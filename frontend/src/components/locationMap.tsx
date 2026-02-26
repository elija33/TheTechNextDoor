import { JSX } from "react";

function LocationMap(): JSX.Element {
  return (
    <div className="location-map-container">
      <iframe
        src="https://maps.google.com/maps?q=275+Lazelle+Rd,+Westerville,+OH+43081&output=embed"
        width="100%"
        height="450"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="The Tech Next Door Location"
      />
    </div>
  );
}

export default LocationMap;
