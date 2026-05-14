"use client";

import { JSX, useState, useEffect } from "react";
import { ShoppingCart, Wrench, MessageSquare, Users, TrendingUp, Eye, MapPin, X, ExternalLink } from "lucide-react";
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

      {/* Google Analytics */}
      <div className="analytics-section">
        <h2 className="analytics-section-title">Google Analytics</h2>
        <div className="ga-card">
          <div className="ga-card-left">
            <svg viewBox="0 0 24 24" className="ga-icon" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <div>
              <p className="ga-card-title">TheTechNextDoor Analytics</p>
              <p className="ga-card-subtitle">View traffic, user behavior, and conversion data</p>
            </div>
          </div>
          <a
            href="https://analytics.google.com/analytics/web/#/p/reports/home"
            target="_blank"
            rel="noopener noreferrer"
            className="ga-open-btn"
          >
            Open GA4 <ExternalLink size={14} />
          </a>
        </div>
        <div className="ga-links">
          <a href="https://analytics.google.com/analytics/web/#/p/reports/realtime" target="_blank" rel="noopener noreferrer" className="ga-link">Real-time</a>
          <a href="https://analytics.google.com/analytics/web/#/p/reports/acquisition" target="_blank" rel="noopener noreferrer" className="ga-link">Acquisition</a>
          <a href="https://analytics.google.com/analytics/web/#/p/reports/engagement" target="_blank" rel="noopener noreferrer" className="ga-link">Engagement</a>
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