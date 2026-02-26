import React, { useState } from "react";
import { Link } from "react-router-dom";

const PHONE_NUMBER = "(609) 555-0123";

const Navbar: React.FC = () => {
  const [showNumber, setShowNumber] = useState(false);

  const handleCallClick = (e: React.MouseEvent) => {
    if (!showNumber) {
      e.preventDefault();
      setShowNumber(true);
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
          <a
            href="/"
            className="nav-link"
            onClick={() => (window.location.href = "/")}
          >
            Home
          </a>
          <a href="/#services-section" className="nav-link">
            Services
          </a>
          <Link to="/contactus" className="nav-link">
            Contact Us
          </Link>
          <Link to="/getaquote" className="nav-link">
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
