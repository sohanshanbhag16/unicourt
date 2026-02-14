import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ✅ Restore user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("pesuUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setAuthLoading(false);
  }, []);

  // ✅ Login
  const login = (profile) => {
    localStorage.setItem("pesuUser", JSON.stringify(profile));
    setUser(profile);
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("pesuUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
