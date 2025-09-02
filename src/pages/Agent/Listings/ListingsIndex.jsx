
import { Link } from "react-router-dom";
import { FiEdit2, FiEye, FiToggleLeft, FiToggleRight } from "react-icons/fi";
import { useState } from "react";
import { LISTINGS } from "../../../data/listings.js"; // or wherever you centralize
export default function ListingsIndex() {
  const [items, setItems] = useState(LISTINGS.map(l => ({...l, status: "approved", visible: true})));
  function toggle(id) {
    setItems(prev => prev.map(x => x.id === id ? {...x, visible: !x.visible} : x));
  }
  return (
    <div>
      <header className="flex-between">
        <h3>Your Listings</h3>
        <Link className="btn" to="../listings/new">+ New listing</Link>
      </header>
      <div className="grid grid--cards">
        {items.map(l => (
          <article key={l.id} className="card" style={{padding:16, display:"grid", gap:10}}>
            <img src={l.img} alt="" style={{width:"100%", aspectRatio:"16/10", objectFit:"cover", borderRadius:12}} />
            <div className="flex-between">
              <div>
                <strong>{l.title}</strong>
                <div style={{color:"var(--ink-soft)"}}>{l.city} • {l.type}</div>
              </div>
              <div style={{display:"grid", gap:8, justifyItems:"end"}}>
                <Link className="btn btn--light" to={`/listings/${l.id}`}><FiEye /> View</Link>
                <Link className="btn btn--light" to={`../listings/${l.id}/edit`}><FiEdit2 /> Edit</Link>
                <button className="btn btn--ghost" onClick={() => toggle(l.id)}>
                  {l.visible ? <><FiToggleRight /> Hide</> : <><FiToggleLeft /> Show</>}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
