import { JSX } from "react";
import { ShoppingCart, Wrench, MessageSquare, DollarSign } from "lucide-react";
import "../../style/DashboardOverview.css";

const recentOrders = [
  { id: "#ORD-001", customer: "John Smith", service: "Screen Repair", date: "Jan 28, 2026", amount: "$89.99", status: "completed" },
  { id: "#ORD-002", customer: "Sarah Johnson", service: "Battery Replacement", date: "Jan 29, 2026", amount: "$49.99", status: "confirmed" },
  { id: "#ORD-004", customer: "Emily Brown", service: "Charging Port Fix", date: "Jan 31, 2026", amount: "$39.99", status: "completed" },
  { id: "#ORD-005", customer: "Chris Wilson", service: "Screen Repair", date: "Feb 1, 2026", amount: "$89.99", status: "cancelled" },
];

function DashboardOverview(): JSX.Element {
  return (
    <div className="overview-container">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon orders">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-info">
            <h3>24</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon services">
            <Wrench size={24} />
          </div>
          <div className="stat-info">
            <h3>8</h3>
            <p>Active Services</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon messages">
            <MessageSquare size={24} />
          </div>
          <div className="stat-info">
            <h3>5</h3>
            <p>Unread Messages</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <h3>$2,450</h3>
            <p>Revenue</p>
          </div>
        </div>
      </div>

      <div className="recent-orders-section">
        <h2>Recent Orders</h2>
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
                <td>{order.id}</td>
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
      </div>
    </div>
  );
}

export default DashboardOverview;
