import { useMemo, useState } from "react";
import {
  FiSearch, FiFilter, FiChevronDown, FiChevronLeft, FiPaperclip, FiSmile,
  FiSend, FiMail, FiUser, FiMapPin, FiStar, FiStar as FiStarFill,
  FiClock, FiFileText, FiXCircle, FiCheckCircle, FiMoreHorizontal
} from "react-icons/fi";
import "./Messages.css";

/* ------------------ demo inbox data ------------------ */
const THREADS = [
  {
    id: "TH-1022",
    student: { name: "Amina N.", email: "amina.n@example.com", avatar: "" },
    listing: "Rutgers-Ready Studio",
    city: "Newark, NJ",
    stage: "Reviewing",
    unread: 2,
    lastAt: "Aug 18, 12:42",
    preview: "I can move in on the 24th. Can we confirm?",
    messages: [
      { from: "student", at: "Aug 18, 11:58", text: "Hi! I’m targeting Aug 24 move-in. Is it available?" },
      { from: "agent", at: "Aug 18, 12:10", text: "Yes, we can hold pending documents." },
      { from: "student", at: "Aug 18, 12:40", text: "Great! I’ll upload my I-20 now." },
      { from: "student", at: "Aug 18, 12:42", text: "I can move in on the 24th. Can we confirm?" },
      
    ],
  },
  {
    id: "TH-1017",
    student: { name: "Brian K.", email: "brian.k@example.com", avatar: "" },
    listing: "Drexel 1BR with Balcony",
    city: "Philadelphia, PA",
    stage: "Offer Sent",
    unread: 0,
    lastAt: "Aug 17, 09:20",
    preview: "Thanks for the offer. Reviewing with my parents.",
    messages: [
      { from: "agent", at: "Aug 16, 18:01", text: "Offer emailed with e-sign link." },
      { from: "student", at: "Aug 17, 09:20", text: "Thanks for the offer. Reviewing with my parents." },
    ],
  },
  {
    id: "TH-1009",
    student: { name: "Sujata P.", email: "sujata.p@example.com", avatar: "" },
    listing: "Columbia Shared Room (F)",
    city: "New York, NY",
    stage: "New",
    unread: 0,
    lastAt: "Aug 16, 08:22",
    preview: "Is it female-only? What’s included?",
    messages: [
      { from: "student", at: "Aug 16, 08:22", text: "Is it female-only? What’s included?" },
    ],
  },
  
];

const STAGE_COLORS = {
  New: "chip--new",
  Reviewing: "chip--reviewing",
  "Offer Sent": "chip--offer",
  "E-signed": "chip--ok",
  Rejected: "chip--bad",
};

/* ------------------ component ------------------ */
export default function Messages() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All"); // All | Unread | Open | Closed (demo)
  const [activeId, setActiveId] = useState(THREADS[0]?.id);
  const [starred, setStarred] = useState(new Set(["TH-1017"]));
  const [text, setText] = useState("");

  const threads = useMemo(() => {
    let list = THREADS.filter((t) =>
      [t.student.name, t.student.email, t.listing, t.preview]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
    if (filter === "Unread") list = list.filter((t) => t.unread > 0);
    if (filter === "Open") list = list.filter((t) => t.stage !== "Closed");
    if (filter === "Closed") list = list.filter((t) => t.stage === "Closed");
    // simple sort: unread first then recent-ish by index
    return list.sort((a, b) => (b.unread - a.unread));
  }, [query, filter]);

  const active = threads.find((t) => t.id === activeId) || THREADS.find(t=>t.id===activeId);

  function send() {
    if (!text.trim()) return;
    // demo append
    active.messages.push({ from: "agent", at: "Just now", text });
    setText("");
  }
  function toggleStar(id) {
    setStarred((s) => {
      const c = new Set(s);
      c.has(id) ? c.delete(id) : c.add(id);
      return c;
    });
  }

  return (
    <div className="msg-container">
      <div className="msg-shell card">
        {/* ====== Sidebar (Inbox) ====== */}
        <aside className={`msg-inbox ${active ? "hidden-on-mobile" : ""}`}>
          <div className="msg-inbox__top">
            <h2 className="msg-title">Messages</h2>
            <button className="btn btn--light btn--filters"><FiFilter /> Filters</button>
          </div>
          <div className="msg-search">
            <FiSearch />
            <input
              placeholder="Search by student, email, listing"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="msg-tabs">
            {["All", "Unread", "Open", "Closed"].map((t) => (
              <button
                key={t}
                className={`msg-tab ${filter === t ? "active" : ""}`}
                onClick={() => setFilter(t)}
                type="button"
              >
                {t}
              </button>
            ))}
          </div>
          <div className="msg-list">
            {threads.map((t) => (
              <button
                key={t.id}
                className={`msg-item ${activeId === t.id ? "active" : ""}`}
                onClick={() => setActiveId(t.id)}
              >
                <div className="msg-item__top">
                  <strong className="msg-name">{t.student.name}</strong>
                  <span
                    className={`chip ${STAGE_COLORS[t.stage] || ""}`}
                    title={t.stage}
                  >
                    {t.stage}
                  </span>
                </div>
                <div className="msg-item__meta mini">
                  <FiMapPin /> {t.city} • {t.listing}
                </div>
                <div className="msg-item__preview">
                  {t.preview}
                </div>
                <div className="msg-item__foot mini">
                  <span className="muted">{t.lastAt}</span>
                  <div className="msg-right">
                    {starred.has(t.id) ? (
                      <FiStarFill className="star on" onClick={(e)=>{e.stopPropagation(); toggleStar(t.id);}} />
                    ) : (
                      <FiStar className="star" onClick={(e)=>{e.stopPropagation(); toggleStar(t.id);}} />
                    )}
                    {t.unread ? <span className="badge-unread">{t.unread}</span> : null}
                  </div>
                </div>
              </button>
            ))}
            {!threads.length && (
              <div className="msg-empty">
                <FiMail />
                <p>No conversations match your filters.</p>
              </div>
            )}
          </div>
        </aside>
        {/* ====== Thread ====== */}
        <main className={`msg-thread ${active ? "" : "msg-thread--empty"}`}>
          {!active ? (
            <div className="msg-empty">
              <FiMail />
              <p>Select a conversation to view.</p>
            </div>
          ) : (
            <>
              <header className="msg-bar">
                <button
                  className="msg-back"
                  onClick={() => setActiveId(null)}
                  aria-label="Back to inbox"
                >
                  <FiChevronLeft />
                </button>
                <div className="msg-bar__info">
                  <div className="msg-bar__who">
                    <div className="msg-avatar" aria-hidden>
                      <FiUser />
                    </div>
                    <div>
                      <strong>{active.student.name}</strong>
                      <div className="mini muted">{active.student.email}</div>
                    </div>
                  </div>
                  <div className="msg-bar__meta">
                    <div className="mini">
                      <FiMapPin /> {active.city} • {active.listing}
                    </div>
                    <span className={`chip ${STAGE_COLORS[active.stage] || ""}`}>
                      {active.stage}
                    </span>
                  </div>
                </div>
         
              </header>
              <section className="msg-hist">
                {active.messages.map((m, i) => (
                  <div key={i} className={`msg-bubble msg-${m.from}`}>
                    <div className="msg-bubble__text">{m.text}</div>
                    <div className="mini muted">{m.at}</div>
                  </div>
                ))}
              </section>
              <footer className="msg-compose">
                <div className="msg-tools">
                  <button className="icon"><FiPaperclip /></button>
                  <button className="icon"><FiSmile /></button>
                </div>
                <textarea
                  placeholder="Write a message…"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={1}
                />
                <button className="btn" onClick={send}>
                  Send <FiSend />
                </button>
              </footer>
            </>
          )}
        </main>
      </div>
    </div>
  );
}