import { useEffect, useMemo, useState } from "react";
import {
  FiUser, FiMail, FiShield, FiKey, FiCopy, FiCheck, FiX, FiPlus, FiTrash2,
  FiLock, FiRefreshCw, FiEyeOff, FiSearch
} from "react-icons/fi";
import "./AdminProfile.css";

/* ---------- Storage keys & helpers ---------- */
const KEY_USERS = "admin:users";
const KEY_SESSIONS = "admin:sessions";

/** roles in ascending power (index 0 = strongest) */
const ROLES = ["superadmin", "admin", "analyst", "readonly"];

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(KEY_USERS)) || []; } catch { return []; }
}
function saveUsers(list) {
  localStorage.setItem(KEY_USERS, JSON.stringify(list));
}
function loadSessions() {
  try { return JSON.parse(localStorage.getItem(KEY_SESSIONS)) || []; } catch { return []; }
}
function saveSessions(list) {
  localStorage.setItem(KEY_SESSIONS, JSON.stringify(list));
}

/* ---------- Seed: ensure at least one superadmin (current user) ---------- */
function seedUsersIfEmpty() {
  const users = loadUsers();
  if (users.length > 0) return users;

  // derive current login from your Auth mock (best-effort)
  let email = "superadmin@homebridge.test";
  try {
    const authUser = JSON.parse(localStorage.getItem("auth:user") || "null");
    if (authUser?.email) email = authUser.email;
  } catch {}
  const role = (localStorage.getItem("auth:role") || "superadmin").toLowerCase();

  const seeded = [{
    id: "adm_" + Date.now(),
    name: "Super Admin",
    email,
    role: role === "admin" ? "superadmin" : role, // make sure it's superadmin at bootstrap
    status: "active", // active | suspended | invited
    twoFA: false,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    avatar: "https://i.pravatar.cc/80?img=65",
    apiKey: "",
  }];
  saveUsers(seeded);
  return seeded;
}

/* ---------- Utils ---------- */
const fmtDate = (iso) => (iso ? new Date(iso).toLocaleString() : "—");
const classRole = (r = "") => "adprof-role " + r.toLowerCase();
const classStatus = (s = "") => "adprof-status " + s.toLowerCase();
const randKey = () =>
  "hb_" + Math.random().toString(36).slice(2, 8) + "-" + Math.random().toString(36).slice(2, 10);

export default function AdminProfile() {
  const [users, setUsers] = useState(seedUsersIfEmpty);
  const [sessions, setSessions] = useState(loadSessions);
  const [tab, setTab] = useState("me"); // me | team
  const [query, setQuery] = useState("");

  // identify current admin (by auth:user email; fallback to first superadmin)
  const current = useMemo(() => {
    const auth = (() => {
      try { return JSON.parse(localStorage.getItem("auth:user") || "null"); } catch { return null; }
    })();
    let byEmail = users.find(u => u.email === auth?.email);
    if (byEmail) return byEmail;
    const superA = users.find(u => u.role === "superadmin");
    return superA || users[0];
  }, [users]);

  /* ----------- My profile state ----------- */
  const [name, setName] = useState(current?.name || "");
  const [twoFA, setTwoFA] = useState(!!current?.twoFA);
  const [apiKey, setApiKey] = useState(current?.apiKey || "");
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });

  useEffect(() => {
    if (!current) return;
    setName(current.name || "");
    setTwoFA(!!current.twoFA);
    setApiKey(current.apiKey || "");
  }, [current?.id]); // refresh when switching accounts (unlikely here)

  /* ----------- Team invite form ----------- */
  const [invite, setInvite] = useState({ email: "", role: "admin" });

  /* ----------- Derived for table ----------- */
  const filtered = useMemo(() => {
    const k = query.trim().toLowerCase();
    return users.filter(u =>
      !k ||
      u.email.toLowerCase().includes(k) ||
      (u.name || "").toLowerCase().includes(k)
    );
  }, [users, query]);

  /* ----------- Mutations ----------- */
  const persistUsers = (next) => { setUsers(next); saveUsers(next); };

  const updateMe = () => {
    const next = users.map(u =>
      u.id === current.id ? { ...u, name, twoFA, apiKey } : u
    );
    persistUsers(next);
  };

  const generateKey = () => {
    const key = randKey();
    setApiKey(key);
    const next = users.map(u => u.id === current.id ? { ...u, apiKey: key } : u);
    persistUsers(next);
  };

  const copyKey = async () => {
    if (!apiKey) return;
    try { await navigator.clipboard.writeText(apiKey); alert("API key copied!"); }
    catch { alert("Copy failed."); }
  };

  const changePassword = () => {
    if (!pwd.next || pwd.next !== pwd.confirm) {
      alert("Passwords do not match (mock).");
      return;
    }
    // mock only
    setPwd({ current: "", next: "", confirm: "" });
    alert("Password changed (mock).");
  };

  const revokeSessions = () => {
    const next = sessions.filter(s => s.userId !== current.id);
    setSessions(next); saveSessions(next);
    alert("All your sessions have been revoked (mock).");
  };

  // Team actions
  const inviteUser = () => {
    if (!invite.email) return;
    if (users.some(u => u.email.toLowerCase() === invite.email.toLowerCase())) {
      alert("User already exists.");
      return;
    }
    const nu = {
      id: "adm_" + Date.now(),
      name: invite.email.split("@")[0],
      email: invite.email,
      role: invite.role,
      status: "invited",
      twoFA: false,
      createdAt: new Date().toISOString(),
      lastLoginAt: "",
      avatar: "https://i.pravatar.cc/80?u=" + invite.email,
      apiKey: "",
    };
    persistUsers([nu, ...users]);
    setInvite({ email: "", role: "admin" });
  };

  const changeRole = (id, role) => {
    // guard: never allow last superadmin to be demoted
    const isLastSuper =
      users.filter(u => u.role === "superadmin" && u.id !== id).length === 0 &&
      users.find(u => u.id === id)?.role === "superadmin";
    if (isLastSuper && role !== "superadmin") {
      alert("You cannot demote the last superadmin.");
      return;
    }
    persistUsers(users.map(u => u.id === id ? { ...u, role } : u));
  };

  const toggleSuspend = (id) => {
    // guard: cannot suspend yourself
    if (id === current.id) { alert("You cannot suspend your own account."); return; }
    const u = users.find(x => x.id === id);
    // guard: cannot suspend the last superadmin
    const isLastSuper = u?.role === "superadmin" &&
      users.filter(x => x.role === "superadmin" && x.id !== id).length === 0;
    if (isLastSuper) { alert("You cannot suspend the last superadmin."); return; }

    const next = users.map(u => u.id === id ? {
      ...u, status: u.status === "suspended" ? "active" : "suspended"
    } : u);
    persistUsers(next);
  };

  const removeUser = (id) => {
    if (id === current.id) { alert("You cannot remove yourself."); return; }
    const u = users.find(x => x.id === id);
    const isLastSuper = u?.role === "superadmin" &&
      users.filter(x => x.role === "superadmin" && x.id !== id).length === 0;
    if (isLastSuper) { alert("You cannot remove the last superadmin."); return; }

    if (!confirm("Remove this admin?")) return;
    persistUsers(users.filter(u => u.id !== id));
  };

  const acceptInvite = (id) => {
    persistUsers(users.map(u => u.id === id ? { ...u, status: "active", lastLoginAt: new Date().toISOString() } : u));
  };

  return (
    <section className="adprof-wrap">
      <header className="adprof-head card">
        <div className="adprof-headL">
          <div className="adprof-title">Profile & Access</div>
          <p className="adprof-sub">Manage your admin account and who can access this console.</p>
        </div>
        <div className="adprof-tabs" role="tablist">
          <button className={`adprof-tab ${tab === "me" ? "is-active" : ""}`} onClick={() => setTab("me")}>
            My profile
          </button>
          <button className={`adprof-tab ${tab === "team" ? "is-active" : ""}`} onClick={() => setTab("team")}>
            Team access
          </button>
        </div>
      </header>

      {tab === "me" && current && (
        <div className="adprof-grid">
          {/* Identity */}
          <section className="card adprof-card">
            <h3>Identity</h3>
            <div className="adprof-id">
              <div className="adprof-ava"><img src={current.avatar} alt="" /></div>
              <div className="adprof-w">
                <div className="adprof-row">
                  <label className="adprof-field">
                    <span><FiUser/> Name</span>
                    <input value={name} onChange={e => setName(e.target.value)} />
                  </label>
                  <label className="adprof-field">
                    <span><FiMail/> Email</span>
                    <input value={current.email} readOnly className="is-readonly" />
                  </label>
                </div>
                <div className="adprof-row">
                  <div className={classRole(current.role)}>{current.role}</div>
                  <div className={classStatus(current.status)}>{current.status}</div>
                </div>
                <div className="adprof-row adprof-meta">
                  <span>Created: <b>{fmtDate(current.createdAt)}</b></span>
                  <span>Last login: <b>{fmtDate(current.lastLoginAt)}</b></span>
                </div>
                <div className="adprof-actions">
                  <button className="btn" onClick={updateMe}><FiCheck/> Save profile</button>
                </div>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="card adprof-card">
            <h3>Security</h3>

            <div className="adprof-switchRow">
              <label className="adprof-switch">
                <input type="checkbox" checked={twoFA} onChange={e => setTwoFA(e.target.checked)} />
                <span className="adprof-slider" />
              </label>
              <div>
                <b>Two-factor authentication</b>
                <div className="adprof-muted">Add an extra step on admin login. (mock)</div>
              </div>
            </div>

            <div className="adprof-sep" />

            <div className="adprof-pwd">
              <h4><FiLock/> Change password</h4>
              <div className="adprof-row">
                <input type="password" placeholder="Current password" value={pwd.current} onChange={e=>setPwd({...pwd, current:e.target.value})}/>
                <input type="password" placeholder="New password" value={pwd.next} onChange={e=>setPwd({...pwd, next:e.target.value})}/>
                <input type="password" placeholder="Confirm new password" value={pwd.confirm} onChange={e=>setPwd({...pwd, confirm:e.target.value})}/>
              </div>
              <button className="btn btn--light" onClick={changePassword}><FiRefreshCw/> Update password</button>
            </div>

            <div className="adprof-sep" />

            <div className="adprof-api">
              <h4><FiKey/> API key</h4>
              <div className="adprof-row">
                <input className="is-readonly" placeholder="No key generated" value={apiKey} readOnly />
                <button className="btn btn--light" onClick={generateKey}><FiKey/> Generate</button>
                <button className="btn btn--light" onClick={copyKey} disabled={!apiKey}><FiCopy/> Copy</button>
              </div>
              <div className="adprof-muted">Mock only. Replace with your backend later.</div>
            </div>

            <div className="adprof-sep" />

            <div className="adprof-row adprof-sessions">
              <div>
                <b>Active sessions</b>
                <div className="adprof-muted">{sessions.filter(s => s.userId === current.id).length} devices (mock)</div>
              </div>
              <button className="btn btn--light" onClick={revokeSessions}><FiEyeOff/> Revoke all</button>
            </div>
          </section>

          {/* Danger zone */}
          <section className="card adprof-card adprof-danger">
            <h3>Danger zone</h3>
            <div className="adprof-muted">
              You cannot delete your own account from here. Contact another superadmin for account removal.
            </div>
            <div className="adprof-row">
              <button className="btn btn--light" disabled><FiTrash2/> Delete my account</button>
            </div>
          </section>
        </div>
      )}

      {tab === "team" && (
        <div className="adprof-team">
          {/* Invite */}
          <section className="card adprof-card">
            <h3>Invite admin</h3>
            <div className="adprof-row">
              <input
                placeholder="email@company.com"
                value={invite.email}
                onChange={e => setInvite({ ...invite, email: e.target.value })}
              />
              <select value={invite.role} onChange={e => setInvite({ ...invite, role: e.target.value })}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <button className="btn" onClick={inviteUser}><FiPlus/> Send invite</button>
            </div>
            <div className="adprof-muted">Invited users appear below with status “invited”.</div>
          </section>

          {/* List & filters */}
          <section className="card adprof-card">
            <div className="adprof-listHead">
              <h3>Team</h3>
              <div className="adprof-search">
                <FiSearch />
                <input placeholder="Search by name or email…" value={query} onChange={e=>setQuery(e.target.value)} />
              </div>
            </div>

            <div className="adprof-tableWrap">
              <table className="adprof-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Last login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u.id}>
                      <td className="adprof-u">
                        <img src={u.avatar} alt="" />
                        <div className="adprof-uMeta">
                          <b>{u.name || "—"}</b>
                          <span className="adprof-email">{u.email}</span>
                        </div>
                      </td>
                      <td>
                        <select
                          className="adprof-roleSel"
                          value={u.role}
                          onChange={e => changeRole(u.id, e.target.value)}
                          disabled={u.id === current.id} /* no self-change in UI */
                        >
                          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>
                      <td><span className={classStatus(u.status)}>{u.status}</span></td>
                      <td>{fmtDate(u.createdAt)}</td>
                      <td>{fmtDate(u.lastLoginAt)}</td>
                      <td className="adprof-actionsTd">
                        {u.status === "invited" ? (
                          <button className="btn btn--light" onClick={() => acceptInvite(u.id)}><FiCheck/> Accept (mock)</button>
                        ) : (
                          <button className="btn btn--light" onClick={() => toggleSuspend(u.id)}>
                            {u.status === "suspended" ? <><FiRefreshCw/> Activate</> : <><FiX/> Suspend</>}
                          </button>
                        )}
                        <button className="btn btn--light" onClick={() => removeUser(u.id)}><FiTrash2/> Remove</button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr className="adprof-emptyRow"><td colSpan={6}>No admins match your search.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
