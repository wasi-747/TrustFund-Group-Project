import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-[#020617]/80 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* 📈 Logo: TrustFund with Professional Growth Arrow */}
        <Link
          to="/dashboard"
          className="flex items-center font-black text-2xl tracking-tight text-white hover:opacity-90 transition group"
        >
          Trust
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
            Fund
          </span>
          {/* ✨ NEW FIXED ARROW ICON (Financial Trend Up) */}
          <div className="ml-2 bg-green-500/10 p-1.5 rounded-lg border border-green-500/20 group-hover:bg-green-500/20 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6 text-green-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941"
              />
            </svg>
          </div>
        </Link>

        <div className="flex gap-6 items-center">
          {!token ? (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-full font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/50 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/create-campaign"
                className="hidden md:block text-gray-300 hover:text-white font-medium transition"
              >
                + Start Fundraiser
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-400 font-bold hover:text-red-300 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
