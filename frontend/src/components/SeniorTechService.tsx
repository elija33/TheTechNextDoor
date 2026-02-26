import { JSX, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import "../style/SeniorTechService.css";
import Footer from "./Footer";
import SEO from "./SEO";
import timeData from "../SelectTime.json";
import { saveSeniorTechRequest } from "../utils/seniorTechStorage";
import Location from "./location";

interface ServiceCategoriesType {
  Smartphone: string[];
  Computer: string[];
  HomeTech: string[];
  OnlineSafety: string[];
}

const defaultCategories: ServiceCategoriesType = {
  Smartphone: [
    "Basic Phone Setup",
    "Contacts & photo transfer",
    "Email setup",
    "FaceTime / video calling",
    "Text message training",
    "App installation",
    "Fixing common phone problems",
  ],
  Computer: [
    "Email Setup & Training",
    "Video Calling (Zoom, FaceTime)",
    "Document Creation",
    "File Organization",
    "Printer Setup",
    "WiFi setup",
    "Password recovery",
    "Basic computer lessons",
  ],
  HomeTech: [
    "Smart TV Setup",
    "Streaming Services (Netflix, Roku, Firestick etc.)",
    "Smart Home Devices",
    "WiFi Troubleshooting",
    "Remote Control Help",
    "Cable Box Setup",
    "Alexa / smart speakers",
    "Ring doorbells",
  ],
  OnlineSafety: [
    "Password Management",
    "Scam Recognition",
    "Privacy Settings",
    "Secure Browsing",
    "Account Security",
    "Data Backup",
    "Facebook account help",
  ],
};

function getServiceCategories(): ServiceCategoriesType {
  const saved = localStorage.getItem("seniorTechServiceCategories");
  return saved ? JSON.parse(saved) : defaultCategories;
}

interface CheckboxDropdownProps {
  title: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

function CheckboxDropdown({ title, options, selected, onChange }: CheckboxDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const displayText = selected.length > 0
    ? `${selected.length} selected`
    : title;

  return (
    <div className="senior-tech-dropdown-group" ref={dropdownRef}>
      <button
        type="button"
        className={`senior-tech-dropdown ${isOpen ? "open" : ""} ${selected.length > 0 ? "has-selection" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="dropdown-text">{displayText}</span>
        <ChevronDown size={16} className={`dropdown-arrow ${isOpen ? "rotated" : ""}`} />
      </button>
      {isOpen && (
        <div className="senior-tech-dropdown-menu">
          {options.map((option) => (
            <label key={option} className="senior-tech-checkbox-item">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => handleToggle(option)}
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-label">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function SeniorTechService(): JSX.Element {
  const navigate = useNavigate();
  const [serviceCategories, setServiceCategories] = useState<ServiceCategoriesType>(getServiceCategories);
  const [smartphoneServices, setSmartphoneServices] = useState<string[]>([]);
  const [computerServices, setComputerServices] = useState<string[]>([]);
  const [homeTechServices, setHomeTechServices] = useState<string[]>([]);
  const [onlineSafetyServices, setOnlineSafetyServices] = useState<string[]>([]);

  // Reload categories from localStorage when component mounts or page regains focus
  useEffect(() => {
    const handleStorageChange = () => {
      setServiceCategories(getServiceCategories());
    };
    const handleFocus = () => {
      setServiceCategories(getServiceCategories());
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const [locationData, setLocationData] = useState({
    streetAddress: "",
    city: "",
    zipPostalCode: "",
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedName, setSubmittedName] = useState({ first: "", last: "" });

  const maxMessageLength = 400;
  const today = new Date().toISOString().split("T")[0];

  const hasServiceSelected =
    smartphoneServices.length > 0 ||
    computerServices.length > 0 ||
    homeTechServices.length > 0 ||
    onlineSafetyServices.length > 0;

  const isFormValid =
    hasServiceSelected &&
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "" &&
    appointmentDate !== "" &&
    appointmentTime !== "";

  const handleSubmit = async () => {
    if (isFormValid) {
      // Save to IndexedDB
      await saveSeniorTechRequest({
        firstName,
        lastName,
        email,
        phone,
        services: {
          smartphone: smartphoneServices,
          computer: computerServices,
          homeTech: homeTechServices,
          onlineSafety: onlineSafetyServices,
        },
        appointmentDate,
        appointmentTime,
        message,
      });
      // Save name before reset for modal
      setSubmittedName({ first: firstName, last: lastName });
      setShowSuccessModal(true);
      // Reset form
      setSmartphoneServices([]);
      setComputerServices([]);
      setHomeTechServices([]);
      setOnlineSafetyServices([]);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setAppointmentDate("");
      setAppointmentTime("");
      setMessage("");
      setLocationData({ streetAddress: "", city: "", zipPostalCode: "" });
    }
  };

  return (
    <>
      <SEO
        title="Senior Tech Service - The Tech Next Door"
        description="Patient, friendly tech support designed for seniors. Smartphone help, computer training, home tech setup, and online safety guidance."
      />
      <div className="senior-tech-container">
        <button className="senior-tech-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="senior-tech-header">
          <h1 className="senior-tech-title">Senior Tech Service</h1>
          <p className="senior-tech-subtitle">
            Patient, friendly tech support designed for seniors. We help you
            stay connected with family and navigate technology with confidence.
          </p>
        </div>

        <div className="senior-tech-services">
          <CheckboxDropdown
            title="Smartphone Services"
            options={serviceCategories.Smartphone}
            selected={smartphoneServices}
            onChange={setSmartphoneServices}
          />
          <CheckboxDropdown
            title="Computer Services"
            options={serviceCategories.Computer}
            selected={computerServices}
            onChange={setComputerServices}
          />
          <CheckboxDropdown
            title="Home Tech Services"
            options={serviceCategories.HomeTech}
            selected={homeTechServices}
            onChange={setHomeTechServices}
          />
          <CheckboxDropdown
            title="Online Safety Services"
            options={serviceCategories.OnlineSafety}
            selected={onlineSafetyServices}
            onChange={setOnlineSafetyServices}
          />
        </div>

        <div className="senior-tech-form">
          <h3 className="senior-tech-form-title">Contact Information</h3>
          <div className="senior-tech-form-row">
            <div className="senior-tech-input-group">
              <label className="senior-tech-label">First Name</label>
              <input
                type="text"
                className="senior-tech-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                disabled={!hasServiceSelected}
              />
            </div>
            <div className="senior-tech-input-group">
              <label className="senior-tech-label">Last Name</label>
              <input
                type="text"
                className="senior-tech-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                disabled={!hasServiceSelected}
              />
            </div>
          </div>
          <div className="senior-tech-form-row">
            <div className="senior-tech-input-group">
              <label className="senior-tech-label">Email</label>
              <input
                type="email"
                className="senior-tech-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={!hasServiceSelected}
              />
            </div>
            <div className="senior-tech-input-group">
              <label className="senior-tech-label">Phone Number</label>
              <input
                type="tel"
                className="senior-tech-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(123) 456-7890"
                disabled={!hasServiceSelected}
              />
            </div>
          </div>
          <div className="senior-tech-location-inline">
            <h3 className="senior-tech-location-title">Your Address</h3>
            <Location
              locationData={locationData}
              onChange={setLocationData}
            />
          </div>
        </div>

        <div className="senior-tech-appointment">
          <div className="senior-tech-appointment-header">
            <span className="senior-tech-appointment-number">2</span>
            <h3 className="senior-tech-appointment-title">Set Appointment</h3>
          </div>

          <div className="senior-tech-form-row">
            <div className="senior-tech-input-group">
              <label className="senior-tech-label">
                <svg
                  className="senior-tech-calendar-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Choose Date*
              </label>
              <input
                type="date"
                className="senior-tech-input"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                min={today}
                disabled={!hasServiceSelected}
              />
              <span className="senior-tech-hint">(date format: mm/dd/yyyy)</span>
            </div>
            <div className="senior-tech-input-group">
              <label className="senior-tech-label">Choose Time*</label>
              <select
                className="senior-tech-input senior-tech-select"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                disabled={!hasServiceSelected}
              >
                <option value="">Select Time</option>
                {timeData.timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={`senior-tech-requested-time ${appointmentDate && appointmentTime ? "selected" : ""}`}>
            <h4 className="senior-tech-requested-title">Your Requested Time</h4>
            <p className="senior-tech-requested-text">
              {appointmentDate && appointmentTime
                ? `${appointmentDate} at ${appointmentTime}`
                : "Please select a date and time"}
            </p>
          </div>

          <div className={`senior-tech-requested-service ${hasServiceSelected ? "selected" : ""}`}>
            <h4 className="senior-tech-requested-title">Your Requested Service is:</h4>
            {hasServiceSelected ? (
              <ul className="senior-tech-service-list">
                {smartphoneServices.map((service) => (
                  <li key={service}><span className="service-category">Smartphone:</span> {service}</li>
                ))}
                {computerServices.map((service) => (
                  <li key={service}><span className="service-category">Computer:</span> {service}</li>
                ))}
                {homeTechServices.map((service) => (
                  <li key={service}><span className="service-category">Home Tech:</span> {service}</li>
                ))}
                {onlineSafetyServices.map((service) => (
                  <li key={service}><span className="service-category">Online Safety:</span> {service}</li>
                ))}
              </ul>
            ) : (
              <p className="senior-tech-requested-text">Please select a service</p>
            )}
          </div>

          <div className="senior-tech-message-section">
            <label className="senior-tech-label">Your Message</label>
            <textarea
              className="senior-tech-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please provide any additional details about your device's issue(s) here"
              maxLength={maxMessageLength}
              disabled={!hasServiceSelected}
            />
            <span className="senior-tech-character-count">
              {message.length} / {maxMessageLength}
            </span>
          </div>
        </div>

        <div className="senior-tech-submit-container">
          <button
            className="senior-tech-submit-btn"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Request Service
          </button>
        </div>
      </div>
      <Footer />

      {showSuccessModal && (
        <div
          className="senior-tech-modal-overlay"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="senior-tech-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="senior-tech-modal-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="senior-tech-modal-title">Request Submitted!</h3>
            <p className="senior-tech-modal-text">
              Thank you {submittedName.first} {submittedName.last} for reaching out. You will receive a confirmation email soon about your appointment.
            </p>
            <button
              className="senior-tech-modal-btn"
              onClick={() => setShowSuccessModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SeniorTechService;
