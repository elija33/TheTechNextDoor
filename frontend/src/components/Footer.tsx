import { JSX } from "react";
import "../style/Footer.css";

function Footer(): JSX.Element {
  return (
    <footer className="footer" style={{ fontWeight: 600 }}>
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">The Tech Next Door</h3>
          <p className="footer-description">
            Your trusted local tech repair service. Quality repairs at
            affordable prices.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/services">Services</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Connect With Us</h4>
          <div className="footer-social">
            <a
              href="https://www.facebook.com/eli.amponsa"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Youtube
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} The Tech Next Door | All rights
          reserved
        </p>
      </div>
    </footer>
  );
}

export default Footer;
