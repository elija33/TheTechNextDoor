import { JSX, useState, useEffect } from "react";
import { settingsApi, adminAccountsApi, AdminAccount } from "../../services/api";
import "../../style/DashboardFooter.css";
import "../../style/DashboardAdministration.css";

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

const PROFILE_DEFAULTS = { firstName: "", lastName: "", age: "", gender: "" };
const NEW_ADMIN_DEFAULTS = { firstName: "", lastName: "", email: "", age: "", gender: "" };
const PASSWORD_DEFAULTS = { currentPassword: "", newPassword: "", confirmPassword: "" };

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString();
}

function extractError(err: unknown, fallback: string): string {
  const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
  return message || fallback;
}

function DashboardAdministration(): JSX.Element {
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(null);

  const [profile, setProfile] = useState(PROFILE_DEFAULTS);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [passwordFields, setPasswordFields] = useState(PASSWORD_DEFAULTS);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(SITE_DEFAULTS);
  const [siteSaved, setSiteSaved] = useState(false);

  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [newAdmin, setNewAdmin] = useState(NEW_ADMIN_DEFAULTS);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createdCredentials, setCreatedCredentials] = useState<{ username: string; email: string; temporaryPassword: string } | null>(null);

  const [loading, setLoading] = useState(true);

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

  const handleChangePassword = async () => {
    if (!currentAdmin) {
      setPasswordError("Please log out and log back in to change your password.");
      return;
    }
    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (passwordFields.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    setPasswordError("");
    try {
      const res = await adminAccountsApi.changePassword(currentAdmin.id, {
        currentPassword: passwordFields.currentPassword,
        newPassword: passwordFields.newPassword,
      });
      const updated = { ...currentAdmin, ...res.data };
      setCurrentAdmin(updated);
      localStorage.setItem("adminInfo", JSON.stringify(updated));
      setPasswordFields(PASSWORD_DEFAULTS);
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (err) {
      setPasswordError(extractError(err, "Failed to change password."));
    }
  };

  const handleSaveSite = async () => {
    await settingsApi.save("siteSettings", JSON.stringify(siteSettings));
    setSiteSaved(true);
    setTimeout(() => setSiteSaved(false), 3000);
  };

  const handleCreateAdmin = async () => {
    if (!newAdmin.firstName.trim() || !newAdmin.lastName.trim() || !newAdmin.email.trim()) {
      setCreateError("First name, last name, and email are required.");
      return;
    }
    setCreateError("");
    setCreating(true);
    try {
      const res = await adminAccountsApi.create(newAdmin);
      setCreatedCredentials({
        username: res.data.username,
        email: res.data.email,
        temporaryPassword: res.data.temporaryPassword || "",
      });
      setNewAdmin(NEW_ADMIN_DEFAULTS);
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

  if (loading) return <div className="df-loading">Loading...</div>;

  return (
    <div className="df-editor da-editor">
      <h2 className="df-title">Admin Profile</h2>
      <p className="df-subtitle">Update the details shown for your admin account.</p>

      {!currentAdmin && (
        <p className="da-warning">You&apos;re signed in with an older session. Log out and back in to edit your profile or password.</p>
      )}

      {currentAdmin?.mustChangePassword && (
        <p className="da-warning">This account is using a temporary password. Please set a new one below.</p>
      )}

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

      <h3 className="df-section-title">Change Password</h3>

      <div className="df-field">
        <label>Current Password</label>
        <input
          type="password"
          value={passwordFields.currentPassword}
          onChange={(e) => setPasswordFields({ ...passwordFields, currentPassword: e.target.value })}
          className="df-input"
        />
      </div>

      <div className="da-row">
        <div className="df-field">
          <label>New Password</label>
          <input
            type="password"
            value={passwordFields.newPassword}
            onChange={(e) => setPasswordFields({ ...passwordFields, newPassword: e.target.value })}
            className="df-input"
          />
        </div>
        <div className="df-field">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={passwordFields.confirmPassword}
            onChange={(e) => setPasswordFields({ ...passwordFields, confirmPassword: e.target.value })}
            className="df-input"
          />
        </div>
      </div>

      {passwordError && <p className="da-error">{passwordError}</p>}

      <button className="df-save-btn" onClick={handleChangePassword}>
        {passwordSaved ? "Saved!" : "Change Password"}
      </button>

      <h2 className="df-title da-section-gap">Admin Accounts</h2>
      <p className="df-subtitle">
        Create accounts for other admins. A username and temporary password are generated
        automatically, shown once below, and emailed to them — they can change the password
        after logging in.
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

      {createError && <p className="da-error">{createError}</p>}

      <button className="df-save-btn" onClick={handleCreateAdmin} disabled={creating}>
        {creating ? "Creating..." : "Create Admin Account"}
      </button>

      {createdCredentials && (
        <div className="da-credentials-box">
          <p>
            <strong>Admin account created.</strong> Save these now — the password won&apos;t be
            shown again (it&apos;s also been emailed to {createdCredentials.email}).
          </p>
          <p>Username: <strong>{createdCredentials.username}</strong></p>
          <p>Temporary password: <strong>{createdCredentials.temporaryPassword}</strong></p>
          <button className="da-dismiss-btn" onClick={() => setCreatedCredentials(null)}>
            Dismiss
          </button>
        </div>
      )}

      {admins.length > 0 && (
        <table className="da-admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
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
                <td>{formatDate(a.createdAt)}</td>
                <td>
                  <button className="da-delete-btn" onClick={() => handleDeleteAdmin(a.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
