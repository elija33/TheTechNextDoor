import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const PHONE_NUMBER = "(609) 555-0123";

const Navbar: React.FC = () => {
  const [showNumber, setShowNumber] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCallClick = (e: React.MouseEvent) => {
    if (!showNumber) {
      e.preventDefault();
      setShowNumber(true);
    }
  };

  const handleServicesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      document.getElementById("services-section")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById("services-section")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          {/* <img src="/logo.png" alt="Logo" className="navbar-logo" /> */}
          The Tech Next Door
        </Link>
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${location.pathname === "/" ? "nav-link-active" : ""}`}>
            Home
          </Link>
          <a href="#services-section" className="nav-link" onClick={handleServicesClick}>
            Services
          </a>
          <Link to="/contactus" className={`nav-link ${location.pathname === "/contactus" ? "nav-link-active" : ""}`}>
            Contact Us
          </Link>
          <Link to="/getaquote" className={`nav-link ${location.pathname === "/getaquote" ? "nav-link-active" : ""}`}>
            Get A Quote
          </Link>
          <a
            href="tel:+16095550123"
            className={`nav-link call-us-btn ${showNumber ? "showing-number" : ""}`}
            onClick={handleCallClick}
          >
            {showNumber ? PHONE_NUMBER : "Call Us"}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
