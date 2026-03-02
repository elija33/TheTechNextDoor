import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import "./App.css";

const Home              = lazy(() => import("./components/Home"));
const Contact           = lazy(() => import("./components/Contact"));
const GetAQuote         = lazy(() => import("./components/getaquote"));
const SeniorTechService = lazy(() => import("./components/SeniorTechService"));
const AdminLogin        = lazy(() => import("./components/AdminLogin"));
const AdminRegister     = lazy(() => import("./components/AdminRegister"));
const AdminDashboard    = lazy(() => import("./components/AdminDashboard"));

const PageLoader = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
    <div style={{ width: 40, height: 40, border: "4px solid rgba(255,255,255,0.2)", borderTopColor: "#3498db", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const AppContent: React.FC = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/admin");

  return (
    <div className="app">
      {!hideNavbar && <Navbar />}
      <main className={location.pathname === "/admin/dashboard" ? "main-content-admin" : "main-content"}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contactus" element={<Contact />} />
            <Route path="/getaquote" element={<GetAQuote />} />
            <Route path="/senior-tech-service" element={<SeniorTechService />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <Router basename="/TheTechNextDoor">
        <AppContent />
      </Router>
    </CartProvider>
  );
};

export default App;
