import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheck,
  FiX,
  FiShield,
  FiFileText,
  FiCalendar,
  FiUser,
} from "react-icons/fi";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. FETCH DATA
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/admin/verifications",
        {
          headers: { "x-auth-token": token },
        }
      );
      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Access Denied. Admins Only.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 2. HANDLE APPROVAL
  const handleAction = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/verify-user/${id}`,
        { status },
        { headers: { "x-auth-token": token } }
      );

      toast.success(
        status === "approved" ? "User Verified! 🚀" : "Request Rejected."
      );
      setRequests(requests.filter((r) => r._id !== id)); // Remove from UI
    } catch (err) {
      toast.error("Action failed.");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-emerald-500 animate-pulse font-bold">
        Loading Admin Panel...
      </div>
    );

  return (
    <div className="min-h-screen pt-24 px-6 bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
          <FiShield className="text-emerald-500" /> Verification Queue
          <span className="text-sm bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full">
            {requests.length} Pending
          </span>
        </h1>

        {requests.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-3xl">
            <p className="text-gray-500">No pending verification requests.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence>
              {requests.map((req) => (
                <motion.div
                  key={req._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white dark:bg-gray-900 border dark:border-gray-800 p-6 rounded-2xl shadow-lg"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center text-xl font-bold">
                      {req.avatar ? (
                        <img
                          src={req.avatar}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        req.name[0]
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{req.name}</h3>
                      <p className="text-sm text-gray-500">{req.email}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 bg-gray-50 dark:bg-white/5 p-4 rounded-xl">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex gap-2 items-center">
                        <FiFileText /> NID Number
                      </span>
                      <span className="font-mono font-bold">
                        {req.verificationData?.nidNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex gap-2 items-center">
                        <FiCalendar /> Applied
                      </span>
                      <span className="font-bold">
                        {new Date(req.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* ID Image Preview */}
                  {req.verificationData?.nidImage && (
                    <div className="mb-6 h-40 bg-gray-100 rounded-xl overflow-hidden border dark:border-gray-700">
                      <img
                        src={req.verificationData.nidImage}
                        alt="ID"
                        className="w-full h-full object-cover hover:scale-105 transition duration-500"
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAction(req._id, "rejected")}
                      className="flex-1 py-3 rounded-xl border border-red-200 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center justify-center gap-2"
                    >
                      <FiX /> Reject
                    </button>
                    <button
                      onClick={() => handleAction(req._id, "approved")}
                      className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                    >
                      <FiCheck /> Approve
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
