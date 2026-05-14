import AdminDashboardClient from "@/components/AdminDashboardClient";

export const metadata = { robots: { index: false, follow: false } };

export const dynamic = "force-dynamic";

export default function Page() {
  return <AdminDashboardClient />;
}
