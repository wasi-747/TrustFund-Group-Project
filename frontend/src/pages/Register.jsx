import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  // Step 1: Register & Get OTP
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });
      toast.success("🎉 Account Created! Check email for OTP.", {
        theme: "dark",
      });
      setStep(2); // Move to OTP
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration Failed";
      toast.error(errorMsg, { theme: "dark" });
    }
  };

  // Step 2: Verify & Auto-Login
  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      localStorage.setItem("token", res.data.token);
      toast.success("✅ Verified! Welcome to TrustFund.", { theme: "dark" });
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP", {
        theme: "dark",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          {step === 1 ? "Create Account" : "Verify Email"}
        </h2>

        {step === 1 ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white py-3 rounded-lg font-bold transition transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              Register
            </button>

             {/* SEPARATOR */}
             <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase">Or</span>
                <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* GITHUB BUTTON */}
            <a
              href="http://localhost:5000/api/auth/github"
              className="w-full py-3 rounded-lg bg-[#24292e] text-white font-bold shadow-lg hover:bg-[#2f363d] transition-all flex items-center justify-center gap-2"
            >
              Continue with GitHub
            </a>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4 animate-fade-in">
            <p className="text-gray-300 text-sm text-center">
              Enter the code sent to {email}
            </p>
            <input
              type="text"
              placeholder="OTP Code"
              className="w-full p-3 rounded-lg bg-white/5 border border-emerald-500 text-white text-center text-2xl tracking-widest focus:ring-2 focus:ring-emerald-500 outline-none"
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              required
            />
            <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-500 transition">
              Verify Account
            </button>
          </form>
        )}

        {step === 1 && (
          <p className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 font-bold hover:underline"
            >
              Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
