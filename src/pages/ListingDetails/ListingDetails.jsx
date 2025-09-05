import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  FiMapPin, FiStar, FiHome, FiUsers, FiShield, FiWifi, FiMonitor, FiDroplet,
  FiThermometer, FiCoffee, FiLock, FiKey, FiCheckCircle, FiAlertCircle,
  FiPhone, FiMail, FiShare2, FiHeart, FiBookOpen, FiClock, FiMap, FiDollarSign
} from "react-icons/fi";
import "./ListingDetails.css";
import { useAuth } from "../../Context/AuthContext.jsx";

/** Pick a cover URL from listing.images (or a preview img) */
function coverUrlFor(item) {
  if (!item) return "";
  const imgs = item.images || [];
  const cover = imgs.find(i => i.id === item.coverImageId) || imgs[0];
  return cover?.url || item.img || "";
}

export default function ListingDetails() {
  const { api, user } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  // If you navigated here from a card, you may have preview data
  const preview = location.state?.listing || null;

  const [item, setItem] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch from public API; gracefully fall back to preview if 404
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setErr("");
        const { item } = await api(`/api/public/listings/${id}`);
        if (!active) return;
        setItem(item);
      } catch (e) {
        // fallback to preview if we have it
        if (preview) {
          setItem({
            ...preview,
            images: preview.images || (preview.img ? [{ id: "preview", url: preview.img }] : []),
          });
        } else {
          setItem(null);
        }
        setErr(e.message || "Failed to load listing");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, id]);

  // Normalize current listing (API or preview)
  const listing = useMemo(() => {
    if (item) return item;
    if (preview) {
      return {
        ...preview,
        images: preview.images || (preview.img ? [{ id: "preview", url: preview.img }] : []),
      };
    }
    return null;
  }, [item, preview]);

  // Build gallery from images
  const gallery = useMemo(() => {
    const urls = (listing?.images || []).map(i => i.url).filter(Boolean);
    if (urls.length) return urls;
    const fallback = coverUrlFor(listing);
    return fallback ? [fallback] : [];
  }, [listing]);

  // Choose starting image index safely (react to query/state + gallery changes)
  const [active, setActive] = useState(0);
  useEffect(() => {
    const qImg = parseInt(sp.get("img") ?? "", 10);
    const stateActive = Number.isInteger(location.state?.activeIndex) ? location.state.activeIndex : null;
    const desired =
      Number.isInteger(qImg) && qImg >= 0 && qImg < gallery.length ? qImg :
      Number.isInteger(stateActive) && stateActive >= 0 && stateActive < gallery.length ? stateActive : 0;
    setActive(gallery.length ? desired : 0);
  }, [sp, location.state, gallery.length]);

  // Hide CTAs when opened from agent dashboard or if the logged-in user is an AGENT
  const hideCtas = Boolean(location.state?.fromAgent) ||
                   String(user?.role || "").toUpperCase() === "AGENT";

  // Derived fields for UI richness (guard with optional chaining)
  const derived = useMemo(() => {
    if (!listing) return null;
    return {
      size: "22 m²",
      guests: 1,
      beds: listing.type === "Room" ? 1 : 1,
      verified: !!listing.verified,
      escrow: true,
      priceUnit: "per month",
      transitMinutes: listing.transitMins || "6–8 min",
      description:
        listing.description ||
        listing.blurb ||
        "Comfortable student-ready accommodation with simple document workflows.",
      // Some icon highlights
      highlights: [
        { icon: <FiShield />, text: "Verified agent + escrow" },
        { icon: <FiWifi />, text: "High-speed Wi-Fi included" },
        { icon: <FiMonitor />, text: "Desk + study lamp" },
        { icon: <FiThermometer />, text: "Heating + AC" },
        { icon: <FiDroplet />, text: "Utilities capped" },
        { icon: <FiCoffee />, text: "Mini-kitchenette" },
      ],
      amenities: [
        ...(listing.amenities || listing.tags || []),
        "Closet",
        "Blackout curtains",
        "On-site laundry",
        "Secure entry",
        "Bike storage",
      ],
      policies: listing.policies?.length
        ? listing.policies
        : ["No smoking", "No pets", "Quiet hours 10pm–7am", "Student-only lease"],
    };
  }, [listing]);

  return (
    <section className="ld-wrap">
      <div className="container">
        {/* Header states (no early returns) */}
        {loading && (
          <div className="card" style={{ padding: 12 }}>Loading…</div>
        )}
        {!loading && !listing && (
          <div className="card" style={{ padding: 12 }}>
            <div style={{ color: "#b91c1c", display: "flex", gap: 8, alignItems: "center" }}>
              <FiAlertCircle /> Listing not found{err ? ` — ${err}` : ""}.
            </div>
          </div>
        )}

        {listing && (
          <>
            {/* Header: title + meta */}
            <header className="ld-head">
              <div className="ld-titleblock">
                <h1 className="ld-title">
                  {listing.title}{" "}
                  {listing.furnished || listing.tags?.includes("Furnished") ? "• Furnished" : ""}
                </h1>

                <div className="ld-meta">
                  <span className="meta">
                    <FiMapPin /> {listing.city}{listing.university ? ` • ${listing.university}` : ""}
                  </span>
                  <span className="dot" />
                  <span className="meta">
                    <FiHome /> {listing.type} • {derived?.size}
                  </span>
                  <span className="dot" />
                  <span className="meta">
                    <FiUsers /> {derived?.guests} guest • {derived?.beds} bed
                  </span>
                  {(listing.rating || listing.reviews) && (
                    <>
                      <span className="dot" />
                      <span className="meta">
                        <FiStar className="star" /> {listing.rating ?? "—"}
                        {listing.reviews ? ` (${listing.reviews})` : ""}
                      </span>
                    </>
                  )}
                  {derived?.verified && (
                    <>
                      <span className="dot" />
                      <span className="badge badge--ok">
                        <FiCheckCircle /> Verified
                      </span>
                    </>
                  )}
                </div>

                {listing.university && (
                  <div className="ld-under">
                    <span className="uni">Near: {listing.university}</span>
                  </div>
                )}
              </div>

              <div className="ld-actions">
                <button className="btn btn--ghost">
                  <FiShare2 /> Share
                </button>
                <button className="btn btn--ghost">
                  <FiHeart /> Save
                </button>
              </div>
            </header>

            {/* Gallery */}
            <section className="ld-gallery card">
              <figure className="ld-main">
                {gallery[active] ? (
                  <img src={gallery[active]} alt={`Listing photo ${active + 1}`} />
                ) : (
                  <div className="ld-map__placeholder">
                    <FiMapPin />
                    <p>No images yet</p>
                  </div>
                )}
              </figure>
              {gallery.length > 1 && (
                <div className="ld-thumbs">
                  {gallery.slice(0, 8).map((src, i) => (
                    <button
                      key={i}
                      className={`ld-thumb ${i === active ? "active" : ""}`}
                      onClick={() => setActive(i)}
                      aria-label={`Show image ${i + 1}`}
                    >
                      <img src={src} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Content grid */}
            <div className="ld-grid">
              {/* LEFT: details */}
              <main className="ld-details">
                <div className="ld-facts card">
                  <div className="fact">
                    <FiHome /> <span>Type</span>
                    <b>{listing.type}</b>
                  </div>
                  <div className="fact">
                    <FiUsers /> <span>Occupancy</span>
                    <b>{derived?.guests} person</b>
                  </div>
                  <div className="fact">
                    <FiBookOpen /> <span>Size</span>
                    <b>{derived?.size}</b>
                  </div>
                  <div className="fact">
                    <FiClock /> <span>Move-in</span>
                    <b>Flexible</b>
                  </div>
                  <div className="fact">
                    <FiShield /> <span>Escrow</span>
                    <b>{derived?.escrow ? "Yes" : "No"}</b>
                  </div>
                  <div className="fact">
                    <FiMap /> <span>Transit</span>
                    <b>{derived?.transitMinutes}</b>
                  </div>
                </div>

                <section className="ld-section card">
                  <h3 className="ld-h3">About this place</h3>
                  <p>{derived?.description}</p>
                </section>

                <section className="ld-section card">
                  <h3 className="ld-h3">Highlights</h3>
                  <ul className="ld-highlights">
                    {(derived?.highlights || []).map((h, i) => (
                      <li key={i}>
                        <span className="ico">{h.icon}</span>
                        {h.text}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="ld-section card">
                  <h3 className="ld-h3">Amenities</h3>
                  <ul className="ld-amenities">
                    {(derived?.amenities || []).map((a, i) => (
                      <li key={i}>
                        <FiCheckCircle className="ok" /> {a}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="ld-section card">
                  <h3 className="ld-h3">Policies & Notes</h3>
                  <ul className="ld-policies">
                    {(derived?.policies || []).map((p, i) => (
                      <li key={i}>
                        <FiAlertCircle /> {p}
                      </li>
                    ))}
                  </ul>
                  <div className="ld-badges">
                    <span className="badge">
                      <FiLock /> Watermarked document previews
                    </span>
                    <span className="badge">
                      <FiKey /> Digital lease • e-signature
                    </span>
                  </div>
                </section>

                <section className="ld-section card">
                  <h3 className="ld-h3">Location</h3>
                  <div className="ld-map">
                    <div className="ld-map__placeholder">
                      <FiMapPin />
                      <p>
                        {listing.city}{listing.university ? ` • ${listing.university}` : ""}
                      </p>
                      <small>(Map integration later)</small>
                    </div>
                  </div>
                </section>
              </main>

              {/* RIGHT: sticky contact */}
              <aside className="ld-contact">
                <div className="ld-sticky card">
                  <div className="ld-price">
                    <div className="amount">
                      <FiDollarSign />
                      {listing.price}
                    </div>
                    <div className="unit">/ {derived?.priceUnit || "per month"}</div>
                  </div>

                  {!hideCtas ? (
                    <form className="ld-form">
                      <label>
                        <span>Move-in date</span>
                        <input className="input" type="date" />
                      </label>
                      <label>
                        <span>Lease length</span>
                        <select className="select" defaultValue="12">
                          <option value="6">6 months</option>
                          <option value="9">9 months</option>
                          <option value="12">12 months</option>
                        </select>
                      </label>
                      <button
                        type="button"
                        className="btn"
                        style={{ width: "100%" }}
                        onClick={() => navigate(`/book/${id}`)}
                      >
                        Request to book
                      </button>
                      <button
                        type="button"
                        className="btn btn--ghost"
                        style={{ width: "100%" }}
                      >
                        Ask a question
                      </button>
                    </form>
                  ) : (
                    <div className="mini" style={{ marginTop: 8, color: "var(--ink-soft)" }}>
                      Viewing as agent — booking CTA hidden.
                    </div>
                  )}

                  <div className="ld-agent">
                    <h4>Agent / Housing Partner</h4>
                    <p className="mini">
                      <FiShield /> KYC verified • Fair Housing acknowledgement
                    </p>
                    <div className="ld-agent__cta">
                      {/* Prefer backend-provided agent contact if present */}
                      {listing.agent?.phone ? (
                        <a className="link" href={`tel:${listing.agent.phone}`}>
                          <FiPhone /> {listing.agent.phone}
                        </a>
                      ) : (
                        <span className="link" style={{ opacity: .7 }}>
                          <FiPhone /> Phone unavailable
                        </span>
                      )}
                      {listing.agent?.supportEmail || listing.agent?.email ? (
                        <a
                          className="link"
                          href={`mailto:${listing.agent.supportEmail || listing.agent.email}`}
                        >
                          <FiMail /> {listing.agent.supportEmail || listing.agent.email}
                        </a>
                      ) : (
                        <span className="link" style={{ opacity: .7 }}>
                          <FiMail /> Email unavailable
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="ld-disclaim mini">
                    <FiAlertCircle /> Escrow releases after move-in confirmation (see refund rules).
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
