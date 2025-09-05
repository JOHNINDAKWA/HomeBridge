import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiGrid, FiList, FiStar, FiMapPin, FiHeart } from "react-icons/fi";
import "./Listings.css";
import { useAuth } from "../../Context/AuthContext.jsx";

function coverUrlFor(item) {
  const imgs = item?.images || [];
  const cover = imgs.find((i) => i.id === item.coverImageId) || imgs[0];
  return cover?.url || "";
}

export default function Listings() {
  const { api } = useAuth(); // works fine without a token for public endpoints
  const [view, setView] = useState("grid"); // 'grid' | 'list'
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setErr("");
        const { items } = await api("/api/public/listings?take=60&skip=0");
        if (!active) return;
        setItems(items || []);
      } catch (e) {
        setErr(e.message || "Failed to load listings");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [api]);

  const results = useMemo(() => {
    return (items || []).filter((l) => {
      const text = [l.title, l.city, l.university, l.type].join(" ").toLowerCase();
      const matchesText = text.includes(q.toLowerCase());
      const matchesType = type === "All" || l.type === type;
      const matchesPrice = (l.price || 0) <= maxPrice;
      return matchesText && matchesType && matchesPrice;
    });
  }, [items, q, type, maxPrice]);

  return (
    <section className={`hbr-listings ${filtersOpen ? "filters-open" : ""}`}>
      <div className="hbr-container hbr-listings__inner">
        {/* Sidebar (filters) */}
        <aside className="hbr-filter" aria-label="Filters" id="filters">
          <h3>Search</h3>

          <label className="hbr-field">
            <span>City</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by city, university, or listing"
              aria-label="City or university"
            />
          </label>

          <div className="hbr-field">
            <span>Move-in date (optional)</span>
            <input type="date" aria-label="Move-in date" />
          </div>

          <div className="hbr-filter__group">
            <h4>Budget (per month)</h4>
            <div className="hbr-range">
              <input
                type="range"
                min="600"
                max="2000"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                aria-label="Max monthly budget"
              />
              <div className="hbr-range__meta">
                <span>$600</span>
                <b>Max ${maxPrice}</b>
                <span>$2000</span>
              </div>
            </div>
          </div>

          <div className="hbr-filter__group">
            <h4>Property Type</h4>
            {["All", "Room", "Studio", "1 Bedroom"].map((t) => (
              <label key={t} className="hbr-check">
                <input
                  type="radio"
                  name="type"
                  checked={type === t}
                  onChange={() => setType(t)}
                />
                <span>{t}</span>
              </label>
            ))}
          </div>

          <div className="hbr-filter__group">
            <h4>Facilities</h4>
            {["Furnished", "Near Transit", "Utilities Included", "Ensuite Bathroom"].map((f) => (
              <label key={f} className="hbr-check hbr-check--ghost">
                <input type="checkbox" />
                <span>{f}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="hbr-results">
          <header className="hbr-results__head">
            <div className="hbr-title">
              <h1>Listings</h1>
              <span className="hbr-count" aria-live="polite">
                {loading ? "Loading…" : `${results.length} result${results.length === 1 ? "" : "s"}`}
              </span>
            </div>

            <div className="hbr-controls">
              <button
                className="hbr-filter-toggle"
                type="button"
                onClick={() => setFiltersOpen(true)}
                aria-controls="filters"
                aria-expanded={filtersOpen}
              >
                Filters
              </button>

              <div className="hbr-display">
                <span>Display:</span>
                <button
                  className={`hbr-iconbtn ${view === "list" ? "active" : ""}`}
                  onClick={() => setView("list")}
                  aria-label="List view"
                >
                  <FiList />
                </button>
                <button
                  className={`hbr-iconbtn ${view === "grid" ? "active" : ""}`}
                  onClick={() => setView("grid")}
                  aria-label="Grid view"
                >
                  <FiGrid />
                </button>
              </div>
            </div>
          </header>

          {/* mobile backdrop for drawer */}
          <div className="hbr-dim" onClick={() => setFiltersOpen(false)} aria-hidden={!filtersOpen} />

          {err && (
            <div className="card" style={{ padding: 12, borderColor: "#e11d48", color: "#b91c1c" }}>
              {err}
            </div>
          )}

          {view === "grid" ? (
            <div className="hbr-grid">
              {results.map((l) => {
                const img = coverUrlFor(l);
                const rating = l.rating ?? 4.8;
                const reviews = l.reviews ?? 0;
                return (
                  <article className="hbr-card" key={l.id}>
                    <figure className="hbr-card__media">
                      {img ? (
                        <img src={img} alt={l.title} />
                      ) : (
                        <div className="hbr-card__placeholder" aria-label="No image" />
                      )}
                      {l.verified ? <span className="hbr-ribbon">Verified</span> : null}
                      <button className="hbr-like" aria-label="Save">
                        <FiHeart />
                      </button>
                    </figure>

                    <div className="hbr-card__meta">
                      <div className="hbr-row">
                        <span className="hbr-rate">
                          <FiStar /> {rating}
                        </span>
                        <span className="hbr-rev">{reviews}</span>
                      </div>
                    </div>

                    <div className="hbr-card__body">
                      <span className="hbr-pill">{l.type}</span>
                      <h3 className="hbr-card__title">{l.title}</h3>
                      <p className="hbr-place">
                        <FiMapPin /> {l.city}
                      </p>
                    </div>

                    <div className="hbr-card__foot">
                      <div className="hbr-price">
                        <b>${l.price}</b> <span>/ month</span>
                      </div>

                      {/* Pass a lightweight preview via state for instant paint */}
                      <Link
                        to={`/listings/${l.id}`}
                        state={{ listing: { ...l, img }, activeIndex: 0 }}
                        className="hbr-btn hbr-btn--ghost"
                      >
                        View detail
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="hbr-list">
              {results.map((l) => {
                const img = coverUrlFor(l);
                return (
                  <article className="hbr-rowcard" key={l.id}>
                    {img ? (
                      <img src={img} alt={l.title} className="hbr-rowcard__img" />
                    ) : (
                      <div className="hbr-rowcard__img hbr-rowcard__placeholder" />
                    )}
                    <div className="hbr-rowcard__main">
                      <h3 className="hbr-rowcard__title">{l.title}</h3>
                      <div className="hbr-rowcard__sub">
                        <span className="hbr-pill">{l.type}</span>
                        {l.university ? <span className="hbr-uni">{l.university}</span> : null}
                        <span className="hbr-city">
                          <FiMapPin /> {l.city}
                        </span>
                      </div>
                      <p className="hbr-rowcard__blurb">{l.description || l.blurb || ""}</p>
                      <div className="hbr-rowcard__facts">
                        <span>
                          <FiStar /> {l.rating ?? 4.8}
                        </span>
                        <span>{l.reviews ?? 0}</span>
                      </div>
                    </div>

                    <div className="hbr-rowcard__aside">
                      <div className="hbr-rowcard__price">
                        <small>From</small>
                        <b>${l.price}</b>
                        <span>/ month</span>
                      </div>
                      <Link
                        to={`/listings/${l.id}`}
                        state={{ listing: { ...l, img }, activeIndex: 0 }}
                        className="hbr-btn hbr-btn--ghost"
                      >
                        View detail
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
