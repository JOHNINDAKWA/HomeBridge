import { useMemo, useState } from "react";
import ComboBox from "../UI/ComboBox/ComboBox";
import MultiSelect from "../UI/MultiSelect/MultiSelect";
import "./HeroSearch.css";

export default function HeroSearch() {
  // Academic years
  const yearOptions = useMemo(
    () => ["2024–25", "2025–26", "2026–27"].map(label => ({ label, value: label })),
    []
  );

// Cities (U.S. launch examples only)
const cityOptions = useMemo(
  () =>
    [
      "Newark, NJ",
      "New York, NY",
      "Philadelphia, PA",
      "Princeton, NJ",
      "Boston, MA",
      "Chicago, IL",
      "Los Angeles, CA",
      "San Francisco, CA",
    ].map(label => ({ label, value: label })),
  []
);

// Universities keyed by city (sample set, expandable later)
const uniByCity = useMemo(
  () => ({
    "Newark, NJ": [
      "Rutgers University – Newark",
      "New Jersey Institute of Technology (NJIT)",
      "Essex County College",
    ],
    "New York, NY": [
      "Columbia University",
      "New York University (NYU)",
      "City University of New York (CUNY) – Baruch",
      "Fordham University – Lincoln Center",
    ],
    "Philadelphia, PA": [
      "University of Pennsylvania",
      "Drexel University",
      "Temple University",
      "Community College of Philadelphia",
    ],
    "Princeton, NJ": ["Princeton University"],
    "Boston, MA": [
      "Harvard University",
      "MIT",
      "Boston University",
      "Northeastern University",
      "Boston College",
    ],
    "Chicago, IL": [
      "University of Chicago",
      "Northwestern University",
      "DePaul University",
      "UIC – University of Illinois at Chicago",
    ],
    "Los Angeles, CA": [
      "University of Southern California (USC)",
      "UCLA – University of California, Los Angeles",
      "Cal State LA",
    ],
    "San Francisco, CA": [
      "University of San Francisco (USF)",
      "San Francisco State University",
      "UC San Francisco (Graduate/Med)",
    ],
  }),
  []
);

  const [year, setYear] = useState(null);
  const [city, setCity] = useState(null);
  const [university, setUniversity] = useState(null);
  const [prefs, setPrefs] = useState([]);

  const universityOptions = useMemo(() => {
    const list = uniByCity[city?.value] || [];
    return list.map(label => ({ label, value: label }));
  }, [city, uniByCity]);

  const preferenceOptions = useMemo(
    () =>
      [
        "Room",
        "Studio",
        "1 Bedroom",
        "Ensuite Bathroom",
        "Furnished",
        "Female-only",
        "Near Transit (<45min)",
        "Utilities Included",
      ].map(label => ({ label, value: label })),
    []
  );

  const onSubmit = e => {
    e.preventDefault();
    const payload = {
      year: year?.value || "",
      city: city?.value || "",
      university: university?.value || "",
      preferences: prefs.map(p => p.value),
    };
    console.log("SEARCH:", payload);
    alert(
      `Searching ${payload.city || "any city"} • ${payload.university || "any university"}\n` +
        `Academic year: ${payload.year || "—"}\n` +
        `Preferences: ${payload.preferences.join(", ") || "—"}`
    );
  };

  return (
    <form className="hb-search hb-search--framed" onSubmit={onSubmit}>
      {/* Row cells — label on the left, control on the right */}
      <div className="hb-search__cell">
        <span className="hb-search__label-inline">Check In</span>
        <div className="hb-input">
          <ComboBox
            placeholder="e.g., 2025–26"
            options={yearOptions}
            value={year}
            onChange={v => setYear(v)}
          />
        </div>
      </div>

      <div className="hb-search__cell">
        <span className="hb-search__label-inline">City</span>
        <div className="hb-input">
          <ComboBox
            placeholder="Which city?"
            options={cityOptions}
            value={city}
            onChange={v => {
              setCity(v);
              setUniversity(null);
            }}
          />
        </div>
      </div>

      <div className="hb-search__cell hb-search__cell--wide">
        <span className="hb-search__label-inline">University</span>
        <div className="hb-input">
          <ComboBox
            placeholder={city ? "Type to search…" : "Select a city first"}
            options={universityOptions}
            value={university}
            onChange={setUniversity}
          />
        </div>
      </div>

      <div className="hb-search__cell hb-search__cell--wide">
        <span className="hb-search__label-inline">Room preferences</span>
        <div className="hb-input hb-input--multi">
          <MultiSelect
            placeholder="Add preferences…"
            options={preferenceOptions}
            values={prefs}
            onChange={setPrefs}
          />
        </div>
      </div>

      <button className="hb-search__cta" type="submit">
        Check Availability
      </button>
    </form>
  );
}
