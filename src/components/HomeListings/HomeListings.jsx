import { useRef } from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiHome, FiMaximize2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./HomeListings.css";

// swap these with your student-housing images later
import img1 from "../../assets/images/home-bg.jpg";
import img2 from "../../assets/images/home-bg2.jpg";
import img3 from "../../assets/images/home-bg4.jpg";
import img4 from "../../assets/images/home-bg5.jpg";
import img5 from "../../assets/images/home-bg6.jpg";
import img6 from "../../assets/images/home-bg4.jpg";

const demos = [
  {
    id: "1",
    title: "Campus Studio • Newark",
    price: 1199,
    img: img1,
    facts: { size: "22 m²", guests: 1, beds: 1 },
    blurb:
      "Compact studio 7 mins to Rutgers Newark by light rail. Furnished, utilities capped, flexible lease.",
  },
  {
    id: "2",
    title: "Shared Room • Upper Manhattan",
    price: 899,
    img: img2,
    facts: { size: "18 m²", guests: 1, beds: 1 },
    blurb:
      "Female-only room in a 3BR near Columbia. Walk to 1 train, laundry in building, verified agent.",
  },
  {
    id: "3",
    title: "1BR • University City, Philly",
    price: 1390,
    img: img3,
    facts: { size: "35 m²", guests: 2, beds: 1 },
    blurb:
      "Bright one-bedroom 10 mins to Drexel. Furnished, near trolley, escrow-ready with digital lease.",
  },
  {
    id: "4",
    title: "2BR Apartment • Jersey City",
    price: 1750,
    img: img4,
    facts: { size: "48 m²", guests: 2, beds: 2 },
    blurb:
      "Modern 2-bedroom near Journal Square PATH. Great for roomies attending NJIT or Stevens Institute.",
  },
  {
    id: "5",
    title: "Loft Room • Downtown Brooklyn",
    price: 1100,
    img: img5,
    facts: { size: "25 m²", guests: 1, beds: 1 },
    blurb:
      "Stylish loft share with exposed brick and study nook. 5 mins from subway, ideal for NYU students.",
  },
  {
    id: "6",
    title: "Studio • Temple University, Philly",
    price: 1025,
    img: img6,
    facts: { size: "20 m²", guests: 1, beds: 1 },
    blurb:
      "Affordable furnished studio in student-heavy neighborhood. Escrow-ready, utilities included.",
  },
];


export default function HomeListings() {
  const railRef = useRef(null);

  const scrollByCards = (dir = 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector(".hb-card");
    const step = card ? card.clientWidth + 24 : 320;
    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="hb-lp-listings container">
      <div className="container hb-lp-head">
        <p className="kicker">Explore verified options</p>
        <div className="hb-lp-titleRow">
          <h2 className="title">Select Your Stay</h2>
          <div className="hb-lp-arrows">
            <button className="arrow" aria-label="Previous" onClick={() => scrollByCards(-1)}>
              <FiChevronLeft />
            </button>
            <button className="arrow" aria-label="Next" onClick={() => scrollByCards(1)}>
              <FiChevronRight />
            </button>
          </div>
        </div>
        <p className="lead">
          Book student-friendly rooms and studios near campus. All listings go through agent
          verification, escrowed booking, and clear refund rules—so you can focus on arrival day.
        </p>
      </div>

      <div className="hb-rail-wrap">
        <div className="hb-rail" ref={railRef}>
          {demos.map((d) => (
            <article className="hb-card" key={d.id}>
              <div className="hb-card__media">
                <img src={d.img} alt={d.title} />
                <span className="hb-card__price">
                  KES {(d.price * 130).toLocaleString()} / mo
                </span>
              </div>

              <div className="hb-card__body">
                <h3 className="hb-card__title">{d.title}</h3>

                <ul className="hb-card__facts">
                  <li><FiMaximize2 /> {d.facts.size}</li>
                  <li><FiUsers /> {d.facts.guests} Guest{d.facts.guests !== 1 ? "s" : ""}</li>
                  <li><FiHome /> {d.facts.beds} Bed{d.facts.beds !== 1 ? "s" : ""}</li>
                </ul>

                <p className="hb-card__blurb">{d.blurb}</p>

                <div className="hb-card__actions">
                  <Link className="link" to={`/listings`}>Discover more</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="container hb-lp-cta">
        <Link className="btn" to="/listings">Browse all listings</Link>
      </div>
    </section>
  );
}
