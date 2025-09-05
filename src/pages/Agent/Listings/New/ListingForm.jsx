// src/pages/Dashboard/Agent/Listings/ListingForm.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiUpload, FiSave, FiX, FiStar, FiMapPin, FiTrash2, FiCheckCircle
} from "react-icons/fi";
import { useAuth } from "../../../../Context/AuthContext.jsx";

const MAX_IMAGES_PER_LISTING = 12;
const MAX_FILES_PER_UPLOAD = 5;

function ensureArray(x) { return Array.isArray(x) ? x : (x ? [x] : []); }
function uid() { return Math.random().toString(36).slice(2, 9); }

export default function ListingForm({ mode = "create" }) {
  const { api } = useAuth();
  const nav = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    // Basics
    title: "",
    type: "Room",
    city: "",
    university: "",
    price: 1000,

    // About
    description: "Comfortable, student-first accommodation with secure workflows and escrowed payments.",

    // Lists
    highlights: [],
    amenities: [],
    policies: ["No smoking", "Student-only lease"],
    notes: "",

    // Location
    address: "",
    latitude: "",
    longitude: "",
    transitMins: "6–8",

    // Flags
    furnished: false,

    // Images / units
    coverImageId: null,
    images: [],
    units: [],
  });

  // Derived cover id: explicit cover → first image fallback
  const coverId = form.coverImageId ?? (form.images?.[0]?.id || null);

  // Local quick-add inputs
  const [hlInput, setHlInput] = useState("");
  const [amInput, setAmInput] = useState("");
  const [polInput, setPolInput] = useState("");

  // -------- Fetch (edit mode) --------
  useEffect(() => {
    if (mode !== "edit") return;
    let active = true;
    (async () => {
      try {
        setErr("");
        const { item } = await api(`/api/agent/listings/${id}`);
        if (!active) return;
        setForm({
          title: item.title || "",
          type: item.type || "Room",
          city: item.city || "",
          university: item.university || "",
          price: item.price ?? 1000,
          description: item.description || "",
          highlights: ensureArray(item.highlights) || [],
          amenities: ensureArray(item.amenities) || [],
          policies: ensureArray(item.policies) || [],
          notes: item.notes || "",

          address: item.address || "",
          latitude: item.latitude || "",
          longitude: item.longitude || "",
          transitMins: item.transitMins || "",

          furnished: !!item.furnished,

          coverImageId: item.coverImageId || null,
          images: item.images || [],
          units: (item.units || []).map(u => ({ ...u })), // keep server ids for edit
        });
      } catch (e) {
        setErr(e.message || "Failed to load listing");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, mode]);

  // -------- Helpers --------
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const addToList = (field, value) => value && setForm(f => ({ ...f, [field]: [...(f[field] || []), value] }));
  const removeFromList = (field, idx) => setForm(f => ({ ...f, [field]: f[field].filter((_, i) => i !== idx) }));

  const addUnit = () =>
    setForm(f => ({
      ...f,
      units: [
        ...(f.units || []),
        { id: uid(), label: "", type: f.type || "Room", price: f.price || 1000, availableFrom: "", leaseMonths: 12, size: "" }
      ]
    }));
  const updateUnit = (uidx, k, v) =>
    setForm(f => ({ ...f, units: f.units.map(u => (u.id === uidx ? { ...u, [k]: v } : u)) }));
  const removeUnit = (uidx) =>
    setForm(f => ({ ...f, units: f.units.filter(u => u.id !== uidx) }));

  const buildPayload = () => ({
    title: form.title,
    type: form.type,
    city: form.city,
    university: form.university || null,
    price: Number.isFinite(form.price) ? form.price : 0,
    description: form.description,
    highlights: (form.highlights || []).filter(Boolean),
    amenities: (form.amenities || []).filter(Boolean),
    policies: (form.policies || []).filter(Boolean),
    notes: form.notes || null,

    address: form.address || null,
    latitude: form.latitude || null,
    longitude: form.longitude || null,
    transitMins: form.transitMins || null,

    furnished: !!form.furnished,
    coverImageId: coverId || null,

    units: (form.units || []).map(u => ({
      label: u.label || null,
      type: u.type || null,
      price: Number.isFinite(u.price) ? u.price : null,
      availableFrom: u.availableFrom || null,
      leaseMonths: Number.isFinite(u.leaseMonths) ? u.leaseMonths : null,
      size: u.size || null,
    })),
  });

  // -------- Save (create or update) --------
  const save = async (e) => {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      const payload = buildPayload();

      if (mode === "create") {
        const { item } = await api("/api/agent/listings", { method: "POST", body: payload });
        // go to edit so photos can be added right away
        nav(`/dashboard/agent/listings/${item.id}/edit`, { replace: true });
      } else {
        const { item } = await api(`/api/agent/listings/${id}`, { method: "PUT", body: payload });
        // merge back for immediate UI freshness
        setForm(f => ({
          ...f,
          ...item,
          images: item.images || f.images,
          units: item.units || f.units,
        }));
      }
    } catch (e) {
      setErr(e.message || "Failed to save listing");
    } finally {
      setSaving(false);
    }
  };

  // -------- Images --------
  const remaining = Math.max(0, MAX_IMAGES_PER_LISTING - (form.images?.length || 0));

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // enforce per-upload and remaining caps
    if (files.length > MAX_FILES_PER_UPLOAD) {
      alert(`You can upload at most ${MAX_FILES_PER_UPLOAD} files at a time.`);
      e.target.value = "";
      return;
    }
    if (files.length > remaining) {
      alert(`You can add ${remaining} more image(s).`);
      e.target.value = "";
      return;
    }

    try {
      // If we're on create, auto-create first
      let listingId = id;
      if (!listingId) {
        const { item } = await api("/api/agent/listings", { method: "POST", body: buildPayload() });
        listingId = item.id;
      }

      const fd = new FormData();
      files.forEach(f => fd.append("images", f));

      const { images } = await api(`/api/agent/listings/${listingId}/images`, {
        method: "POST",
        body: fd, // <-- FormData (api helper must not set JSON header)
      });

      setForm(f => ({
        ...f,
        images: [...(f.images || []), ...images],
        coverImageId: f.coverImageId || images[0]?.id || null,
      }));

      if (!id) {
        // Move to edit route after successful upload
        nav(`/dashboard/agent/listings/${listingId}/edit`, { replace: true });
      }
    } catch (err) {
      alert(err.message || "Upload failed");
    } finally {
      e.target.value = ""; // allow re-picking the same files
    }
  };

  const setCover = async (imageId) => {
    // only meaningful once listing exists
    if (!id) return;
    try {
      await api(`/api/agent/listings/${id}/cover/${imageId}`, { method: "PATCH" });
      setForm(f => ({ ...f, coverImageId: imageId }));
    } catch (e) {
      alert(e.message || "Failed to set cover image");
    }
  };

  const removeImage = async (imageId) => {
    if (!id) return;
    try {
      await api(`/api/agent/listings/${id}/images/${imageId}`, { method: "DELETE" });
      setForm(f => {
        const next = (f.images || []).filter(i => i.id !== imageId);
        const nextCover = f.coverImageId === imageId ? (next[0]?.id || null) : f.coverImageId;
        return { ...f, images: next, coverImageId: nextCover };
      });
    } catch (e) {
      alert(e.message || "Failed to delete image");
    }
  };

  if (loading) return <div className="card" style={{ padding: 16 }}>Loading…</div>;

  return (
    <form className="card" style={{ padding: 16, display: "grid", gap: 16 }} onSubmit={save}>
      <h3>{mode === "create" ? "Create Listing" : "Edit Listing"}</h3>
      {err && (
        <div className="card" style={{ padding: 12, borderColor: "#e11d48", color: "#b91c1c" }}>
          ⚠ {err}
        </div>
      )}

      {/* BASICS */}
      <section className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <label>Title
          <input className="input" value={form.title} onChange={(e) => update("title", e.target.value)} required />
        </label>
        <label>Type
          <select className="select" value={form.type} onChange={(e) => update("type", e.target.value)}>
            <option>Room</option>
            <option>Studio</option>
            <option>1 Bedroom</option>
          </select>
        </label>
        <label>City
          <input className="input" value={form.city} onChange={(e) => update("city", e.target.value)} required />
        </label>
        <label>University
          <input className="input" value={form.university} onChange={(e) => update("university", e.target.value)} />
        </label>
        <label>Price (per month)
          <input className="input" type="number" value={form.price}
                 onChange={(e) => update("price", e.target.valueAsNumber)} required />
        </label>
        <label className="rg-check" style={{ alignSelf: "end" }}>
          <input type="checkbox" checked={form.furnished} onChange={(e) => update("furnished", e.target.checked)} />
          <span>Furnished</span>
        </label>
      </section>

      {/* ABOUT / DESCRIPTION */}
      <section className="card" style={{ padding: 12, display: "grid", gap: 10 }}>
        <h4 style={{ margin: 0 }}>About / Description</h4>
        <textarea className="textarea" rows={5} value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Describe the accommodation, distance to campus, who it suits, etc." />
      </section>

      {/* HIGHLIGHTS */}
      <section className="card" style={{ padding: 12, display: "grid", gap: 10 }}>
        <h4 style={{ margin: 0 }}>Highlights (short selling points)</h4>
        <div className="grid" style={{ gridTemplateColumns: "1fr auto", gap: 8 }}>
          <input className="input" value={hlInput}
                 onChange={(e) => setHlInput(e.target.value)} placeholder="e.g., Verified agent + escrow" />
          <button type="button" className="btn btn--light"
                  onClick={() => { addToList("highlights", hlInput.trim()); setHlInput(""); }}>
            Add
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {form.highlights.map((h, i) => (
            <span key={i} className="badge" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <FiStar /> {h}
              <button type="button" className="btn btn--ghost" title="Remove"
                      onClick={() => removeFromList("highlights", i)} style={{ padding: "2px 6px" }}>
                <FiX />
              </button>
            </span>
          ))}
        </div>
      </section>

      {/* AMENITIES */}
      <section className="card" style={{ padding: 12, display: "grid", gap: 10 }}>
        <h4 style={{ margin: 0 }}>Amenities</h4>
        <div className="grid" style={{ gridTemplateColumns: "1fr auto", gap: 8 }}>
          <input className="input" value={amInput}
                 onChange={(e) => setAmInput(e.target.value)} placeholder="e.g., In-unit laundry" />
          <button type="button" className="btn btn--light"
                  onClick={() => { addToList("amenities", amInput.trim()); setAmInput(""); }}>
            Add
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {form.amenities.map((a, i) => (
            <span key={i} className="badge" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <FiCheckCircle /> {a}
              <button type="button" className="btn btn--ghost" title="Remove"
                      onClick={() => removeFromList("amenities", i)} style={{ padding: "2px 6px" }}>
                <FiX />
              </button>
            </span>
          ))}
        </div>
      </section>

      {/* POLICIES & NOTES */}
      <section className="card" style={{ padding: 12, display: "grid", gap: 10 }}>
        <h4 style={{ margin: 0 }}>Policies & Notes</h4>
        <div className="grid" style={{ gridTemplateColumns: "1fr auto", gap: 8 }}>
          <input className="input" value={polInput}
                 onChange={(e) => setPolInput(e.target.value)} placeholder="e.g., No pets" />
          <button type="button" className="btn btn--light"
                  onClick={() => { addToList("policies", polInput.trim()); setPolInput(""); }}>
            Add
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {form.policies.map((p, i) => (
            <span key={i} className="badge" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              {p}
              <button type="button" className="btn btn--ghost" title="Remove"
                      onClick={() => removeFromList("policies", i)} style={{ padding: "2px 6px" }}>
                <FiX />
              </button>
            </span>
          ))}
        </div>
        <label>Notes (optional)
          <textarea className="textarea" rows={3} value={form.notes}
                    onChange={(e) => update("notes", e.target.value)} placeholder="Any extra information…" />
        </label>
      </section>

      {/* LOCATION */}
      <section className="card" style={{ padding: 12, display: "grid", gap: 10 }}>
        <h4 style={{ margin: 0 }}>Location</h4>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>Address
            <input className="input" value={form.address}
                   onChange={(e) => update("address", e.target.value)} placeholder="Street, City, Zip" />
          </label>
          <label>Transit (mins)
            <input className="input" value={form.transitMins}
                   onChange={(e) => update("transitMins", e.target.value)} placeholder="e.g., 6–8" />
          </label>
          <label>Latitude
            <input className="input" value={form.latitude}
                   onChange={(e) => update("latitude", e.target.value)} placeholder="(optional)" />
          </label>
          <label>Longitude
            <input className="input" value={form.longitude}
                   onChange={(e) => update("longitude", e.target.value)} placeholder="(optional)" />
          </label>
        </div>
        <div className="mini" style={{ color: "var(--ink-soft)", display: "flex", alignItems: "center", gap: 6 }}>
          <FiMapPin /> Map integration coming soon—save lat/lng for now.
        </div>
      </section>

      {/* PHOTOS (create + edit) */}
      <section className="card" style={{ padding: 12, display: "grid", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h4 style={{ margin: 0 }}>Photos</h4>
          <label className="btn btn--light" style={{ cursor: "pointer" }}>
            <FiUpload /> Upload ({form.images?.length || 0}/{MAX_IMAGES_PER_LISTING})
            <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleUpload} />
          </label>
        </div>

        {(form.images?.length || 0) === 0 ? (
          <p className="mini" style={{ color: "var(--ink-soft)" }}>
            No photos yet. Upload up to {MAX_IMAGES_PER_LISTING} images. (Max {MAX_FILES_PER_UPLOAD} per upload)
          </p>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {form.images.map((p) => (
              <div key={p.id} className="card" style={{ padding: 8, display: "grid", gap: 8 }}>
                <img
                  src={p.url}
                  alt=""
                  style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", borderRadius: 8 }}
                  onClick={() => setCover(p.id)}
                />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <label className="rg-check" title="Set as main image">
                    <input
                      type="radio"
                      name="cover"
                      checked={(form.coverImageId ?? form.images?.[0]?.id) === p.id}
                      onChange={() => setCover(p.id)}
                    />
                    <span>Main image</span>
                  </label>
                  <button type="button" className="btn btn--ghost" title="Remove photo"
                          onClick={() => removeImage(p.id)} style={{ padding: "2px 8px" }}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <button className="btn" type="submit" disabled={saving}>
        <FiSave /> {saving ? "Saving…" : "Save listing"}
      </button>
    </form>
  );
}
