import { JSX, useState, useEffect } from "react";
import { ShoppingCart, Wrench, MessageSquare, Users, TrendingUp, Eye, MapPin, X } from "lucide-react";
import "../../style/DashboardOverview.css";
import { repairOrdersApi, repairServicesApi, contactMessagesApi, analyticsApi, AnalyticsSummary } from "../../services/api";

const PAGE_LABELS: Record<string, string> = {
  "/": "Home",
  "/contactus": "Contact Us",
  "/getaquote": "Get A Quote",
  "/senior-tech-service": "Senior Tech Service",
};

function DashboardOverview(): JSX.Element {
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [activeServices, setActiveServices] = useState<number | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<number | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [recentOrders, setRecentOrders] = useState<{ id: string; customer: string; service: string; date: string; amount: string; status: string }[]>([]);
  const [showLocations, setShowLocations] = useState(false);

  useEffect(() => {
    repairOrdersApi.getAll()
      .then((res) => {
        const orders = res.data as { id: string; customer: string; service: string; date: string; amount: string; status: string; timestamp: number }[];
        setTotalOrders(orders.length);
        const sorted = [...orders].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).slice(0, 5);
        setRecentOrders(sorted);
      })
      .catch(() => setTotalOrders(0));

    repairServicesApi.getAll()
      .then((res) => setActiveServices((res.data as unknown[]).length))
      .catch(() => setActiveServices(0));

    contactMessagesApi.getAll()
      .then((res) => {
        const msgs = res.data as { read?: boolean }[];
        setUnreadMessages(msgs.filter((m) => !m.read).length);
      })
      .catch(() => setUnreadMessages(0));

    analyticsApi.getSummary()
      .then((res) => setAnalytics(res.data))
      .catch(() => setAnalytics({ totalVisits: 0, todayVisits: 0, weekVisits: 0, topPages: [], todayLocations: [] }));
  }, []);

  const maxPageCount = analytics?.topPages?.[0]?.count ?? 1;

  return (
    <div className="overview-container">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon orders">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-info">
            <h3>{totalOrders ?? "—"}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon services">
            <Wrench size={24} />
          </div>
          <div className="stat-info">
            <h3>{activeServices ?? "—"}</h3>
            <p>Active Services</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon messages">
            <MessageSquare size={24} />
          </div>
          <div className="stat-info">
            <h3>{unreadMessages ?? "—"}</h3>
            <p>Unread Messages</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon visits">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>{analytics?.totalVisits ?? "—"}</h3>
            <p>Total Visits</p>
          </div>
        </div>
      </div>

      {/* Site Analytics */}
      <div className="analytics-section">
        <h2 className="analytics-section-title">Site Analytics</h2>

        <div className="analytics-visit-cards">
          <div
            className="analytics-visit-card analytics-visit-card--clickable"
            onClick={() => setShowLocations(!showLocations)}
            title="Click to see today's visitor locations"
          >
            <Eye size={18} className="analytics-visit-icon" />
            <div>
              <span className="analytics-visit-number">{analytics?.todayVisits ?? "—"}</span>
              <span className="analytics-visit-label">Today</span>
            </div>
            <MapPin size={14} className="analytics-location-hint" />
          </div>

          {showLocations && (
            <div className="analytics-locations-panel">
              <div className="analytics-locations-header">
                <span>Today's Visitor Locations</span>
                <button className="analytics-locations-close" onClick={() => setShowLocations(false)}>
                  <X size={14} />
                </button>
              </div>
              {!analytics?.todayLocations?.length ? (
                <p className="analytics-empty">No location data yet for today.</p>
              ) : (
                analytics.todayLocations.map((loc) => (
                  <div key={loc.city} className="analytics-location-row">
                    <MapPin size={13} className="analytics-location-pin" />
                    <span className="analytics-location-city">{loc.city}</span>
                    <span className="analytics-location-count">{loc.count}</span>
                  </div>
                ))
              )}
            </div>
          )}
          <div className="analytics-visit-card">
            <TrendingUp size={18} className="analytics-visit-icon" />
            <div>
              <span className="analytics-visit-number">{analytics?.weekVisits ?? "—"}</span>
              <span className="analytics-visit-label">Last 7 Days</span>
            </div>
          </div>
          <div className="analytics-visit-card">
            <Users size={18} className="analytics-visit-icon" />
            <div>
              <span className="analytics-visit-number">{analytics?.totalVisits ?? "—"}</span>
              <span className="analytics-visit-label">All Time</span>
            </div>
          </div>
        </div>

        <div className="analytics-pages-section">
          <h3 className="analytics-pages-title">Most Visited Pages</h3>
          {(!analytics || analytics.topPages.length === 0) ? (
            <p className="analytics-empty">No visits recorded yet. Data will appear as users browse the site.</p>
          ) : (
            <div className="analytics-pages-list">
              {analytics.topPages.map((entry) => {
                const label = PAGE_LABELS[entry.page] ?? entry.page;
                const pct = Math.round((entry.count / maxPageCount) * 100);
                return (
                  <div key={entry.page} className="analytics-page-row">
                    <span className="analytics-page-name">{label}</span>
                    <div className="analytics-bar-wrap">
                      <div className="analytics-bar" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="analytics-page-count">{entry.count.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="recent-orders-section">
        <h2>Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="analytics-empty">No orders yet.</p>
        ) : (
          <table className="recent-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id.slice(0, 8)}</td>
                  <td>{order.customer}</td>
                  <td>{order.service}</td>
                  <td>{order.date}</td>
                  <td>{order.amount}</td>
                  <td>
                    <span className={`table-status ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DashboardOverview;
