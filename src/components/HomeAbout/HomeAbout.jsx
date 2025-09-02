import "./HomeAbout.css";

// Tip: replace these file names with your 7 actual images in /assets/images
import img1 from "../../assets/images/ota1.jpg";
import img2 from "../../assets/images/ota2.jpg";
import img3 from "../../assets/images/ota3.jpg";
import img4 from "../../assets/images/ota4.jpg";
import img5 from "../../assets/images/ota5.jpg";
import img6 from "../../assets/images/ota6.jpg";
import center from "../../assets/images/hero-desktop2.png";

const orbitImages = [img1, img2, img3, img4, img5, img6,];

export default function HomeAbout() {
  return (
    <section className="hb-about">
      <div className="container hb-about__grid">
        {/* Visual side */}
        <div className="hb-about__visual" aria-hidden="true">
          <div className="hb-orbit">
            {/* dotted arc */}
            <span className="hb-orbit__ring" />
            {/* center card/image */}
            <div className="hb-orbit__center card">
              <img src={center} alt="" />
            </div>

            {/* orbiting badges */}
            {orbitImages.map((src, i) => (
              <div
                className={`hb-orbit__node node-${i + 1}`}
                key={i}
                style={{ "--idx": i }}
              >
                <img src={src} alt="" />
              </div>
            ))}
          </div>
        </div>

        {/* Copy side */}
        <div className="hb-about__copy">
          <p className="hb-kicker">Why HomeBridge</p>
          <h2 className="hb-about__title">
            Seamless pre-arrival housing, synced and verified.
          </h2>
          <p className="hb-about__lead">
            We verify student-friendly agents, escrow your move-in payments, and streamline
            document workflows—so you can book with confidence before you fly.
          </p>

          <ul className="hb-about__list">
            <li><span className="plus">+</span> Verified listings near campus with transit-aware filters.</li>
            <li><span className="plus">+</span> Escrowed bookings with clear refund &amp; release rules.</li>
            <li><span className="plus">+</span> Document vault: I-20, passport, admission/agency letters.</li>
            <li><span className="plus">+</span> In-app messaging &amp; audit trail for every decision.</li>
            <li><span className="plus">+</span> Agent onboarding with KYC/KYB &amp; Fair Housing prompts.</li>
          </ul>

          <a className="hb-about__link" href="/about">
            Learn how HomeBridge works →
          </a>
        </div>
      </div>
    </section>
  );
}
