import { JSX, useState, useEffect, useRef } from "react";
import { settingsApi } from "../../services/api";
import { UserCircle, Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import "../../style/DashboardTechnician.css";

interface TechnicianProfile {
  id: string;
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  specialties: string;
  yearsOfExperience: string;
}

const EMPTY_FORM: Omit<TechnicianProfile, "id"> = {
  name: "",
  title: "",
  bio: "",
  photoUrl: "",
  specialties: "",
  yearsOfExperience: "",
};

function DashboardTechnician(): JSX.Element {
  const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const parseList = (val: string): TechnicianProfile[] | null => {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        if (parsed && typeof parsed === "object" && parsed.name) return [{ id: "1", ...parsed }];
      } catch { /* ignore */ }
      return null;
    };

    // Try the current key first, then fall back to old singular key
    settingsApi.get("technicians")
      .then((res) => {
        const val = res.data as string;
        const list = val ? parseList(val) : null;
        if (list) {
          setTechnicians(list);
          setLoading(false);
          return;
        }
        // Fall back to old "technician" key and migrate
        return settingsApi.get("technician")
          .then((r) => {
            const oldVal = r.data as string;
            const oldList = oldVal ? parseList(oldVal) : null;
            if (oldList) setTechnicians(oldList);
          })
          .catch(() => {})
          .finally(() => setLoading(false));
      })
      .catch(() => setLoading(false));
  }, []);

  const save = async (list: TechnicianProfile[]) => {
    const payload = JSON.stringify(list);
    await settingsApi.save("technicians", payload);
    setTechnicians(list);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setMessage(null);
    setView("form");
  };

  const openEdit = (t: TechnicianProfile) => {
    setEditingId(t.id);
    setForm({ name: t.name, title: t.title, bio: t.bio, photoUrl: t.photoUrl, specialties: t.specialties, yearsOfExperience: t.yearsOfExperience });
    setMessage(null);
    setView("form");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this technician profile?")) return;
    await save(technicians.filter((t) => t.id !== id));
  };

  const resizeImage = (file: File, maxSize: number): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
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
      const resized = await resizeImage(file, 400);
      setForm((f) => ({ ...f, photoUrl: resized }));
    } catch {
      setMessage({ text: "Failed to process photo.", type: "error" });
    }
    e.target.value = "";
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setMessage({ text: "Name is required.", type: "error" });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      let updated: TechnicianProfile[];
      if (editingId) {
        updated = technicians.map((t) => t.id === editingId ? { id: editingId, ...form } : t);
      } else {
        updated = [...technicians, { id: Date.now().toString(), ...form }];
      }
      await save(updated);
      setMessage({ text: "Saved successfully.", type: "success" });
      setTimeout(() => setView("list"), 800);
    } catch {
      setMessage({ text: "Failed to save.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const specialtyList = form.specialties
    ? form.specialties.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  if (loading) return <div className="dt-loading">Loading...</div>;

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  if (view === "list") {
    return (
      <div className="dt-container">
        <div className="dt-list-header">
          <div>
            <h2 className="dt-section-title">Technician Profiles</h2>
            <p className="dt-section-subtitle">
              These profiles appear in the "Meet the Technician" section on the homepage.
            </p>
          </div>
          <button className="dt-btn-add" onClick={openAdd}>
            <Plus size={16} /> Add Technician
          </button>
        </div>

        {technicians.length === 0 ? (
          <div className="dt-empty">
            <UserCircle size={48} className="dt-empty-icon" />
            <p>No technicians added yet.</p>
            <button className="dt-btn-add" onClick={openAdd}>
              <Plus size={16} /> Add First Technician
            </button>
          </div>
        ) : (
          <div className="dt-cards-grid">
            {technicians.map((t) => (
              <div key={t.id} className="dt-card">
                <div className="dt-card-photo">
                  {t.photoUrl ? (
                    <img src={t.photoUrl} alt={t.name} className="dt-card-img" />
                  ) : (
                    <div className="dt-card-initials">{t.name.charAt(0)}</div>
                  )}
                </div>
                <div className="dt-card-info">
                  <p className="dt-card-name">{t.name}</p>
                  {t.title && <p className="dt-card-role">{t.title}</p>}
                  {t.yearsOfExperience && (
                    <p className="dt-card-exp">{t.yearsOfExperience}+ yrs experience</p>
                  )}
                </div>
                <div className="dt-card-actions">
                  <button className="dt-card-btn dt-card-btn--edit" onClick={() => openEdit(t)}>
                    <Pencil size={15} /> Edit
                  </button>
                  <button className="dt-card-btn dt-card-btn--delete" onClick={() => handleDelete(t.id)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── FORM VIEW ──────────────────────────────────────────────────────────────
  return (
    <div className="dt-container">
      <button className="dt-btn-back" onClick={() => setView("list")}>
        <ArrowLeft size={16} /> Back to list
      </button>

      <div className="dt-layout">
        <div className="dt-form-panel">
          <h2 className="dt-section-title">{editingId ? "Edit Technician" : "Add Technician"}</h2>

          <div className="dt-photo-row">
            <div className="dt-photo-preview">
              {form.photoUrl ? (
                <img src={form.photoUrl} alt="Technician" className="dt-photo-img" />
              ) : (
                <div className="dt-photo-placeholder"><span>No Photo</span></div>
              )}
            </div>
            <div className="dt-photo-actions">
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoUpload} />
              <button className="dt-btn-upload" onClick={() => fileInputRef.current?.click()}>Upload Photo</button>
              {form.photoUrl && (
                <button className="dt-btn-remove" onClick={() => setForm((f) => ({ ...f, photoUrl: "" }))}>Remove</button>
              )}
              <p className="dt-photo-hint">Auto-resized to 600px. JPG or PNG.</p>
            </div>
          </div>

          <div className="dt-field">
            <label className="dt-label">Full Name *</label>
            <input className="dt-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Marcus Johnson" />
          </div>
          <div className="dt-field">
            <label className="dt-label">Title / Role</label>
            <input className="dt-input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Lead iPhone Repair Technician" />
          </div>
          <div className="dt-field">
            <label className="dt-label">Years of Experience</label>
            <input className="dt-input dt-input--short" value={form.yearsOfExperience} onChange={(e) => setForm((f) => ({ ...f, yearsOfExperience: e.target.value }))} placeholder="e.g. 5" type="number" min="0" />
          </div>
          <div className="dt-field">
            <label className="dt-label">Bio</label>
            <textarea className="dt-textarea" value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} placeholder="Write a short bio..." rows={4} />
          </div>
          <div className="dt-field">
            <label className="dt-label">Specialties</label>
            <input className="dt-input" value={form.specialties} onChange={(e) => setForm((f) => ({ ...f, specialties: e.target.value }))} placeholder="e.g. Screen Repair, Battery Replacement" />
            <p className="dt-field-hint">Separate with commas.</p>
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
              {form.photoUrl ? (
                <img src={form.photoUrl} alt="Preview" className="dt-preview-img" />
              ) : (
                <div className="dt-preview-placeholder" />
              )}
            </div>
            <div className="dt-preview-info">
              <p className="dt-preview-name">{form.name || "Technician Name"}</p>
              <p className="dt-preview-role">{form.title || "Title / Role"}</p>
              {form.yearsOfExperience && <p className="dt-preview-exp">{form.yearsOfExperience}+ years of experience</p>}
              {form.bio && <p className="dt-preview-bio">{form.bio}</p>}
              {specialtyList.length > 0 && (
                <div className="dt-preview-tags">
                  {specialtyList.map((s) => <span key={s} className="dt-preview-tag">{s}</span>)}
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
