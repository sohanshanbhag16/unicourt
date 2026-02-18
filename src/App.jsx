import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Landing from "./pages/Landing/Landing";
import Courts from "./pages/Courts/Courts";
import Bookings from "./pages/Bookings/Bookings";
import Login from "./pages/Auth/Login";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Cursor from "./components/Cursor";
import PageWrapper from "./components/PageWrapper"; // ✅ THIS WAS MISSING


export default function App() {
  const location = useLocation();

  return (
    <>
      <Cursor />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          {/* PUBLIC */}
          <Route
            path="/"
            element={<PageWrapper><Landing /></PageWrapper>}
          />

          <Route
            path="/login"
            element={<PageWrapper><Login /></PageWrapper>}
          />

          {/* PROTECTED */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/courts"
              element={<PageWrapper><Courts /></PageWrapper>}
            />
            <Route
              path="/bookings"
              element={<PageWrapper><Bookings /></PageWrapper>}
            />
          </Route>

        </Routes>
      </AnimatePresence>
    </>
  );
}
