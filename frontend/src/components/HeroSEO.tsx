import { JSX } from "react";
import { useNavigate } from "react-router-dom";
import "../style/HeroSEO.css";

function HeroSEO(): JSX.Element {
  const navigate = useNavigate();

  return (
    <section className="heroseo">
      {/* Animated background blobs */}
      <div className="heroseo-blob heroseo-blob-1" />
      <div className="heroseo-blob heroseo-blob-2" />
      <div className="heroseo-blob heroseo-blob-3" />

      <div className="heroseo-inner">
        {/* Badge */}
        <div className="heroseo-badge">
          <span className="heroseo-badge-dot" />
          Columbus, Ohio's Mobile Repair Service
        </div>

        {/* Headline */}
        <h1 className="heroseo-h1">
          We Come To You.
          <br />
          <span className="heroseo-h1-accent">
            Phone Fixed In Under An Hour.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="heroseo-sub">
          Cracked screen? Dead battery? Broken charging port? The Tech Next Door
          repairs iPhones &amp; Android phones at your home, office, or wherever
          you are in Columbus, Ohio — same day, no store trip needed.
        </p>

        {/* CTA Buttons */}
        <div className="heroseo-ctas">
          <a href="tel:+16144186756" className="heroseo-btn-primary">
            📞 Call (614) 418-6756
          </a>
          <button
            className="heroseo-btn-secondary"
            onClick={() => navigate("/getaquote")}
          >
            Get a Free Quote
          </button>
        </div>

        {/* Trust bar */}
        <div className="heroseo-trust">
          <div className="heroseo-trust-item">
            <span className="heroseo-trust-icon">✅</span>
            <span>Same-Day Service</span>
          </div>
          <div className="heroseo-trust-item">
            <span className="heroseo-trust-icon">✅</span>
            <span>We Come To You</span>
          </div>
          <div className="heroseo-trust-item">
            <span className="heroseo-trust-icon">✅</span>
            <span>iPhone &amp; Android</span>
          </div>
          <div className="heroseo-trust-item">
            <span className="heroseo-trust-icon">✅</span>
            <span>All Columbus Areas</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSEO;
