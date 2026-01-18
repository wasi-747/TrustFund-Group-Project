import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiMail,
  FiLock,
  FiShield,
  FiArrowRight,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const Login = () => {
  const [step, setStep] = useState(1); // 1 = Creds, 2 = Verification
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Send Credentials
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend validates password & sends OTP email
      await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      toast.info("🔐 Security Check: Code sent to your email", {
        theme: "dark",
      });
      setStep(2); // Transition to Verification Page
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed", {
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      // 1. Save Token & Role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      toast.success("🚀 Login Successful!", { theme: "dark" });

      // 2. CHECK ROLE & REDIRECT CORRECTLY 👈 (THIS IS THE FIX)
      if (res.data.role === "admin") {
        navigate("/admin"); // Admins go here
      } else {
        navigate("/dashboard"); // Users go here
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or Expired Code", {
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-black relative overflow-hidden">
      {/* Background Decor (Optional Glow) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10">
        {/* --- STEP 1: LOGIN FORM --- */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-400 text-sm">
                Sign in to continue to TrustFund
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <FiMail className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full bg-black/40 border border-gray-700 text-white p-3 pl-12 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder-gray-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Password
                  </label>
                  {/* 👇 UPDATED LINK */}
                  <Link
                    to="/forgot-password"
                    className="text-xs text-emerald-500 hover:text-emerald-400"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-gray-700 text-white p-3 pl-12 pr-12 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder-gray-600"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    Login <FiArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center border-t border-gray-800 pt-6">
              <p className="text-gray-500 text-sm">
                New to TrustFund?{" "}
                <Link
                  to="/register"
                  className="text-white font-bold hover:text-emerald-400 transition"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* --- STEP 2: PROFESSIONAL VERIFICATION PAGE --- */}
        {step === 2 && (
          <div className="animate-fade-in-up text-center">
            {/* Security Icon */}
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <FiShield className="text-4xl text-emerald-500" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              Security Verification
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              We sent a 6-digit code to <br />
              <span className="text-white font-mono bg-white/10 px-2 py-1 rounded mt-1 inline-block border border-white/10">
                {email}
              </span>
            </p>

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="000 000"
                  className="w-full bg-black/40 border-2 border-gray-700 focus:border-emerald-500 text-white text-center text-3xl font-bold tracking-[0.5em] p-4 rounded-xl outline-none transition-all placeholder-gray-700"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  autoFocus
                  required
                />
              </div>

              <button
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Verifying..."
                ) : (
                  <>
                    Verify Identity <FiCheckCircle />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex justify-between items-center text-sm">
              <button
                onClick={() => setStep(1)}
                className="text-gray-500 hover:text-white transition"
              >
                ← Back to Login
              </button>
              <button className="text-emerald-500 hover:text-emerald-400 font-semibold">
                Resend Code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
