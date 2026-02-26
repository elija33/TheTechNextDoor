import { useState } from "react";
import { JSX } from "react";
import { useNavigate } from "react-router-dom";
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
import "../style/AdminDashboard.css";
import DashboardFooter from "./dashboard/DashboardFooter";

const sectionTitles: Record<string, string> = {
  overview: "Dashboard",
  orders: "Orders",
  services: "Services",
  messages: "Messages",
  quotes: "Get A Quote",
  seniortech: "Senior Tech Service",
  carousel: "Carousel Images",
  video: "Video",
  footer: "Footer",
};

interface AdminInfo {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  emailOrPhone: string;
}

function AdminDashboard(): JSX.Element {
  const [activeSection, setActiveSection] = useState("overview");
  const navigate = useNavigate();

  const stored = localStorage.getItem("adminInfo");
  const adminInfo: AdminInfo | null = stored ? JSON.parse(stored) : null;

  const handleLogout = () => {
    navigate("/admin");
  };

  const renderSection = () => {
    switch (activeSection) {
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
      case "footer":
        return <DashboardFooter />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      />

      <div className="admin-dashboard-main">
        <AdminHeader
          title={sectionTitles[activeSection]}
          adminInfo={adminInfo}
          onLogout={handleLogout}
        />

        <div className="admin-dashboard-content">{renderSection()}</div>
        <DashboardFooter />
      </div>
    </div>
  );
}

export default AdminDashboard;
