import { JSX, useState, useEffect } from "react";
import {
  getQuoteRequests,
  updateQuoteStatus,
  QuoteRequest,
  getQuoteOptions,
  saveQuoteOptions,
  QuoteOptions,
  getDefaultOptions,
} from "../../utils/quoteStorage";
import { Plus, Trash2, Check, Edit2, X } from "lucide-react";
import "../../style/DashboardQuotes.css";

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

function getStatusColor(status: QuoteRequest["status"]): string {
  switch (status) {
    case "pending":
      return "#f39c12";
    case "reviewed":
      return "#3498db";
    case "completed":
      return "#27ae60";
    default:
      return "#95a5a6";
  }
}

function DashboardQuotes(): JSX.Element {
  const [activeTab, setActiveTab] = useState<"requests" | "options" | "serviceDetails">(
    "requests",
  );
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [filter, setFilter] = useState<"all" | QuoteRequest["status"]>("all");

  // Options state
  const [options, setOptions] = useState<QuoteOptions | null>(null);
  const [newBrand, setNewBrand] = useState("");
  const [selectedBrandForGrouping, setSelectedBrandForGrouping] = useState("");
  const [newGrouping, setNewGrouping] = useState("");
  const [selectedBrandForModel, setSelectedBrandForModel] = useState("");
  const [selectedGroupingForModel, setSelectedGroupingForModel] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newService, setNewService] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastFading, setToastFading] = useState(false);

  // Service editing state
  const [editingService, setEditingService] = useState<string | null>(null);
  const [editedServiceName, setEditedServiceName] = useState("");
  const [editedServiceDescription, setEditedServiceDescription] = useState("");

  // Service descriptions stored in localStorage
  const [serviceDescriptions, setServiceDescriptions] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("serviceDescriptions");
    return saved ? JSON.parse(saved) : {};
  });
  // Service prices stored in localStorage
  const [servicePrices, setServicePrices] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("servicePrices");
    return saved ? JSON.parse(saved) : {};
  });
  const [editedServicePrice, setEditedServicePrice] = useState("");
  const [hasDescriptionChanges, setHasDescriptionChanges] = useState(false);

  useEffect(() => {
    getQuoteRequests().then(setQuotes);
    getQuoteOptions().then(setOptions);
  }, []);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const fadeTimer = setTimeout(() => {
        setToastFading(true);
      }, 2500);
      const hideTimer = setTimeout(() => {
        setShowToast(false);
        setToastFading(false);
      }, 3000);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [showToast]);

  const filteredQuotes =
    filter === "all" ? quotes : quotes.filter((q) => q.status === filter);
  const pendingCount = quotes.filter((q) => q.status === "pending").length;

  const handleStatusChange = async (
    id: string,
    newStatus: QuoteRequest["status"],
  ) => {
    await updateQuoteStatus(id, newStatus);
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q)),
    );
    if (selectedQuote && selectedQuote.id === id) {
      setSelectedQuote({ ...selectedQuote, status: newStatus });
    }
  };

  const handleQuoteClick = (quote: QuoteRequest) => {
    setSelectedQuote(quote);
  };

  const handleCloseDetail = () => {
    setSelectedQuote(null);
  };

  // Options management functions
  const addBrand = () => {
    if (!options || !newBrand.trim()) return;
    if (options.brands.includes(newBrand.trim())) return;
    setOptions({
      ...options,
      brands: [...options.brands, newBrand.trim()],
    });
    setNewBrand("");
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const removeBrand = (brand: string) => {
    if (!options) return;
    setOptions({
      ...options,
      brands: options.brands.filter((b) => b !== brand),
      groupings: options.groupings.filter((g) => g.brand !== brand),
      models: options.models.filter((m) => m.brand !== brand),
    });
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const addGrouping = () => {
    if (!options || !selectedBrandForGrouping || !newGrouping.trim()) return;
    const existingGrouping = options.groupings.find(
      (g) => g.brand === selectedBrandForGrouping,
    );
    if (existingGrouping?.groupings.includes(newGrouping.trim())) return;

    const updatedGroupings = existingGrouping
      ? options.groupings.map((g) =>
          g.brand === selectedBrandForGrouping
            ? { ...g, groupings: [...g.groupings, newGrouping.trim()] }
            : g,
        )
      : [
          ...options.groupings,
          { brand: selectedBrandForGrouping, groupings: [newGrouping.trim()] },
        ];

    setOptions({ ...options, groupings: updatedGroupings });
    setNewGrouping("");
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const removeGrouping = (brand: string, grouping: string) => {
    if (!options) return;
    setOptions({
      ...options,
      groupings: options.groupings
        .map((g) =>
          g.brand === brand
            ? { ...g, groupings: g.groupings.filter((gr) => gr !== grouping) }
            : g,
        )
        .filter((g) => g.groupings.length > 0),
      models: options.models.filter(
        (m) => !(m.brand === brand && m.grouping === grouping),
      ),
    });
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const addModel = () => {
    if (
      !options ||
      !selectedBrandForModel ||
      !selectedGroupingForModel ||
      !newModel.trim()
    )
      return;
    const existingModel = options.models.find(
      (m) =>
        m.brand === selectedBrandForModel &&
        m.grouping === selectedGroupingForModel,
    );
    if (existingModel?.models.includes(newModel.trim())) return;

    const updatedModels = existingModel
      ? options.models.map((m) =>
          m.brand === selectedBrandForModel &&
          m.grouping === selectedGroupingForModel
            ? { ...m, models: [...m.models, newModel.trim()] }
            : m,
        )
      : [
          ...options.models,
          {
            brand: selectedBrandForModel,
            grouping: selectedGroupingForModel,
            models: [newModel.trim()],
          },
        ];

    setOptions({ ...options, models: updatedModels });
    setNewModel("");
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const removeModel = (brand: string, grouping: string, model: string) => {
    if (!options) return;
    setOptions({
      ...options,
      models: options.models
        .map((m) =>
          m.brand === brand && m.grouping === grouping
            ? { ...m, models: m.models.filter((mo) => mo !== model) }
            : m,
        )
        .filter((m) => m.models.length > 0),
    });
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const addService = () => {
    if (!options || !newService.trim()) return;
    if (options.services.includes(newService.trim())) return;
    setOptions({
      ...options,
      services: [...options.services, newService.trim()],
    });
    setNewService("");
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const removeService = (service: string) => {
    if (!options) return;
    setOptions({
      ...options,
      services: options.services.filter((s) => s !== service),
    });
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const startEditingService = (service: string) => {
    setEditingService(service);
    setEditedServiceName(service);
    setEditedServiceDescription(serviceDescriptions[service] || "");
    setEditedServicePrice(servicePrices[service] || "");
  };

  const cancelEditingService = () => {
    setEditingService(null);
    setEditedServiceName("");
    setEditedServiceDescription("");
    setEditedServicePrice("");
  };

  const saveEditedService = () => {
    if (!options || !editingService || !editedServiceName.trim()) return;

    const nameChanged = editedServiceName.trim() !== editingService;
    const descriptionChanged = editedServiceDescription !== (serviceDescriptions[editingService] || "");
    const priceChanged = editedServicePrice !== (servicePrices[editingService] || "");

    // Check if new name already exists (only if name changed)
    if (nameChanged && options.services.includes(editedServiceName.trim())) {
      alert("A service with this name already exists.");
      return;
    }

    // Update service name if changed
    if (nameChanged) {
      setOptions({
        ...options,
        services: options.services.map((s) =>
          s === editingService ? editedServiceName.trim() : s
        ),
      });
      // Move description and price to new name
      const newDescriptions = { ...serviceDescriptions };
      const newPrices = { ...servicePrices };
      delete newDescriptions[editingService];
      delete newPrices[editingService];
      if (editedServiceDescription.trim()) {
        newDescriptions[editedServiceName.trim()] = editedServiceDescription.trim();
      }
      if (editedServicePrice.trim()) {
        newPrices[editedServiceName.trim()] = editedServicePrice.trim();
      }
      setServiceDescriptions(newDescriptions);
      setServicePrices(newPrices);
      setHasChanges(true);
      setSaveSuccess(false);
    } else if (descriptionChanged || priceChanged) {
      // Update description and/or price
      if (descriptionChanged) {
        const newDescriptions = { ...serviceDescriptions };
        if (editedServiceDescription.trim()) {
          newDescriptions[editingService] = editedServiceDescription.trim();
        } else {
          delete newDescriptions[editingService];
        }
        setServiceDescriptions(newDescriptions);
      }
      if (priceChanged) {
        const newPrices = { ...servicePrices };
        if (editedServicePrice.trim()) {
          newPrices[editingService] = editedServicePrice.trim();
        } else {
          delete newPrices[editingService];
        }
        setServicePrices(newPrices);
      }
      setHasDescriptionChanges(true);
    }

    setEditingService(null);
    setEditedServiceName("");
    setEditedServiceDescription("");
    setEditedServicePrice("");
  };

  const saveAllServices = async () => {
    if (!options) return;
    // Save options (services list)
    await saveQuoteOptions(options);
    // Save descriptions and prices to localStorage
    localStorage.setItem("serviceDescriptions", JSON.stringify(serviceDescriptions));
    localStorage.setItem("servicePrices", JSON.stringify(servicePrices));
    setHasChanges(false);
    setHasDescriptionChanges(false);
    setSaveSuccess(true);
    setShowToast(true);
    setToastFading(false);
  };

  const handleSaveOptions = async () => {
    if (!options) return;
    await saveQuoteOptions(options);
    setHasChanges(false);
    setSaveSuccess(true);
    setShowToast(true);
    setToastFading(false);
    console.log("Options saved:", handleSaveOptions);
  };

  const handleResetToDefaults = async () => {
    const defaults = getDefaultOptions();
    setOptions(defaults);
    await saveQuoteOptions(defaults);
    setHasChanges(false);
    setSaveSuccess(true);
    setShowToast(true);
    setToastFading(false);
  };

  const getGroupingsForBrand = (brand: string) => {
    return options?.groupings.find((g) => g.brand === brand)?.groupings || [];
  };

  if (selectedQuote) {
    return (
      <div className="quotes-page">
        <div className="quote-detail-header">
          <button className="quote-back-btn" onClick={handleCloseDetail}>
            ← Back to Quotes
          </button>
        </div>
        <div className="quote-detail">
          <div className="quote-detail-top">
            <div className="quote-avatar">
              {getInitials(selectedQuote.firstName, selectedQuote.lastName)}
            </div>
            <div className="quote-detail-info">
              <h3>
                {selectedQuote.firstName} {selectedQuote.lastName}
              </h3>
              <p className="quote-detail-contact">
                {selectedQuote.email} • {selectedQuote.phone}
              </p>
              <p className="quote-detail-time">
                {formatTimeAgo(selectedQuote.timestamp)}
              </p>
            </div>
            <div className="quote-detail-status">
              <span
                className="quote-status-badge"
                style={{
                  backgroundColor: getStatusColor(selectedQuote.status),
                }}
              >
                {selectedQuote.status.charAt(0).toUpperCase() +
                  selectedQuote.status.slice(1)}
              </span>
            </div>
          </div>
          <div className="quote-detail-body">
            <h4>Device Information</h4>
            <div className="quote-info-grid">
              <div className="quote-info-item">
                <span className="quote-info-label">Brand</span>
                <span className="quote-info-value">{selectedQuote.brand}</span>
              </div>
              <div className="quote-info-item">
                <span className="quote-info-label">Series</span>
                <span className="quote-info-value">
                  {selectedQuote.grouping}
                </span>
              </div>
              <div className="quote-info-item">
                <span className="quote-info-label">Model</span>
                <span className="quote-info-value">{selectedQuote.model}</span>
              </div>
              <div className="quote-info-item">
                <span className="quote-info-label">Service Needed</span>
                <span className="quote-info-value">
                  {selectedQuote.service}
                </span>
              </div>
            </div>
          </div>
          <div className="quote-detail-actions">
            <h4>Update Status</h4>
            <div className="quote-status-buttons">
              <button
                className={`quote-status-btn ${selectedQuote.status === "pending" ? "active" : ""}`}
                onClick={() => handleStatusChange(selectedQuote.id, "pending")}
              >
                Pending
              </button>
              <button
                className={`quote-status-btn ${selectedQuote.status === "reviewed" ? "active" : ""}`}
                onClick={() => handleStatusChange(selectedQuote.id, "reviewed")}
              >
                Reviewed
              </button>
              <button
                className={`quote-status-btn ${selectedQuote.status === "completed" ? "active" : ""}`}
                onClick={() =>
                  handleStatusChange(selectedQuote.id, "completed")
                }
              >
                Completed
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quotes-page">
      <div className="quotes-tabs">
        <button
          className={`quotes-tab ${activeTab === "requests" ? "active" : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          Quote Requests ({pendingCount} pending)
        </button>
        <button
          className={`quotes-tab ${activeTab === "options" ? "active" : ""}`}
          onClick={() => setActiveTab("options")}
        >
          Manage Options
        </button>
        <button
          className={`quotes-tab ${activeTab === "serviceDetails" ? "active" : ""}`}
          onClick={() => setActiveTab("serviceDetails")}
        >
          Service Details
        </button>
      </div>

      {activeTab === "requests" && (
        <>
          <div className="quotes-filter">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All ({quotes.length})
            </button>
            <button
              className={`filter-btn ${filter === "pending" ? "active" : ""}`}
              onClick={() => setFilter("pending")}
            >
              Pending ({quotes.filter((q) => q.status === "pending").length})
            </button>
            <button
              className={`filter-btn ${filter === "reviewed" ? "active" : ""}`}
              onClick={() => setFilter("reviewed")}
            >
              Reviewed ({quotes.filter((q) => q.status === "reviewed").length})
            </button>
            <button
              className={`filter-btn ${filter === "completed" ? "active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              Completed ({quotes.filter((q) => q.status === "completed").length}
              )
            </button>
          </div>

          {filteredQuotes.length === 0 ? (
            <div className="quotes-empty">
              No quote requests yet. Quote requests from the Get A Quote page
              will appear here.
            </div>
          ) : (
            <div className="quotes-list">
              {filteredQuotes.map((quote) => (
                <div
                  className="quote-item"
                  key={quote.id}
                  onClick={() => handleQuoteClick(quote)}
                >
                  <div className="quote-avatar">
                    {getInitials(quote.firstName, quote.lastName)}
                  </div>
                  <div className="quote-content">
                    <div className="quote-header">
                      <span className="quote-sender">
                        {quote.firstName} {quote.lastName}
                      </span>
                      <span className="quote-time">
                        {formatTimeAgo(quote.timestamp)}
                      </span>
                    </div>
                    <div className="quote-device">
                      {quote.brand} {quote.model}
                    </div>
                    <div className="quote-service">{quote.service}</div>
                  </div>
                  <span
                    className="quote-status-badge"
                    style={{ backgroundColor: getStatusColor(quote.status) }}
                  >
                    {quote.status.charAt(0).toUpperCase() +
                      quote.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "options" && (
        <div className="options-manager">
          {/* Brands Section */}
          <div className="options-section">
            <h3>Brands</h3>
            <div className="options-add-row">
              <input
                type="text"
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                placeholder="Enter brand name"
                className="options-input"
              />
              <button className="options-add-btn" onClick={addBrand}>
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="options-list">
              {options?.brands.map((brand) => (
                <div key={brand} className="options-item">
                  <span>{brand}</span>
                  <button
                    className="options-remove-btn"
                    onClick={() => removeBrand(brand)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Groupings Section */}
          <div className="options-section">
            <h3>Groupings (Series)</h3>
            <div className="options-add-row">
              <select
                value={selectedBrandForGrouping}
                onChange={(e) => setSelectedBrandForGrouping(e.target.value)}
                className="options-select"
              >
                <option value="">Select Brand</option>
                {options?.brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newGrouping}
                onChange={(e) => setNewGrouping(e.target.value)}
                placeholder="Enter grouping name"
                className="options-input"
                disabled={!selectedBrandForGrouping}
              />
              <button
                className="options-add-btn"
                onClick={addGrouping}
                disabled={!selectedBrandForGrouping}
              >
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="options-list">
              {options?.groupings.map((g) =>
                g.groupings.map((grouping) => (
                  <div key={`${g.brand}-${grouping}`} className="options-item">
                    <span>
                      <strong>{g.brand}</strong> → {grouping}
                    </span>
                    <button
                      className="options-remove-btn"
                      onClick={() => removeGrouping(g.brand, grouping)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )),
              )}
            </div>
          </div>

          {/* Models Section */}
          <div className="options-section">
            <h3>Models</h3>
            <div className="options-add-row">
              <select
                value={selectedBrandForModel}
                onChange={(e) => {
                  setSelectedBrandForModel(e.target.value);
                  setSelectedGroupingForModel("");
                }}
                className="options-select"
              >
                <option value="">Select Brand</option>
                {options?.brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              <select
                value={selectedGroupingForModel}
                onChange={(e) => setSelectedGroupingForModel(e.target.value)}
                className="options-select"
                disabled={!selectedBrandForModel}
              >
                <option value="">Select Grouping</option>
                {getGroupingsForBrand(selectedBrandForModel).map((grouping) => (
                  <option key={grouping} value={grouping}>
                    {grouping}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newModel}
                onChange={(e) => setNewModel(e.target.value)}
                placeholder="Enter model name"
                className="options-input"
                disabled={!selectedGroupingForModel}
              />
              <button
                className="options-add-btn"
                onClick={addModel}
                disabled={!selectedGroupingForModel}
              >
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="options-list options-list-models">
              {options?.models.map((m) =>
                m.models.map((model) => (
                  <div
                    key={`${m.brand}-${m.grouping}-${model}`}
                    className="options-item"
                  >
                    <span>
                      <strong>{m.brand}</strong> → {m.grouping} → {model}
                    </span>
                    <button
                      className="options-remove-btn"
                      onClick={() => removeModel(m.brand, m.grouping, model)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )),
              )}
            </div>
          </div>

          {/* Services Section */}
          <div className="options-section">
            <h3>Services</h3>
            <div className="options-add-row">
              <input
                type="text"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="Enter service name"
                className="options-input"
              />
              <button className="options-add-btn" onClick={addService}>
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="options-list">
              {options?.services.map((service) => (
                <div key={service} className="options-item">
                  <span>{service}</span>
                  <button
                    className="options-remove-btn"
                    onClick={() => removeService(service)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="options-save-area">
            <button
              className="options-save-btn"
              onClick={handleSaveOptions}
              disabled={!hasChanges}
            >
              Save Changes
            </button>
            <button
              className="options-reset-btn"
              onClick={handleResetToDefaults}
            >
              Reset to Defaults
            </button>
            {saveSuccess && (
              <span className="options-save-success">
                Options saved successfully!
              </span>
            )}
          </div>
        </div>
      )}

      {activeTab === "serviceDetails" && (
        <div className="service-details-manager">
          <button
            className="service-details-back-btn"
            onClick={() => setActiveTab("requests")}
          >
            ← Back to Quote Requests
          </button>
          <div className="options-section">
            <h3>Service Details</h3>
            <p className="service-details-description">
              Manage service pricing, descriptions, and details for your repair services.
            </p>
            <div className="options-add-row">
              <input
                type="text"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="Enter new service name"
                className="options-input"
                onKeyDown={(e) => e.key === "Enter" && addService()}
              />
              <button className="options-add-btn" onClick={addService}>
                <Plus size={16} /> Add Service
              </button>
            </div>
            {options?.services.length === 0 ? (
              <div className="service-details-empty">
                No services yet. Add your first service above.
              </div>
            ) : (
              <div className="service-details-list">
                {options?.services.map((service) => (
                  <div key={service} className={`service-detail-card ${editingService === service ? "editing" : ""}`}>
                    <div className="service-detail-header">
                      {editingService === service ? (
                        <>
                          <input
                            type="text"
                            value={editedServiceName}
                            onChange={(e) => setEditedServiceName(e.target.value)}
                            className="service-edit-input"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEditedService();
                              if (e.key === "Escape") cancelEditingService();
                            }}
                          />
                          <div className="service-edit-actions">
                            <button
                              className="service-edit-save-btn"
                              onClick={saveEditedService}
                              title="Save"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              className="service-edit-cancel-btn"
                              onClick={cancelEditingService}
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="service-detail-name">{service}</span>
                          <div className="service-detail-actions">
                            <button
                              className="service-detail-edit-btn"
                              onClick={() => startEditingService(service)}
                              title="Edit service"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className="service-detail-remove-btn"
                              onClick={() => removeService(service)}
                              title="Remove service"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="service-detail-body">
                      {editingService === service ? (
                        <>
                          <textarea
                            value={editedServiceDescription}
                            onChange={(e) => setEditedServiceDescription(e.target.value)}
                            className="service-edit-textarea"
                            placeholder="Add a description for this service..."
                            rows={3}
                          />
                          <div className="service-price-row">
                            <label className="service-price-label">Price:</label>
                            <input
                              type="text"
                              value={editedServicePrice}
                              onChange={(e) => setEditedServicePrice(e.target.value)}
                              className="service-edit-price"
                              placeholder="e.g., $49.99"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <p className={`service-detail-description ${!serviceDescriptions[service] ? "placeholder" : ""}`}>
                            {serviceDescriptions[service] || "Click the edit icon to add a description."}
                          </p>
                          {servicePrices[service] && (
                            <p className="service-detail-price">{servicePrices[service]}</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="service-details-save-area">
              <button
                className="service-details-save-btn"
                onClick={saveAllServices}
                disabled={!hasChanges && !hasDescriptionChanges}
              >
                <Check size={16} /> Save All Services
              </button>
              {(hasChanges || hasDescriptionChanges) && (
                <span className="service-details-unsaved">Unsaved changes</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {showToast && (
        <div className={`options-toast ${toastFading ? "fade-out" : ""}`}>
          <div className="options-toast-icon">
            <Check size={20} />
          </div>
          <span className="options-toast-message">
            Options saved successfully!
          </span>
        </div>
      )}
    </div>
  );
}

export default DashboardQuotes;
