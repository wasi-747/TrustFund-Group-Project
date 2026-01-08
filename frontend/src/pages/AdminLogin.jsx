import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiLock, FiMail, FiArrowRight, FiShield } from "react-icons/fi";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Call Standard Login API
      // 👇 UPDATED: Removed "http://localhost:5000"
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      // 2. 🛡️ CRITICAL SECURITY CHECK
      // We must fetch the user details immediately to check the role
      const token = res.data.token;

      // 👇 UPDATED: Removed "http://localhost:5000"
      const userRes = await axios.get("/api/auth/me", {
        headers: { "x-auth-token": token },
      });

      const user = userRes.data;

      if (user.role !== "admin") {
        toast.error("⛔ ACCESS DENIED. Admins only.");
        setLoading(false);
        return;
      }

      // 3. Success: Store Token & Redirect
      localStorage.setItem("token", token);
      toast.success(`Welcome back, Commander ${user.name}`);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Invalid Credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white relative overflow-hidden">
      {/* Background Matrix/Grid Effect */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-emerald-950 opacity-90"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-8 bg-black/50 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mb-4 border border-emerald-500/20">
            <FiShield size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Secure access for TrustFund staff only.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              Email Address
            </label>
            <div className="relative group">
              <FiMail className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm font-medium placeholder-gray-600"
                placeholder="admin@trustfund.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              Password
            </label>
            <div className="relative group">
              <FiLock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm font-medium placeholder-gray-600"
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <>
                Access Dashboard{" "}
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-800 pt-6">
          <p className="text-xs text-gray-600">
            Unauthorized access is prohibited. Your IP is being monitored.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
