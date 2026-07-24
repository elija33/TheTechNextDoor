"use client";

import { JSX, useState, useEffect } from "react";
import { adminAccountsApi, AdminAccount } from "../../services/api";
import "../../style/DashboardFooter.css";
import "../../style/DashboardAdministration.css";

const PROFILE_DEFAULTS = { firstName: "", lastName: "", age: "", gender: "" };
const NEW_ADMIN_DEFAULTS = { firstName: "", lastName: "", email: "", age: "", gender: "" };

const SECTION_OPTIONS = [
  { id: "orders", label: "Orders" },
  { id: "services", label: "Services" },
  { id: "messages", label: "Messages" },
  { id: "quotes", label: "Get A Quote" },
  { id: "seniortech", label: "Senior Tech" },
  { id: "technician", label: "Technician" },
  { id: "carousel", label: "Carousel Images" },
  { id: "video", label: "Video" },
  { id: "footer", label: "Footer" },
];

const SUPER_ADMIN_EMAIL = "amponsaeli@gmail.com";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString();
}

function toggleSection(sections: string[], id: string): string[] {
  return sections.includes(id) ? sections.filter((s) => s !== id) : [...sections, id];
}

function extractError(err: unknown, fallback: string): string {
  const axiosErr = err as { response?: { status?: number; data?: { error?: string } }; request?: unknown };
  const message = axiosErr?.response?.data?.error;
  if (message) return message;
  if (axiosErr?.response) return `${fallback} (server responded with status ${axiosErr.response.status}).`;
  if (axiosErr?.request) return `${fallback} (couldn't reach the server — check your connection).`;
  return fallback;
}

function DashboardAdministration(): JSX.Element {
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(null);

  const [profile, setProfile] = useState(PROFILE_DEFAULTS);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [newAdmin, setNewAdmin] = useState(NEW_ADMIN_DEFAULTS);
  const [newAdminSections, setNewAdminSections] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createdConfirmation, setCreatedConfirmation] = useState<{ username: string; email: string; emailSent: boolean } | null>(null);
  const [resendingId, setResendingId] = useState<number | null>(null);
  const [resendMessage, setResendMessage] = useState<{ text: string; success: boolean } | null>(null);

  const [editingPermissionsFor, setEditingPermissionsFor] = useState<AdminAccount | null>(null);
  const [editingSections, setEditingSections] = useState<string[]>([]);
  const [savingPermissions, setSavingPermissions] = useState(false);
  const [permissionsError, setPermissionsError] = useState("");

  const loadAdmins = () => {
    adminAccountsApi.getAll().then((res) => setAdmins(res.data)).catch(() => {});
  };

  useEffect(() => {
    const stored = localStorage.getItem("adminInfo");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AdminAccount;
        if (parsed.id) {
          setCurrentAdmin(parsed);
          setProfile({
            firstName: parsed.firstName ?? "",
            lastName: parsed.lastName ?? "",
            age: parsed.age ?? "",
            gender: parsed.gender ?? "",
          });
        }
      } catch { /* not logged in with a real account yet */ }
    }

    loadAdmins();
  }, []);

  const handleSaveProfile = async () => {
    if (!currentAdmin) {
      setProfileError("Please log out and log back in to edit your profile.");
      return;
    }
    setProfileError("");
    try {
      const res = await adminAccountsApi.updateProfile(currentAdmin.id, profile);
      const updated = { ...currentAdmin, ...res.data };
      setCurrentAdmin(updated);
      localStorage.setItem("adminInfo", JSON.stringify(updated));
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      setProfileError(extractError(err, "Failed to save profile. Please try again."));
    }
  };

  const handleCreateAdmin = async () => {
    if (!newAdmin.firstName.trim() || !newAdmin.lastName.trim() || !newAdmin.email.trim()) {
      setCreateError("First name, last name, and email are required.");
      return;
    }
    setCreateError("");
    setCreating(true);
    try {
      const res = await adminAccountsApi.create({ ...newAdmin, allowedSections: newAdminSections });
      setCreatedConfirmation({
        username: res.data.username,
        email: res.data.email,
        emailSent: res.data.emailSent ?? false,
      });
      setNewAdmin(NEW_ADMIN_DEFAULTS);
      setNewAdminSections([]);
      loadAdmins();
    } catch (err) {
      setCreateError(extractError(err, "Failed to create admin account."));
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    if (!confirm("Remove this admin account? This cannot be undone.")) return;
    await adminAccountsApi.delete(id);
    loadAdmins();
  };

  const handleResendCredentials = async (id: number) => {
    setResendMessage(null);
    setResendingId(id);
    try {
      const res = await adminAccountsApi.resendCredentials(id);
      setResendMessage(
        res.data.emailSent
          ? { text: `New temporary password emailed to ${res.data.email}.`, success: true }
          : { text: `Couldn't send the email to ${res.data.email} — mail delivery may not be configured right now.`, success: false }
      );
    } catch (err) {
      setResendMessage({ text: extractError(err, "Failed to resend credentials."), success: false });
    } finally {
      setResendingId(null);
    }
  };

  const handleOpenPermissions = (admin: AdminAccount) => {
    setPermissionsError("");
    setEditingSections(admin.allowedSections ?? []);
    setEditingPermissionsFor(admin);
  };

  const handleSavePermissions = async () => {
    if (!editingPermissionsFor) return;
    setPermissionsError("");
    setSavingPermissions(true);
    try {
      await adminAccountsApi.updatePermissions(editingPermissionsFor.id, editingSections);
      setEditingPermissionsFor(null);
      loadAdmins();
    } catch (err) {
      setPermissionsError(extractError(err, "Failed to save access."));
    } finally {
      setSavingPermissions(false);
    }
  };

  return (
    <div className="df-editor da-editor">
      <h2 className="df-title">Admin Accounts</h2>
      <p className="df-subtitle">
        Create accounts for other admins. A username and temporary password are generated
        automatically and emailed directly to them — you won&apos;t see their password. They can
        log in with the username or their email, and change the password anytime.
      </p>

      <div className="da-row">
        <div className="df-field">
          <label>First Name</label>
          <input
            type="text"
            value={newAdmin.firstName}
            onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
            className="df-input"
          />
        </div>
        <div className="df-field">
          <label>Last Name</label>
          <input
            type="text"
            value={newAdmin.lastName}
            onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
            className="df-input"
          />
        </div>
      </div>

      <div className="df-field">
        <label>Email</label>
        <input
          type="text"
          value={newAdmin.email}
          onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
          className="df-input"
        />
      </div>

      <div className="df-field">
        <label>Dashboard Access</label>
        <div className="da-checkbox-grid">
          {SECTION_OPTIONS.map((section) => (
            <label key={section.id} className="da-checkbox">
              <input
                type="checkbox"
                checked={newAdminSections.includes(section.id)}
                onChange={() => setNewAdminSections(toggleSection(newAdminSections, section.id))}
              />
              {section.label}
            </label>
          ))}
        </div>
      </div>

      {createError && <p className="da-error">{createError}</p>}

      <button className="df-save-btn" onClick={handleCreateAdmin} disabled={creating}>
        {creating ? "Creating..." : "Create Admin Account"}
      </button>

      {createdConfirmation && (
        <div className={createdConfirmation.emailSent ? "da-credentials-box" : "da-credentials-box da-credentials-box--warn"}>
          {createdConfirmation.emailSent ? (
            <p>
              <strong>Admin account created.</strong> Username{" "}
              <strong>{createdConfirmation.username}</strong> — their login details have been
              emailed to {createdConfirmation.email}. For security, the temporary password is
              only ever shown to them, not here.
            </p>
          ) : (
            <p>
              <strong>Admin account created</strong> (username{" "}
              <strong>{createdConfirmation.username}</strong>), but the email to{" "}
              {createdConfirmation.email} could not be sent — mail delivery may not be configured
              right now. Once it's fixed, use <strong>Resend</strong> below to send them a fresh
              temporary password.
            </p>
          )}
          <button className="da-dismiss-btn" onClick={() => setCreatedConfirmation(null)}>
            Dismiss
          </button>
        </div>
      )}

      {resendMessage && (
        <p className={resendMessage.success ? "da-resend-message da-resend-message--success" : "da-resend-message"}>
          {resendMessage.text}
        </p>
      )}

      {admins.length > 0 && (
        <table className="da-admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Access</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id}>
                <td>{a.firstName} {a.lastName}</td>
                <td>{a.username}</td>
                <td>{a.email}</td>
                <td>
                  {a.email?.toLowerCase() === SUPER_ADMIN_EMAIL
                    ? "Full access"
                    : a.allowedSections?.length
                      ? a.allowedSections
                          .map((id) => SECTION_OPTIONS.find((s) => s.id === id)?.label ?? id)
                          .join(", ")
                      : "None"}
                </td>
                <td>{formatDate(a.createdAt)}</td>
                <td className="da-actions">
                  {a.email?.toLowerCase() !== SUPER_ADMIN_EMAIL && (
                    <button className="da-resend-btn" onClick={() => handleOpenPermissions(a)}>
                      Edit Access
                    </button>
                  )}
                  {a.mustChangePassword && (
                    <button
                      className="da-resend-btn"
                      onClick={() => handleResendCredentials(a.id)}
                      disabled={resendingId === a.id}
                    >
                      {resendingId === a.id ? "Sending..." : "Resend"}
                    </button>
                  )}
                  <button className="da-delete-btn" onClick={() => handleDeleteAdmin(a.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="df-title da-section-gap">Admin Profile</h2>
      <p className="df-subtitle">Update the details shown for your admin account.</p>

      <div className="da-row">
        <div className="df-field">
          <label>First Name</label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            className="df-input"
          />
        </div>
        <div className="df-field">
          <label>Last Name</label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            className="df-input"
          />
        </div>
      </div>

      <div className="da-row">
        <div className="df-field">
          <label>Age</label>
          <input
            type="text"
            value={profile.age}
            onChange={(e) => setProfile({ ...profile, age: e.target.value })}
            className="df-input"
          />
        </div>
        <div className="df-field">
          <label>Gender</label>
          <input
            type="text"
            value={profile.gender}
            onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
            className="df-input"
          />
        </div>
      </div>

      <div className="da-row">
        <div className="df-field">
          <label>Username</label>
          <input type="text" value={currentAdmin?.username ?? ""} disabled className="df-input" />
        </div>
        <div className="df-field">
          <label>Email</label>
          <input type="text" value={currentAdmin?.email ?? ""} disabled className="df-input" />
        </div>
      </div>

      {profileError && <p className="da-error">{profileError}</p>}

      <button className="df-save-btn" onClick={handleSaveProfile}>
        {profileSaved ? "Saved!" : "Save Profile"}
      </button>

      {editingPermissionsFor && (
        <div className="da-modal-overlay">
          <div className="da-modal">
            <h3 className="da-modal-title">
              Edit access for {editingPermissionsFor.firstName} {editingPermissionsFor.lastName}
            </h3>
            <div className="da-checkbox-grid">
              {SECTION_OPTIONS.map((section) => (
                <label key={section.id} className="da-checkbox">
                  <input
                    type="checkbox"
                    checked={editingSections.includes(section.id)}
                    onChange={() => setEditingSections(toggleSection(editingSections, section.id))}
                  />
                  {section.label}
                </label>
              ))}
            </div>

            {permissionsError && <p className="da-error">{permissionsError}</p>}

            <div className="da-modal-actions">
              <button className="df-save-btn" onClick={handleSavePermissions} disabled={savingPermissions}>
                {savingPermissions ? "Saving..." : "Save Access"}
              </button>
              <button className="da-dismiss-btn" onClick={() => setEditingPermissionsFor(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardAdministration;
