import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing/Landing";
import Courts from "./pages/Courts/Courts";
import Bookings from "./pages/Bookings/Bookings";
import Login from "./pages/Auth/Login";

import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* PROTECTED */}
      <Route
        path="/courts"
        element={
          <ProtectedRoute>
            <Courts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <Bookings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
