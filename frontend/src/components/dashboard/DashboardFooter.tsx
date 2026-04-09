import { JSX, useState, useEffect } from "react";
import { settingsApi } from "../../services/api";
import "../../style/DashboardFooter.css";

interface FooterData {
  description: string;
  facebook: string;
  instagram: string;
  youtube: string;
  email: string;
}

const DEFAULTS: FooterData = {
  description: "Your trusted local tech repair service. Quality repairs at affordable prices.",
  facebook: "https://www.facebook.com/thetechnextdoors",
  instagram: "https://www.instagram.com",
  youtube: "https://www.youtube.com",
  email: "tthetechnextdoors@gmail.com",
};

function DashboardFooter(): JSX.Element {
  const [data, setData] = useState<FooterData>(DEFAULTS);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsApi.get("footer")
      .then((res) => {
        if (res.data) {
          try {
            const parsed = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
            setData({ ...DEFAULTS, ...parsed });
          } catch { /* use defaults */ }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    await settingsApi.save("footer", JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div className="df-loading">Loading...</div>;

  return (
    <div className="df-editor">
      <h2 className="df-title">Footer Settings</h2>
      <p className="df-subtitle">Changes here update the footer on your public site.</p>

      <div className="df-field">
        <label>Description</label>
        <textarea
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          rows={3}
          className="df-textarea"
        />
      </div>

      <h3 className="df-section-title">Social Links</h3>

      <div className="df-field">
        <label>Facebook URL</label>
        <input
          type="text"
          value={data.facebook}
          onChange={(e) => setData({ ...data, facebook: e.target.value })}
          className="df-input"
        />
      </div>

      <div className="df-field">
        <label>Instagram URL</label>
        <input
          type="text"
          value={data.instagram}
          onChange={(e) => setData({ ...data, instagram: e.target.value })}
          className="df-input"
        />
      </div>

      <div className="df-field">
        <label>YouTube URL</label>
        <input
          type="text"
          value={data.youtube}
          onChange={(e) => setData({ ...data, youtube: e.target.value })}
          className="df-input"
        />
      </div>

      <div className="df-field">
        <label>Email</label>
        <input
          type="text"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          className="df-input"
        />
      </div>

      <button className="df-save-btn" onClick={handleSave}>
        {saved ? "Saved!" : "Save Changes"}
      </button>

      <h3 className="df-section-title">Live Preview</h3>
      <div className="df-preview">
        <div className="df-preview-content">
          <div className="df-preview-section">
            <div className="df-preview-brand">The Tech Next Door</div>
            <p className="df-preview-description">{data.description}</p>
          </div>
          <div className="df-preview-section">
            <div className="df-preview-heading">Quick Links</div>
            <div className="df-preview-links">
              <span>Home</span>
              <span>Services</span>
              <span>Contact</span>
              <span>Get Free Quote</span>
            </div>
          </div>
          <div className="df-preview-section">
            <div className="df-preview-heading">Connect With Us</div>
            <div className="df-preview-social">
              {data.facebook && <span>Facebook</span>}
              {data.instagram && <span>Instagram</span>}
              {data.youtube && <span>Youtube</span>}
              {data.email && <span>Email</span>}
            </div>
          </div>
        </div>
        <div className="df-preview-bottom">
          &copy; {new Date().getFullYear()} The Tech Next Door | All rights reserved
        </div>
      </div>
    </div>
  );
}

export default DashboardFooter;
