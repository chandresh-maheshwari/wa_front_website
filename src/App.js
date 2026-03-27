import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ls from "local-storage";

// CSS
import "./Wa-Frontend/Wa-Frontend.css";
import "./Wa-Frontend/Wa-MediaQuerys.css";

// Pages
import Home from "./Wa-Frontend/Home";
import TopNav from "./Wa-Frontend/TopNav";
import Footer from "./Wa-Frontend/Footer";
import MenuPage from "./components/MenuPage";
import NoPage from "./NoPage";
// import ProductRegistration from "./Wa-Frontend/OurProducts/ProductRegistration";
import RegistrationPage from "./components/Login/RegistrationPage";

// Protected pages
import Company from "./components/companypage/Company";
import Contract from "./components/companypage/Contract";
import Depot from "./components/companypage/Depot";
import Vehicle from "./components/companypage/Vehicle";
import Site from "./components/companypage/Site";
import Success from "./components/companypage/Success";

/* =====================
   Protected Route
===================== */
function ProtectedRoute({ children }) {
  const isLoggedIn = ls("userData") !== null;
  return isLoggedIn ? children : <Navigate to="/" />;
}

function App() {
  const location = useLocation();

  /* =====================================
     1️⃣ PAGE BASED SCROLLBAR
  ===================================== */
  useEffect(() => {
    if (location.pathname === "/") {
      document.body.classList.add("image-scrollbar");
    } else {
      document.body.classList.remove(
        "image-scrollbar",
        "scrolled-top",
        "scrolled-down"
      );
    }

    window.scrollTo(0, 0);
  }, [location.pathname]);

  /* =====================================
     2️⃣ DIRECTION BASED IMAGE SWITCH
  ===================================== */
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      // Only on home page
      if (!document.body.classList.contains("image-scrollbar")) return;

      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // 🔽 scrolling down
        document.body.classList.add("scrolled-down");
        document.body.classList.remove("scrolled-top");
      } else if (currentScrollY < lastScrollY) {
        // 🔼 scrolling up
        document.body.classList.add("scrolled-top");
        document.body.classList.remove("scrolled-down");
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <TopNav />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu/:menuName" element={<MenuPage />} />
        {/* <Route path="/registration" element={<ProductRegistration />} /> */}
        <Route path="/registration" element={<RegistrationPage />} />

        <Route path="/company" element={<ProtectedRoute><Company /></ProtectedRoute>} />
        <Route path="/contract" element={<ProtectedRoute><Contract /></ProtectedRoute>} />
        <Route path="/depot" element={<ProtectedRoute><Depot /></ProtectedRoute>} />
        <Route path="/vehicle" element={<ProtectedRoute><Vehicle /></ProtectedRoute>} />
        <Route path="/site" element={<ProtectedRoute><Site /></ProtectedRoute>} />
        <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />

        <Route path="*" element={<NoPage />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
