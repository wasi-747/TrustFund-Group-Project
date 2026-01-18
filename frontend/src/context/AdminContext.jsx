import React, { createContext, useState, useContext, useEffect } from "react";

const AdminModeContext = createContext();

export const useAdminMode = () => useContext(AdminModeContext);

export const AdminModeProvider = ({ children }) => {
  // Default to false. Only settable to true if user is actually admin.
  // We'll persist this preference.
  const [isAdminMode, setIsAdminMode] = useState(() => {
    const saved = localStorage.getItem("adminViewMode");
    return saved === "true";
  });

  const toggleAdminMode = (value) => {
    setIsAdminMode(value);
    localStorage.setItem("adminViewMode", value);
    // Reload to ensure all components (nav, etc) catch up cleanly if needed, 
    // or just state update is fine. State update is smoother.
  };

  return (
    <AdminModeContext.Provider value={{ isAdminMode, toggleAdminMode }}>
      {children}
    </AdminModeContext.Provider>
  );
};
