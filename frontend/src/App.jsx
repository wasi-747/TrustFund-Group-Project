import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AdminModeProvider } from "./context/AdminContext";

// Components
import Navbar from "./components/Navbar";
import InteractiveBackground from "./components/InteractiveBackground";
import PageWrapper from "./components/PageWrapper";
import AdminRoute from "./components/AdminRoute"; // 👈 IMPORT GUARD

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CampaignDetails from "./pages/CampaignDetails";
import CampaignWizard from "./pages/CampaignWizard";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFail from "./pages/PaymentFail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import Resources from "./pages/Resources";
import Discover from "./pages/Discover";
import SocialImpactFunds from "./pages/SocialImpactFunds";
import CrisisRelief from "./pages/CrisisRelief";
import SupporterSpace from "./pages/SupporterSpace";
import HowToStart from "./pages/HowToStart";
import FundraisingTips from "./pages/FundraisingTips";
import FundraisingIdeas from "./pages/FundraisingIdeas";
import FundraisingBlog from "./pages/FundraisingBlog";
import FundraisingCategories from "./pages/FundraisingCategories";
import TeamFundraising from "./pages/TeamFundraising";
import CharityFundraising from "./pages/CharityFundraising";
import NonprofitSignup from "./pages/NonprofitSignup";
import Footer from "./components/Footer";

const AppContent = () => {
  const { theme } = useTheme();
  const location = useLocation();

  return (
    <>
      <div className="fixed inset-0 z-0 block">
        <InteractiveBackground theme={theme} />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme={theme === "light" ? "light" : "dark"}
      />

      <div className="min-h-screen font-sans relative z-10 transition-colors duration-300 dark:text-white text-gray-900">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Public Routes */}
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
            <Route
              path="/forgot-password"
              element={
                <PageWrapper>
                  <ForgotPassword />
                </PageWrapper>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PageWrapper>
                  <ResetPassword />
                </PageWrapper>
              }
            />

            {/* User Routes */}
            <Route
              path="/dashboard"
              element={
                <PageWrapper>
                  <Dashboard />
                </PageWrapper>
              }
            />
            <Route
              path="/profile"
              element={
                <PageWrapper>
                  <Profile />
                </PageWrapper>
              }
            />
            <Route
              path="/settings"
              element={
                <PageWrapper>
                  <Settings />
                </PageWrapper>
              }
            />
            <Route
              path="/create-campaign"
              element={
                <PageWrapper>
                  <CampaignWizard />
                </PageWrapper>
              }
            />
            <Route
              path="/campaign/:id"
              element={
                <PageWrapper>
                  <CampaignDetails />
                </PageWrapper>
              }
            />
            <Route
              path="/payment/success"
              element={
                <PageWrapper>
                  <PaymentSuccess />
                </PageWrapper>
              }
            />
            <Route
              path="/payment/fail"
              element={
                <PageWrapper>
                  <PaymentFail />
                </PageWrapper>
              }
            />

            {/* Discover Page */}
            <Route
              path="/discover"
              element={
                <PageWrapper>
                  <Discover />
                </PageWrapper>
              }
            />

            {/* Social Impact Funds Page */}
            <Route
              path="/social-impact-funds"
              element={
                <PageWrapper>
                  <SocialImpactFunds />
                </PageWrapper>
              }
            />

            {/* Crisis Relief Page */}
            <Route
              path="/crisis-relief"
              element={
                <PageWrapper>
                  <CrisisRelief />
                </PageWrapper>
              }
            />

            {/* Supporter Space Page */}
            <Route
              path="/supporter-space"
              element={
                <PageWrapper>
                  <SupporterSpace />
                </PageWrapper>
              }
            />

            {/* Fundraise Dropdown Pages */}
            <Route
              path="/how-to-start"
              element={
                <PageWrapper>
                  <HowToStart />
                </PageWrapper>
              }
            />
            <Route
              path="/fundraising-tips"
              element={
                <PageWrapper>
                  <FundraisingTips />
                </PageWrapper>
              }
            />
            <Route
              path="/fundraising-ideas"
              element={
                <PageWrapper>
                  <FundraisingIdeas />
                </PageWrapper>
              }
            />
            <Route
              path="/fundraising-blog"
              element={
                <PageWrapper>
                  <FundraisingBlog />
                </PageWrapper>
              }
            />
            <Route
              path="/fundraising-categories"
              element={
                <PageWrapper>
                  <FundraisingCategories />
                </PageWrapper>
              }
            />
            <Route
              path="/team-fundraising"
              element={
                <PageWrapper>
                  <TeamFundraising />
                </PageWrapper>
              }
            />
            <Route
              path="/charity-fundraising"
              element={
                <PageWrapper>
                  <CharityFundraising />
                </PageWrapper>
              }
            />
            <Route
              path="/nonprofit-signup"
              element={
                <PageWrapper>
                  <NonprofitSignup />
                </PageWrapper>
              }
            />

            {/* Resources Routes */}
            <Route
              path="/resources/:section"
              element={
                <PageWrapper>
                  <Resources />
                </PageWrapper>
              }
            />

            {/* 🔒 ADMIN ROUTE (Protected) */}
            <Route element={<AdminRoute />}>
              <Route
                path="/admin"
                element={
                  <PageWrapper>
                    <AdminDashboard />
                  </PageWrapper>
                }
              />
            </Route>
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </>
  );
};

function App() {
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp < Date.now() / 1000) {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }
        } catch (error) {
          localStorage.removeItem("token");
        }
      }
    };
    checkToken();
    const interval = setInterval(checkToken, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider>
      <AdminModeProvider>
        <Router>
          <AppContent />
        </Router>
      </AdminModeProvider>
    </ThemeProvider>
  );
}

export default App;
