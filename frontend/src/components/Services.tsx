import { JSX, useState, useEffect } from "react";
import "../style/carousel.css";
import "../style/Services.css";

interface ServiceCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

// Fallback mapping for icon names to emojis (for backward compatibility)
const ICON_MAP: Record<string, string> = {
  "Smartphone": "📱",
  "Tablet": "📱",
  "Laptop": "💻",
  "Monitor": "🖥️",
  "Watch": "⌚",
  "Headphones": "🎧",
  "TV": "📺",
  "Camera": "📷",
  "Gamepad": "🎮",
  "Speaker": "🔊",
  "Printer": "🖨️",
  "CPU": "🔧",
  "Hard Drive": "💾",
  "Wifi": "📶",
  "Battery": "🔋",
  "Wrench": "🔧",
  "Settings": "⚙️",
  "Power": "⚡",
  "Price Tag": "🏷️",
  "Target": "🎯",
  "Mobile": "📱",
  "Repair": "🛠️⚡️",
};

function Services(): JSX.Element {
  const [services, setServices] = useState<ServiceCard[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("serviceCards");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert icon names to emojis if needed
      const converted = parsed.map((card: ServiceCard) => ({
        ...card,
        icon: ICON_MAP[card.icon] || card.icon,
      }));
      setServices(converted);
    }
  }, []);

  if (services.length === 0) {
    return <></>;
  }

  return (
    <div id="services-section" className="py-20 px-6">
      <h2 className="text-4xl font-serif font-bold text-center mb-16" style={{ textAlign: "center", color: "white" }}>
        Services
      </h2>
      <hr className="services-divider" />

      <div className="services-container">
        {services.map((service) => (
          <div key={service.id} className="service-box">
            <div className="service-icon">{service.icon}</div>
            <h3 className="service-title">{service.title}</h3>
            <hr className="services-title-divider" />
            <p className="service-description">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Services;
