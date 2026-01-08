import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import axios from "axios"; // 👈 Import axios

// 👇 ADD THIS SECTION
// Set the base URL for all axios requests
axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
// 👆 END ADD SECTION

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
