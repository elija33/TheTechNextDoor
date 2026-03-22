import { useState, useEffect } from "react";
import { JSX } from "react";
import "../../style/DashboardOrders.css";
import { getOrders, updateOrderStatus, Order } from "../../utils/orderStorage";
import LocationMap from "../locationMap";

const filters = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

const BASE_COORDS = { lat: 40.1360039, lng: -83.0023984 };

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function DashboardOrders(): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [distanceLoading, setDistanceLoading] = useState(false);

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  useEffect(() => {
    if (!selectedOrder?.streetAddress) {
      setDistance(null);
      return;
    }
    const address = `${selectedOrder.streetAddress}, ${selectedOrder.city}, ${selectedOrder.zipPostalCode}`;
    setDistanceLoading(true);
    setDistance(null);
    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } },
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          const dist = haversineDistance(BASE_COORDS.lat, BASE_COORDS.lng, lat, lon);
          setDistance(`${dist.toFixed(1)} miles from base`);
        } else {
          setDistance("Distance unavailable");
        }
      })
      .catch(() => setDistance("Distance unavailable"))
      .finally(() => setDistanceLoading(false));
  }, [selectedOrder]);

  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter((o) => o.status === activeFilter.toLowerCase());

  const sendStatusNotifications = async (order: Order, newStatus: Order["status"]) => {
    const body = {
      customerName: order.customer,
      model: order.model,
      service: order.service,
      date: order.date,
      time: order.time,
      status: newStatus,
    };

    // Always send email
    fetch("https://api.thetechnextdoors.com/api/email/send-status-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, email: order.email }),
    }).catch((e) => console.error("Failed to send status email:", e));

    // Send SMS only if customer opted in
    if (order.textConfirmation) {
      fetch("https://api.thetechnextdoors.com/api/sms/send-status-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, phoneNumber: order.phone }),
      }).catch((e) => console.error("Failed to send status SMS:", e));
    }
  };

  const handleStatusChange = async (id: string, newStatus: Order["status"]) => {
    const order = orders.find((o) => o.id === id);

    try {
      await updateOrderStatus(id, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
      );
      if (order && (newStatus === "confirmed" || newStatus === "completed" || newStatus === "cancelled")) {
        await sendStatusNotifications(order, newStatus);
      }
    } catch {
      console.error("Failed to update order status");
    }
  };

  return (
    <div className="orders-page">
      <div className="orders-filter-bar">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`orders-filter-btn ${activeFilter === filter ? "active" : ""}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Phone Number</th>
              <th>Service</th>
              <th>Scheduled</th>
              <th>Device</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Information</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={9} className="orders-empty-row">
                  No orders found. Orders from Schedule A Service will appear
                  here.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    <div className="order-customer-name">{order.customer}</div>
                    <div className="order-customer-email">{order.email}</div>
                  </td>
                  <td>{order.phone}</td>
                  <td>{order.service}</td>
                  <td>
                    <div className="order-date">{order.date}</div>
                    <div className="order-time">{order.time}</div>
                  </td>
                  <td>{order.model}</td>
                  <td>{order.amount}</td>
                  <td>
                    <select
                      className={`table-status-select ${order.status}`}
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          e.target.value as Order["status"],
                        )
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="orders-info-btn"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Info
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="orders-info-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="orders-info-modal" onClick={(e) => e.stopPropagation()}>
            <div className="orders-info-modal-header">
              <h3>Order Details - {selectedOrder.id}</h3>
              <button
                className="orders-info-modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                &times;
              </button>
            </div>
            <div className="orders-info-modal-content">
              <div className="orders-info-section">
                <h4>Notes / Message</h4>
                <p className="orders-info-notes">
                  {selectedOrder.notes || "No notes provided"}
                </p>
              </div>
              {selectedOrder.images && selectedOrder.images.length > 0 && (
                <div className="orders-info-section">
                  <h4>Uploaded Images</h4>
                  <div className="orders-info-images">
                    {selectedOrder.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Upload ${index + 1}`}
                        className="orders-info-image"
                      />
                    ))}
                  </div>
                </div>
              )}
              {(!selectedOrder.images || selectedOrder.images.length === 0) && (
                <div className="orders-info-section">
                  <h4>Uploaded Images</h4>
                  <p className="orders-info-notes">No images uploaded</p>
                </div>
              )}
              <div className="orders-info-section">
                <h4>Location</h4>
                {selectedOrder.streetAddress || selectedOrder.city || selectedOrder.zipPostalCode ? (
                  <div className="orders-info-notes">
                    <div>{selectedOrder.streetAddress}</div>
                    <div>{selectedOrder.city}</div>
                    <div>{selectedOrder.zipPostalCode}</div>
                  </div>
                ) : (
                  <p className="orders-info-notes">No location provided</p>
                )}
                <LocationMap />
                <div className="orders-distance">
                  {distanceLoading
                    ? "Calculating distance..."
                    : distance
                      ? `Distance: ${distance}`
                      : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardOrders;
