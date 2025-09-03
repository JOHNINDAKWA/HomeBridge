import "./TermsOfUse.css";

export default function TermsOfUse() {
  const effective = "September 3, 2025"; // update as needed

  return (
    <section className="legal-wrap container2">
      <header className="legal-hero card">
        <h1>Terms of Use</h1>
        <p className="legal-sub">Effective {effective}</p>
      </header>

      <div className="legal-grid">
        <aside className="legal-aside card">
          <nav className="legal-toc" aria-label="Terms of use contents">
            <a href="#acceptance">1. Acceptance</a>
            <a href="#eligibility">2. Eligibility & Accounts</a>
            <a href="#platform-role">3. Platform Role</a>
            <a href="#bookings">4. Listings & Bookings</a>
            <a href="#fees">5. Fees, Escrow & Refunds</a>
            <a href="#conduct">6. User Conduct</a>
            <a href="#content">7. User Content & IP</a>
            <a href="#third-party">8. Third-Party Services</a>
            <a href="#disclaimers">9. Disclaimers</a>
            <a href="#liability">10. Limitation of Liability</a>
            <a href="#indemnity">11. Indemnity</a>
            <a href="#law">12. Governing Law</a>
            <a href="#changes">13. Changes</a>
            <a href="#contact">14. Contact</a>
          </nav>
        </aside>

        <main className="legal-main card">
          <section id="acceptance" className="legal-section">
            <h2>1. Acceptance</h2>
            <p>
              By accessing or using HomeBridge (the “Platform”), you agree to be bound by these Terms
              of Use (“Terms”). If you do not agree, do not use the Platform.
            </p>
          </section>

          <section id="eligibility" className="legal-section">
            <h2>2. Eligibility & Accounts</h2>
            <p>
              You must be able to form a binding contract and comply with applicable laws. You are
              responsible for your account credentials and for all activity under your account. We
              may suspend or terminate accounts for policy violations or misuse.
            </p>
          </section>

          <section id="platform-role" className="legal-section">
            <h2>3. Platform Role</h2>
            <p>
              HomeBridge is a marketplace facilitating bookings between students and independent
              housing partners. HomeBridge is not a landlord, property manager, or real-estate
              broker, and is not a party to leases or accommodation contracts.
            </p>
          </section>

          <section id="bookings" className="legal-section">
            <h2>4. Listings & Bookings</h2>
            <p>
              Partners are responsible for listing accuracy, pricing, and availability. Booking
              requests, confirmations, and cancellations are subject to applicable partner rules,
              local laws, and Platform policies. We may provide messaging, document handling, and
              e-sign tools for convenience only.
            </p>
          </section>

          <section id="fees" className="legal-section">
            <h2>5. Fees, Escrow & Refunds</h2>
            <p>
              Certain bookings may use an escrow flow. Fees and any applicable taxes will be
              disclosed at checkout. Refunds, if any, follow the partner’s cancellation policy and
              Platform rules. Payment processing is handled by third-party providers.
            </p>
          </section>

          <section id="conduct" className="legal-section">
            <h2>6. User Conduct</h2>
            <ul className="legal-list">
              <li>No fraud, misrepresentation, or unlawful activity.</li>
              <li>No discrimination, harassment, or hateful content.</li>
              <li>No posting of content that infringes others’ rights or privacy.</li>
              <li>No attempts to bypass Platform features, access unauthorized data, or disrupt service.</li>
            </ul>
          </section>

          <section id="content" className="legal-section">
            <h2>7. User Content & IP</h2>
            <p>
              You retain rights to content you submit. By submitting content, you grant HomeBridge a
              worldwide, non-exclusive, royalty-free license to host, store, display, and process it
              to operate the Platform. HomeBridge’s trademarks, branding, and software are protected
              by intellectual property laws and may not be used without permission.
            </p>
          </section>

          <section id="third-party" className="legal-section">
            <h2>8. Third-Party Services</h2>
            <p>
              The Platform may link to or integrate third-party services (e.g., payment/escrow,
              verification, maps, analytics). Those services are governed by their own terms and
              policies. HomeBridge is not responsible for third-party services.
            </p>
          </section>

          <section id="disclaimers" className="legal-section">
            <h2>9. Disclaimers</h2>
            <p>
              The Platform is provided “as is” and “as available” without warranties of any kind,
              express or implied, including merchantability, fitness for a particular purpose, or
              non-infringement. We do not guarantee listing accuracy, availability, or outcomes
              (including visas, admissions, or travel approvals).
            </p>
          </section>

          <section id="liability" className="legal-section">
            <h2>10. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, HomeBridge will not be liable for indirect,
              incidental, special, consequential, or exemplary damages, or for lost profits, data,
              or goodwill, arising from or related to your use of the Platform.
            </p>
          </section>

          <section id="indemnity" className="legal-section">
            <h2>11. Indemnity</h2>
            <p>
              You agree to defend, indemnify, and hold harmless HomeBridge and its affiliates from
              any claims, damages, liabilities, and expenses arising from your use of the Platform,
              your content, or your violation of these Terms or applicable law.
            </p>
          </section>

          <section id="law" className="legal-section">
            <h2>12. Governing Law</h2>
            <p>
              These Terms are governed by the laws of <b>[Your Country/Region]</b>, without regard
              to conflict-of-laws rules. You agree to the exclusive jurisdiction of the courts in
              <b> [Your City/Jurisdiction]</b>. {/* TODO: Set your actual governing law and venue */}
            </p>
          </section>

          <section id="changes" className="legal-section">
            <h2>13. Changes</h2>
            <p>
              We may revise these Terms from time to time. The “Effective” date above indicates the
              latest version. Your continued use of the Platform constitutes acceptance of the
              updated Terms.
            </p>
          </section>

          <section id="contact" className="legal-section">
            <h2>14. Contact</h2>
            <p>
              Questions? Email <a href="mailto:legal@homebridge.com">legal@homebridge.com</a>.
            </p>
            <p className="legal-note">
              This page is a general template and not legal advice. Please consult legal counsel to
              tailor it to your business and jurisdictions.
            </p>
          </section>
        </main>
      </div>
    </section>
  );
}
