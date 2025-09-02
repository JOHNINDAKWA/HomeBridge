import "./NotFound.css";
import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <section className="section nf">
      <div className="container card nf__card">
        <h2>Page not found</h2>
        <p>Let’s get you back home.</p>
        <Link to="/" className="btn">Go Home</Link>
      </div>
    </section>
  );
}
