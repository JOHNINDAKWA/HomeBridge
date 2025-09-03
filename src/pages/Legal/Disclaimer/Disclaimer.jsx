import "./Disclaimer.css";

export default function Disclaimer() {
  const effective = "September 3, 2025"; // update as needed

  return (
    <section className="legal-wrap container2">
      <header className="legal-hero card">
        <h1>Disclaimer</h1>
        <p className="legal-sub">Effective {effective}</p>
      </header>

      <div className="legal-grid">
        {/* TOC */}
        <aside className="legal-aside card">
          <nav className="legal-toc" aria-label="Disclaimer contents">
            <a href="#informational">1. Informational Use Only</a>
            <a href="#platform-role">2. Platform Role</a>
            <a href="#listings">3. Listings & Availability</a>
            <a href="#no-guarantee">4. No Visa/Admission Guarantee</a>
            <a href="#third-party">5. Third-Party Services</a>
            <a href="#user-content">6. User Content</a>
            <a href="#warranties">7. No Warranties</a>
            <a href="#liability">8. Limitation of Liability</a>
            <a href="#changes">9. Changes</a>
            <a href="#contact">10. Contact</a>
          </nav>
        </aside>

        {/* BODY */}
        <main className="legal-main card">
          <section id="informational" className="legal-section">
            <h2>1. Informational Use Only</h2>
            <p>
              HomeBridge provides information and tooling to help students discover and book housing.
              Content is provided “as is” for general informational purposes and does not constitute
              legal, financial, housing, immigration, or professional advice. You should seek advice
              from qualified professionals where appropriate.
            </p>
          </section>

          <section id="platform-role" className="legal-section">
            <h2>2. Platform Role</h2>
            <p>
              HomeBridge is a marketplace platform that facilitates connections between
              students and independent housing partners (agents/landlords). HomeBridge is
              <strong> not</strong> a landlord, property manager, real-estate broker, or fiduciary,
              and is not a party to any lease or accommodation contract between students and partners.
            </p>
          </section>

          <section id="listings" className="legal-section">
            <h2>3. Listings & Availability</h2>
            <p>
              Listing details, pricing, and availability are provided by partners and may change at
              any time. While we may run verification or KYC/KYB checks, HomeBridge does not
              guarantee the accuracy or completeness of any listing or partner information.
            </p>
          </section>

          <section id="no-guarantee" className="legal-section">
            <h2>4. No Visa/Admission Guarantee</h2>
            <p>
              Housing bookings do not imply or guarantee university admission, visa issuance,
              travel permissions, or compliance with any government requirements. You are responsible
              for your own travel, immigration, and enrollment obligations.
            </p>
          </section>

          <section id="third-party" className="legal-section">
            <h2>5. Third-Party Services</h2>
            <p>
              The platform may reference or integrate third-party services (e.g., escrow/payment
              processors, ID verification, mapping/analytics). HomeBridge does not control and is
              not responsible for such services. Your use of third-party services is governed by
              their own terms and policies.
            </p>
          </section>

          <section id="user-content" className="legal-section">
            <h2>6. User Content</h2>
            <p>
              Reviews, messages, and documents may be submitted by users and partners. HomeBridge
              does not endorse user content and disclaims liability for it. Please report any
              misuse or policy violations so we can review and take action where appropriate.
            </p>
          </section>

          <section id="warranties" className="legal-section">
            <h2>7. No Warranties</h2>
            <p>
              The platform is provided on an “as is” and “as available” basis without warranties of
              any kind, express or implied, including but not limited to merchantability, fitness
              for a particular purpose, title, or non-infringement.
            </p>
          </section>

          <section id="liability" className="legal-section">
            <h2>8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, HomeBridge and its affiliates shall not be
              liable for indirect, incidental, special, consequential, or exemplary damages, or for
              loss of profits, data, goodwill, or other intangible losses arising from or relating
              to your use of the platform.
            </p>
          </section>

          <section id="changes" className="legal-section">
            <h2>9. Changes</h2>
            <p>
              We may update this Disclaimer from time to time. The “Effective” date above reflects
              the latest version. Continued use of the platform after changes are posted constitutes
              acceptance of the revised terms.
            </p>
          </section>

          <section id="contact" className="legal-section">
            <h2>10. Contact</h2>
            <p>
              Questions? Contact us at <a href="mailto:legal@homebridge.com">legal@homebridge.com</a>.
            </p>
            <p className="legal-note">
              This page is a general template and not legal advice. For specific requirements,
              consult your legal counsel.
            </p>
          </section>
        </main>
      </div>
    </section>
  );
}
