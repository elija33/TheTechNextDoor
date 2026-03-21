import { JSX, useState, useEffect } from "react";
import { Plus, Edit, Trash2, Smartphone, X, Check, Save, Monitor, Tablet, Laptop, Watch, Headphones, Tv, Camera, Gamepad2, Speaker, Printer, Cpu, HardDrive, Wifi, Battery, Wrench, Settings, Zap } from "lucide-react";
import "../../style/DashboardServices.css";
import { getServices, saveService, Service } from "../../utils/serviceStorage";
import { serviceCardsApi } from "../../services/api";

// Icon options for service cards
const ICON_OPTIONS: Array<{ name: string; icon?: typeof Smartphone; emoji?: string }> = [
  { name: "Smartphone", icon: Smartphone },
  { name: "Tablet", icon: Tablet },
  { name: "Laptop", icon: Laptop },
  { name: "Monitor", icon: Monitor },
  { name: "Watch", icon: Watch },
  { name: "Headphones", icon: Headphones },
  { name: "TV", icon: Tv },
  { name: "Camera", icon: Camera },
  { name: "Gamepad", icon: Gamepad2 },
  { name: "Speaker", icon: Speaker },
  { name: "Printer", icon: Printer },
  { name: "CPU", icon: Cpu },
  { name: "Hard Drive", icon: HardDrive },
  { name: "Wifi", icon: Wifi },
  { name: "Battery", icon: Battery },
  { name: "Wrench", icon: Wrench },
  { name: "Settings", icon: Settings },
  { name: "Power", icon: Zap },
  // Emoji icons
  { name: "Price Tag", emoji: "🏷️" },
  { name: "Target", emoji: "🎯" },
  { name: "Mobile", emoji: "📱" },
  { name: "Repair", emoji: "🛠️⚡️" },
];

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const SERVICE_TYPES = [
  "All",
  "Screen Repair",
  "Battery Replacement",
  "Charging Port Fix",
  "Speaker Repair",
  "Camera Fix",
  "Back Glass Repair",
  "Software Troubleshooting",
] as const;

type ServiceFilter = typeof SERVICE_TYPES[number];

interface LocalService {
  id: number;
  name: string;
  description: string;
  price: string;
  image: null;
}

function DashboardServices(): JSX.Element {
  const [activeTab, setActiveTab] = useState<"manage" | "cards">("manage");
  const [services, setServices] = useState<LocalService[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState({ name: "", description: "", price: "" });
  const [editingService, setEditingService] = useState<{ id: number; name: string; description: string; price: string } | null>(null);
  const [filter, setFilter] = useState<ServiceFilter>("All");
  const [hasChanges, setHasChanges] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastFading, setToastFading] = useState(false);

  // Service Cards state
  const [serviceCards, setServiceCards] = useState<ServiceCard[]>([]);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCard, setNewCard] = useState({ title: "", description: "", icon: "Smartphone" });
  const [editingCard, setEditingCard] = useState<ServiceCard | null>(null);
  const [hasCardChanges, setHasCardChanges] = useState(false);

  // Load service cards from API on mount
  useEffect(() => {
    serviceCardsApi.getAll().then((response) => {
      setServiceCards(response.data as ServiceCard[]);
    }).catch(() => {});
  }, []);

  // Load services from IndexedDB on mount
  useEffect(() => {
    getServices().then((storedServices) => {
      const mappedServices = storedServices.map((s) => ({
        id: parseInt(s.id) || Date.now(),
        name: s.name,
        description: s.description,
        price: s.price,
        image: null,
      }));
      if (mappedServices.length > 0) {
        setServices(mappedServices);
      }
    });
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

  const filteredServices = filter === "All"
    ? services
    : services.filter((s) => s.name.toLowerCase().includes(filter.toLowerCase()));

  const handleSaveAll = async () => {
    for (const service of services) {
      const serviceToSave: Service = {
        id: service.id.toString(),
        name: service.name,
        description: service.description,
        price: service.price,
      };
      await saveService(serviceToSave);
    }
    setHasChanges(false);
    setShowToast(true);
    setToastFading(false);
  };

  const handleAddService = () => {
    if (!newService.name.trim() || !newService.description.trim() || !newService.price.trim()) {
      return;
    }

    const service = {
      id: Date.now(),
      name: newService.name.trim(),
      description: newService.description.trim(),
      price: newService.price.trim(),
      image: null,
    };

    setServices((prev) => [...prev, service]);
    setNewService({ name: "", description: "", price: "" });
    setShowAddModal(false);
    setHasChanges(true);
  };

  const handleEditClick = (service: LocalService) => {
    setEditingService({
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
    });
  };

  const handleSaveEdit = () => {
    if (!editingService || !editingService.name.trim() || !editingService.description.trim() || !editingService.price.trim()) {
      return;
    }

    setServices((prev) =>
      prev.map((s) =>
        s.id === editingService.id
          ? { ...s, name: editingService.name.trim(), description: editingService.description.trim(), price: editingService.price.trim() }
          : s
      )
    );
    setEditingService(null);
    setHasChanges(true);
  };

  const handleDeleteService = (id: number) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    setHasChanges(true);
  };

  const isAddValid = newService.name.trim() && newService.description.trim() && newService.price.trim();
  const isEditValid = editingService && editingService.name.trim() && editingService.description.trim() && editingService.price.trim();

  // Service Cards handlers
  const handleAddCard = () => {
    if (!newCard.title.trim() || !newCard.description.trim()) return;

    const card: ServiceCard = {
      id: Date.now().toString(),
      title: newCard.title.trim(),
      description: newCard.description.trim(),
      icon: newCard.icon,
    };

    setServiceCards((prev) => [...prev, card]);
    setNewCard({ title: "", description: "", icon: "Smartphone" });
    setShowAddCardModal(false);
    setHasCardChanges(true);
  };

  const handleEditCardClick = (card: ServiceCard) => {
    setEditingCard({ ...card });
  };

  const handleSaveCardEdit = () => {
    if (!editingCard || !editingCard.title.trim() || !editingCard.description.trim()) return;

    setServiceCards((prev) =>
      prev.map((c) =>
        c.id === editingCard.id
          ? { ...c, title: editingCard.title.trim(), description: editingCard.description.trim(), icon: editingCard.icon }
          : c
      )
    );
    setEditingCard(null);
    setHasCardChanges(true);
  };

  const handleDeleteCard = (id: string) => {
    setServiceCards((prev) => prev.filter((c) => c.id !== id));
    setHasCardChanges(true);
  };

  const handleSaveAllCards = async () => {
    // Convert icon names to display emojis for the public page
    const cardsToSave = serviceCards.map((card) => ({
      ...card,
      icon: getDisplayIcon(card.icon),
    }));
    await serviceCardsApi.saveAll(cardsToSave);
    setHasCardChanges(false);
    setShowToast(true);
    setToastFading(false);
  };

  const getIconOption = (iconName: string) => {
    return ICON_OPTIONS.find((opt) => opt.name === iconName) || ICON_OPTIONS[0];
  };

  // Get the display icon (emoji string) for saving to localStorage
  const getDisplayIcon = (iconName: string): string => {
    const opt = ICON_OPTIONS.find((o) => o.name === iconName);
    if (opt?.emoji) return opt.emoji;
    // For lucide icons, return a default emoji based on name
    const emojiMap: Record<string, string> = {
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
    };
    return emojiMap[iconName] || "📱";
  };

  const isAddCardValid = newCard.title.trim() && newCard.description.trim();
  const isEditCardValid = editingCard && editingCard.title.trim() && editingCard.description.trim();

  return (
    <div className="services-page">
      <div className="services-tabs">
        <button
          className={`services-tab ${activeTab === "manage" ? "active" : ""}`}
          onClick={() => setActiveTab("manage")}
        >
          Manage Services
        </button>
        <button
          className={`services-tab ${activeTab === "cards" ? "active" : ""}`}
          onClick={() => setActiveTab("cards")}
        >
          Services Card
        </button>
      </div>

      {activeTab === "manage" && (
        <>
          <div className="services-page-header">
            <h2>Manage Services ({services.length})</h2>
            <div className="services-header-actions">
              <button className="add-service-btn" onClick={() => setShowAddModal(true)}>
                <Plus size={18} />
                Add Service
              </button>
              <button
                className="save-services-btn"
                onClick={handleSaveAll}
                disabled={!hasChanges}
              >
                <Save size={18} />
                Save All
              </button>
            </div>
          </div>

          <div className="services-filter-buttons">
        {SERVICE_TYPES.map((type) => (
          <button
            key={type}
            className={`filter-btn ${filter === type ? "active" : ""}`}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

          <div className="services-grid">
            {filteredServices.map((service) => (
              <div className="service-card" key={service.id}>
                <div className="service-card-image">
                  <Smartphone size={40} />
                </div>
                <div className="service-card-body">
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <div className="service-card-price">{service.price}</div>
                  <div className="service-card-actions">
                    <button className="service-edit-btn" onClick={() => handleEditClick(service)}>
                      <Edit size={14} />
                      Edit
                    </button>
                    <button className="service-delete-btn" onClick={() => handleDeleteService(service.id)}>
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showAddModal && (
        <div className="service-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="service-modal" onClick={(e) => e.stopPropagation()}>
            <div className="service-modal-header">
              <h3>Add New Service</h3>
              <button className="service-modal-close" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="service-modal-body">
              <div className="service-form-group">
                <label>Service Name</label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  placeholder="e.g., Screen Repair"
                />
              </div>
              <div className="service-form-group">
                <label>Description</label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Describe the service..."
                />
              </div>
              <div className="service-form-group">
                <label>Price</label>
                <input
                  type="text"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  placeholder="e.g., $89.99"
                />
              </div>
            </div>
            <div className="service-modal-footer">
              <button className="service-modal-cancel" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="service-modal-save" onClick={handleAddService} disabled={!isAddValid}>
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}

      {editingService && (
        <div className="service-modal-overlay" onClick={() => setEditingService(null)}>
          <div className="service-modal" onClick={(e) => e.stopPropagation()}>
            <div className="service-modal-header">
              <h3>Edit Service</h3>
              <button className="service-modal-close" onClick={() => setEditingService(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="service-modal-body">
              <div className="service-form-group">
                <label>Service Name</label>
                <input
                  type="text"
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  placeholder="e.g., Screen Repair"
                />
              </div>
              <div className="service-form-group">
                <label>Description</label>
                <textarea
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  placeholder="Describe the service..."
                />
              </div>
              <div className="service-form-group">
                <label>Price</label>
                <input
                  type="text"
                  value={editingService.price}
                  onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                  placeholder="e.g., $89.99"
                />
              </div>
            </div>
            <div className="service-modal-footer">
              <button className="service-modal-cancel" onClick={() => setEditingService(null)}>
                Cancel
              </button>
              <button className="service-modal-save" onClick={handleSaveEdit} disabled={!isEditValid}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

        </>
      )}

      {activeTab === "cards" && (
        <>
          <div className="services-page-header">
            <h2>Service Cards ({serviceCards.length})</h2>
            <div className="services-header-actions">
              <button className="add-service-btn" onClick={() => setShowAddCardModal(true)}>
                <Plus size={18} />
                Add Card
              </button>
              <button
                className="save-services-btn"
                onClick={handleSaveAllCards}
                disabled={!hasCardChanges}
              >
                <Save size={18} />
                Save All
              </button>
            </div>
          </div>

          <div className="service-cards-grid">
            {serviceCards.map((card) => {
              const iconOpt = getIconOption(card.icon);
              return (
                <div className="service-display-card" key={card.id}>
                  <div className="service-display-icon">
                    {iconOpt.emoji ? (
                      <span className="emoji-icon">{iconOpt.emoji}</span>
                    ) : iconOpt.icon ? (
                      <iconOpt.icon size={48} />
                    ) : null}
                  </div>
                  <h3 className="service-display-title">{card.title}</h3>
                  <div className="service-display-line"></div>
                  <p className="service-display-description">{card.description}</p>
                  <div className="service-card-actions">
                    <button className="service-edit-btn" onClick={() => handleEditCardClick(card)}>
                      <Edit size={14} />
                      Edit
                    </button>
                    <button className="service-delete-btn" onClick={() => handleDeleteCard(card.id)}>
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {showAddCardModal && (
            <div className="service-modal-overlay" onClick={() => setShowAddCardModal(false)}>
              <div className="service-modal" onClick={(e) => e.stopPropagation()}>
                <div className="service-modal-header">
                  <h3>Add New Card</h3>
                  <button className="service-modal-close" onClick={() => setShowAddCardModal(false)}>
                    <X size={20} />
                  </button>
                </div>
                <div className="service-modal-body">
                  <div className="service-form-group">
                    <label>Icon</label>
                    <div className="icon-selector">
                      {ICON_OPTIONS.map((opt) => {
                        return (
                          <button
                            key={opt.name}
                            type="button"
                            className={`icon-option ${newCard.icon === opt.name ? "selected" : ""}`}
                            onClick={() => setNewCard({ ...newCard, icon: opt.name })}
                          >
                            {opt.emoji ? (
                              <span className="emoji-icon-sm">{opt.emoji}</span>
                            ) : opt.icon ? (
                              <opt.icon size={24} />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="service-form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={newCard.title}
                      onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                      placeholder="e.g., Phone Repair"
                    />
                  </div>
                  <div className="service-form-group">
                    <label>Description</label>
                    <textarea
                      value={newCard.description}
                      onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                      placeholder="Describe the service..."
                    />
                  </div>
                </div>
                <div className="service-modal-footer">
                  <button className="service-modal-cancel" onClick={() => setShowAddCardModal(false)}>
                    Cancel
                  </button>
                  <button className="service-modal-save" onClick={handleAddCard} disabled={!isAddCardValid}>
                    Add Card
                  </button>
                </div>
              </div>
            </div>
          )}

          {editingCard && (
            <div className="service-modal-overlay" onClick={() => setEditingCard(null)}>
              <div className="service-modal" onClick={(e) => e.stopPropagation()}>
                <div className="service-modal-header">
                  <h3>Edit Card</h3>
                  <button className="service-modal-close" onClick={() => setEditingCard(null)}>
                    <X size={20} />
                  </button>
                </div>
                <div className="service-modal-body">
                  <div className="service-form-group">
                    <label>Icon</label>
                    <div className="icon-selector">
                      {ICON_OPTIONS.map((opt) => {
                        return (
                          <button
                            key={opt.name}
                            type="button"
                            className={`icon-option ${editingCard.icon === opt.name ? "selected" : ""}`}
                            onClick={() => setEditingCard({ ...editingCard, icon: opt.name })}
                          >
                            {opt.emoji ? (
                              <span className="emoji-icon-sm">{opt.emoji}</span>
                            ) : opt.icon ? (
                              <opt.icon size={24} />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="service-form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={editingCard.title}
                      onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                    />
                  </div>
                  <div className="service-form-group">
                    <label>Description</label>
                    <textarea
                      value={editingCard.description}
                      onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="service-modal-footer">
                  <button className="service-modal-cancel" onClick={() => setEditingCard(null)}>
                    Cancel
                  </button>
                  <button className="service-modal-save" onClick={handleSaveCardEdit} disabled={!isEditCardValid}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {showToast && (
        <div className={`services-toast ${toastFading ? "fade-out" : ""}`}>
          <div className="services-toast-icon">
            <Check size={20} />
          </div>
          <span className="services-toast-message">Services saved successfully!</span>
        </div>
      )}
    </div>
  );
}

export default DashboardServices;
