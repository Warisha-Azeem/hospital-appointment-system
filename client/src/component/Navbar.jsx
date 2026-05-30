import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/doctors?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="site-shell topbar">
      <Link className="brand" to="/">
        City Med Portal
      </Link>
      <nav className="nav-links">
        <Link className={`nav-link ${isActive("/") ? "active" : ""}`} to="/">Home</Link>
        <Link className={`nav-link ${isActive("/doctors") ? "active" : ""}`} to="/doctors">Doctors</Link>
        <Link className={`nav-link ${isActive("/appointment") ? "active" : ""}`} to="/appointment">Appointment</Link>
        <Link className={`nav-link ${isActive("/admin") ? "active" : ""}`} to="/admin">Admin</Link>
      </nav>
      <form className="search-bar" onSubmit={handleSearch} role="search" aria-label="Search doctors">
        <input
          type="text"
          aria-label="Search doctors"
          placeholder="Search doctors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" aria-label="Search" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)", fontSize: "1.2rem" }}>🔍</button>
      </form>
    </header>
  );
}

export default Navbar;