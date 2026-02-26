import { JSX } from "react";
import "../style/calendar.css";
import timeData from "../SelectTime.json";
import Location from "./location";

interface CalendarData {
  date: string;
  time: string;
  notes: string;
}

interface CalendarErrors {
  date: string;
  time: string;
  notes: string;
}

interface LocationData {
  streetAddress: string;
  city: string;
  zipPostalCode: string;
}

interface LocationErrors {
  streetAddress: string;
  city: string;
  zipPostalCode: string;
}

interface CalendarProps {
  appointmentData: CalendarData;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  errors: CalendarErrors;
  disabled?: boolean;
  bookedTimes?: string[];
  locationData: LocationData;
  locationErrors: LocationErrors;
  onLocationChange: (data: LocationData) => void;
}

function Calendar({
  appointmentData,
  onChange,
  errors,
  disabled = false,
  bookedTimes = [],
  locationData,
  locationErrors,
  onLocationChange,
}: CalendarProps): JSX.Element {
  const maxNotesLength = 400;

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <span className="calendar-number">2</span>
        <h2 className="calendar-title">Set Appointment</h2>
      </div>

      <div className="calendar-row">
        <div className="calendar-field">
          <label className="calendar-label">
            <svg
              className="calendar-icon"
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
            name="date"
            value={appointmentData.date}
            onChange={onChange}
            min={today}
            className={`calendar-input ${
              errors.date ? "calendar-input-error" : ""
            }`}
            disabled={disabled}
            required
          />
          {errors.date ? (
            <span className="calendar-error">{errors.date}</span>
          ) : (
            <span className="calendar-hint">(date format: mm/dd/yyyy)</span>
          )}
        </div>
        <div className="calendar-field">
          <label className="calendar-label">Choose Time*</label>
          <select
            name="time"
            value={appointmentData.time}
            onChange={onChange}
            className={`calendar-input calendar-select ${
              errors.time ? "calendar-input-error" : ""
            }`}
            disabled={disabled}
            required
          >
            <option value="">Select Time</option>
            {timeData.timeSlots.map((time) => {
              const isBooked = bookedTimes.includes(time);
              return (
                <option key={time} value={time} disabled={isBooked}>
                  {time}
                  {isBooked ? " - Not Available" : ""}
                </option>
              );
            })}
          </select>
          {errors.time && <span className="calendar-error">{errors.time}</span>}
        </div>
      </div>
      <div className="calendar-field">
        <Location
          locationData={locationData}
          onChange={onLocationChange}
          errors={locationErrors}
        />
      </div>
      <div
        className={`calendar-requested-time ${appointmentData.date && appointmentData.time ? "calendar-requested-time-selected" : ""}`}
      >
        <h3 className="calendar-requested-title">Your Requested Time</h3>
        <p className="calendar-requested-text">
          {appointmentData.date && appointmentData.time
            ? `${appointmentData.date} at ${appointmentData.time}`
            : "Please select a date and time"}
        </p>
      </div>

      <div className="calendar-notes-section">
        <label className="calendar-label">Your Message</label>
        <textarea
          name="notes"
          value={appointmentData.notes}
          onChange={onChange}
          className={`calendar-textarea${errors.notes ? " calendar-textarea-error" : ""}`}
          placeholder="Please provide any additional details about your device's issue(s) here"
          maxLength={maxNotesLength}
          disabled={disabled}
        />
        {errors.notes && (
          <span className="calendar-error">{errors.notes}</span>
        )}
        <span className="calendar-character-count">
          {appointmentData.notes.length} / {maxNotesLength}
        </span>
      </div>
    </div>
  );
}

export default Calendar;
