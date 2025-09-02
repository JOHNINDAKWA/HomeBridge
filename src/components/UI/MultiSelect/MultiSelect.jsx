import { useMemo, useRef, useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import "./MultiSelect.css";

export default function MultiSelect({
  options = [],
  values = [],
  onChange,
  placeholder = "Search & select…",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  const selectedMap = useMemo(() => {
    const m = new Map(values.map(v => [v.value, true]));
    return m;
  }, [values]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(o => o.label.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const toggle = (opt) => {
    const has = selectedMap.has(opt.value);
    if (has) onChange(values.filter(v => v.value !== opt.value));
    else onChange([...values, opt]);
  };

  const clearTag = (val) => {
    onChange(values.filter(v => v.value !== val));
  };

  return (
    <div className="hb-ms" ref={rootRef}>
      <div
        className={`hb-ms__control ${open ? "open" : ""}`}
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 0); }}
      >
        <div className="hb-ms__tags">
          {values.map(v => (
            <span className="hb-ms__tag" key={v.value}>
              {v.label}
              <button type="button" className="hb-ms__tagx" onClick={(e) => { e.stopPropagation(); clearTag(v.value); }}>
                <FiX />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            className="hb-ms__input"
            placeholder={values.length ? "" : placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
          />
        </div>
      </div>

      {open && (
        <div className="hb-ms__menu">
          <div className="hb-ms__searchrow">
            <FiSearch />
            <input
              className="hb-ms__search"
              placeholder="Type to filter…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button className="hb-ms__clear" onClick={() => setQuery("")} type="button" aria-label="Clear">
                <FiX />
              </button>
            )}
          </div>

          <div className="hb-ms__list">
            {filtered.length === 0 && <div className="hb-ms__empty">No matches</div>}
            {filtered.map(opt => {
              const active = selectedMap.has(opt.value);
              return (
                <button
                  type="button"
                  key={opt.value}
                  className={`hb-ms__option ${active ? "active" : ""}`}
                  onClick={() => toggle(opt)}
                >
                  <span className="hb-ms__check">{active ? "✓" : ""}</span>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
