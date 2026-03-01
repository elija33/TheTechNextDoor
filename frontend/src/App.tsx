import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import GetAQuote from "./components/getaquote";
import Contact from "./components/Contact";
import AdminLogin from "./components/AdminLogin";
import AdminRegister from "./components/AdminRegister";
import AdminDashboard from "./components/AdminDashboard";
import SeniorTechService from "./components/SeniorTechService";
import "./App.css";
import Home from "./components/Home";

const AppContent: React.FC = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/admin");

  return (
    <div className="app">
      {!hideNavbar && <Navbar />}
      <main className={location.pathname === "/admin/dashboard" ? "main-content-admin" : "main-content"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contactus" element={<Contact />} />
          <Route path="/getaquote" element={<GetAQuote />} />
          <Route path="/senior-tech-service" element={<SeniorTechService />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
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
