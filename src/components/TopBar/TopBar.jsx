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
import { faUser, faBars, faTimes, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

import "./TopBar.css";

import { useAuth } from "../../context/AuthContext";

const THEME_KEY = "unicourt-theme";

export default function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [isDark, setIsDark] = useState(() => document.body.classList.contains("dark"));

  const closePanel = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 300);
  };

  const closeMenu = () => {
    setMenuClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setMenuClosing(false);
    }, 300);
  };

  const toggleTheme = () => {
    document.body.classList.toggle("dark");
    const nowDark = document.body.classList.contains("dark");
    localStorage.setItem(THEME_KEY, nowDark ? "dark" : "light");
    setIsDark(nowDark);
  };

  useEffect(() => {
    if (open || menuOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open, menuOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        closePanel();
        closeMenu();
      }
    };

    if (open || menuOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, menuOpen]);

  const handleLogout = () => {
    closePanel();
    logout();
    navigate("/");
  };

  const handleNavClick = () => {
    closeMenu();
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

        {/* CENTER - desktop nav */}
        <div className="nav-center">
          <nav className="nav" aria-label="Main navigation">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/courts">Courts</NavLink>
            <NavLink to="/bookings">My Bookings</NavLink>
          </nav>
        </div>

        {/* RIGHT */}
        <div className="nav-right">
          <button
            type="button"
            className="cta-btn theme-toggle"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
          </button>
          <button
            type="button"
            className="hamburger-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <button
            type="button"
            className="cta-btn"
            onClick={() => setOpen(true)}
            aria-label="Profile"
          >
            <FontAwesomeIcon icon={faUser} />
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <div
          className={`panel-overlay mobile-nav-overlay ${menuClosing ? "fade-out" : "fade-in"}`}
          onClick={closeMenu}
          aria-hidden="true"
        >
          <div
            className={`mobile-nav-drawer ${menuClosing ? "slide-out-left" : "slide-in-left"}`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Navigation menu"
          >
            <div className="mobile-nav-header">
              <span className="mobile-nav-title">Menu</span>
              <button
                type="button"
                className="mobile-nav-close"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <nav className="mobile-nav" aria-label="Mobile navigation">
              <NavLink to="/" end onClick={handleNavClick}>Home</NavLink>
              <NavLink to="/courts" onClick={handleNavClick}>Courts</NavLink>
              <NavLink to="/bookings" onClick={handleNavClick}>My Bookings</NavLink>
            </nav>
          </div>
        </div>
      )}

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
