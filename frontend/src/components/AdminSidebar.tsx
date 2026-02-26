import { JSX } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Wrench,
  MessageSquare,
  ImageIcon,
  FileText,
  LogOut,
  Users,
  Video,
  PanelBottom,
} from "lucide-react";
import "../style/AdminSidebar.css";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

const navItems = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "services", label: "Services", icon: Wrench },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "quotes", label: "Get A Quote", icon: FileText },
  { id: "seniortech", label: "Senior Tech", icon: Users },
  { id: "carousel", label: "Carousel Images", icon: ImageIcon },
  { id: "video", label: "Video", icon: Video },
  { id: "footer", label: "Footer", icon: PanelBottom },
];

function AdminSidebar({
  activeSection,
  onSectionChange,
  onLogout,
}: AdminSidebarProps): JSX.Element {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">The Tech Next Door</div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-nav-item ${activeSection === item.id ? "active" : ""}`}
            onClick={() => onSectionChange(item.id)}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-logout">
        <button className="sidebar-logout-btn" onClick={onLogout}>
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
