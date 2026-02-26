import { useState, JSX, useEffect } from "react";
import "../style/location.css";

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

interface LocationProps {
  locationData?: LocationData;
  onChange?: (data: LocationData) => void;
  errors?: LocationErrors;
}

function Location({
  locationData,
  onChange,
  errors,
}: LocationProps): JSX.Element {
  const [location, setLocation] = useState<LocationData>({
    streetAddress: locationData?.streetAddress || "",
    city: locationData?.city || "",
    zipPostalCode: locationData?.zipPostalCode || "",
  });

  useEffect(() => {
    if (locationData) {
      setLocation(locationData);
    }
  }, [locationData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedLocation = {
      ...location,
      [name]: value,
    };
    setLocation(updatedLocation);
    onChange?.(updatedLocation);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Location data:", location);
  };

  return (
    <div className="location-container">
      <h2>Your Preferred Location</h2>
      <form onSubmit={handleSubmit} className="location-form">
        <div className="location-form-group">
          <label htmlFor="streetAddress" className="location-label">
            Street Address*
          </label>
          <input
            type="text"
            id="streetAddress"
            name="streetAddress"
            value={location.streetAddress}
            onChange={handleChange}
            placeholder="Enter street address"
            className={`location-input ${errors?.streetAddress ? "location-input-error" : ""}`}
          />
          {errors?.streetAddress && (
            <span className="location-error">{errors.streetAddress}</span>
          )}
        </div>

        <div className="location-form-group">
          <label htmlFor="city" className="location-label">
            City*
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={location.city}
            onChange={handleChange}
            placeholder="Enter city"
            className={`location-input ${errors?.city ? "location-input-error" : ""}`}
          />
          {errors?.city && (
            <span className="location-error">{errors.city}</span>
          )}
        </div>

        <div className="location-form-group">
          <label htmlFor="zipPostalCode" className="location-label">
            Zip or Postal Code*
          </label>
          <input
            type="text"
            id="zipPostalCode"
            name="zipPostalCode"
            value={location.zipPostalCode}
            onChange={handleChange}
            placeholder="Enter zip or postal code"
            className={`location-input ${errors?.zipPostalCode ? "location-input-error" : ""}`}
          />
          {errors?.zipPostalCode && (
            <span className="location-error">{errors.zipPostalCode}</span>
          )}
        </div>
      </form>
    </div>
  );
}

export default Location;
