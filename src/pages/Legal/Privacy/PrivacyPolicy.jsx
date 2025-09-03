import "./PrivacyPolicy.css";

export default function PrivacyPolicy() {
  const effective = "September 3, 2025"; // update as needed

  return (
    <section className="legal-wrap container2">
      <header className="legal-hero card">
        <h1>Privacy Policy</h1>
        <p className="legal-sub">Effective {effective}</p>
      </header>

      <div className="legal-grid">
        <aside className="legal-aside card">
          <nav className="legal-toc" aria-label="Privacy policy contents">
            <a href="#scope">1. Scope</a>
            <a href="#data-we-collect">2. Data We Collect</a>
            <a href="#how-we-use">3. How We Use Data</a>
            <a href="#sharing">4. How We Share</a>
            <a href="#cookies">5. Cookies & Tracking</a>
            <a href="#retention">6. Retention</a>
            <a href="#security">7. Security</a>
            <a href="#international">8. International Transfers</a>
            <a href="#your-rights">9. Your Rights</a>
            <a href="#children">10. Children</a>
            <a href="#changes">11. Changes</a>
            <a href="#contact">12. Contact</a>
          </nav>
        </aside>

        <main className="legal-main card">
          <section id="scope" className="legal-section">
            <h2>1. Scope</h2>
            <p>
              This Privacy Policy explains how HomeBridge (“we”, “us”, “our”) collects, uses, and
              shares information when you use our website, apps, and services (the “Platform”).
            </p>
          </section>

          <section id="data-we-collect" className="legal-section">
            <h2>2. Data We Collect</h2>
            <ul className="legal-list">
              <li><b>Account & Profile:</b> name, email, password (hashed), role (student/agent), school, program, intake, phone.</li>
              <li><b>Documents & Vault:</b> filenames, metadata, sizes, and (if uploaded) document content necessary to provide the service.</li>
              <li><b>Booking & Payments:</b> listing IDs, dates, status; limited payment/escrow metadata from processors.</li>
              <li><b>Communications:</b> messages with partners, support tickets, reviews.</li>
              <li><b>Device/Usage:</b> IP address, device identifiers, browser, pages viewed, referring/exit pages, timestamps.</li>
              <li><b>Cookies:</b> as described in the Cookies section below.</li>
            </ul>
          </section>

          <section id="how-we-use" className="legal-section">
            <h2>3. How We Use Data</h2>
            <ul className="legal-list">
              <li>Provide and improve the Platform, including bookings, messaging, and escrow flows.</li>
              <li>Verify identity and ensure trust & safety (e.g., KYC/KYB checks, fraud prevention).</li>
              <li>Communicate with you about bookings, updates, and support.</li>
              <li>Personalize content and recommend listings.</li>
              <li>Analytics, debugging, and service performance.</li>
              <li>Legal compliance, dispute resolution, and enforcement.</li>
            </ul>
          </section>

          <section id="sharing" className="legal-section">
            <h2>4. How We Share</h2>
            <ul className="legal-list">
              <li><b>Agents/Landlords:</b> we share relevant booking and profile info to process your request.</li>
              <li><b>Payment/Escrow Providers:</b> to process payments and escrow releases.</li>
              <li><b>Verification Providers:</b> to perform identity verification or compliance checks.</li>
              <li><b>Service Providers:</b> hosting, analytics, emails, customer support.</li>
              <li><b>Legal/Protection:</b> to comply with law or protect rights, safety, and property.</li>
              <li><b>Business Transfers:</b> as part of a merger, acquisition, or asset sale.</li>
            </ul>
          </section>

          <section id="cookies" className="legal-section">
            <h2>5. Cookies & Tracking</h2>
            <p>
              We use cookies and similar technologies to operate the Platform, remember preferences,
              measure performance, and improve features. You can adjust cookie settings in your
              browser. Some features may not function properly without certain cookies.
            </p>
          </section>

          <section id="retention" className="legal-section">
            <h2>6. Data Retention</h2>
            <p>
              We retain information for as long as necessary to provide the Platform and fulfill the
              purposes outlined here, unless a longer retention period is required by law. You may
              request deletion where applicable (see “Your Rights”).
            </p>
          </section>

          <section id="security" className="legal-section">
            <h2>7. Security</h2>
            <p>
              We implement technical and organizational safeguards designed to protect your
              information. However, no method of transmission or storage is 100% secure. Use the
              Platform at your own risk.
            </p>
          </section>

          <section id="international" className="legal-section">
            <h2>8. International Transfers</h2>
            <p>
              Your information may be processed in countries other than your own. Where required,
              we implement appropriate safeguards to protect international transfers.
            </p>
          </section>

          <section id="your-rights" className="legal-section">
            <h2>9. Your Rights</h2>
            <p>
              Depending on your location, you may have rights to access, correct, delete, or
              export your information, and to object to or restrict certain processing. To exercise
              these rights, contact us at <a href="mailto:privacy@homebridge.com">privacy@homebridge.com</a>.
            </p>
          </section>

          <section id="children" className="legal-section">
            <h2>10. Children</h2>
            <p>
              The Platform is not intended for children under the age of 16 (or as defined by local
              law). We do not knowingly collect personal data from children under that age.
            </p>
          </section>

          <section id="changes" className="legal-section">
            <h2>11. Changes</h2>
            <p>
              We may update this Privacy Policy periodically. The “Effective” date above indicates
              the latest version. Continued use of the Platform after updates constitutes acceptance.
            </p>
          </section>

          <section id="contact" className="legal-section">
            <h2>12. Contact</h2>
            <p>
              Questions or requests? Email <a href="mailto:privacy@homebridge.com">privacy@homebridge.com</a>.
            </p>
            <p className="legal-note">
              This page is a general template and not legal advice. Please consult your counsel to
              adapt it for your jurisdiction and data flows.
            </p>
          </section>
        </main>
      </div>
    </section>
  );
}
