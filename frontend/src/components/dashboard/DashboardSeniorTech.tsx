import { JSX, useState, useEffect } from "react";
import { getSeniorTechRequests, markSeniorTechAsRead, updateSeniorTechStatus, SeniorTechRequest } from "../../utils/seniorTechStorage";
import { sendConfirmationNotification } from "../../utils/notificationService";
import "../../style/DashboardSeniorTech.css";

const defaultCategories = {
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

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function getStatusColor(status: string): string {
  switch (status) {
    case "pending": return "#f59e0b";
    case "confirmed": return "#3b82f6";
    case "completed": return "#10b981";
    case "cancelled": return "#ef4444";
    default: return "#64748b";
  }
}

type ServiceCategory = "smartphone" | "computer" | "homeTech" | "onlineSafety" | null;

interface ServiceCategoriesState {
  Smartphone: string[];
  Computer: string[];
  HomeTech: string[];
  OnlineSafety: string[];
}

function DashboardSeniorTech(): JSX.Element {
  const [requests, setRequests] = useState<SeniorTechRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<SeniorTechRequest | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [showServiceCategories, setShowServiceCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>(null);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategoriesState>(() => {
    const saved = localStorage.getItem("seniorTechServiceCategories");
    return saved ? JSON.parse(saved) : defaultCategories;
  });
  const [newServiceInput, setNewServiceInput] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    getSeniorTechRequests().then(setRequests);
  }, []);

  useEffect(() => {
    localStorage.setItem("seniorTechServiceCategories", JSON.stringify(serviceCategories));
  }, [serviceCategories]);

  const getCategoryKey = (category: ServiceCategory): keyof ServiceCategoriesState | null => {
    switch (category) {
      case "smartphone": return "Smartphone";
      case "computer": return "Computer";
      case "homeTech": return "HomeTech";
      case "onlineSafety": return "OnlineSafety";
      default: return null;
    }
  };

  const handleAddService = () => {
    if (!selectedCategory || !newServiceInput.trim()) return;
    const key = getCategoryKey(selectedCategory);
    if (!key) return;

    setServiceCategories(prev => ({
      ...prev,
      [key]: [...prev[key], newServiceInput.trim()]
    }));
    setNewServiceInput("");
  };

  const handleRemoveService = (service: string) => {
    if (!selectedCategory) return;
    const key = getCategoryKey(selectedCategory);
    if (!key) return;

    setServiceCategories(prev => ({
      ...prev,
      [key]: prev[key].filter(s => s !== service)
    }));
  };

  const handleSaveCategories = () => {
    localStorage.setItem("seniorTechServiceCategories", JSON.stringify(serviceCategories));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const getFilteredRequests = () => {
    let filtered = filter === "all" ? requests : requests.filter(r => r.status === filter);

    if (selectedCategory) {
      filtered = filtered.filter(r => r.services[selectedCategory].length > 0);
    }

    return filtered;
  };

  const filteredRequests = getFilteredRequests();

  const unreadCount = requests.filter((r) => r.unread).length;

  const handleRequestClick = async (request: SeniorTechRequest) => {
    if (request.unread) {
      await markSeniorTechAsRead(request.id);
      setRequests((prev) =>
        prev.map((r) => (r.id === request.id ? { ...r, unread: false } : r))
      );
    }
    setSelectedRequest(request);
  };

  const handleStatusChange = async (id: string, status: SeniorTechRequest["status"]) => {
    await updateSeniorTechStatus(id, status);

    // Find the request to get customer details
    const request = requests.find(r => r.id === id);

    // Send confirmation notification when status changes to "confirmed"
    if (status === "confirmed" && request) {
      await sendConfirmationNotification({
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        phone: request.phone,
        appointmentDate: request.appointmentDate,
        appointmentTime: request.appointmentTime,
      });
    }

    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest({ ...selectedRequest, status });
    }
  };

  const handleCloseDetail = () => {
    setSelectedRequest(null);
  };

  const getAllServices = (request: SeniorTechRequest): string[] => {
    const services: string[] = [];
    request.services.smartphone.forEach(s => services.push(`Smartphone: ${s}`));
    request.services.computer.forEach(s => services.push(`Computer: ${s}`));
    request.services.homeTech.forEach(s => services.push(`Home Tech: ${s}`));
    request.services.onlineSafety.forEach(s => services.push(`Online Safety: ${s}`));
    return services;
  };

  if (selectedRequest) {
    const allServices = getAllServices(selectedRequest);
    return (
      <div className="senior-tech-page">
        <div className="senior-tech-detail-header">
          <button className="senior-tech-back-btn" onClick={handleCloseDetail}>
            ← Back to Requests
          </button>
        </div>
        <div className="senior-tech-detail">
          <div className="senior-tech-detail-top">
            <div className="senior-tech-avatar">
              {getInitials(selectedRequest.firstName, selectedRequest.lastName)}
            </div>
            <div className="senior-tech-detail-info">
              <h3>{selectedRequest.firstName} {selectedRequest.lastName}</h3>
              <p className="senior-tech-detail-contact">
                {selectedRequest.email} • {selectedRequest.phone}
              </p>
              <p className="senior-tech-detail-time">{formatTimeAgo(selectedRequest.timestamp)}</p>
            </div>
            <div className="senior-tech-status-badge" style={{ backgroundColor: getStatusColor(selectedRequest.status) }}>
              {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
            </div>
          </div>

          <div className="senior-tech-detail-section">
            <h4>Appointment</h4>
            <p><strong>Date:</strong> {selectedRequest.appointmentDate}</p>
            <p><strong>Time:</strong> {selectedRequest.appointmentTime}</p>
          </div>

          <div className="senior-tech-detail-section">
            <h4>Requested Services ({allServices.length})</h4>
            <ul className="senior-tech-services-list">
              {allServices.map((service, idx) => (
                <li key={idx}>{service}</li>
              ))}
            </ul>
          </div>

          {selectedRequest.message && (
            <div className="senior-tech-detail-section">
              <h4>Message</h4>
              <p>{selectedRequest.message}</p>
            </div>
          )}

          <div className="senior-tech-detail-actions">
            <h4>Update Status</h4>
            <div className="status-buttons">
              <button
                className={`status-btn pending ${selectedRequest.status === "pending" ? "active" : ""}`}
                onClick={() => handleStatusChange(selectedRequest.id, "pending")}
              >
                Pending
              </button>
              <button
                className={`status-btn confirmed ${selectedRequest.status === "confirmed" ? "active" : ""}`}
                onClick={() => handleStatusChange(selectedRequest.id, "confirmed")}
              >
                Confirmed
              </button>
              <button
                className={`status-btn completed ${selectedRequest.status === "completed" ? "active" : ""}`}
                onClick={() => handleStatusChange(selectedRequest.id, "completed")}
              >
                Completed
              </button>
              <button
                className={`status-btn cancelled ${selectedRequest.status === "cancelled" ? "active" : ""}`}
                onClick={() => handleStatusChange(selectedRequest.id, "cancelled")}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="senior-tech-page">
      <div className="senior-tech-header">
        <h2>Senior Tech Service Requests ({unreadCount} new)</h2>
        <div className="senior-tech-filters">
          <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All</button>
          <button className={`filter-btn ${filter === "pending" ? "active" : ""}`} onClick={() => setFilter("pending")}>Pending</button>
          <button className={`filter-btn ${filter === "confirmed" ? "active" : ""}`} onClick={() => setFilter("confirmed")}>Confirmed</button>
          <button className={`filter-btn ${filter === "completed" ? "active" : ""}`} onClick={() => setFilter("completed")}>Completed</button>
          <button
            className={`filter-btn senior-tech-service-btn ${showServiceCategories ? "active" : ""}`}
            onClick={() => {
              setShowServiceCategories(true);
              setSelectedCategory(null);
            }}
          >
            Senior Tech Service
          </button>
        </div>
      </div>

      {showServiceCategories && !selectedCategory && (
        <div className="service-categories-page">
          <button className="back-to-all-btn" onClick={() => setShowServiceCategories(false)}>
            ← Back to All Requests
          </button>
          <div className="service-categories-grid">
            <button
              className="service-category-card"
              onClick={() => setSelectedCategory("smartphone")}
            >
              <div className="category-icon-box smartphone">
                <span className="category-emoji">📱</span>
              </div>
              <div className="category-info">
                <span className="category-name-large">Smartphone Services</span>
              </div>
            </button>
            <button
              className="service-category-card"
              onClick={() => setSelectedCategory("computer")}
            >
              <div className="category-icon-box computer">
                <span className="category-emoji">💻</span>
              </div>
              <div className="category-info">
                <span className="category-name-large">Computer Services</span>
              </div>
            </button>
            <button
              className="service-category-card"
              onClick={() => setSelectedCategory("homeTech")}
            >
              <div className="category-icon-box hometech">
                <span className="category-emoji">📺</span>
              </div>
              <div className="category-info">
                <span className="category-name-large">Home Tech Services</span>
              </div>
            </button>
            <button
              className="service-category-card"
              onClick={() => setSelectedCategory("onlineSafety")}
            >
              <div className="category-icon-box safety">
                <span className="category-emoji">🔒</span>
              </div>
              <div className="category-info">
                <span className="category-name-large">Online Safety Services</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {showServiceCategories && selectedCategory && (
        <div className="category-detail-page">
          <button className="back-to-categories-btn" onClick={() => setSelectedCategory(null)}>
            ← Back to Categories
          </button>
          <h3 className="category-requests-title">
            {selectedCategory === "smartphone" && "📱 Smartphone Services"}
            {selectedCategory === "computer" && "💻 Computer Services"}
            {selectedCategory === "homeTech" && "📺 Home Tech Services"}
            {selectedCategory === "onlineSafety" && "🔒 Online Safety Services"}
          </h3>
          <div className="category-services-list">
            <h4>Available Services:</h4>
            <div className="add-service-form">
              <input
                type="text"
                placeholder="Add new service..."
                value={newServiceInput}
                onChange={(e) => setNewServiceInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddService()}
                className="add-service-input"
              />
              <button onClick={handleAddService} className="add-service-btn">
                + Add
              </button>
            </div>
            <ul>
              {selectedCategory === "smartphone" && serviceCategories.Smartphone.map((service, idx) => (
                <li key={idx}>
                  <span>{service}</span>
                  <button className="remove-service-btn" onClick={() => handleRemoveService(service)}>×</button>
                </li>
              ))}
              {selectedCategory === "computer" && serviceCategories.Computer.map((service, idx) => (
                <li key={idx}>
                  <span>{service}</span>
                  <button className="remove-service-btn" onClick={() => handleRemoveService(service)}>×</button>
                </li>
              ))}
              {selectedCategory === "homeTech" && serviceCategories.HomeTech.map((service, idx) => (
                <li key={idx}>
                  <span>{service}</span>
                  <button className="remove-service-btn" onClick={() => handleRemoveService(service)}>×</button>
                </li>
              ))}
              {selectedCategory === "onlineSafety" && serviceCategories.OnlineSafety.map((service, idx) => (
                <li key={idx}>
                  <span>{service}</span>
                  <button className="remove-service-btn" onClick={() => handleRemoveService(service)}>×</button>
                </li>
              ))}
            </ul>
            <div className="save-categories-container">
              <button className="save-categories-btn" onClick={handleSaveCategories}>
                Save Changes
              </button>
              {saveSuccess && <span className="save-success-message">Saved successfully!</span>}
            </div>
          </div>
          <h4 className="category-requests-subtitle">
            Requests for this category ({filteredRequests.length})
          </h4>
        </div>
      )}

      <div className="senior-tech-table-container">
        <table className="senior-tech-table">
          <thead>
            <tr>
              <th>REQUEST ID</th>
              <th>CUSTOMER</th>
              <th>PHONE NUMBER</th>
              <th>SERVICES</th>
              <th>SCHEDULED</th>
              <th>STATUS</th>
              <th>INFORMATION</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={7} className="senior-tech-empty-row">
                  No senior tech service requests yet.
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => {
                const serviceCount =
                  request.services.smartphone.length +
                  request.services.computer.length +
                  request.services.homeTech.length +
                  request.services.onlineSafety.length;
                return (
                  <tr key={request.id} className={request.unread ? "unread" : ""}>
                    <td className="request-id">#{request.id.slice(0, 8).toUpperCase()}</td>
                    <td className="customer-cell">
                      <div className="customer-name">{request.firstName} {request.lastName}</div>
                      <div className="customer-email">{request.email}</div>
                    </td>
                    <td>{request.phone}</td>
                    <td>{serviceCount} service{serviceCount !== 1 ? "s" : ""}</td>
                    <td className="scheduled-cell">
                      <div className="scheduled-date">{request.appointmentDate}</div>
                      <div className="scheduled-time">{request.appointmentTime}</div>
                    </td>
                    <td>
                      <select
                        className={`status-dropdown ${request.status}`}
                        value={request.status}
                        onChange={(e) => handleStatusChange(request.id, e.target.value as SeniorTechRequest["status"])}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="info-btn"
                        onClick={() => handleRequestClick(request)}
                      >
                        Info
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardSeniorTech;
