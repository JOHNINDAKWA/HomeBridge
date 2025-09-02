import "./Dashboard.css";
export default function Dashboard() {
  return (
    <section className="section">
      <h2 className="page-title">Dashboard</h2>
      <div className="grid grid--cards">
        <div className="card" style={{ padding: 16 }}>Applications</div>
        <div className="card" style={{ padding: 16 }}>Bookings</div>
        <div className="card" style={{ padding: 16 }}>Documents</div>
      </div>
    </section>
  );
}
