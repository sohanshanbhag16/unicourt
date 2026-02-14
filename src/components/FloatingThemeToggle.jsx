import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import "./FloatingThemeToggle.css";

const THEME_KEY = "unicourt-theme";

export default function FloatingThemeToggle() {
  const [isDark, setIsDark] = useState(() => document.body.classList.contains("dark"));

  useEffect(() => {
    setIsDark(document.body.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    document.body.classList.toggle("dark");
    const nowDark = document.body.classList.contains("dark");
    localStorage.setItem(THEME_KEY, nowDark ? "dark" : "light");
    setIsDark(nowDark);
  };

  return (
    <button
      type="button"
      className="floating-theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
    </button>
  );
}
