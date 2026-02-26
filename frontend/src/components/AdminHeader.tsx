import { JSX } from "react";
import { Bell, LogOut } from "lucide-react";
import "../style/AdminHeader.css";

interface AdminInfo {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  emailOrPhone: string;
}

interface AdminHeaderProps {
  title: string;
  adminInfo: AdminInfo | null;
  onLogout: () => void;
}

function AdminHeader({ title, adminInfo, onLogout }: AdminHeaderProps): JSX.Element {
  const displayName = adminInfo ? `${adminInfo.firstName} ${adminInfo.lastName}` : "Admin";
  const initials = adminInfo ? `${adminInfo.firstName[0]}${adminInfo.lastName[0]}`.toUpperCase() : "A";
  return (
    <header className="admin-header">
      <h1 className="admin-header-title">{title}</h1>

      <div className="admin-header-actions">
        <button className="admin-notification-btn">
          <Bell size={20} />
          <span className="notification-badge" />
        </button>

        <div className="admin-profile">
          <div className="admin-avatar">{initials}</div>
          <span className="admin-name">{displayName}</span>
        </div>

        <button className="admin-header-logout" onClick={onLogout}>
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
