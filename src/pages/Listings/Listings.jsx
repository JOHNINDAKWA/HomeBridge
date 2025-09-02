import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiGrid,
  FiList,
  FiStar,
  FiMapPin,
  FiHeart,
} from "react-icons/fi";
import "./Listings.css";

/** Shared data source (single place of truth) */
import img1 from "../../assets/images/home-bg.jpg";
import img2 from "../../assets/images/home-bg2.jpg";
import img3 from "../../assets/images/home-bg3.jpg";
import img4 from "../../assets/images/home-bg4.jpg";
import img5 from "../../assets/images/home-bg5.jpg";
import img6 from "../../assets/images/home-bg6.jpg";
import img7 from "../../assets/images/home-bg7.jpg";
import img8 from "../../assets/images/home-bg8.jpg";
import img9 from "../../assets/images/home-bg9.jpg";
import img10 from "../../assets/images/home-bg10.jpg";

const LISTINGS = [
  {
    id: "hb-001",
    title: "Rutgers-Ready Studio",
    city: "Newark, NJ",
    university: "Rutgers University – Newark",
    type: "Studio",
    price: 1290,
    rating: 4.8,
    reviews: 212,
    img: img1,
    blurb:
      "Furnished studio 6 mins to campus by light rail. Escrow-ready, utilities capped, flexible lease.",
    tags: ["Furnished", "Near Transit", "Utilities Included"],
  },
  {
    id: "hb-002",
    title: "Columbia Shared Room (F)",
    city: "New York, NY",
    university: "Columbia University",
    type: "Room",
    price: 980,
    rating: 4.6,
    reviews: 167,
    img: img2,
    blurb:
      "Female-only room in 3BR. Walk to 1 train. Verified agent with digital lease & escrow.",
    tags: ["Female-only", "In-Unit Laundry"],
  },
  {
    id: "hb-003",
    title: "Drexel 1BR with Balcony",
    city: "Philadelphia, PA",
    university: "Drexel University",
    type: "1 Bedroom",
    price: 1425,
    rating: 4.9,
    reviews: 98,
    img: img3,
    blurb:
      "Bright 1BR near trolley. Document vault supported (I-20, passport) and watermarked previews.",
    tags: ["Furnished", "Elevator"],
  },
  {
    id: "hb-004",
    title: "NYU East Village Micro-Studio",
    city: "New York, NY",
    university: "NYU – Washington Square",
    type: "Studio",
    price: 1690,
    rating: 4.4,
    reviews: 341,
    img: img4,
    blurb: "Micro-studio near Washington Sq. Escrow and clear refund rules.",
    tags: ["Near Transit", "Utilities Included"],
  },
  {
    id: "hb-005",
    title: "Temple Room w/ Ensuite",
    city: "Philadelphia, PA",
    university: "Temple University",
    type: "Room",
    price: 925,
    rating: 4.5,
    reviews: 126,
    img: img5,
    blurb: "Private room with ensuite bath in 4BR. Verified landlord.",
    tags: ["Ensuite Bathroom", "Desk"],
  },
  {
    id: "hb-006",
    title: "Princeton Graduate Cottage",
    city: "Princeton, NJ",
    university: "Princeton University",
    type: "1 Bedroom",
    price: 1780,
    rating: 4.9,
    reviews: 64,
    img: img6,
    blurb:
      "Quiet 1BR cottage 12 mins by bike. Digital lease & escrow release on move-in.",
    tags: ["Furnished", "Bike Storage"],
  },
  {
    id: "hb-007",
    title: "UPenn Studio by Schuylkill",
    city: "Philadelphia, PA",
    university: "University of Pennsylvania",
    type: "Studio",
    price: 1510,
    rating: 4.7,
    reviews: 204,
    img: img7,
    blurb: "River-adjacent studio, furnished. Utilities capped, elevator.",
    tags: ["Furnished", "Elevator", "Utilities Included"],
  },
  {
    id: "hb-008",
    title: "CUNY Baruch Shared (M)",
    city: "New York, NY",
    university: "CUNY Baruch",
    type: "Room",
    price: 975,
    rating: 4.3,
    reviews: 89,
    img: img8,
    blurb: "Male-only room in 2BR near Lexington Ave. Agent KYC verified.",
    tags: ["Male-only", "Near Transit"],
  },
  {
    id: "hb-009",
    title: "NJIT 1BR Loft",
    city: "Newark, NJ",
    university: "NJIT",
    type: "1 Bedroom",
    price: 1320,
    rating: 4.6,
    reviews: 143,
    img: img9,
    blurb:
      "Industrial loft with high ceilings, near Broad St. station. Escrow-ready.",
    tags: ["Furnished", "Near Transit"],
  },
  {
    id: "hb-010",
    title: "Columbia West Harlem Room",
    city: "New York, NY",
    university: "Columbia University",
    type: "Room",
    price: 890,
    rating: 4.2,
    reviews: 311,
    img: img10,
    blurb:
      "Budget-friendly room in a verified 5BR. Audit trail for every decision.",
    tags: ["Budget", "Verified Agent"],
  },
];

export default function Listings() {
  const [view, setView] = useState("grid"); // 'grid' | 'list'
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(() => {
    return LISTINGS.filter((l) => {
      const matchesText = [l.title, l.city, l.university, l.type]
        .join(" ")
        .toLowerCase()
        .includes(q.toLowerCase());
      const matchesType = type === "All" || l.type === type;
      const matchesPrice = l.price <= maxPrice;
      return matchesText && matchesType && matchesPrice;
    });
  }, [q, type, maxPrice]);

  return (
    <section className={`hbr-listings ${filtersOpen ? "filters-open" : ""}`}>
      <div className="hbr-container hbr-listings__inner">
        {/* Sidebar (filters) */}
        <aside className="hbr-filter" aria-label="Filters">
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
            {[
              "Furnished",
              "Near Transit",
              "Utilities Included",
              "Ensuite Bathroom",
            ].map((f) => (
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
                {results.length} result{results.length === 1 ? "" : "s"}
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
          <div
            className="hbr-dim"
            onClick={() => setFiltersOpen(false)}
            aria-hidden={!filtersOpen}
          />

          {view === "grid" ? (
            <div className="hbr-grid">
              {results.map((l) => (
                <article className="hbr-card" key={l.id}>
                  <figure className="hbr-card__media">
                    <img src={l.img} alt={l.title} />
                    <span className="hbr-ribbon">Verified</span>
                    <button className="hbr-like" aria-label="Save">
                      <FiHeart />
                    </button>
                  </figure>

                  <div className="hbr-card__meta">
                    <div className="hbr-row">
                      <span className="hbr-rate">
                        <FiStar /> {l.rating}
                      </span>
                      <span className="hbr-rev">{l.reviews}</span>
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

                    {/* Pass the listing and which image should be active (0 = the card image) */}
                    <Link
                      to={`/listings/${l.id}`}
                      state={{ listing: l, activeIndex: 0 }}
                      className="hbr-btn hbr-btn--ghost"
                    >
                      View detail
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="hbr-list">
              {results.map((l) => (
                <article className="hbr-rowcard" key={l.id}>
                  <img src={l.img} alt={l.title} className="hbr-rowcard__img" />
                  <div className="hbr-rowcard__main">
                    <h3 className="hbr-rowcard__title">{l.title}</h3>
                    <div className="hbr-rowcard__sub">
                      <span className="hbr-pill">{l.type}</span>
                      <span className="hbr-uni">{l.university}</span>
                      <span className="hbr-city">
                        <FiMapPin /> {l.city}
                      </span>
                    </div>
                    <p className="hbr-rowcard__blurb">{l.blurb}</p>
                    <div className="hbr-rowcard__facts">
                      <span>
                        <FiStar /> {l.rating}
                      </span>
                      <span>{l.reviews}</span>
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
                      state={{ listing: l, activeIndex: 0 }}
                      className="hbr-btn hbr-btn--ghost"
                    >
                      View detail
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
