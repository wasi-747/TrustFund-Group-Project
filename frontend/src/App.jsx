import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Components
import Navbar from "./components/Navbar";
import InteractiveBackground from "./components/InteractiveBackground";
import PageWrapper from "./components/PageWrapper";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateCampaign from "./pages/CreateCampaign";

// 🎬 This component handles the animation logic
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Pages */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route
          path="/login"
          element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          }
        />

        <Route
          path="/register"
          element={
            <PageWrapper>
              <Register />
            </PageWrapper>
          }
        />

        {/* Week 2 Features */}
        <Route
          path="/dashboard"
          element={
            <PageWrapper>
              <Dashboard />
            </PageWrapper>
          }
        />

        <Route
          path="/create-campaign"
          element={
            <PageWrapper>
              <CreateCampaign />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      {/* 🌌 The New Interactive Background */}
      <InteractiveBackground />

      <div className="min-h-screen text-white font-sans selection:bg-green-500 selection:text-black relative z-10">
        <Navbar />
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
