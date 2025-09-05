export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function api(path, opts = {}) {
  const token = localStorage.getItem("auth:token");
  const headers = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${API_URL}${path}`, { ...opts, headers });
  if (!res.ok) {
    let err;
    try { err = await res.json(); } catch { err = { error: res.statusText }; }
    throw err;
  }
  return res.json();
}

// special call for login/register (no token yet)
export async function apiNoAuth(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let err;
    try { err = await res.json(); } catch { err = { error: res.statusText }; }
    throw err;
  }
  return res.json();
}
