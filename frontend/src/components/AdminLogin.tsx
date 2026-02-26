import React, { useState } from "react";
import { JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/AdminLogin.css";

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initCodeClient: (config: {
            client_id: string;
            scope: string;
            ux_mode: string;
            callback: (response: { code: string }) => void;
          }) => { requestCode: () => void };
        };
      };
    };
  }
}

// Replace with your Google Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

function AdminLogin(): JSX.Element {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleGoogleLogin = () => {
    setShowGoogleModal(true);
  };

  const handleGoogleContinue = () => {
    setShowGoogleModal(false);
    if (window.google) {
      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "email profile",
        ux_mode: "popup",
        callback: (response) => {
          if (response.code) {
            console.log("Google Auth Code:", response.code);
            // TODO: Send this code to your backend to exchange for tokens
          }
        },
      });
      client.requestCode();
    } else {
      console.error("Google Sign-In not loaded");
    }
  };

  const handleGoogleCancel = () => {
    setShowGoogleModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError(true);
      return;
    }

    setEmailError(false);
    // TODO: Add actual authentication logic here
    console.log("Login attempt:", { email, password });
    navigate("/admin/dashboard");
  };

  return (
    <div className="admin-login-container">
      <h1 className="admin-brand-title">The Tech Next Door</h1>

      <div className="admin-login-card">
        <h2 className="login-card-title">Log Into The Tech Next Door</h2>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-input-wrapper">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or phone number"
              className={`admin-input ${emailError ? "admin-input-error" : ""}`}
            />
            {emailError && <span className="admin-error-icon">!</span>}
          </div>
          {emailError && (
            <p className="admin-error-message">
              The email or mobile number you entered isn't connected to an account. <a href="/forgot-password">Find your account and log in.</a>
            </p>
          )}

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="admin-input"
          />

          <button type="submit" className="admin-login-btn">
            Log In
          </button>

          {emailError && (
            <button type="button" className="google-login-btn" onClick={handleGoogleLogin}>
              <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Log in with Google
            </button>
          )}

          <a href="/forgot-password" className="forgot-password-link">
            Forgot account?
          </a>

          <div className="admin-divider-with-text">
            <span>or</span>
          </div>

          <Link to="/admin/register" className="create-account-btn">
            Create new account
          </Link>
        </form>
      </div>

      {showGoogleModal && (
        <div className="google-modal-overlay" onClick={handleGoogleCancel}>
          <div className="google-modal" onClick={(e) => e.stopPropagation()}>
            <div className="google-modal-header">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Sign in with Google</span>
            </div>

            <div className="google-modal-body">
              <div className="google-modal-left">
                <h2>Sign in to The Tech Next Door</h2>
              </div>

              <div className="google-modal-right">
                <p className="google-modal-info-title">Google will allow The Tech Next Door to access this info about you</p>
                <div className="google-modal-info-item">
                  <span className="google-modal-info-icon">&#9993;</span>
                  <div>
                    <p className="google-modal-info-label">Email address</p>
                  </div>
                </div>
                <p className="google-modal-terms">
                  Review The Tech Next Door's <a href="/privacy">privacy policy</a> and <a href="/terms">Terms of Service</a> to understand how The Tech Next Door will process and protect your data.
                </p>
                <p className="google-modal-terms">
                  To make changes at any time, go to your <a href="#">Google Account</a>.
                </p>
                <p className="google-modal-terms">
                  Learn more about <a href="#">Sign in with Google</a>.
                </p>
              </div>
            </div>

            <div className="google-modal-actions">
              <button className="google-modal-cancel" onClick={handleGoogleCancel}>Cancel</button>
              <button className="google-modal-continue" onClick={handleGoogleContinue}>Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLogin;
