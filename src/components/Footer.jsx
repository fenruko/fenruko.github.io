import { Link } from "react-router-dom";
import { DASHBOARD_URL, DOCS_URL, LOGO, STAFF_URL, SUPPORT_SERVER_URL } from "../links";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <Link to="/" className="brand" aria-label="Rift home">
            <img src={LOGO} width="28" height="28" alt="" className="logo" loading="lazy" />
            <span>rift</span>
          </Link>
          <p className="muted small footer-blurb">
            A Discord bot with 75+ modules completely free with no strings attached.
          </p>
        </div>

        <div>
          <h2 className="eyebrow">Site</h2>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/commands">Commands</Link></li>
            <li><a href={DOCS_URL}>Docs</a></li>
            <li><Link to="/team">Team</Link></li>
            <li><a href={DASHBOARD_URL}>Dashboard</a></li>
          </ul>
        </div>

        <div>
          <h2 className="eyebrow">Support</h2>
          <ul className="footer-links">
            <li><a href={SUPPORT_SERVER_URL}>Discord server</a></li>
            <li><a href="/bug-report.html">Report a bug</a></li>
            <li><a href={STAFF_URL}>Ban appeals</a></li>
          </ul>
        </div>
      </div>

      <div className="wrap footer-base muted small">
        <span>&copy; {new Date().getFullYear()} Rift</span>
      </div>
    </footer>
  );
}
