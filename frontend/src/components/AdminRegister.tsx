import React, { useState } from "react";
import { JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import { emailApi } from "../services/api";
import "../style/AdminRegister.css";

function AdminRegister(): JSX.Element {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sending, setSending] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};

    if (!firstName.trim()) newErrors.firstName = true;
    if (!lastName.trim()) newErrors.lastName = true;
    if (!age.trim()) newErrors.age = true;
    if (!gender) newErrors.gender = true;
    if (!emailOrPhone.trim()) newErrors.emailOrPhone = true;
    if (!password.trim()) newErrors.password = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setSending(true);

    try {
      await emailApi.sendConfirmation({
        email: emailOrPhone,
        firstName,
        lastName,
      });

      const adminInfo = {
        firstName,
        lastName,
        age,
        gender,
        emailOrPhone,
      };

      localStorage.setItem("adminInfo", JSON.stringify(adminInfo));
      navigate("/admin");
    } catch {
      alert("Failed to send confirmation email. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="register-container">
      <h1 className="register-brand-title">The Tech Next Door</h1>

      <div className="register-card">
        <div className="register-header">
          <h2>Create a new account</h2>
          <p>It's quick and easy.</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="name-row">
            <div className="input-wrapper">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className={`register-input ${errors.firstName ? "input-error" : ""}`}
              />
              {errors.firstName && <span className="error-icon">!</span>}
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className={`register-input ${errors.lastName ? "input-error" : ""}`}
              />
              {errors.lastName && <span className="error-icon">!</span>}
            </div>
          </div>

          <div className="form-section">
            <div className="age-label-row">
              <label className="section-label">Age</label>
              {errors.age && <span className="error-icon gender-error">!</span>}
            </div>
            <div className="age-row">
              <div className="input-wrapper age-input-wrapper">
                <input
                  type="text"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Your age"
                  className={`register-input ${errors.age ? "input-error" : ""}`}
                />
              </div>
              <a href="#" className="use-dob-link">Use date of birth</a>
            </div>
          </div>

          <div className="form-section">
            <div className="gender-label-row">
              <label className="section-label">Gender</label>
              {errors.gender && <span className="error-icon gender-error">!</span>}
            </div>
            <div className={`gender-row ${errors.gender ? "gender-row-error" : ""}`}>
              <label className={`gender-option ${errors.gender ? "gender-option-error" : ""}`}>
                <span>Female</span>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={(e) => setGender(e.target.value)}
                />
              </label>
              <label className={`gender-option ${errors.gender ? "gender-option-error" : ""}`}>
                <span>Male</span>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={(e) => setGender(e.target.value)}
                />
              </label>
              <label className={`gender-option ${errors.gender ? "gender-option-error" : ""}`}>
                <span>Not specified</span>
                <input
                  type="radio"
                  name="gender"
                  value="not-specified"
                  checked={gender === "not-specified"}
                  onChange={(e) => setGender(e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="input-wrapper full-width">
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="Mobile number or email"
              className={`register-input full-width ${errors.emailOrPhone ? "input-error" : ""}`}
            />
            {errors.emailOrPhone && <span className="error-icon">!</span>}
          </div>

          <div className="input-wrapper full-width">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className={`register-input full-width ${errors.password ? "input-error" : ""}`}
            />
            {errors.password && <span className="error-icon">!</span>}
          </div>

          <p className="terms-text">
            People who use our service may have uploaded your contact information to The Tech Next Door. <a href="/learn-more">Learn more.</a>
          </p>

          <p className="terms-text">
            By clicking Sign Up, you agree to our <a href="/terms">Terms</a>,{" "}
            <a href="/privacy">Privacy Policy</a> and{" "}
            <a href="/cookies">Cookies Policy</a>. You may receive SMS notifications from us and can opt out any time.
          </p>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>

          <Link to="/admin" className="already-account-link">
            Already have an account?
          </Link>
        </form>
      </div>
      {showConfirmation && (
        <div className="confirmation-overlay" onClick={handleCancelConfirmation}>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirmation-icon">&#9993;</div>
            <h2 className="confirmation-title">
              Hello {firstName} {lastName},
            </h2>
            <p className="confirmation-text">Can you please confirm</p>
            <p className="confirmation-email">
              A confirmation will be sent to <strong>{emailOrPhone}</strong>
            </p>
            <div className="confirmation-actions">
              <button className="confirmation-cancel-btn" onClick={handleCancelConfirmation}>
                Cancel
              </button>
              <button className="confirmation-confirm-btn" onClick={handleConfirm} disabled={sending}>
                {sending ? "Sending..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRegister;
