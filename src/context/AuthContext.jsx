import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ token: null, admin: null });
  const [loading, setLoading] = useState(true);

  // Initialize auth from localStorage on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedAdmin = localStorage.getItem("admin");

    if (storedToken && storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin);
        setAuth({
          token: storedToken,
          admin: adminData,
        });
        console.log("✅ Auth restored from localStorage");
      } catch (e) {
        console.error("Corrupted admin data, clearing storage");
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
      }
    }
    setLoading(false);
  }, []);

  const login = ({ token, admin }) => {
    if (!token || !admin) {
      console.error("Invalid login data: token or admin missing");
      return;
    }

    console.log("🔐 Logging in admin:", admin);

    // Save to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("admin", JSON.stringify(admin));

    // Update context state
    setAuth({
      token,
      admin,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setAuth({ token: null, admin: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}