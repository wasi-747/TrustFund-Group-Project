import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiLock,
  FiCheckCircle,
  FiHash,
  FiMail,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Form State
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Load email from navigation state
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword)
      return toast.warning("Passwords do not match");
    if (password.length < 6) return toast.warning("Password must be 6+ chars");

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        otp,
        password,
      });
      toast.success("🎉 Password Reset Successful! Please Login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid Code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-6 flex justify-center">
      <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Set New Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email (Read-only if passed) */}
          <div className="relative group">
            <FiMail className="absolute left-4 top-3.5 text-gray-500" />
            <input
              type="email"
              required
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-gray-700 text-white p-3 pl-12 rounded-xl focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          {/* OTP Input */}
          <div className="relative group">
            <FiHash className="absolute left-4 top-3.5 text-emerald-500" />
            <input
              type="text"
              required
              placeholder="Enter 6-Digit Code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-black/40 border border-gray-700 text-white p-3 pl-12 rounded-xl focus:border-emerald-500 outline-none transition-all font-mono tracking-widest"
              maxLength="6"
            />
          </div>

          {/* New Password */}
          <div className="relative group">
            <FiLock className="absolute left-4 top-3.5 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"} // 👈 Toggles Type
              required
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-gray-700 text-white p-3 pl-12 pr-10 rounded-xl focus:border-emerald-500 outline-none transition-all"
            />
            {/* 👁️ Eye Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-gray-500 hover:text-white transition-colors"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative group">
            <FiLock className="absolute left-4 top-3.5 text-gray-500" />
            <input
              type={showConfirmPassword ? "text" : "password"} // 👈 Toggles Type
              required
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-black/40 border border-gray-700 text-white p-3 pl-12 pr-10 rounded-xl focus:border-emerald-500 outline-none transition-all"
            />
            {/* 👁️ Eye Button */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-3.5 text-gray-500 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              "Updating..."
            ) : (
              <>
                Reset Password <FiCheckCircle />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
