import { JSX, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../style/GetAQuote.css";
import GetAQuoteImage from "./GetAQuoteImage";
import Footer from "./Footer";
import Submit from "./submit";
import SEO from "./SEO";
import {
  saveQuoteRequest,
  QuoteRequest,
  getQuoteOptions,
  QuoteOptions,
} from "../utils/quoteStorage";
import { Smartphone } from "lucide-react";

function GetAQuote(): JSX.Element {
  const location = useLocation();
  const [options, setOptions] = useState<QuoteOptions | null>(null);
  const [brand, setBrand] = useState("");
  const [grouping, setGrouping] = useState("");
  const [model, setModel] = useState("");
  const [service, setService] = useState("");
  const [availableGroupings, setAvailableGroupings] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const [serviceDescriptions, setServiceDescriptions] = useState<Record<string, string>>({});
  const [servicePrices, setServicePrices] = useState<Record<string, string>>({});

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedName, setSubmittedName] = useState({ first: "", last: "" });
  const [submittedQuote, setSubmittedQuote] = useState({
    brand: "",
    grouping: "",
    model: "",
    service: "",
  });

  const isFormEnabled =
    brand !== "" && grouping !== "" && model !== "" && service !== "";
  const isSubmitEnabled =
    isFormEnabled &&
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "";

  // Load options from IndexedDB and service details from localStorage
  useEffect(() => {
    getQuoteOptions().then((opts) => {
      setOptions(opts);
      setAvailableServices(opts.services);
    });
    // Load service descriptions and prices from localStorage
    const savedDescriptions = localStorage.getItem("serviceDescriptions");
    const savedPrices = localStorage.getItem("servicePrices");
    if (savedDescriptions) {
      setServiceDescriptions(JSON.parse(savedDescriptions));
    }
    if (savedPrices) {
      setServicePrices(JSON.parse(savedPrices));
    }
  }, [location.pathname]);

  // When brand changes, populate groupings
  useEffect(() => {
    if (options && brand) {
      const brandGroupings = options.groupings.find((g) => g.brand === brand);
      setAvailableGroupings(brandGroupings?.groupings || []);
      setGrouping("");
      setModel("");
      setAvailableModels([]);
    } else {
      setAvailableGroupings([]);
      setGrouping("");
      setModel("");
      setAvailableModels([]);
    }
  }, [brand, options]);

  // When grouping changes, populate models
  useEffect(() => {
    if (options && brand && grouping) {
      const modelData = options.models.find(
        (m) => m.brand === brand && m.grouping === grouping,
      );
      setAvailableModels(modelData?.models || []);
      setModel("");
    } else {
      setAvailableModels([]);
      setModel("");
    }
  }, [grouping, brand, options]);

  return (
    <>
      <SEO
        title="Get A Quote - The Tech Next Door"
        description="Get a free quote for your phone, tablet, or device repair. Fast and affordable repair services from The Tech Next Door."
      />
      <div className="min-h-screen flex items-center justify-center py-20 px-6">
        <div className="w-full max-w-3xl">
          <GetAQuoteImage />
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-serif font-bold mb-4"
              style={{ textAlign: "center", color: "white" }}
            >
              Get A Quote
              <hr className="getaguotline" />
            </h2>
            <p
              style={{
                textAlign: "center",
                color: "white",
                marginBottom: "2rem",
              }}
            >
              Tell us about your project and we'll provide a customized quote.
            </p>
          </div>
          <div
            className="quote-dropdown-container"
            style={{ marginTop: "2rem" }}
          >
            <div className="quote-dropdown-group">
              <select
                className="quote-dropdown"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                <option value="">Choose Brand</option>
                {options?.brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div className="quote-dropdown-group">
              <select
                className="quote-dropdown"
                value={grouping}
                onChange={(e) => setGrouping(e.target.value)}
                disabled={!brand}
              >
                <option value="">Choose Grouping</option>
                {availableGroupings.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
            <div className="quote-dropdown-group">
              <select
                className="quote-dropdown"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={!grouping}
              >
                <option value="">Choose Model</option>
                {availableModels.map((modelName) => (
                  <option key={modelName} value={modelName}>
                    {modelName}
                  </option>
                ))}
              </select>
            </div>
            <div className="quote-dropdown-group">
              <select
                className="quote-dropdown"
                value={service}
                onChange={(e) => setService(e.target.value)}
                disabled={!model}
              >
                <option value="">Choose Services</option>
                {availableServices.map((serviceName) => (
                  <option key={serviceName} value={serviceName}>
                    {serviceName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="quote-form-container">
            <div className="quote-input-row">
              <div className="quote-input-group">
                <label className="quote-label">First Name :</label>
                <input
                  type="text"
                  className="quote-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  disabled={!isFormEnabled}
                />
              </div>
            </div>

            <div className="quote-input-row">
              <div className="quote-input-group">
                <label className="quote-label">Last Name :</label>
                <input
                  type="text"
                  className="quote-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  disabled={!isFormEnabled}
                />
              </div>
            </div>

            <div className="quote-input-row">
              <div className="quote-input-group">
                <label className="quote-label">Email :</label>
                <input
                  type="email"
                  className="quote-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={!isFormEnabled}
                />
              </div>
            </div>

            <div className="quote-input-row">
              <div className="quote-input-group">
                <label className="quote-label">Phone Number </label>
                <input
                  type="tel"
                  className="quote-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(123) 456-7890"
                  disabled={!isFormEnabled}
                />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Submit
              disabled={!isSubmitEnabled}
              onClick={async () => {
                const quote: QuoteRequest = {
                  id:
                    Date.now().toString() +
                    Math.random().toString(36).substr(2, 9),
                  brand,
                  grouping,
                  model,
                  service,
                  firstName,
                  lastName,
                  email,
                  phone,
                  timestamp: Date.now(),
                  status: "pending",
                };

                await saveQuoteRequest(quote);

                setSubmittedName({ first: firstName, last: lastName });
                setSubmittedQuote({ brand, grouping, model, service });
                setBrand("");
                setGrouping("");
                setModel("");
                setService("");
                setFirstName("");
                setLastName("");
                setEmail("");
                setPhone("");
                setShowSuccessModal(true);
              }}
            />
          </div>
        </div>
      </div>
      <Footer />

      {showSuccessModal && (
        <div
          className="quote-modal-overlay"
          onClick={() => setShowSuccessModal(false)}
        >
          <div className="quote-modal" onClick={(e) => e.stopPropagation()}>
            <div className="quote-modal-icon">
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
            <h3 className="quote-modal-title">
              Thank You {submittedName.first} {submittedName.last}!
            </h3>
            <div className="quote-selection-card" style={{ margin: "1rem 0" }}>
              <div className="quote-card-image">
                <Smartphone size={48} />
              </div>
              <div className="quote-card-body">
                <div className="quote-card-device">
                  <span className="quote-card-brand">
                    {submittedQuote.brand}
                  </span>
                  <span className="quote-card-model">
                    {submittedQuote.grouping} - {submittedQuote.model}
                  </span>
                </div>
                <h3 className="quote-card-service">{submittedQuote.service}</h3>
                <p className="quote-card-description">
                  {serviceDescriptions[submittedQuote.service] ||
                    "Service description"}
                </p>
                <div className="quote-card-price">
                  {servicePrices[submittedQuote.service] ||
                    "Contact for quote"}
                </div>
              </div>
            </div>
            <button
              className="quote-modal-btn"
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
export default GetAQuote;
