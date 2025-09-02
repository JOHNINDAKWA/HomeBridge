import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import "./HomeFAQ.css";

const faqs = [
  {
    q: "How does escrow work for my booking?",
    a: "You pay a deposit into an escrow account. Funds are only released to the agent after you confirm move-in, or automatically after the agreed window. If plans change or a dispute occurs, our rules guide refunds.",
  },
  {
    q: "Which documents do I need?",
    a: "Commonly: passport, I-20/DS-2019, admission or agency letter, and proof of funds. Upload once to your vault and share securely with verified agents.",
  },
  {
    q: "Can I book before I receive my visa?",
    a: "Yes — many agents accept pre-arrival bookings. If your visa is denied, your case is reviewed under our refund policy with evidence.",
  },
  {
    q: "Is HomeBridge available beyond NJ/NY/PA?",
    a: "The MVP focuses on NJ/NY/PA. We’re expanding city by city — you can join the waitlist and we’ll notify you as we launch.",
  },
];

export default function HomeFAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="hb-faq">
      <div className="container">
        <div className="hb-faq__head">
          <p className="kicker">FAQ</p>
          <h2>Questions students ask us</h2>
          <p className="lead">Short answers now — deeper guidance inside your dashboard.</p>
        </div>

        <div className="hb-faq__list">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div className={`faq ${isOpen ? "open" : ""}`} key={i}>
                <button className="faq__q" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                  <span>{f.q}</span>
                  <FiChevronDown className="chev" />
                </button>
                <div className="faq__a" role="region">
                  <p>{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
