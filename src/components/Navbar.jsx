import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { BOT_INVITE_URL, DASHBOARD_URL, DOCS_URL, LOGO } from "../links";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="nav-wrap">
      <nav className="nav glass" aria-label="Main">
        <Link to="/" className="brand" aria-label="Rift home">
          <img src={LOGO} width="28" height="28" alt="" className="logo" />
          <span>rift</span>
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>

        <div id="nav-links" className={`nav-links${open ? " open" : ""}`}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/commands">Commands</NavLink>
          <a href={DOCS_URL}>Docs</a>
          <NavLink to="/team">Team</NavLink>
          <a href={DASHBOARD_URL}>Dashboard</a>
          <a href={BOT_INVITE_URL} className="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">
            Add to Discord
          </a>
        </div>
      </nav>
    </header>
  );
}
