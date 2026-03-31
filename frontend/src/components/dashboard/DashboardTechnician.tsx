import { JSX, useState, useEffect, useRef } from "react";
import { settingsApi } from "../../services/api";
import "../../style/DashboardTechnician.css";

interface TechnicianProfile {
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  specialties: string;
  yearsOfExperience: string;
}

const EMPTY: TechnicianProfile = {
  name: "",
  title: "",
  bio: "",
  photoUrl: "",
  specialties: "",
  yearsOfExperience: "",
};

function DashboardTechnician(): JSX.Element {
  const [profile, setProfile] = useState<TechnicianProfile>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    settingsApi.get("technician")
      .then((res) => {
        const val = res.data as string;
        if (val) {
          try { setProfile(JSON.parse(val)); } catch { /* ignore */ }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field: keyof TechnicianProfile, value: string) => {
    setProfile((p) => ({ ...p, [field]: value }));
  };

  const resizeImage = (file: File, maxSize: number): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.onerror = reject;
        img.src = ev.target!.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const resized = await resizeImage(file, 600);
      setProfile((p) => ({ ...p, photoUrl: resized }));
    } catch {
      setMessage({ text: "Failed to process photo.", type: "error" });
    }
    e.target.value = "";
  };

  const handleSave = async () => {
    if (!profile.name.trim()) {
      setMessage({ text: "Name is required.", type: "error" });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await settingsApi.save("technician", JSON.stringify(profile));
      setMessage({ text: "Profile saved successfully.", type: "success" });
    } catch {
      setMessage({ text: "Failed to save profile.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const specialtyList = profile.specialties
    ? profile.specialties.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  if (loading) return <div className="dt-loading">Loading...</div>;

  return (
    <div className="dt-container">
      <div className="dt-layout">
        {/* Form */}
        <div className="dt-form-panel">
          <h2 className="dt-section-title">Technician Profile</h2>
          <p className="dt-section-subtitle">
            This information appears in the "Meet the Technician" section on the homepage.
          </p>

          <div className="dt-photo-row">
            <div className="dt-photo-preview">
              {profile.photoUrl ? (
                <img src={profile.photoUrl} alt="Technician" className="dt-photo-img" />
              ) : (
                <div className="dt-photo-placeholder">
                  <span>No Photo</span>
                </div>
              )}
            </div>
            <div className="dt-photo-actions">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePhotoUpload}
              />
              <button className="dt-btn-upload" onClick={() => fileInputRef.current?.click()}>
                Upload Photo
              </button>
              {profile.photoUrl && (
                <button className="dt-btn-remove" onClick={() => handleChange("photoUrl", "")}>
                  Remove
                </button>
              )}
              <p className="dt-photo-hint">Auto-resized to 600px. JPG or PNG.</p>
            </div>
          </div>

          <div className="dt-field">
            <label className="dt-label">Full Name *</label>
            <input
              className="dt-input"
              value={profile.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Marcus Johnson"
            />
          </div>

          <div className="dt-field">
            <label className="dt-label">Title / Role</label>
            <input
              className="dt-input"
              value={profile.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Lead iPhone Repair Technician"
            />
          </div>

          <div className="dt-field">
            <label className="dt-label">Years of Experience</label>
            <input
              className="dt-input dt-input--short"
              value={profile.yearsOfExperience}
              onChange={(e) => handleChange("yearsOfExperience", e.target.value)}
              placeholder="e.g. 5"
              type="number"
              min="0"
            />
          </div>

          <div className="dt-field">
            <label className="dt-label">Bio</label>
            <textarea
              className="dt-textarea"
              value={profile.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Write a short bio about the technician..."
              rows={4}
            />
          </div>

          <div className="dt-field">
            <label className="dt-label">Specialties</label>
            <input
              className="dt-input"
              value={profile.specialties}
              onChange={(e) => handleChange("specialties", e.target.value)}
              placeholder="e.g. Screen Repair, Battery Replacement, Water Damage"
            />
            <p className="dt-field-hint">Separate with commas. Each specialty shows as a badge on the homepage.</p>
          </div>

          {message && (
            <div className={`dt-message dt-message--${message.type}`}>{message.text}</div>
          )}

          <button className="dt-btn-save" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>

        {/* Preview */}
        <div className="dt-preview-panel">
          <h3 className="dt-preview-title">Live Preview</h3>
          <div className="dt-preview-card">
            <div className="dt-preview-photo">
              {profile.photoUrl ? (
                <img src={profile.photoUrl} alt="Preview" className="dt-preview-img" />
              ) : (
                <div className="dt-preview-placeholder" />
              )}
            </div>
            <div className="dt-preview-info">
              <p className="dt-preview-name">{profile.name || "Technician Name"}</p>
              <p className="dt-preview-role">{profile.title || "Title / Role"}</p>
              {profile.yearsOfExperience && (
                <p className="dt-preview-exp">{profile.yearsOfExperience}+ years of experience</p>
              )}
              {profile.bio && <p className="dt-preview-bio">{profile.bio}</p>}
              {specialtyList.length > 0 && (
                <div className="dt-preview-tags">
                  {specialtyList.map((s) => (
                    <span key={s} className="dt-preview-tag">{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardTechnician;
