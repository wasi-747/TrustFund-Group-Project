import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import {
  FiUser,
  FiLogOut,
  FiSettings,
  FiList,
  FiHeart,
  FiHelpCircle,
  FiChevronRight,
  FiChevronDown,
  FiActivity,
  FiMoon,
  FiSun,
} from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { "x-auth-token": token },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Navbar Auth Check Failed");
      }
    };
    fetchUser();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  const handleLaunchClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.isVerified) {
      navigate("/create-campaign");
    } else {
      toast.info("🔒 Please verify your account to launch a campaign!");
      navigate("/profile");
    }
  };

  const handleComingSoon = (e) => {
    e.preventDefault();
    setActiveMenu(null);
    toast.info("🚧 This feature is coming soon!");
  };

  let timeoutId;
  const handleMouseEnter = (menu) => {
    clearTimeout(timeoutId);
    setActiveMenu(menu);
  };
  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => setActiveMenu(null), 200);
  };

  // Helper to cycle themes
  const cycleTheme = () => {
    if (theme === "dark") toggleTheme("light");
    else toggleTheme("dark");
  };

  return (
    <nav className="fixed top-0 w-full z-50 transition-colors duration-300 dark:bg-black/80 bg-white/90 backdrop-blur-md border-b dark:border-white/10 border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-8">
          <Link
            to="/dashboard"
            className="text-2xl font-bold tracking-wide dark:text-white text-gray-900 flex items-center gap-2"
          >
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 text-transparent bg-clip-text">
              TrustFund
            </span>
            <span className="text-xs bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-transparent">
              Beta
            </span>
          </Link>

          {/* 🟢 DONATE MENU */}
          <div
            className="relative h-20 flex items-center"
            onMouseEnter={() => handleMouseEnter("donate")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                activeMenu === "donate"
                  ? "text-emerald-600 dark:text-white"
                  : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
              }`}
            >
              Donate
              <FiChevronDown
                className={`transition-transform duration-300 ${
                  activeMenu === "donate" ? "rotate-180 text-emerald-500" : ""
                }`}
              />
            </button>

            {activeMenu === "donate" && (
              <div className="absolute top-16 left-0 w-[500px] dark:bg-black/95 bg-white border dark:border-emerald-500/20 border-gray-100 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.2)] dark:shadow-[0_0_40px_rgba(16,185,129,0.1)] p-6 animate-in fade-in slide-in-from-top-2 z-50 backdrop-blur-xl">
                <div className="flex items-center gap-2 dark:text-white text-gray-900 font-bold mb-4 pb-2 border-b dark:border-white/10 border-gray-100">
                  <FiHeart className="text-emerald-500" /> Discover fundraisers
                  to support
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <a
                      href="#"
                      onClick={handleComingSoon}
                      className="block group"
                    >
                      <p className="dark:text-white text-gray-800 font-semibold group-hover:text-emerald-500 transition-colors">
                        Categories
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Browse fundraisers by category
                      </p>
                    </a>
                    <a
                      href="#"
                      onClick={handleComingSoon}
                      className="block group"
                    >
                      <p className="dark:text-white text-gray-800 font-semibold group-hover:text-emerald-500 transition-colors">
                        Crisis relief
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Donate to verified relief
                      </p>
                    </a>
                  </div>
                  <div className="space-y-4">
                    <a
                      href="#"
                      onClick={handleComingSoon}
                      className="block group"
                    >
                      <p className="dark:text-white text-gray-800 font-semibold group-hover:text-emerald-500 transition-colors">
                        Social Impact Funds
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Direct support for urgent needs
                      </p>
                    </a>
                    <a
                      href="#"
                      onClick={handleComingSoon}
                      className="block group"
                    >
                      <p className="dark:text-white text-gray-800 font-semibold group-hover:text-emerald-500 transition-colors">
                        Supporter Space
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Inspiration, FAQs, and more
                      </p>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 🟢 FUNDRAISE MENU */}
          <div
            className="relative h-20 flex items-center"
            onMouseEnter={() => handleMouseEnter("fundraise")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                activeMenu === "fundraise"
                  ? "text-emerald-600 dark:text-white"
                  : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
              }`}
            >
              Fundraise
              <FiChevronDown
                className={`transition-transform duration-300 ${
                  activeMenu === "fundraise"
                    ? "rotate-180 text-emerald-500"
                    : ""
                }`}
              />
            </button>

            {activeMenu === "fundraise" && (
              <div className="absolute top-16 left-0 w-[600px] dark:bg-black/95 bg-white border dark:border-emerald-500/20 border-gray-100 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.2)] dark:shadow-[0_0_40px_rgba(16,185,129,0.1)] p-6 animate-in fade-in slide-in-from-top-2 z-50 backdrop-blur-xl">
                <div className="flex items-center gap-2 dark:text-white text-gray-900 font-bold mb-4 pb-2 border-b dark:border-white/10 border-gray-100">
                  <FiActivity className="text-emerald-500" /> Start fundraising,
                  tips, and resources
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-4">
                    <a
                      href="#"
                      onClick={handleComingSoon}
                      className="block group"
                    >
                      <p className="dark:text-white text-gray-800 font-semibold group-hover:text-emerald-500 transition-colors">
                        How to start
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Step-by-step help and examples
                      </p>
                    </a>
                    <a
                      href="#"
                      onClick={handleComingSoon}
                      className="block group"
                    >
                      <p className="dark:text-white text-gray-800 font-semibold group-hover:text-emerald-500 transition-colors">
                        Team fundraising
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Fundraise together with a team
                      </p>
                    </a>
                    <a
                      href="#"
                      onClick={handleComingSoon}
                      className="block group"
                    >
                      <p className="dark:text-white text-gray-800 font-semibold group-hover:text-emerald-500 transition-colors">
                        Fundraising Blog
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Resources, tips, and more
                      </p>
                    </a>
                  </div>
                  <div className="space-y-4">
                    <a
                      href="#"
                      onClick={handleComingSoon}
                      className="block group"
                    >
                      <p className="dark:text-white text-gray-800 font-semibold group-hover:text-emerald-500 transition-colors">
                        Fundraising tips
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        The ultimate guide
                      </p>
                    </a>
                    <a
                      href="#"
                      onClick={handleComingSoon}
                      className="block group"
                    >
                      <p className="dark:text-white text-gray-800 font-semibold group-hover:text-emerald-500 transition-colors">
                        Fundraising ideas
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Ideas to spark creativity
                      </p>
                    </a>
                    <a
                      href="#"
                      onClick={handleComingSoon}
                      className="block group"
                    >
                      <p className="dark:text-white text-gray-800 font-semibold group-hover:text-emerald-500 transition-colors">
                        Charity fundraising
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Fundraise for a non-profit
                      </p>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-6">
          {token ? (
            <>
              <button
                onClick={handleLaunchClick}
                className="px-6 py-2.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-green-500 to-emerald-700 hover:from-green-400 hover:to-emerald-600 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 hidden md:block"
              >
                Start a TrustFund
              </button>

              {/* PROFILE DROPDOWN */}
              <div
                className="relative h-20 flex items-center"
                onMouseEnter={() => handleMouseEnter("profile")}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all cursor-pointer ${
                    activeMenu === "profile"
                      ? "bg-emerald-500/20 text-emerald-500"
                      : "dark:bg-white/5 bg-gray-100 dark:text-gray-300 text-gray-600 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <FiUser size={20} />
                </div>

                {activeMenu === "profile" && user && (
                  <div className="absolute top-16 right-0 w-80 dark:bg-black/95 bg-white border dark:border-emerald-500/20 border-gray-100 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.2)] dark:shadow-[0_0_40px_rgba(16,185,129,0.1)] py-2 animate-in fade-in slide-in-from-top-2 z-50 backdrop-blur-xl">
                    <div className="px-6 py-4 border-b dark:border-white/10 border-gray-100">
                      <h3 className="dark:text-white text-gray-900 font-bold text-lg truncate">
                        {user.name}
                      </h3>
                      <Link
                        to="/profile"
                        className="text-sm text-emerald-500 hover:text-emerald-400 flex items-center gap-1 mt-1 transition-colors"
                      >
                        View Profile <FiChevronRight size={14} />
                      </Link>
                    </div>

                    <div className="px-6 py-4 border-b dark:border-white/10 border-gray-100 dark:bg-white/5 bg-gray-50">
                      <h4 className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-3">
                        Your Impact
                      </h4>
                      <Link
                        to="/profile"
                        className="flex items-center justify-between p-3 dark:bg-white/5 bg-white border dark:border-transparent border-gray-200 rounded-xl hover:shadow-md transition group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center">
                            <FiHeart size={18} />
                          </div>
                          <div>
                            <p className="dark:text-white text-gray-900 font-bold">
                              Donation History
                            </p>
                            <p className="text-xs text-gray-500">
                              View your support
                            </p>
                          </div>
                        </div>
                        <FiChevronRight className="text-gray-400 group-hover:text-emerald-500 transition" />
                      </Link>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-6 py-3 dark:text-gray-300 text-gray-600 hover:bg-gray-100 dark:hover:bg-white/5 transition"
                      >
                        <FiList size={18} /> My Campaigns
                      </Link>

                      {/* 👇 THEME SWITCHER */}
                      <button
                        onClick={cycleTheme}
                        className="w-full flex items-center justify-between px-6 py-3 dark:text-gray-300 text-gray-600 hover:bg-gray-100 dark:hover:bg-white/5 transition group"
                      >
                        <span className="flex items-center gap-3">
                          {theme === "dark" ? (
                            <FiMoon size={18} />
                          ) : (
                            <FiSun size={18} />
                          )}
                          Appearance
                        </span>
                        <span className="text-[10px] uppercase font-bold dark:bg-white/10 bg-gray-200 text-gray-500 dark:text-gray-300 px-2 py-0.5 rounded border dark:border-white/10 border-gray-300">
                          {theme}
                        </span>
                      </button>

                      <a
                        href="#"
                        onClick={handleComingSoon}
                        className="flex items-center gap-3 px-6 py-3 dark:text-gray-300 text-gray-600 hover:bg-gray-100 dark:hover:bg-white/5 transition justify-between group"
                      >
                        <span className="flex items-center gap-3">
                          <FiSettings size={18} /> Settings
                        </span>
                        <span className="text-[10px] dark:bg-white/10 bg-gray-200 text-gray-500 dark:text-gray-300 px-2 py-0.5 rounded border dark:border-white/10 border-gray-300">
                          SOON
                        </span>
                      </a>

                      <a
                        href="#"
                        onClick={handleComingSoon}
                        className="flex items-center gap-3 px-6 py-3 dark:text-gray-300 text-gray-600 hover:bg-gray-100 dark:hover:bg-white/5 transition justify-between group"
                      >
                        <span className="flex items-center gap-3">
                          <FiHelpCircle size={18} /> Help & Support
                        </span>
                        <span className="text-[10px] dark:bg-white/10 bg-gray-200 text-gray-500 dark:text-gray-300 px-2 py-0.5 rounded border dark:border-white/10 border-gray-300">
                          SOON
                        </span>
                      </a>
                    </div>

                    <div className="border-t dark:border-white/10 border-gray-100 pt-2 pb-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-6 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition font-medium"
                      >
                        <FiLogOut size={18} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 rounded-full font-medium dark:text-white text-gray-900 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 border border-gray-200 dark:border-white/10 transition-all"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
