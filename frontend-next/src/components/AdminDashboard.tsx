"use client";

import { useState, useEffect } from "react";
import { JSX } from "react";
import { useRouter } from "next/navigation";
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
import "../style/AdminDashboard.css";

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
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("adminInfo");
    let parsed: AdminAccount | null = null;
    try {
      parsed = stored ? JSON.parse(stored) : null;
    } catch {
      parsed = null;
    }

    if (!parsed || !parsed.id) {
      router.replace("/admin");
      return;
    }

    setAdminInfo(parsed);
    setCheckingAuth(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminInfo");
    router.push("/admin");
  };

  if (checkingAuth) {
    return <div className="admin-auth-checking" />;
  }

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
      </div>
    </div>
  );
}

export default AdminDashboard;