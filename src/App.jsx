import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing/Landing";
import Courts from "./pages/Courts/Courts";
import Bookings from "./pages/Bookings/Bookings";
import Login from "./pages/Auth/Login";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

export default function App() {
  return (
    <>
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
