"use client";

import { JSX, useState, useEffect } from "react";
import { settingsApi } from "../../services/api";
import "../../style/DashboardFooter.css";
import "../../style/DashboardAdministration.css";

interface AdminInfo {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  emailOrPhone: string;
}

const ADMIN_DEFAULTS: AdminInfo = {
  firstName: "",
  lastName: "",
  age: "",
  gender: "",
  emailOrPhone: "",
};

interface SiteSettings {
  businessPhone: string;
  businessEmail: string;
  businessAddress: string;
  businessHours: string;
}

const SITE_DEFAULTS: SiteSettings = {
  businessPhone: "",
  businessEmail: "",
  businessAddress: "",
  businessHours: "",
};

function DashboardAdministration(): JSX.Element {
  const [adminInfo, setAdminInfo] = useState<AdminInfo>(ADMIN_DEFAULTS);
  const [adminSaved, setAdminSaved] = useState(false);

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(SITE_DEFAULTS);
  const [siteSaved, setSiteSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("adminInfo");
    if (stored) {
      try {
        setAdminInfo({ ...ADMIN_DEFAULTS, ...JSON.parse(stored) });
      } catch { /* use defaults */ }
    }

    settingsApi.get("siteSettings")
      .then((res) => {
        if (res.data) {
          try {
            const parsed = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
            setSiteSettings({ ...SITE_DEFAULTS, ...parsed });
          } catch { /* use defaults */ }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveAdmin = () => {
    localStorage.setItem("adminInfo", JSON.stringify(adminInfo));
    setAdminSaved(true);
    setTimeout(() => setAdminSaved(false), 3000);
  };

  const handleSaveSite = async () => {
    await settingsApi.save("siteSettings", JSON.stringify(siteSettings));
    setSiteSaved(true);
    setTimeout(() => setSiteSaved(false), 3000);
  };

  if (loading) return <div className="df-loading">Loading...</div>;

  return (
    <div className="df-editor da-editor">
      <h2 className="df-title">Admin Profile</h2>
      <p className="df-subtitle">Update the details shown for your admin account.</p>

      <div className="da-row">
        <div className="df-field">
          <label>First Name</label>
          <input
            type="text"
            value={adminInfo.firstName}
            onChange={(e) => setAdminInfo({ ...adminInfo, firstName: e.target.value })}
            className="df-input"
          />
        </div>
        <div className="df-field">
          <label>Last Name</label>
          <input
            type="text"
            value={adminInfo.lastName}
            onChange={(e) => setAdminInfo({ ...adminInfo, lastName: e.target.value })}
            className="df-input"
          />
        </div>
      </div>

      <div className="da-row">
        <div className="df-field">
          <label>Age</label>
          <input
            type="text"
            value={adminInfo.age}
            onChange={(e) => setAdminInfo({ ...adminInfo, age: e.target.value })}
            className="df-input"
          />
        </div>
        <div className="df-field">
          <label>Gender</label>
          <input
            type="text"
            value={adminInfo.gender}
            onChange={(e) => setAdminInfo({ ...adminInfo, gender: e.target.value })}
            className="df-input"
          />
        </div>
      </div>

      <div className="df-field">
        <label>Email or Phone</label>
        <input
          type="text"
          value={adminInfo.emailOrPhone}
          onChange={(e) => setAdminInfo({ ...adminInfo, emailOrPhone: e.target.value })}
          className="df-input"
        />
      </div>

      <button className="df-save-btn" onClick={handleSaveAdmin}>
        {adminSaved ? "Saved!" : "Save Profile"}
      </button>

      <h2 className="df-title da-section-gap">Site Settings</h2>
      <p className="df-subtitle">Business contact info and hours shown across the site.</p>

      <div className="df-field">
        <label>Business Phone</label>
        <input
          type="text"
          value={siteSettings.businessPhone}
          onChange={(e) => setSiteSettings({ ...siteSettings, businessPhone: e.target.value })}
          className="df-input"
        />
      </div>

      <div className="df-field">
        <label>Business Email</label>
        <input
          type="text"
          value={siteSettings.businessEmail}
          onChange={(e) => setSiteSettings({ ...siteSettings, businessEmail: e.target.value })}
          className="df-input"
        />
      </div>

      <div className="df-field">
        <label>Business Address</label>
        <input
          type="text"
          value={siteSettings.businessAddress}
          onChange={(e) => setSiteSettings({ ...siteSettings, businessAddress: e.target.value })}
          className="df-input"
        />
      </div>

      <div className="df-field">
        <label>Business Hours</label>
        <textarea
          value={siteSettings.businessHours}
          onChange={(e) => setSiteSettings({ ...siteSettings, businessHours: e.target.value })}
          rows={4}
          className="df-textarea"
          placeholder={"Mon-Fri: 9am - 7pm\nSat-Sun: 9am - 7pm"}
        />
      </div>

      <button className="df-save-btn" onClick={handleSaveSite}>
        {siteSaved ? "Saved!" : "Save Site Settings"}
      </button>
    </div>
  );
}

export default DashboardAdministration;
