import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

/* Fonts */
import "@fontsource/sansation/300.css";
import "@fontsource/sansation/400.css";
import "@fontsource/sansation/700.css";
import "@fontsource/source-sans-3/300.css";
import "@fontsource/source-sans-3/400.css";
import "@fontsource/source-sans-3/600.css";
import "@fontsource/source-sans-3/700.css";

/* Font Awesome */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import "./TopBar.css";
import { useAuth } from "../../context/AuthContext";

export default function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  /* ---------- CLOSE HANDLER (with animation) ---------- */
  const closePanel = () => {
    setClosing(true);

    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 300); // must match CSS animation duration
  };

  /* ---------- ESC KEY ---------- */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closePanel();
    };

    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  /* ---------- LOGOUT ---------- */
  const handleLogout = () => {
    closePanel();
    logout();            // 🔥 real logout (clears context + localStorage)
    navigate("/");       // optional redirect
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        {/* LEFT */}
        <div className="nav-left">
          <div className="logo">
            <span className="bold">Uni</span>Court
          </div>
        </div>

        {/* CENTER */}
        <div className="nav-center">
          <nav className="nav">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/courts">Courts</NavLink>
            <NavLink to="/bookings">My Bookings</NavLink>
          </nav>
        </div>

        {/* RIGHT */}
        <div className="nav-right">
          <button
            className="cta-btn"
            onClick={() => setOpen(true)}
            aria-label="Open profile"
          >
            <FontAwesomeIcon icon={faUser} />
          </button>
        </div>
      </div>

      {/* ---------- OVERLAY ---------- */}
      {open && (
        <div
          className={`panel-overlay ${closing ? "fade-out" : "fade-in"}`}
          onClick={closePanel}
        >
          {/* ---------- PROFILE PANEL ---------- */}
          <div
            className={`profile-panel ${closing ? "slide-out" : "slide-in"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              className="profile-close"
              onClick={closePanel}
              aria-label="Close profile"
            >
              ✕
            </button>

            {/* Header */}
            <div className="profile-header">
              <div className="profile-avatar">
                {user?.name?.charAt(0) || "?"}
              </div>

              <div>
                <h3 className="profile-name">{user?.name || "Guest"}</h3>
                <p className="profile-srn">{user?.srn}</p>
              </div>
            </div>

            {/* Details */}
            <div className="profile-details">
              <div className="detail-row"><span>Program</span><span>{user?.program}</span></div>
              <div className="detail-row"><span>Branch</span><span>{user?.branch}</span></div>
              <div className="detail-row"><span>Semester</span><span>{user?.semester}</span></div>
              <div className="detail-row"><span>Section</span><span>{user?.section}</span></div>
              <div className="detail-row"><span>Campus</span><span>{user?.campus}</span></div>
              <div className="detail-row"><span>Email</span><span className="mono">{user?.email}</span></div>
              <div className="detail-row"><span>Phone</span><span className="mono">{user?.phone}</span></div>
              <div className="detail-row"><span>PRN</span><span className="mono">{user?.prn}</span></div>
            </div>

            {/* Logout */}
            <div className="logout-row">
              <button className="logout-btn" onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
