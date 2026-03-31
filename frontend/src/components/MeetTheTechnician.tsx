import { JSX, useEffect, useState } from "react";
import { settingsApi } from "../services/api";
import "../style/MeetTheTechnician.css";

interface TechnicianProfile {
  id: string;
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  specialties: string;
  yearsOfExperience: string;
}

function MeetTheTechnician(): JSX.Element | null {
  const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);

  useEffect(() => {
    settingsApi.get("technicians")
      .then((res) => {
        const val = res.data as string;
        if (val) {
          try {
            const parsed = JSON.parse(val);
            const list: TechnicianProfile[] = Array.isArray(parsed)
              ? parsed
              : [{ id: "1", ...parsed }];
            setTechnicians(list.filter((t) => t.name));
          } catch { /* ignore */ }
        }
      })
      .catch(() => {});
  }, []);

  if (!technicians.length) return null;

  return (
    <section className="mtt-section">
      <div className="mtt-inner">
        <div className="mtt-header">
          <h2 className="mtt-heading">Meet the Technician{technicians.length > 1 ? "s" : ""}</h2>
          <div className="mtt-divider" />
        </div>

        <div className={`mtt-grid ${technicians.length === 1 ? "mtt-grid--single" : ""}`}>
          {technicians.map((profile) => {
            const specialtyList = profile.specialties
              ? profile.specialties.split(",").map((s) => s.trim()).filter(Boolean)
              : [];

            return (
              <div key={profile.id} className="mtt-card">
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
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default MeetTheTechnician;
