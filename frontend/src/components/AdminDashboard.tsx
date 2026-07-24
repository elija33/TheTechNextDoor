import { useState, useEffect } from "react";
import { JSX } from "react";
import { useNavigate } from "react-router-dom";
import { AdminAccount } from "../services/api";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import DashboardOverview from "./dashboard/DashboardOverview";
import DashboardOrders from "./dashboard/DashboardOrders";
import DashboardServices from "./dashboard/DashboardServices";
import DashboardMessages from "./dashboard/DashboardMessages";
import DashboardCarousel from "./dashboard/DashboardCarousel";
import DashboardQuotes from "./dashboard/DashboardQuotes";
import DashboardSeniorTech from "./dashboard/DashboardSeniorTech";
import DashboardVideo from "./dashboard/DashboardVideo";
import DashboardTechnician from "./dashboard/DashboardTechnician";
import DashboardFooter from "./dashboard/DashboardFooter";
import DashboardAdministration from "./dashboard/DashboardAdministration";
import ChangePasswordPrompt from "./ChangePasswordPrompt";
import "../style/AdminDashboard.css";

const SUPER_ADMIN_EMAIL = "amponsaeli@gmail.com";
const SUPER_ADMIN_NAME = "elija amponsah";

function isSuperAdmin(admin: AdminAccount | null): boolean {
  if (!admin) return false;
  if (admin.email?.toLowerCase() === SUPER_ADMIN_EMAIL) return true;
  const fullName = `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim().toLowerCase();
  return fullName === SUPER_ADMIN_NAME;
}

const sectionTitles: Record<string, string> = {
  overview: "Dashboard",
  orders: "Orders",
  services: "Services",
  technician: "Technician Profile",
  messages: "Messages",
  quotes: "Get A Quote",
  seniortech: "Senior Tech Service",
  carousel: "Carousel Images",
  video: "Video",
  footer: "Footer",
  administration: "Administration",
};

function AdminDashboard(): JSX.Element {
  const [activeSection, setActiveSection] = useState("overview");
  const [adminInfo, setAdminInfo] = useState<AdminAccount | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [skipPasswordPrompt, setSkipPasswordPrompt] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("adminInfo");
    let parsed: AdminAccount | null = null;
    try {
      parsed = stored ? JSON.parse(stored) : null;
    } catch {
      parsed = null;
    }

    if (!parsed || !parsed.id) {
      navigate("/admin", { replace: true });
      return;
    }

    setAdminInfo(parsed);
    setCheckingAuth(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminInfo");
    navigate("/admin");
  };

  if (checkingAuth) {
    return <div className="admin-auth-checking" />;
  }

  const canManageAdmins = isSuperAdmin(adminInfo);
  const allowedSections = adminInfo?.allowedSections ?? [];

  const canAccessSection = (section: string): boolean => {
    if (section === "overview") return true;
    if (section === "administration") return canManageAdmins;
    if (canManageAdmins) return true;
    return allowedSections.includes(section);
  };

  const handlePasswordChanged = (updated: AdminAccount) => {
    const merged = { ...adminInfo, ...updated };
    setAdminInfo(merged);
    localStorage.setItem("adminInfo", JSON.stringify(merged));
  };

  const renderSection = () => {
    const section = canAccessSection(activeSection) ? activeSection : "overview";
    switch (section) {
      case "overview":
        return <DashboardOverview />;
      case "orders":
        return <DashboardOrders />;
      case "services":
        return <DashboardServices />;
      case "messages":
        return <DashboardMessages />;
      case "quotes":
        return <DashboardQuotes />;
      case "seniortech":
        return <DashboardSeniorTech />;
      case "carousel":
        return <DashboardCarousel />;
      case "video":
        return <DashboardVideo />;
      case "technician":
        return <DashboardTechnician />;
      case "footer":
        return <DashboardFooter />;
      case "administration":
        return <DashboardAdministration />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="admin-dashboard">
      {adminInfo?.mustChangePassword && !skipPasswordPrompt && (
        <ChangePasswordPrompt
          adminId={adminInfo.id}
          onChanged={handlePasswordChanged}
          onSkip={() => setSkipPasswordPrompt(true)}
        />
      )}

      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
        isSuperAdmin={canManageAdmins}
        allowedSections={allowedSections}
      />

      <div className="admin-dashboard-main">
        <AdminHeader
          title={sectionTitles[activeSection]}
          adminInfo={adminInfo}
          onLogout={handleLogout}
        />

        <div className="admin-dashboard-content">{renderSection()}</div>
      </div>
    </div>
  );
}

export default AdminDashboard;
