// src/pages/About.jsx
import "./About.css";
import {
  FiCheckCircle,
  FiSearch,
  FiFileText,
  FiShield,
} from "react-icons/fi";

import {
  FiHeart,
  FiDollarSign,
  FiHeadphones,
} from "react-icons/fi";

// Images (swap paths if yours differ)
import heroImg from "../../assets/images/about-hero.jpg";
import imgA from "../../assets/images/students.jpg";
import imgB from "../../assets/images/avatar5.jpg";

import agentImg from "../../assets/images/partner-handshake.jpg";
import studentImg from "../../assets/images/list-keys.jpg";

import arrowImg from "../../assets/images/step-arrow-right.svg";

export default function About() {
  return (
    <main className="ab-wrap">
      {/* ================= HERO ================= */}
      <section
        className="ab-hero"
        style={{ backgroundImage: `url(${heroImg})` }}
        role="img"
        aria-label="About HomeBridge"
      >
        <div className="container ab-hero__inner">
          <h1 className="ab-hero__title">About Us</h1>
          <p className="ab-hero__sub">
            HomeBridge helps international students secure verified housing before they fly.
            Payments are escrowed, documents handled securely, and every action leaves
            a clear audit trail.
          </p>

          <nav className="ab-breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><a href="/">Home</a></li>
              <li aria-current="page">About Us</li>
            </ol>
          </nav>
        </div>
        <div className="ab-hero__fade" aria-hidden />
      </section>

      {/* ========== STORY / STATS (2-column) ========== */}
      <section className="container ab-body">
        <div className="ab-grid">
          {/* LEFT: copy */}
          <article className="ab-copy">
            <span className="ab-kicker">Welcome</span>
            <h2 className="ab-h2">Our Story at HomeBridge</h2>

            <p className="ab-p">
              We build student-first housing for cross-border study. From Nairobi to Newark,
              our goal is simple: make it safe and straightforward to find a place near campus
              and move in with confidence.
            </p>

            <p className="ab-p">
              Every listing is verified, every payment protected through escrow, and
              every step is recorded—so parents can relax and students can focus on Day 1.
            </p>

            <ul className="ab-points">
              <li><FiCheckCircle style={{marginRight: 6}} /> Verified agents & listings near campus</li>
              <li><FiCheckCircle style={{marginRight: 6}} /> Escrow with transparent refund & release rules</li>
              <li><FiCheckCircle style={{marginRight: 6}} /> Document vault for I-20, passport & admission letters</li>
              <li><FiCheckCircle style={{marginRight: 6}} /> Messaging + audit trail for every decision</li>
            </ul>
          </article>

          {/* RIGHT: 2×2 collage */}
          <aside className="ab-collage">
            <figure className="ab-card ab-card--img">
              <img src={imgA} alt="Students preparing to study abroad" />
            </figure>

            <div className="ab-card ab-card--stat" aria-label="Verified Listings">
              <div className="ab-stat">
                <div className="ab-stat__num">10k+</div>
                <div className="ab-stat__label">Verified Listings</div>
              </div>
            </div>

            <div className="ab-card ab-card--stat" aria-label="Universities Covered">
              <div className="ab-stat">
                <div className="ab-stat__num">120+</div>
                <div className="ab-stat__label">Universities Covered</div>
              </div>
            </div>

            <figure className="ab-card ab-card--img">
              <img src={imgB} alt="Community & amenities that matter" />
            </figure>
          </aside>
        </div>
      </section>



      {/* =========================
          1) WHY HOMEBRIDGE (feature row)
         ========================= */}

{/* =========================
    “Book Your Perfect Accommodation” (feature row)
   ========================= */}
<section className="container ab-features">
  <header className="ab-sechead">
    <h3 className="ab-h3">Book Your Perfect Accommodation</h3>
    <p className="ab-sub">
      Built for students booking across borders—simple, secure and transparent.
    </p>
  </header>

  <div className="ab-features__grid">
    <article className="ab-feature card">
      <div className="ab-feature__ico">
        <FiHeart size={22} />
      </div>
      <h4>Instant & Easy Bookings</h4>
      <p>Reserve verified rooms in minutes—no guesswork, no hidden steps.</p>
    </article>

    <article className="ab-feature card">
      <div className="ab-feature__ico">
        <FiDollarSign size={22} />
      </div>
      <h4>Fair, Transparent Pricing</h4>
      <p>All fees upfront. Clear refund rules tied to escrow milestones.</p>
    </article>

    <article className="ab-feature card">
      <div className="ab-feature__ico">
        <FiHeadphones size={22} />
      </div>
      <h4>Real Human Support</h4>
      <p>Questions from Nairobi at 2 a.m.? We’ve got you—chat or call.</p>
    </article>

    <article className="ab-feature card">
      <div className="ab-feature__ico">
        <FiShield size={22} />
      </div>
      <h4>100% Verified Listings</h4>
      <p>Agent KYC/KYB, Fair-Housing prompts, and listing audits—always.</p>
    </article>
  </div>
</section>


      {/* ========== 3 EASY STEPS (with arrow images) ========== */}
      <section className="container ab-steps">
        <header className="ab-sechead">
          <h3 className="ab-h3">Book Your Place in 3 Easy Steps</h3>
          <p className="ab-sub">From search to secure booking—made for international arrivals.</p>
        </header>

        <div className="ab-steps__grid">
          <article className="ab-step card">
            <span className="ab-step__badge">1</span>
            <div className="ab-step__icon">
              <FiSearch size={26} />
            </div>
            <h4>Discover & Shortlist</h4>
            <p>Use transit-aware filters and furnished options to shortlist near campus.</p>
          </article>

          {/* Arrow connector */}
          <img src={arrowImg} alt="" className="ab-arrow" />

          <article className="ab-step card">
            <span className="ab-step__badge">2</span>
            <div className="ab-step__icon">
              <FiFileText size={26} />
            </div>
            <h4>Get Your Paperwork Done</h4>
            <p>Upload passport, I-20 and admission letters to the vault. E-sign the lease.</p>
          </article>

          {/* Arrow connector */}
          <img src={arrowImg} alt="" className="ab-arrow" />

          <article className="ab-step card">
            <span className="ab-step__badge">3</span>
            <div className="ab-step__icon">
              <FiShield size={26} />
            </div>
            <h4>Escrowed Booking</h4>
            <p>Funds are held until move-in confirmation. Relax and book your flight.</p>
          </article>
        </div>
      </section>

      {/* ========== PROMOS: Agents & Students ========== */}
      <section className="container ab-promos">
        <div
          className="ab-promo ab-promo--left card"
          style={{ backgroundImage: `url(${agentImg})` }}
          aria-label="For Agents & Landlords"
        >
          <div className="ab-promo__content">
            <h4>For Agents & Landlords</h4>
            <p>
              Join HomeBridge to reach international students before they land.
              Verified processes, fair rules and fast payouts.
            </p>
            <a href="/partners" className="btn btn--light">Partner With HomeBridge</a>
          </div>
        </div>

        <div
          className="ab-promo ab-promo--right card"
          style={{ backgroundImage: `url(${studentImg})` }}
          aria-label="For Students"
        >
          <div className="ab-promo__content">
            <h4>For Students</h4>
            <p>
              Secure your housing abroad before flying. Verified listings, escrowed payments,
              and simple document workflows.
            </p>
            <a href="/listings" className="btn btn--light">Browse Listings</a>
          </div>
        </div>
      </section>
    </main>
  );
}
