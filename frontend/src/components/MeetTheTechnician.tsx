import { JSX, useEffect, useState } from "react";
import { settingsApi } from "../services/api";
import "../style/MeetTheTechnician.css";

interface TechnicianProfile {
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  specialties: string;
  yearsOfExperience: string;
}

function MeetTheTechnician(): JSX.Element | null {
  const [profile, setProfile] = useState<TechnicianProfile | null>(null);

  useEffect(() => {
    settingsApi.get("technician")
      .then((res) => {
        const val = res.data as string;
        if (val) {
          try {
            const parsed = JSON.parse(val);
            if (parsed.name) setProfile(parsed);
          } catch { /* ignore */ }
        }
      })
      .catch(() => {});
  }, []);

  if (!profile) return null;

  const specialtyList = profile.specialties
    ? profile.specialties.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <section className="mtt-section">
      <div className="mtt-inner">
        <div className="mtt-header">
          <h2 className="mtt-heading">Meet the Technician</h2>
          <div className="mtt-divider" />
        </div>

        <div className="mtt-card">
          <div className="mtt-photo-col">
            {profile.photoUrl ? (
              <img src={profile.photoUrl} alt={profile.name} className="mtt-photo" />
            ) : (
              <div className="mtt-photo-fallback">
                <span>{profile.name.charAt(0)}</span>
              </div>
            )}
            {profile.yearsOfExperience && (
              <div className="mtt-exp-badge">
                <span className="mtt-exp-number">{profile.yearsOfExperience}+</span>
                <span className="mtt-exp-label">Years Experience</span>
              </div>
            )}
          </div>

          <div className="mtt-info-col">
            <p className="mtt-name">{profile.name}</p>
            {profile.title && <p className="mtt-title">{profile.title}</p>}
            {profile.bio && <p className="mtt-bio">{profile.bio}</p>}

            {specialtyList.length > 0 && (
              <div className="mtt-specialties">
                <p className="mtt-specialties-label">Specialties</p>
                <div className="mtt-tags">
                  {specialtyList.map((s) => (
                    <span key={s} className="mtt-tag">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MeetTheTechnician;
