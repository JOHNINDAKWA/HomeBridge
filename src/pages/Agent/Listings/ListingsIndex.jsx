import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";
import { useAuth } from "../../../Context/AuthContext.jsx";

const PAGE_SIZE = 24;

export default function ListingsIndex() {
  const { api } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);

  const load = async (nextSkip = 0) => {
    setErr("");
    setLoading(true);
    try {
      const q = new URLSearchParams({ take: String(PAGE_SIZE), skip: String(nextSkip) });
      const { items: rows, total } = await api(`/api/agent/listings?${q.toString()}`);
      if (nextSkip === 0) setItems(rows);
      else setItems(prev => [...prev, ...rows]);
      setTotal(total);
      setSkip(nextSkip);
    } catch (e) {
      setErr(e.message || "Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(0); /* on mount */ }, []); // eslint-disable-line

  const canLoadMore = useMemo(() => items.length < total, [items.length, total]);

  const coverUrl = (l) => {
    if (!l.images?.length) return "";
    const cover = l.images.find(i => i.id === l.coverImageId) || l.images[0];
    return cover?.url || "";
  };

  const remove = async (id) => {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    try {
      await api(`/api/agent/listings/${id}`, { method: "DELETE" });
      setItems(prev => prev.filter(x => x.id !== id));
      setTotal(t => Math.max(0, t - 1));
    } catch (e) {
      alert(e.message || "Failed to delete listing");
    }
  };

  return (
    <div className="container2">
      <header className="flex-between" style={{marginBottom:12}}>
        <h3>Your Listings</h3>
        <Link className="btn" to="../listings/new">+ New listing</Link>
      </header>

      {err && <div className="card" style={{padding:12, borderColor:"#e11d48", color:"#b91c1c"}}>⚠ {err}</div>}
      {loading && items.length === 0 && (
        <div className="card" style={{padding:16}}>Loading…</div>
      )}

      <div className="grid grid--cards">
        {items.map(l => (
          <article key={l.id} className="card" style={{padding:14, display:"grid", gap:10}}>
            {coverUrl(l) ? (
              <img
                src={coverUrl(l)}
                alt=""
                style={{width:"100%", aspectRatio:"16/10", objectFit:"cover", borderRadius:12}}
              />
            ) : (
              <div className="muted mini" style={{padding:"40px 0", textAlign:"center", border:"1px dashed var(--border)", borderRadius:12}}>
                No image yet
              </div>
            )}
            <div className="flex-between">
              <div>
                <strong>{l.title}</strong>
                <div style={{color:"var(--ink-soft)"}}>
                  {l.city} • {l.type} • ${l.price}/mo
                </div>
              </div>
              <div style={{display:"grid", gap:8, justifyItems:"end"}}>
                <Link to={`/listings/${l.id}`} state={{ fromAgent: true }} className="btn btn--light">View</Link>
                <Link className="btn btn--light" to={`../listings/${l.id}/edit`}><FiEdit2 /> Edit</Link>
                <button className="btn btn--ghost" onClick={() => remove(l.id)}>
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          </article>
        ))}

        {!loading && items.length === 0 && !err && (
          <div className="card" style={{padding:16}}>No listings yet. Click “New listing” to get started.</div>
        )}
      </div>

      {canLoadMore && (
        <div style={{display:"grid", placeItems:"center", marginTop:16}}>
          <button className="btn btn--light" onClick={() => load(skip + PAGE_SIZE)}>Load more</button>
        </div>
      )}
    </div>
  );
}
