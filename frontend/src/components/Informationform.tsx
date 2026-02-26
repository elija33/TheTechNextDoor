import { JSX, useState, useEffect } from "react";
import "../style/Informationform.css";
import Calendar from "./calendar";
import {
  saveOrder,
  generateOrderId,
  getBookedTimesForDate,
} from "../utils/orderStorage";
import { getServices, Service } from "../utils/serviceStorage";
import LoadingImages from "./loadingimages";

interface InformationFormData {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  textConfirmation: boolean;
}

interface CalendarData {
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

interface FormErrors {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface CalendarErrors {
  date: string;
  time: string;
  notes: string;
}

interface DeviceInfo {
  brand: string;
  grouping: string;
  model: string;
  service: string;
}

interface InformationformProps {
  isDeviceSelected?: boolean;
  deviceInfo?: DeviceInfo;
  onSuccess?: () => void;
}

// Service price mapping
const SERVICE_PRICES: Record<string, string> = {
  "Screen Repair": "$89.99",
  "Battery Replacement": "$49.99",
  "Water Damage Repair": "$129.99",
  "Charging Port Repair": "$39.99",
  "Speaker Repair": "$59.99",
  "Camera Repair": "$69.99",
  "Back Glass Replacement": "$79.99",
  "Software Issues": "$29.99",
  Other: "TBD",
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

function Informationform({
  isDeviceSelected = true,
  deviceInfo,
  onSuccess,
}: InformationformProps): JSX.Element {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [submittedDevice, setSubmittedDevice] = useState<DeviceInfo | null>(null);
  const [submittedServiceData, setSubmittedServiceData] = useState<Service | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imageResetKey, setImageResetKey] = useState(0);
  const [formData, setFormData] = useState<InformationFormData>({
    email: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    textConfirmation: false,
  });

  const [calendarData, setCalendarData] = useState<CalendarData>({
    date: "",
    time: "",
    notes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [calendarErrors, setCalendarErrors] = useState<CalendarErrors>({
    date: "",
    time: "",
    notes: "",
  });

  const [locationData, setLocationData] = useState<LocationData>({
    streetAddress: "",
    city: "",
    zipPostalCode: "",
  });

  const [locationErrors, setLocationErrors] = useState<LocationErrors>({
    streetAddress: "",
    city: "",
    zipPostalCode: "",
  });

  const [bookedTimes, setBookedTimes] = useState<string[]>([]);

  // Fetch booked times when date changes
  useEffect(() => {
    if (calendarData.date) {
      getBookedTimesForDate(calendarData.date).then(setBookedTimes);
    } else {
      setBookedTimes([]);
    }
  }, [calendarData.date]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (name in errors) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCalendarChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ): void => {
    const { name, value } = e.target;

    // If date changes, clear the time selection
    if (name === "date") {
      setCalendarData((prev) => ({
        ...prev,
        date: value,
        time: "",
      }));
    } else {
      setCalendarData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (name in calendarErrors) {
      setCalendarErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (): Promise<void> => {
    const newErrors: FormErrors = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    };

    const newCalendarErrors: CalendarErrors = {
      date: "",
      time: "",
      notes: "",
    };

    // Validate contact info
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone Number is required";
    }

    // Validate calendar fields
    if (!calendarData.date.trim()) {
      newCalendarErrors.date = "Choose Date is required";
    }
    if (!calendarData.time.trim()) {
      newCalendarErrors.time = "Choose Time is required";
    }
    if (!calendarData.notes.trim()) {
      newCalendarErrors.notes = "Your Message is required";
    }

    const newLocationErrors: LocationErrors = {
      streetAddress: "",
      city: "",
      zipPostalCode: "",
    };
    if (!locationData.streetAddress.trim()) {
      newLocationErrors.streetAddress = "Street Address is required";
    }
    if (!locationData.city.trim()) {
      newLocationErrors.city = "City is required";
    }
    if (!locationData.zipPostalCode.trim()) {
      newLocationErrors.zipPostalCode = "Zip or Postal Code is required";
    }

    setErrors(newErrors);
    setCalendarErrors(newCalendarErrors);
    setLocationErrors(newLocationErrors);

    // Check if there are any errors
    const hasFormErrors = Object.values(newErrors).some(
      (error) => error !== "",
    );
    const hasCalendarErrors = Object.values(newCalendarErrors).some(
      (error) => error !== "",
    );
    const hasLocationErrors = Object.values(newLocationErrors).some(
      (error) => error !== "",
    );

    if (!hasFormErrors && !hasCalendarErrors && !hasLocationErrors && deviceInfo) {
      // Convert images to base64
      const imageBase64Array = await Promise.all(
        uploadedImages.map((file) => fileToBase64(file)),
      );

      // Match selected service against DashboardServices data for price and description.
      // Priority: model-specific match (e.g. "iPhone 12 Screen Repair") > exact service > partial.
      const allServices = await getServices();
      const serviceLower = deviceInfo.service.toLowerCase();
      const modelLower = deviceInfo.model.toLowerCase();
      const matchedService =
        allServices.find(
          (s) =>
            s.name.toLowerCase().includes(modelLower) &&
            s.name.toLowerCase().includes(serviceLower),
        ) ??
        allServices.find((s) => s.name.toLowerCase() === serviceLower) ??
        allServices.find((s) => s.name.toLowerCase().includes(serviceLower)) ??
        null;

      // Create and save order
      const order = {
        id: generateOrderId(),
        customer: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phoneNumber,
        brand: deviceInfo.brand,
        grouping: deviceInfo.grouping,
        model: deviceInfo.model,
        service: deviceInfo.service,
        date: calendarData.date,
        time: calendarData.time,
        notes: calendarData.notes,
        amount: matchedService?.price || SERVICE_PRICES[deviceInfo.service] || "TBD",
        status: "pending" as const,
        timestamp: Date.now(),
        textConfirmation: formData.textConfirmation,
        images: imageBase64Array,
        streetAddress: locationData.streetAddress,
        city: locationData.city,
        zipPostalCode: locationData.zipPostalCode,
      };

      await saveOrder(order);
      setSubmittedName(`${formData.firstName} ${formData.lastName}`);
      setSubmittedDevice(deviceInfo);
      setSubmittedServiceData(matchedService);
      setShowSuccessModal(true);
      setUploadedImages([]);
      setImageResetKey((k) => k + 1);
      onSuccess?.();

      // Reset form
      setFormData({
        email: "",
        phoneNumber: "",
        firstName: "",
        lastName: "",
        textConfirmation: false,
      });
      setCalendarData({
        date: "",
        time: "",
        notes: "",
      });
      setLocationData({ streetAddress: "", city: "", zipPostalCode: "" });
      setLocationErrors({ streetAddress: "", city: "", zipPostalCode: "" });
    }
  };

  return (
    <div className="info-form-container">
      <div className="info-form-header">
        <span className="info-form-number">1</span>
        <h2 className="info-form-title">Contact Info</h2>
      </div>

      <div className="info-form-row">
        <div className="info-form-field">
          <label className="info-form-label">First Name</label>
          <div className="info-form-input-wrapper">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`info-form-input ${
                errors.firstName ? "info-form-input-error" : ""
              }`}
              disabled={!isDeviceSelected}
              required
            />
            {errors.firstName && (
              <span className="info-form-error">{errors.firstName}</span>
            )}
          </div>
        </div>

        <div className="info-form-field">
          <label className="info-form-label">Last Name</label>
          <div className="info-form-input-wrapper">
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`info-form-input ${
                errors.lastName ? "info-form-input-error" : ""
              }`}
              disabled={!isDeviceSelected}
              required
            />
            {errors.lastName && (
              <span className="info-form-error">{errors.lastName}</span>
            )}
          </div>
        </div>
      </div>

      <div className="info-form-row">
        <div className="info-form-field">
          <label className="info-form-label">Email</label>
          <div className="info-form-input-wrapper">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`info-form-input ${
                errors.email ? "info-form-input-error" : ""
              }`}
              maxLength={50}
              disabled={!isDeviceSelected}
              required
            />
            {errors.email ? (
              <span className="info-form-error">{errors.email}</span>
            ) : (
              <span className="info-form-hint">Max 50 Characters</span>
            )}
          </div>
        </div>

        <div className="info-form-field">
          <label className="info-form-label">Phone Number</label>
          <div className="info-form-input-wrapper">
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`info-form-input ${
                errors.phoneNumber ? "info-form-input-error" : ""
              }`}
              disabled={!isDeviceSelected}
              required
            />
            {errors.phoneNumber ? (
              <span className="info-form-error">{errors.phoneNumber}</span>
            ) : (
              <span className="info-form-hint">
                Your Number will not be used for marketing purposes.
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="info-form-checkbox-group">
        <label className="info-form-checkbox-label">
          <input
            type="checkbox"
            name="textConfirmation"
            checked={formData.textConfirmation}
            onChange={handleChange}
            className="info-form-checkbox"
            disabled={!isDeviceSelected}
          />
          <span className="info-form-checkbox-text">
            Yes! Please text me with confirmation & reminders about my
            appointment.
          </span>
        </label>
      </div>
      <div>
        <Calendar
          appointmentData={calendarData}
          onChange={handleCalendarChange}
          errors={calendarErrors}
          disabled={!isDeviceSelected}
          bookedTimes={bookedTimes}
          locationData={locationData}
          locationErrors={locationErrors}
          onLocationChange={(data) => {
            setLocationData(data);
            setLocationErrors({ streetAddress: "", city: "", zipPostalCode: "" });
          }}
        />
      </div>
      <div>
        <LoadingImages
          key={imageResetKey}
          disabled={!isDeviceSelected}
          onImagesChange={setUploadedImages}
        />
      </div>

      <button
        className="info-form-button"
        onClick={handleSubmit}
        disabled={!isDeviceSelected}
      >
        Confirm Appointment
      </button>

      {showSuccessModal && (
        <div
          className="info-form-modal-overlay"
          onClick={() => setShowSuccessModal(false)}
        >
          <div className="info-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="info-form-modal-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="info-form-modal-title">
              Thank You {submittedName}!
            </h3>
            <div className="info-form-modal-card">
              <div className="info-form-modal-card-header">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                  <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5"></line>
                </svg>
              </div>
              <div className="info-form-modal-card-body">
                <p className="info-form-modal-brand">{submittedDevice?.brand}</p>
                <p className="info-form-modal-model">
                  {submittedDevice?.grouping} - {submittedDevice?.model}
                </p>
                <p className="info-form-modal-service">{submittedDevice?.service}</p>
                {submittedServiceData?.description && (
                  <p className="info-form-modal-description">
                    {submittedServiceData.description}
                  </p>
                )}
                <p className="info-form-modal-price">
                  {submittedServiceData?.price ||
                    SERVICE_PRICES[submittedDevice?.service ?? ""] ||
                    "TBD"}
                </p>
              </div>
            </div>
            <button
              className="info-form-modal-btn"
              onClick={() => setShowSuccessModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Informationform;
