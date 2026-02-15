import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import "@fontsource/sansation/300.css";
import "@fontsource/sansation/400.css";
import "@fontsource/sansation/700.css";
import "@fontsource/source-sans-3/300.css";
import "@fontsource/source-sans-3/400.css";
import "@fontsource/source-sans-3/600.css";
import "@fontsource/source-sans-3/700.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faMoon } from "@fortawesome/free-solid-svg-icons";
import { faSun } from "@fortawesome/free-solid-svg-icons";

import "./TopBar.css";

import { useAuth } from "../../context/AuthContext";

export default function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const closePanel = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 300);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closePanel();
    };

    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  const handleLogout = () => {
    closePanel();
    logout();
    navigate("/");
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
          <button className="cta-btn" onClick={() => setOpen(true)}>
            <FontAwesomeIcon icon={faMoon} />
          </button>
          {/* PROFILE */}
          <button className="cta-btn" onClick={() => setOpen(true)}>
            <FontAwesomeIcon icon={faUser} />
          </button>

        </div>
      </div>

      {open && (
        <div
          className={`panel-overlay ${closing ? "fade-out" : "fade-in"}`}
          onClick={closePanel}
        >
          <div
            className={`profile-panel ${closing ? "slide-out" : "slide-in"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="profile-close" onClick={closePanel}>✕</button>

            <div className="profile-header">
              <div className="profile-avatar">
                {user?.name?.charAt(0) || "?"}
              </div>
              <div>
                <h3 className="profile-name">{user?.name || "Guest"}</h3>
                <p className="profile-srn">{user?.srn}</p>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-row"><span>Program</span><span>{user?.program}</span></div>
              <div className="detail-row"><span>Branch</span><span>{user?.branch}</span></div>
              <div className="detail-row"><span>Semester</span><span>{user?.semester}</span></div>
              <div className="detail-row"><span>Section</span><span>{user?.section}</span></div>
              <div className="detail-row"><span>Campus</span><span>{user?.campus}</span></div>
              <div className="detail-row"><span>Email</span><span>{user?.email}</span></div>
              <div className="detail-row"><span>Phone</span><span>{user?.phone}</span></div>
              <div className="detail-row"><span>PRN</span><span>{user?.prn}</span></div>
            </div>

            <div className="logout-row">
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
