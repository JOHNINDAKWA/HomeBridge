import { FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../../../../Context/AuthContext.jsx";
import "./StudentProfile.css";


export default function StudentProfile(){
const { profile, setProfile } = useAuth();
const keys = ["fullName","phone","school","program"];
const filled = keys.filter(k => profile?.[k] && String(profile[k]).trim().length > 0).length;
const pct = Math.round((filled/keys.length)*100);


return (
<section className="sdp-panel card">
<header className="sdp-head">
<h2>Your Profile</h2>
<div className="sdp-mini">
<span>Completed</span>
<div className="sdp-progress"><span style={{ width: `${pct}%` }} /></div>
<b>{pct}%</b>
</div>
</header>


<div className="sdp-grid">
<label className="sdp-field"><span>Full name</span>
<input value={profile?.fullName||""} onChange={e => setProfile(p => ({...p, fullName: e.target.value}))} placeholder="e.g. Jane Student" />
</label>
<label className="sdp-field"><span>Phone</span>
<input value={profile?.phone||""} onChange={e => setProfile(p => ({...p, phone: e.target.value}))} placeholder="+254..." />
</label>
<label className="sdp-field"><span>Institution</span>
<input value={profile?.school||""} onChange={e => setProfile(p => ({...p, school: e.target.value}))} placeholder="University / College" />
</label>
<label className="sdp-field"><span>Program</span>
<input value={profile?.program||""} onChange={e => setProfile(p => ({...p, program: e.target.value}))} placeholder="Course / Program" />
</label>
</div>


<div className="sdp-savehint"><FiCheckCircle /> Saved automatically</div>
</section>
);
}