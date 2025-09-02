import { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import "./ComboBox.css";

export default function ComboBox({
  value,
  onChange,
  options = [],
  placeholder = "Search…",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(-1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const handleSelect = (opt) => {
    onChange(opt);
    setQuery("");
    setOpen(false);
    setActiveIdx(-1);
  };

  // close on outside click
  useEffect(() => {
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // keyboard navigation
  const onKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0) handleSelect(filtered[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="hb-combo" ref={rootRef} onKeyDown={onKeyDown}>
      <div
        className={`hb-combo__control ${open ? "open" : ""}`}
        onClick={() => {
          setOpen((v) => !v);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
      >
      
        <input
          ref={inputRef}
          className="hb-combo__input"
          placeholder={placeholder}
          value={open ? query : (value?.label || "")}
          onChange={(e) => setQuery(e.target.value)}
        />
        {value && !open && (
          <button
            className="hb-combo__clear"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            aria-label="Clear selection"
          >
            <FiX />
          </button>
        )}
      </div>

      {open && (
        <div className="hb-combo__menu" role="listbox">
          {filtered.length === 0 && (
            <div className="hb-combo__empty">No matches</div>
          )}
          {filtered.map((opt, idx) => (
            <div
              key={opt.value}
              className={`hb-combo__option ${idx === activeIdx ? "active" : ""}`}
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(opt)}
              role="option"
              aria-selected={value?.value === opt.value}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
