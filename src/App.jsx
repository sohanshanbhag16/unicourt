import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Landing from "./pages/Landing/Landing";
import Courts from "./pages/Courts/Courts";
import Bookings from "./pages/Bookings/Bookings";

import Login from "./pages/Auth/Login";

import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* 🔓 PUBLIC ROUTES */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* 🔒 PROTECTED ROUTES */}
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
  );
}
