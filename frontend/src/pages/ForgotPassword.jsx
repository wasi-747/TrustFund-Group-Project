import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiMail, FiArrowRight } from "react-icons/fi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });
      toast.success("✅ Code sent! Check your inbox.");
      // Navigate to Reset Page, passing the email in state
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "User not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-6 flex justify-center">
      <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          Forgot Password?
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Enter your email to receive a secure code.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <FiMail className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-gray-700 text-white p-3 pl-12 rounded-xl focus:border-emerald-500 outline-none transition-all placeholder-gray-600"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              "Sending..."
            ) : (
              <>
                Get Code <FiArrowRight />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
