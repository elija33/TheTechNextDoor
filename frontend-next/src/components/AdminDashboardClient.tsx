"use client";

import dynamic from "next/dynamic";

// Admin dashboard uses localStorage and other browser-only APIs, so skip SSR.
const AdminDashboard = dynamic(() => import("./AdminDashboard"), {
  ssr: false,
});

export default function AdminDashboardClient() {
  return <AdminDashboard />;
}
