import { MapPin, Phone, Mail } from "lucide-react";
import { JSX } from "react";
import "../style/GetInTouch.css";

function GetInTouch(): JSX.Element {
  return (
    <div className="get-in-touch-section">
      <div className="get-in-touch-header">
        <h3 className="get-in-touch-title">Get In Touch</h3>
        <hr className="get-in-touch-divider" />
        <p className="get-in-touch-subtitle">
          We're here to help and answer any question you might have.
        </p>
      </div>

      <div className="get-in-touch-container">
        {/* Map Container */}
        <div className="map-container">
          <iframe
            title="Our Location on Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48611.77657069441!2d-83.02097810000001!3d40.146131!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8838f465750f7e55%3A0xbcd030b00fc20f59!2sColumbus%2C%20OH%2043240!5e0!3m2!1sen!2sus!4v1707300000000!5m2!1sen!2sus"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Info Container */}
        <div className="info-container">
          <div className="info-card">
            <MapPin className="info-icon" size={24} />
            <div className="info-content">
              <h4 className="info-label">Address</h4>
              <p className="info-text">Columbus, OH 43240</p>
            </div>
          </div>

          <div className="info-card">
            <Phone className="info-icon" size={24} />
            <div className="info-content">
              <h4 className="info-label">Phone</h4>
              <p className="info-text">(609) 555-0123</p>
            </div>
          </div>

          <div className="info-card">
            <Mail className="info-icon" size={24} />
            <div className="info-content">
              <h4 className="info-label">Email</h4>
              <p className="info-text">TheTechNextDoor@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default GetInTouch;
