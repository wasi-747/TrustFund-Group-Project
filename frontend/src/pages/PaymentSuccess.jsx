import React from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-emerald-500/20 blur-[80px] rounded-full"></div>

        <FiCheckCircle className="text-7xl text-emerald-500 mx-auto mb-6 relative z-10 animate-bounce" />

        <h1 className="text-3xl font-bold text-white mb-2 relative z-10">
          Donation Successful!
        </h1>
        <p className="text-gray-400 mb-8 relative z-10">
          Thank you for your generosity. Your contribution has been verified and
          added to the campaign.
        </p>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 relative z-10"
        >
          Return to Dashboard <FiArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;