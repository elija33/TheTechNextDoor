import { JSX, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Schedule.css";
import Informationform from "./Informationform";
import SEO from "./SEO";
import { getQuoteOptions, QuoteOptions } from "../utils/quoteStorage";

function Schedule(): JSX.Element {
  const navigate = useNavigate();
  const [options, setOptions] = useState<QuoteOptions | null>(null);
  const [brand, setBrand] = useState("");
  const [grouping, setGrouping] = useState("");
  const [model, setModel] = useState("");
  const [service, setService] = useState("");
  const [availableGroupings, setAvailableGroupings] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  const prevBrand = useRef("");
  const prevGrouping = useRef("");

  const loadOptions = () => {
    getQuoteOptions().then(setOptions);
  };

  useEffect(() => {
    loadOptions();
    window.addEventListener("focus", loadOptions);
    return () => window.removeEventListener("focus", loadOptions);
  }, []);

  // When brand changes, populate groupings
  useEffect(() => {
    if (brand && options) {
      const brandGroupings =
        options.groupings.find((g) => g.brand === brand)?.groupings ?? [];
      setAvailableGroupings(brandGroupings);
    } else {
      setAvailableGroupings([]);
    }
    // Only reset downstream selections when brand itself changed, not when options refreshes
    if (brand !== prevBrand.current) {
      setGrouping("");
      setModel("");
      setAvailableModels([]);
      prevBrand.current = brand;
    }
  }, [brand, options]);

  // When grouping changes, populate models
  useEffect(() => {
    if (grouping && brand && options) {
      const brandModels =
        options.models.find(
          (m) => m.brand === brand && m.grouping === grouping,
        )?.models ?? [];
      setAvailableModels(brandModels);
    } else if (!grouping) {
      setAvailableModels([]);
    }
    // Only reset model when grouping itself changed, not when options refreshes
    if (grouping !== prevGrouping.current) {
      setModel("");
      prevGrouping.current = grouping;
    }
  }, [grouping, brand, options]);

  const isDeviceSelected =
    brand !== "" && grouping !== "" && model !== "" && service !== "";

  return (
    <>
      <SEO
        title="Schedule A Service - The Tech Next Door"
        description="Schedule your phone or device repair service with The Tech Next Door. Fast, reliable, and affordable repairs."
      />
      <div className="schedule-container">
        <h2 className="schedule-title">Schedule A Service</h2>
        <div className="schedule-form">
          <div className="dropdown-group">
            <select
              className="schedule-dropdown"
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

          <div className="dropdown-group">
            <select
              className="schedule-dropdown"
              value={grouping}
              onChange={(e) => setGrouping(e.target.value)}
              disabled={!brand}
            >
              <option value="">Choose Grouping</option>
              {availableGroupings.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="dropdown-group">
            <select
              className="schedule-dropdown"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={!grouping}
            >
              <option value="">Choose Model</option>
              {availableModels.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="dropdown-group">
            <select
              className="schedule-dropdown"
              value={service}
              onChange={(e) => setService(e.target.value)}
              disabled={!model}
            >
              <option value="">Choose Services</option>
              {options?.services.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <button
            className="senior-tech-btn"
            type="button"
            onClick={() => navigate("/senior-tech-service")}
            disabled={brand !== "" && grouping !== "" && model !== ""}
          >
            SENIOR TECH SERVICE
          </button>
        </div>
        <div>
          <Informationform
            isDeviceSelected={isDeviceSelected}
            deviceInfo={{ brand, grouping, model, service }}
            onSuccess={() => {
              setBrand("");
              setService("");
              prevBrand.current = "";
              prevGrouping.current = "";
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Schedule;
