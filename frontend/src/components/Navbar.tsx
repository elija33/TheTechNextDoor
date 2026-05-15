import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const PHONE_NUMBER = "(614) 418-6756";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);

  const handleServicesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    closeMenu();
    if (location.pathname === "/") {
      document
        .getElementById("services-section")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document
          .getElementById("services-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          {/* <img src="/logo.png" alt="Logo" className="navbar-logo" /> */}
          The Tech Next Door
        </Link>

        {/* Hamburger button — mobile only */}
        <button
          className={`navbar-hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${menuOpen ? "navbar-links-open" : ""}`}>
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "nav-link-active" : ""}`}
            onClick={closeMenu}
          >
            Home
          </Link>
          <a
            href="#services-section"
            className="nav-link"
            onClick={handleServicesClick}
          >
            Services
          </a>
          <Link
            to="/contactus"
            className={`nav-link ${location.pathname === "/contactus" ? "nav-link-active" : ""}`}
            onClick={closeMenu}
          >
            Contact Us
          </Link>
          <Link
            to="/getaquote"
            className={`nav-link ${location.pathname === "/getaquote" ? "nav-link-active" : ""}`}
            onClick={closeMenu}
          >
            Get Free Quote
          </Link>
          <Link
            to="/blog"
            className={`nav-link ${location.pathname.startsWith("/blog") ? "nav-link-active" : ""}`}
            onClick={closeMenu}
          >
            Blog
          </Link>
          <a
            href="tel:+16144186756"
            className="nav-link call-us-btn showing-number"
            onClick={closeMenu}
          >
            {PHONE_NUMBER}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
