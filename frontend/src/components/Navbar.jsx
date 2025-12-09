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
    <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
          TrustFund
        </Link>

        {/* Links */}
        <div className="flex gap-6 items-center">
          {!token ? (
            <>
              <Link
                to="/login"
                className="text-gray-600 font-medium hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-red-500 font-bold hover:text-red-700"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
