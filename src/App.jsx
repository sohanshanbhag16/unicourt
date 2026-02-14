import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Landing from "./pages/Landing/Landing";
import Courts from "./pages/Courts/Courts";
import Bookings from "./pages/Bookings/Bookings";
import Login from "./pages/Auth/Login";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import FloatingThemeToggle from "./components/FloatingThemeToggle";

const THEME_KEY = "unicourt-theme";

export default function App() {
  const location = useLocation();
  const showFloatingToggle = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark") document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, []);

  return (
    <>
      {showFloatingToggle && <FloatingThemeToggle />}
      <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* PROTECTED WITH LAYOUT */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/courts" element={<Courts />} />
        <Route path="/bookings" element={<Bookings />} />
      </Route>
    </Routes>
    </>
  );
}
