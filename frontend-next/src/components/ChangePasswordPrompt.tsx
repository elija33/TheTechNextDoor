"use client";

import { JSX, useState } from "react";
import { adminAccountsApi, AdminAccount } from "../services/api";
import "../style/ChangePasswordPrompt.css";

const PASSWORD_DEFAULTS = { currentPassword: "", newPassword: "", confirmPassword: "" };

function extractError(err: unknown, fallback: string): string {
  const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
  return message || fallback;
}

interface ChangePasswordPromptProps {
  adminId: number;
  onChanged: (updated: AdminAccount) => void;
  onSkip: () => void;
}

function ChangePasswordPrompt({ adminId, onChanged, onSkip }: ChangePasswordPromptProps): JSX.Element {
  const [fields, setFields] = useState(PASSWORD_DEFAULTS);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (fields.newPassword !== fields.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (fields.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const res = await adminAccountsApi.changePassword(adminId, {
        currentPassword: fields.currentPassword,
        newPassword: fields.newPassword,
      });
      onChanged(res.data);
    } catch (err) {
      setError(extractError(err, "Failed to change password."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cpp-overlay">
      <div className="cpp-modal">
        <h2 className="cpp-title">Do you want to change your password?</h2>
        <p className="cpp-subtitle">You&apos;re signed in with a temporary password.</p>

        <h3 className="cpp-section-title">Change Password</h3>

        <div className="cpp-field">
          <label>Current Password</label>
          <input
            type="password"
            value={fields.currentPassword}
            onChange={(e) => setFields({ ...fields, currentPassword: e.target.value })}
            className="cpp-input"
          />
        </div>

        <div className="cpp-row">
          <div className="cpp-field">
            <label>New Password</label>
            <input
              type="password"
              value={fields.newPassword}
              onChange={(e) => setFields({ ...fields, newPassword: e.target.value })}
              className="cpp-input"
            />
          </div>
          <div className="cpp-field">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={fields.confirmPassword}
              onChange={(e) => setFields({ ...fields, confirmPassword: e.target.value })}
              className="cpp-input"
            />
          </div>
        </div>

        {error && <p className="cpp-error">{error}</p>}

        <div className="cpp-actions">
          <button className="cpp-save-btn" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Change Password"}
          </button>
          <button className="cpp-skip-btn" onClick={onSkip}>
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordPrompt;
