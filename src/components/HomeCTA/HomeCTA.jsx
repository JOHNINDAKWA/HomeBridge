import "./HomeCTA.css";
import { Link } from "react-router-dom";

// Replace with your own banner image
import ctaBg from "../../assets/images/cta-banner.jpg";

export default function HomeCTA() {
  return (
    <section className="hb-cta" style={{ "--cta-bg": `url(${ctaBg})` }}>
      <div className="hb-cta__overlay" />
      <div className="container hb-cta__inner">
        <div className="hb-cta__content">
          <p className="kicker">Ready for takeoff?</p>
          <h2>Book safe & verified housing before your flight</h2>
          <p className="lead">
            Browse pre-vetted listings near campus, escrow your deposit, and sign a digital lease.
            We’ll handle the paperwork. You focus on the journey.
          </p>
          <div className="hb-cta__actions">
            <Link to="/listings" className="btn btn--primary">Browse Listings</Link>
            <Link to="/about" className="btn btn--ghost">How it works</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
