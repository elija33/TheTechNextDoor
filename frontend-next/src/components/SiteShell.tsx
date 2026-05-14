"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import { usePageTracking } from "../hooks/usePageTracking";

/**
 * Mirrors the original App layout: hides the Navbar on admin routes
 * and switches the main wrapper class for the admin dashboard.
 * Also runs the page-tracking analytics hook.
 */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const hideNavbar = pathname.startsWith("/admin");
  const mainClass = pathname === "/admin/dashboard" ? "main-content-admin" : "main-content";
  usePageTracking();

  return (
    <div className="app">
      {!hideNavbar && <Navbar />}
      <main className={mainClass}>{children}</main>
    </div>
  );
}
