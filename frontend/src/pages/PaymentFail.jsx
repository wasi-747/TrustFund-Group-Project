import React from "react";
import { Link } from "react-router-dom";
import { FiAlertCircle, FiRotateCw } from "react-icons/fi";

const PaymentFail = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="max-w-md w-full bg-gray-900 border border-red-900/30 p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-500/10 blur-[80px] rounded-full"></div>

        <FiAlertCircle className="text-7xl text-red-500 mx-auto mb-6 relative z-10" />

        <h1 className="text-3xl font-bold text-white mb-2 relative z-10">
          Payment Failed
        </h1>
        <p className="text-gray-400 mb-8 relative z-10">
          We couldn't process your donation. This might be due to a cancellation
          or a network issue.
        </p>

        <div className="flex gap-4 justify-center relative z-10">
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition"
          >
            Cancel
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-red-500/20"
          >
            <FiRotateCw /> Try Again
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFail;


