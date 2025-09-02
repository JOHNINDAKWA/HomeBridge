import "./GuestPicker.css";

export default function GuestPicker({ value, onChange }) {
  const inc = (k) => onChange({ ...value, [k]: value[k] + 1 });
  const dec = (k) => onChange({ ...value, [k]: Math.max(0, value[k] - 1) });

  return (
    <div className="hb-guests">
      <div className="hb-guests__display">
        {value.adults} Adult{value.adults !== 1 ? "s" : ""}, {value.children} Child{value.children !== 1 ? "ren" : ""}
      </div>
      <div className="hb-guests__panel">
        <Row
          label="Adults"
          value={value.adults}
          onDec={() => dec("adults")}
          onInc={() => inc("adults")}
        />
        <Row
          label="Children"
          value={value.children}
          onDec={() => dec("children")}
          onInc={() => inc("children")}
        />
      </div>
    </div>
  );
}

function Row({ label, value, onDec, onInc }) {
  return (
    <div className="hb-guests__row">
      <span>{label}</span>
      <div className="hb-guests__ctrls">
        <button type="button" onClick={onDec} className="hb-guests__btn">–</button>
        <span className="hb-guests__num">{value}</span>
        <button type="button" onClick={onInc} className="hb-guests__btn">+</button>
      </div>
    </div>
  );
}
