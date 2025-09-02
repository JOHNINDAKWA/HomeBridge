import { FiStar, FiCheckCircle } from "react-icons/fi";
import "./HomeTrust.css";

// Replace these with your brand images if desired
import badgeGoogle from "../../assets/images/google-badge.png";
import avatar1 from "../../assets/images/avatar1.jpg";
import avatar2 from "../../assets/images/avatar2.jpg";
import avatar3 from "../../assets/images/avatar4.jpg";

const reviews = [
  {
    id: 1,
    name: "Amina N.",
    uni: "Rutgers Newark",
    text:
      "Booked from Nairobi, moved in the next day. Escrow made my parents calm — zero drama.",
    rating: 5,
    avatar: avatar1,
  },
  {
    id: 2,
    name: "Brian K.",
    uni: "USIU–Africa → Drexel",
    text:
      "The document vault was clutch. Agent was verified and the lease was signed before I flew.",
    rating: 5,
    avatar: avatar2,
  },
  {
    id: 3,
    name: "Sujata P.",
    uni: "Columbia University",
    text:
      "Filters for transit time + furnished saved hours. Transparent fees, quick support.",
    rating: 4.8,
    avatar: avatar3,
  },
];

export default function HomeTrust() {
  return (
    <section className="hb-trust">
      <div className="container">
        <div className="hb-trust__head">
          <div className="hb-trust__left">
            <p className="kicker">Why students trust us</p>
            <h2>Google-style confidence, student-first care</h2>
            <p className="lead">
              We build for international students: verified agents, escrowed payments, and
              compliant workflows — so you can book before you fly.
            </p>
            <div className="hb-trust__badge">
              <img src={badgeGoogle} alt="Google Reviews badge" />
              <div className="score">
                <span className="num">4.9</span>
                <div className="stars" aria-label="rating 4.9 out of 5">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} />
                  ))}
                </div>
                <small>Based on 1,200+ reviews</small>
              </div>
            </div>
            <ul className="hb-trust__ticks">
              <li><FiCheckCircle /> Verified agents & listings</li>
              <li><FiCheckCircle /> Escrow with transparent rules</li>
              <li><FiCheckCircle /> Document vault & e-sign</li>
            </ul>
          </div>

          <div className="hb-trust__cards">
            {reviews.map(r => (
              <article className="tcard" key={r.id}>
                <div className="tcard__row">
                  <img className="tcard__avatar" src={r.avatar} alt={`${r.name} avatar`} />
                  <div>
                    <h4>{r.name}</h4>
                    <p className="tcard__uni">{r.uni}</p>
                  </div>
                </div>
                <div className="tcard__stars">
                  {[...Array(5)].map((_, i) => <FiStar key={i} />)}
                  <span className="tcard__rating">{r.rating}</span>
                </div>
                <p className="tcard__text">{r.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
