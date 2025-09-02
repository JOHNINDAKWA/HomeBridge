import { useMemo, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import {
  FiMapPin,
  FiStar,
  FiHome,
  FiUsers,
  FiShield,
  FiWifi,
  FiMonitor,
  FiDroplet,
  FiThermometer,
  FiCoffee,
  FiLock,
  FiKey,
  FiCheckCircle,
  FiAlertCircle,
  FiPhone,
  FiMail,
  FiShare2,
  FiHeart,
  FiBookOpen,
  FiClock,
  FiMap,
  FiDollarSign,
} from "react-icons/fi";
import "./ListingDetails.css";

import {
  useNavigate,
} from "react-router-dom";

/** Shared data source (same list the cards use) */
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

/** Extra gallery images (fallbacks) */
const EXTRA_IMAGES = [img2, img3, img4, img5, img6, img7, img8, img9, img10];

export default function ListingDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  // Listing from navigation state (fast path), else lookup by :id (deep link / refresh)
  const passedListing = location.state?.listing;
  const listing = passedListing ?? LISTINGS.find((l) => l.id === id);

  if (!listing) {
    return (
      <section className="ld-wrap">
        <div className="container">
          <p>Listing not found.</p>
        </div>
      </section>
    );
  }

  // Build gallery so the FIRST image is the card image from Listings page
  const gallery = useMemo(() => {
    const unique = [
      listing.img,
      ...EXTRA_IMAGES.filter((x) => x !== listing.img),
    ];
    return unique.slice(0, 10); // cap if you want
  }, [listing.img]);

  // Initial active index priority:
  // 1) query param ?img=2  2) state.activeIndex  3) default 0
  const qImg = parseInt(sp.get("img") ?? "", 10);
  const stateActive = Number.isInteger(location.state?.activeIndex)
    ? location.state.activeIndex
    : null;
  const initialActive =
    Number.isInteger(qImg) && qImg >= 0 && qImg < gallery.length
      ? qImg
      : Number.isInteger(stateActive) &&
        stateActive >= 0 &&
        stateActive < gallery.length
      ? stateActive
      : 0;

  const [active, setActive] = useState(initialActive);

  // Derived/demo fields to flesh out the page
  const derived = useMemo(() => {
    return {
      size: "22 m²",
      guests: 1,
      beds: listing.type === "Room" ? 1 : 1,
      verified: true,
      escrow: true,
      priceUnit: "per month",
      transitMinutes: "6–8 min",
      highlights: [
        { icon: <FiShield />, text: "Verified agent + escrow" },
        { icon: <FiWifi />, text: "High-speed Wi-Fi included" },
        { icon: <FiMonitor />, text: "Desk + study lamp" },
        { icon: <FiThermometer />, text: "Heating + AC" },
        { icon: <FiDroplet />, text: "Utilities capped" },
        { icon: <FiCoffee />, text: "Mini-kitchenette" },
      ],
      amenities: [
        ...(listing.tags || []),
        "Closet",
        "Blackout curtains",
        "On-site laundry",
        "Secure entry",
        "Bike storage",
      ],
      policies: [
        "No smoking",
        "No pets",
        "Quiet hours 10pm–7am",
        "Student-only lease",
        "Watermarked doc previews",
      ],
      description:
        listing.blurb ||
        "Comfortable student-ready accommodation with simple document workflows.",
    };
  }, [listing]);

  return (
    <section className="ld-wrap">
      <div className="container">
        {/* Header: title + meta */}
        <header className="ld-head">
          <div className="ld-titleblock">
            <h1 className="ld-title">
              {listing.title}{" "}
              {listing.tags?.includes("Furnished") ? "• Furnished" : ""}
            </h1>
            <div className="ld-meta">
              <span className="meta">
                <FiMapPin /> {listing.city}
              </span>
              <span className="dot" />
              <span className="meta">
                <FiHome /> {listing.type} • {derived.size}
              </span>
              <span className="dot" />
              <span className="meta">
                <FiUsers /> {derived.guests} guest • {derived.beds} bed
              </span>
              <span className="dot" />
              <span className="meta">
                <FiStar className="star" /> {listing.rating} ({listing.reviews})
              </span>
              {derived.verified && (
                <>
                  <span className="dot" />
                  <span className="badge badge--ok">
                    <FiCheckCircle /> Verified
                  </span>
                </>
              )}
            </div>
            <div className="ld-under">
              <span className="uni">Near: {listing.university}</span>
            </div>
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
            <img src={gallery[active]} alt={`Listing photo ${active + 1}`} />
          </figure>
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
        </section>

        {/* Content grid: left details, right sticky contact */}
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
                <b>{derived.guests} person</b>
              </div>
              <div className="fact">
                <FiBookOpen /> <span>Size</span>
                <b>{derived.size}</b>
              </div>
              <div className="fact">
                <FiClock /> <span>Move-in</span>
                <b>Flexible</b>
              </div>
              <div className="fact">
                <FiShield /> <span>Escrow</span>
                <b>{derived.escrow ? "Yes" : "No"}</b>
              </div>
              <div className="fact">
                <FiMap /> <span>Transit</span>
                <b>{derived.transitMinutes}</b>
              </div>
            </div>

            <section className="ld-section card">
              <h3 className="ld-h3">About this place</h3>
              <p>{derived.description}</p>
            </section>

            <section className="ld-section card">
              <h3 className="ld-h3">Highlights</h3>
              <ul className="ld-highlights">
                {derived.highlights.map((h, i) => (
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
                {derived.amenities.map((a, i) => (
                  <li key={i}>
                    <FiCheckCircle className="ok" /> {a}
                  </li>
                ))}
              </ul>
            </section>

            <section className="ld-section card">
              <h3 className="ld-h3">Policies & Notes</h3>
              <ul className="ld-policies">
                {derived.policies.map((p, i) => (
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
                    {listing.city} • {listing.university}
                  </p>
                  <small>(Map integration later)</small>
                </div>
              </div>
            </section>
          </main>

          {/* RIGHT: sticky contact / booking card */}
          <aside className="ld-contact">
            <div className="ld-sticky card">
              <div className="ld-price">
                <div className="amount">
                  <FiDollarSign />
                  {listing.price}
                </div>
                <div className="unit">/ {derived.priceUnit}</div>
              </div>

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

              <div className="ld-agent">
                <h4>Agent / Housing Partner</h4>
                <p className="mini">
                  <FiShield /> KYC verified • Fair Housing acknowledgement
                </p>
                <div className="ld-agent__cta">
                  <a className="link" href="tel:+12125556688">
                    <FiPhone /> +1 212 555 6688
                  </a>
                  <a className="link" href="mailto:hello@homebridge.com">
                    <FiMail /> hello@homebridge.com
                  </a>
                </div>
              </div>

              <div className="ld-disclaim mini">
                <FiAlertCircle /> Escrow releases after move-in confirmation
                (see refund rules).
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
