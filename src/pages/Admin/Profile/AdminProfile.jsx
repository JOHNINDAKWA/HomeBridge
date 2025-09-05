import { useEffect, useMemo, useState } from "react";
import {
  FiUser, FiMail, FiShield, FiKey, FiCopy, FiCheck, FiX, FiPlus, FiTrash2,
  FiLock, FiRefreshCw, FiEyeOff, FiSearch, FiLoader
} from "react-icons/fi";
import { useAuth } from "../../../Context/AuthContext.jsx";
import "./AdminProfile.css";
import Modal from "./Modal.jsx"; 

/* ---------- UI role <-> server scope mapping ---------- */
const UI_ROLES = ["superadmin", "admin", "analyst", "readonly"];
const toServerScope = (ui) => String(ui || "").toUpperCase();          // "superadmin" -> "SUPERADMIN"
const toUiRole = (server) => String(server || "").toLowerCase();       // "SUPERADMIN" -> "superadmin"

/* ---------- helpers ---------- */
const fmtDate = (iso) => (iso ? new Date(iso).toLocaleString() : "—");
const classRole = (r = "") => "adprof-role " + r.toLowerCase();
const classStatus = (s = "") => "adprof-status " + String(s || "").toLowerCase();

export default function AdminProfile() {
  const { api } = useAuth();

  const [tab, setTab] = useState("me"); // "me" | "team"
  const [loadingMe, setLoadingMe] = useState(true);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [err, setErr] = useState("");

  // me
  const [me, setMe] = useState(null);
  const [name, setName] = useState("");
  const [twoFA, setTwoFA] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [savingMe, setSavingMe] = useState(false);
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [savingPwd, setSavingPwd] = useState(false);
  const [rotatingKey, setRotatingKey] = useState(false);
  const [revoking, setRevoking] = useState(false);

  // team
  const [team, setTeam] = useState([]);
  const [query, setQuery] = useState("");
  const [invite, setInvite] = useState({ email: "", name: "", role: "admin", password: "" });
  const [inviting, setInviting] = useState(false);
  const [rowBusy, setRowBusy] = useState({}); // id -> boolean

   const [modal, setModal] = useState({ visible: false, title: '', message: '', copiablePassword: null });

  // initial load
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        setErr("");
        const [{ user: userMe }, { team: teamList }] = await Promise.all([
          api("/api/admin/me"),
          api("/api/admin/team"),
        ]);
        if (!live) return;

        setMe(userMe);
        setName(userMe?.name || "");
        setTwoFA(!!userMe?.twoFA);
        setApiKey(userMe?.apiKey || "");
        setTeam(teamList);
      } catch (e) {
        setErr(e.message || "Failed to load admin data");
      } finally {
        if (live) { setLoadingMe(false); setLoadingTeam(false); }
      }
    })();
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentRoleUi = useMemo(() => toUiRole(me?.adminScope || (me?.role ?? "")), [me]);

  /* ---------- ME actions ---------- */
  const saveMe = async () => {
    setSavingMe(true); setErr("");
    try {
      const { user } = await api("/api/admin/me", { method: "PUT", body: { name, twoFA } });
      setMe((m) => ({ ...m, name: user.name, twoFA: user.twoFA }));
    } catch (e) {
      setErr(e.message || "Failed to save profile");
    } finally {
      setSavingMe(false);
    }
  };

const changePassword = async () => {
  if (!pwd.next || pwd.next !== pwd.confirm) {
    setModal({
      visible: true,
      title: "Password Mismatch",
      message: "New passwords do not match."
    });
    return;
  }
  setSavingPwd(true); setErr("");
  try {
    await api("/api/admin/me/password", { method: "POST", body: { current: pwd.current, next: pwd.next } });
    setPwd({ current: "", next: "", confirm: "" });
    setModal({
      visible: true,
      title: "Success",
      message: "Password has been successfully updated."
    });
  } catch (e) {
    setErr(e.message || "Failed to update password");
  } finally {
    setSavingPwd(false);
  }
};

  const rotateKey = async () => {
    setRotatingKey(true); setErr("");
    try {
      const { apiKey: k } = await api("/api/admin/me/api-key", { method: "POST" });
      setApiKey(k || "");
    } catch (e) {
      setErr(e.message || "Failed to generate API key");
    } finally {
      setRotatingKey(false);
    }
  };

const copyKey = async () => {
  if (!apiKey) return;
  try {
    await navigator.clipboard.writeText(apiKey);
    setModal({
      visible: true,
      title: "Copied!",
      message: "API key has been copied to your clipboard. Keep it safe! 🔐"
    });
  } catch {
    setModal({
      visible: true,
      title: "Copy Failed",
      message: "Could not copy the API key. Please try again or copy manually."
    });
  }
};

const revokeSessions = async () => {
  setRevoking(true); setErr("");
  try {
    await api("/api/admin/me/revoke-sessions", { method: "POST" });
    setModal({
      visible: true,
      title: "Sessions Revoked",
      message: "All your active sessions have been successfully revoked. You will be logged out on other devices."
    });
  } catch (e) {
    setErr(e.message || "Failed to revoke sessions");
  } finally {
    setRevoking(false);
  }
};

  /* ---------- TEAM actions ---------- */
  const filtered = useMemo(() => {
    const k = query.trim().toLowerCase();
    return team.filter(u =>
      !k ||
      u.email.toLowerCase().includes(k) ||
      (u.name || "").toLowerCase().includes(k)
    );
  }, [team, query]);

  const setBusy = (id, val) => setRowBusy((m) => ({ ...m, [id]: val }));

const doInvite = async () => {
  if (!invite.email) return;
  setInviting(true); setErr("");
  try {
    const body = {
      email: invite.email,
      name: invite.name || undefined,
      adminScope: toServerScope(invite.role),
      password: invite.password || undefined,
    };
    const res = await api("/api/admin/team/invite", { method: "POST", body });
    const { invited, tempPassword } = res || {};
    setTeam((t) => [invited, ...t]);
    setInvite({ email: "", name: "", role: "admin", password: "" });

    // Show modal with copiable password
    setModal({
      visible: true,
      title: "Invite Sent!",
      message: `An invitation has been sent to ${invited.email}.`,
      copiablePassword: tempPassword,
    });
  } catch (e) {
    setErr(e.message || "Failed to invite user");
  } finally {
    setInviting(false);
  }
};

  const changeRole = async (id, uiRole) => {
    setBusy(id, true); setErr("");
    try {
      const { user } = await api(`/api/admin/team/${id}`, {
        method: "PATCH",
        body: { adminScope: toServerScope(uiRole) },
      });
      setTeam((t) => t.map(u => u.id === id ? { ...u, adminScope: user.adminScope, role: user.role } : u));
    } catch (e) {
      alert(e.message || "Failed to change role");
    } finally {
      setBusy(id, false);
    }
  };

  const toggleSuspend = async (id) => {
    const target = team.find(u => u.id === id);
    const nextStatus = target?.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    setBusy(id, true); setErr("");
    try {
      const { user } = await api(`/api/admin/team/${id}`, { method: "PATCH", body: { status: nextStatus } });
      setTeam((t) => t.map(u => u.id === id ? { ...u, status: user.status } : u));
    } catch (e) {
      alert(e.message || "Failed to change status");
    } finally {
      setBusy(id, false);
    }
  };

  const acceptInvite = async (id) => {
    setBusy(id, true); setErr("");
    try {
      const { user } = await api(`/api/admin/team/${id}`, { method: "PATCH", body: { status: "ACTIVE" } });
      setTeam((t) => t.map(u => u.id === id ? { ...u, status: user.status } : u));
    } catch (e) {
      alert(e.message || "Failed to accept invite");
    } finally {
      setBusy(id, false);
    }
  };

const resetPassword = async (id) => {
  setBusy(id, true); setErr("");
  try {
    const { tempPassword } = await api(`/api/admin/team/${id}/reset-password`, { method: "POST" });
    setModal({
      visible: true,
      title: "Password Reset",
      message: tempPassword ? "A new temporary password has been generated." : "Password has been reset. The user must change it on their next login.",
      copiablePassword: tempPassword,
    });
  } catch (e) {
    setModal({
      visible: true,
      title: "Reset Failed",
      message: e.message || "Failed to reset password."
    });
  } finally {
    setBusy(id, false);
  }
};

  const removeUser = async (id) => {
    if (!confirm("Remove this admin?")) return;
    setBusy(id, true); setErr("");
    try {
      await api(`/api/admin/team/${id}`, { method: "DELETE" });
      setTeam((t) => t.filter(u => u.id !== id));
    } catch (e) {
      alert(e.message || "Failed to remove user");
    } finally {
      setBusy(id, false);
    }
  };

  if (loadingMe && loadingTeam) {
    return (
      <div className="card" style={{ padding: 16, display:"flex", alignItems:"center", gap:8 }}>
        <FiLoader className="spin" /> Loading…
      </div>
    );
  }

  return (
    <>
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

      {err && <div className="card" style={{ padding: 12, borderColor: "#e11d48", color: "#b91c1c" }}>⚠ {err}</div>}

      {tab === "me" && me && (
        <div className="adprof-grid">
          {/* Identity */}
       <section className="asx-card asx-identity">
            <h3>Identity</h3>
            <div className="adprof-id">
              <div className="adprof-ava">
                <img src={`https://i.pravatar.cc/80?u=${me.email}`} alt="" />
              </div>
              <div className="adprof-w">
                <div className="adprof-row">
                  <label className="adprof-field">
                    <span><FiUser/> Name</span>
                    <input value={name} onChange={e => setName(e.target.value)} />
                  </label>
                  <label className="adprof-field">
                    <span><FiMail/> Email</span>
                    <input value={me.email} readOnly className="is-readonly" />
                  </label>
                </div>
                <div className="adprof-row">
                  <div className={classRole(currentRoleUi)}>{currentRoleUi}</div>
                  <div className={classStatus(me.status)}>{me.status?.toLowerCase()}</div>
                </div>
                <div className="adprof-row adprof-meta">
                  <span>Created: <b>{fmtDate(me.createdAt)}</b></span>
                  <span>Last login: <b>{fmtDate(me.lastLoginAt)}</b></span>
                </div>
                <div className="adprof-actions">
                  <button className="btn" onClick={saveMe} disabled={savingMe}>
                    {savingMe ? <><FiLoader className="spin"/> Saving…</> : <><FiCheck/> Save profile</>}
                  </button>
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
                <div className="adprof-muted">Add an extra step on admin login.</div>
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
              <button className="btn btn--light" onClick={changePassword} disabled={savingPwd}>
                {savingPwd ? <><FiLoader className="spin"/> Updating…</> : <><FiRefreshCw/> Update password</>}
              </button>
            </div>

            <div className="adprof-sep" />

            <div className="adprof-api">
              <h4><FiKey/> API key</h4>
              <div className="adprof-row">
                <input className="is-readonly" placeholder="No key generated" value={apiKey} readOnly />
                <button className="btn btn--light" onClick={rotateKey} disabled={rotatingKey}>
                  {rotatingKey ? <><FiLoader className="spin"/> Generating…</> : <><FiKey/> Generate</>}
                </button>
                <button className="btn btn--light" onClick={copyKey} disabled={!apiKey}><FiCopy/> Copy</button>
              </div>
              <div className="adprof-muted">Keys are stored on your user and can be rotated anytime.</div>
            </div>

            <div className="adprof-sep" />

            <div className="adprof-row adprof-sessions">
              <div>
                <b>Active sessions</b>
                <div className="adprof-muted">Revoke all JWT sessions (forces re-login).</div>
              </div>
              <button className="btn btn--light" onClick={revokeSessions} disabled={revoking}>
                {revoking ? <><FiLoader className="spin"/> Revoking…</> : <><FiEyeOff/> Revoke all</>}
              </button>
            </div>
          </section>

          {/* Danger zone */}
          <section className="card adprof-card adprof-danger">
            <h3>Danger zone</h3>
            <div className="adprof-muted">
              You cannot delete your own account from here. Ask another superadmin if needed.
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
          <section className="asx-card asx-invite">
            <h3>Invite admin</h3>
            <div className="adprof-row" style={{ flexWrap: "wrap" }}>
              <input placeholder="Full name (optional)" value={invite.name} onChange={e => setInvite({ ...invite, name: e.target.value })} />
              <input placeholder="email@company.com" value={invite.email} onChange={e => setInvite({ ...invite, email: e.target.value })} />
              <select value={invite.role} onChange={e => setInvite({ ...invite, role: e.target.value })}>
                {UI_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <input placeholder="Temp password (leave blank to auto-generate)" value={invite.password} onChange={e => setInvite({ ...invite, password: e.target.value })} />
              <button className="btn" onClick={doInvite} disabled={inviting}>
                {inviting ? <><FiLoader className="spin"/> Sending…</> : <><FiPlus/> Send invite</>}
              </button>
            </div>
            <div className="adprof-muted">If you leave password empty, a temporary one will be generated and shown once.</div>
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

            {loadingTeam ? (
              <div style={{ padding: 12, display:"flex", alignItems:"center", gap:8 }}>
                <FiLoader className="spin" /> Loading team…
              </div>
            ) : (
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
                    {filtered.map(u => {
                      const uiRole = toUiRole(u.adminScope || u.role);
                      const busy = !!rowBusy[u.id];
                      return (
                        <tr key={u.id}>
                          <td className="adprof-u">
                            <img src={`https://i.pravatar.cc/80?u=${u.email}`} alt="" />
                            <div className="adprof-uMeta">
                              <b>{u.name || "—"}</b>
                              <span className="adprof-email">{u.email}</span>
                            </div>
                          </td>
                          <td>
                            <select
                              className="adprof-roleSel"
                              value={uiRole}
                              onChange={e => changeRole(u.id, e.target.value)}
                              disabled={busy}
                            >
                              {UI_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                          </td>
                          <td><span className={classStatus(u.status)}>{String(u.status || "").toLowerCase()}</span></td>
                          <td>{fmtDate(u.createdAt)}</td>
                          <td>{fmtDate(u.lastLoginAt)}</td>
                          <td className="adprof-actionsTd">
                            {u.status === "INVITED" ? (
                              <button className="btn btn--light" onClick={() => acceptInvite(u.id)} disabled={busy}><FiCheck/> Accept</button>
                            ) : (
                              <button className="btn btn--light" onClick={() => toggleSuspend(u.id)} disabled={busy}>
                                {u.status === "SUSPENDED" ? <><FiRefreshCw/> Activate</> : <><FiX/> Suspend</>}
                              </button>
                            )}
                            <button className="btn btn--light" onClick={() => resetPassword(u.id)} disabled={busy}><FiRefreshCw/> Reset password</button>
                            <button className="btn btn--light" onClick={() => removeUser(u.id)} disabled={busy}><FiTrash2/> Remove</button>
                          </td>
                        </tr>
                      );
                    })}
                    {filtered.length === 0 && (
                      <tr className="adprof-emptyRow"><td colSpan={6}>No admins match your search.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}

      
    </section>


{modal.visible && (
  <Modal
    title={modal.title}
    message={modal.message}
    onClose={() => setModal({ ...modal, visible: false })}
  >
    {/* Conditional content for the copiable password */}
    {modal.copiablePassword && (
      <div className="modal-copy-pwd">
        <input type="text" value={modal.copiablePassword} readOnly />
        <button className="btn btn--light" onClick={() => {
          navigator.clipboard.writeText(modal.copiablePassword);
        }}>
          <FiCopy /> Copy
        </button>
      </div>
    )}
  </Modal>
)}

</>

    
  );

  
}
