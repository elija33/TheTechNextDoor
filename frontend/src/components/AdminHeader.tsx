import { JSX } from "react";
import { Bell } from "lucide-react";
import { AdminAccount } from "../services/api";
import "../style/AdminHeader.css";

interface AdminHeaderProps {
  title: string;
  adminInfo: AdminAccount | null;
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
          Log out
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
