import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { LISTINGS } from "../../../../data/listings.js"; // adjust if your path differs
import {
  FiUpload, FiSave, FiX, FiStar, FiMapPin, FiTrash2, FiCheckCircle
} from "react-icons/fi";

/**
 * Utility helpers
 */
function ensureArray(x) { return Array.isArray(x) ? x : (x ? [x] : []); }
function uid() { return Math.random().toString(36).slice(2, 9); }

export default function ListingForm({ mode = "create" }) {
  const { id } = useParams();
  const nav = useNavigate();

  // base listing when editing
  const base = useMemo(
    () => (mode === "edit" ? LISTINGS.find((l) => l.id === id) : null),
    [mode, id]
  );

  const [form, setForm] = useState({
    // Basics
    title: base?.title || "",
    type: base?.type || "Room",
    city: base?.city || "",
    university: base?.university || "",
    price: base?.price || 1000,

    // About / description
    description:
      base?.blurb ||
      "Comfortable, student-first accommodation with secure workflows and escrowed payments.",

    // Lists
    highlights: ensureArray(base?.tags?.includes("Furnished") ? ["Furnished"] : []),
    amenities: ensureArray(base?.tags) || [],
    policies: ["No smoking", "Student-only lease"],
    notes: "",

    // Location (simple version; wire to maps later)
    address: "",
    latitude: "",
    longitude: "",
    transitMins: "6–8",

    // Photos
    photos: base?.img ? [{ id: uid(), src: base.img }] : [],
    coverPhotoId: null, // set after upload/selection

    // Available units (if property has multiple units / rooms)
    units: [
      // { id, label, type, price, availableFrom, leaseMonths, size }
    ],

    // Flags
    furnished: base?.tags?.includes("Furnished") || false,
    verified: true,
  });

  // Derived: if no cover set but we have photos, choose first
  const coverId = form.coverPhotoId ?? (form.photos[0]?.id || null);

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function addToList(field, value) {
    if (!value) return;
    setForm((f) => ({ ...f, [field]: [...(f[field] || []), value] }));
  }

  function removeFromList(field, idx) {
    setForm((f) => ({ ...f, [field]: f[field].filter((_, i) => i !== idx) }));
  }

  function addUnit() {
    setForm((f) => ({
      ...f,
      units: [
        ...(f.units || []),
        {
          id: uid(),
          label: "",
          type: f.type || "Room",
          price: f.price || 1000,
          availableFrom: "",
          leaseMonths: 12,
          size: "",
        },
      ],
    }));
  }

  function updateUnit(id, k, v) {
    setForm((f) => ({
      ...f,
      units: f.units.map((u) => (u.id === id ? { ...u, [k]: v } : u)),
    }));
  }

  function removeUnit(id) {
    setForm((f) => ({ ...f, units: f.units.filter((u) => u.id !== id) }));
  }

  // Mock upload: you’ll replace with your uploader later
  function mockUpload() {
    const url = window.prompt("Paste an image URL to mock-upload:");
    if (!url) return;
    const photo = { id: uid(), src: url };
    setForm((f) => ({
      ...f,
      photos: [...f.photos, photo],
      coverPhotoId: f.coverPhotoId ?? photo.id,
    }));
  }

  function setCover(id) {
    setForm((f) => ({ ...f, coverPhotoId: id }));
  }

  function save(e) {
    e.preventDefault();

    // Build payload you’d POST to API
    const payload = {
      ...form,
      coverPhotoId: coverId,
      // normalize lists
      highlights: form.highlights.filter(Boolean),
      amenities: form.amenities.filter(Boolean),
      policies: form.policies.filter(Boolean),
      units: (form.units || []).map((u) => ({ ...u })),
    };

    // TODO: call your API here
    console.log("Saving listing:", payload);

    // Navigate back to agent listings index
    nav("/dashboard/agent/listings");
  }

  // Local inputs for quick add rows
  const [hlInput, setHlInput] = useState("");
  const [amInput, setAmInput] = useState("");
  const [polInput, setPolInput] = useState("");

  return (
    <form className="card" style={{ padding: 16, display: "grid", gap: 16 }} onSubmit={save}>
      <h3>{mode === "create" ? "Create Listing" : "Edit Listing"}</h3>

      {/* BASICS */}
      <section className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <label>
          Title
          <input className="input" value={form.title} onChange={(e) => update("title", e.target.value)} />
        </label>

        <label>
          Type
          <select className="select" value={form.type} onChange={(e) => update("type", e.target.value)}>
            <option>Room</option>
            <option>Studio</option>
            <option>1 Bedroom</option>
          </select>
        </label>

        <label>
          City
          <input className="input" value={form.city} onChange={(e) => update("city", e.target.value)} />
        </label>

        <label>
          University
          <input className="input" value={form.university} onChange={(e) => update("university", e.target.value)} />
        </label>

        <label>
          Price (per month)
          <input
            className="input"
            type="number"
            value={form.price}
            onChange={(e) => update("price", e.target.valueAsNumber)}
          />
        </label>

        <label className="rg-check" style={{ alignSelf: "end" }}>
          <input
            type="checkbox"
            checked={form.furnished}
            onChange={(e) => update("furnished", e.target.checked)}
          />
          <span>Furnished</span>
        </label>
      </section>

      {/* ABOUT / DESCRIPTION */}
      <section className="card" style={{ padding: 12, display: "grid", gap: 10 }}>
        <h4 style={{ margin: 0 }}>About / Description</h4>
        <textarea
          className="textarea"
          rows={5}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Describe the accommodation, distance to campus, who it suits, etc."
        />
      </section>

      {/* HIGHLIGHTS */}
      <section className="card" style={{ padding: 12, display: "grid", gap: 10 }}>
        <h4 style={{ margin: 0 }}>Highlights (short selling points)</h4>
        <div className="grid" style={{ gridTemplateColumns: "1fr auto", gap: 8 }}>
          <input
            className="input"
            value={hlInput}
            onChange={(e) => setHlInput(e.target.value)}
            placeholder="e.g., Verified agent + escrow"
          />
          <button
            type="button"
            className="btn btn--light"
            onClick={() => {
              addToList("highlights", hlInput.trim());
              setHlInput("");
            }}
          >
            Add
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {form.highlights.map((h, i) => (
            <span key={i} className="badge" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <FiStar /> {h}
              <button
                type="button"
                className="btn btn--ghost"
                title="Remove"
                onClick={() => removeFromList("highlights", i)}
                style={{ padding: "2px 6px" }}
              >
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
          <input
            className="input"
            value={amInput}
            onChange={(e) => setAmInput(e.target.value)}
            placeholder="e.g., In-unit laundry"
          />
          <button
            type="button"
            className="btn btn--light"
            onClick={() => {
              addToList("amenities", amInput.trim());
              setAmInput("");
            }}
          >
            Add
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {form.amenities.map((a, i) => (
            <span key={i} className="badge" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <FiCheckCircle /> {a}
              <button
                type="button"
                className="btn btn--ghost"
                title="Remove"
                onClick={() => removeFromList("amenities", i)}
                style={{ padding: "2px 6px" }}
              >
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
          <input
            className="input"
            value={polInput}
            onChange={(e) => setPolInput(e.target.value)}
            placeholder="e.g., No pets"
          />
          <button
            type="button"
            className="btn btn--light"
            onClick={() => {
              addToList("policies", polInput.trim());
              setPolInput("");
            }}
          >
            Add
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {form.policies.map((p, i) => (
            <span key={i} className="badge" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              {p}
              <button
                type="button"
                className="btn btn--ghost"
                title="Remove"
                onClick={() => removeFromList("policies", i)}
                style={{ padding: "2px 6px" }}
              >
                <FiX />
              </button>
            </span>
          ))}
        </div>
        <label>
          Notes (optional)
          <textarea
            className="textarea"
            rows={3}
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Any extra information you want the student to know."
          />
        </label>
      </section>

      {/* LOCATION */}
      <section className="card" style={{ padding: 12, display: "grid", gap: 10 }}>
        <h4 style={{ margin: 0 }}>Location</h4>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>
            Address
            <input
              className="input"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="Street, City, Zip"
            />
          </label>
          <label>
            Transit (mins)
            <input
              className="input"
              value={form.transitMins}
              onChange={(e) => update("transitMins", e.target.value)}
              placeholder="e.g., 6–8"
            />
          </label>
          <label>
            Latitude
            <input
              className="input"
              value={form.latitude}
              onChange={(e) => update("latitude", e.target.value)}
              placeholder="(optional)"
            />
          </label>
          <label>
            Longitude
            <input
              className="input"
              value={form.longitude}
              onChange={(e) => update("longitude", e.target.value)}
              placeholder="(optional)"
            />
          </label>
        </div>
        <div className="mini" style={{ color: "var(--ink-soft)", display: "flex", alignItems: "center", gap: 6 }}>
          <FiMapPin /> Map integration coming soon—save lat/lng for now.
        </div>
      </section>

      {/* PHOTOS + COVER */}
      <section className="card" style={{ padding: 12, display: "grid", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h4 style={{ margin: 0 }}>Photos</h4>
          <button type="button" className="btn btn--light" onClick={mockUpload}>
            <FiUpload /> Upload
          </button>
        </div>

        {form.photos.length === 0 ? (
          <p className="mini" style={{ color: "var(--ink-soft)" }}>
            No photos yet. Upload at least one image.
          </p>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {form.photos.map((p) => (
              <div key={p.id} className="card" style={{ padding: 8, display: "grid", gap: 8 }}>
                <img
                  src={p.src}
                  alt=""
                  style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", borderRadius: 8 }}
                  onClick={() => setCover(p.id)}
                />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <label className="rg-check" title="Set as main image">
                    <input
                      type="radio"
                      name="cover"
                      checked={(coverId === p.id)}
                      onChange={() => setCover(p.id)}
                    />
                    <span>Main image</span>
                  </label>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    title="Remove photo"
                    onClick={() =>
                      setForm((f) => {
                        const next = f.photos.filter((x) => x.id !== p.id);
                        const nextCover =
                          f.coverPhotoId === p.id ? (next[0]?.id ?? null) : f.coverPhotoId;
                        return { ...f, photos: next, coverPhotoId: nextCover };
                      })
                    }
                    style={{ padding: "2px 8px" }}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* AVAILABLE UNITS */}
      <section className="card" style={{ padding: 12, display: "grid", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h4 style={{ margin: 0 }}>Available Units (optional)</h4>
          <button type="button" className="btn btn--light" onClick={addUnit}>+ Add unit</button>
        </div>

        {(form.units || []).length === 0 ? (
          <p className="mini" style={{ color: "var(--ink-soft)" }}>No units added.</p>
        ) : (
          <div className="grid" style={{ gap: 10 }}>
            {form.units.map((u) => (
              <div key={u.id} className="card" style={{ padding: 10, display: "grid", gap: 8 }}>
                <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <label>
                    Label
                    <input
                      className="input"
                      value={u.label}
                      onChange={(e) => updateUnit(u.id, "label", e.target.value)}
                      placeholder="e.g., Room 2A, 3rd floor"
                    />
                  </label>
                  <label>
                    Type
                    <select
                      className="select"
                      value={u.type}
                      onChange={(e) => updateUnit(u.id, "type", e.target.value)}
                    >
                      <option>Room</option>
                      <option>Studio</option>
                      <option>1 Bedroom</option>
                    </select>
                  </label>
                  <label>
                    Price (per month)
                    <input
                      className="input"
                      type="number"
                      value={u.price}
                      onChange={(e) => updateUnit(u.id, "price", e.target.valueAsNumber)}
                    />
                  </label>
                </div>

                <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <label>
                    Available from
                    <input
                      className="input"
                      type="date"
                      value={u.availableFrom || ""}
                      onChange={(e) => updateUnit(u.id, "availableFrom", e.target.value)}
                    />
                  </label>
                  <label>
                    Lease (months)
                    <input
                      className="input"
                      type="number"
                      value={u.leaseMonths}
                      onChange={(e) => updateUnit(u.id, "leaseMonths", e.target.valueAsNumber)}
                    />
                  </label>
                  <label>
                    Size
                    <input
                      className="input"
                      value={u.size}
                      onChange={(e) => updateUnit(u.id, "size", e.target.value)}
                      placeholder="e.g., 22 m²"
                    />
                  </label>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => removeUnit(u.id)}
                  >
                    <FiTrash2 /> Remove unit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <button className="btn" type="submit"><FiSave /> Save listing</button>
    </form>
  );
}
