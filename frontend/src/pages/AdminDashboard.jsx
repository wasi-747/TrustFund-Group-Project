import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheck,
  FiX,
  FiShield,
  FiDollarSign,
  FiCalendar,
  FiFileText,
  FiEye,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiUser,
} from "react-icons/fi";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [milestones, setMilestones] = useState([]); // 👈 NEW STATE
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("verifications"); // 'verifications' | 'milestones'
  // 4. VIEW PROOF MODAL STATE
  const [proofModal, setProofModal] = useState(null); // { url, desc, title }
  // 5. VERIFICATION DETAILS MODAL STATE
  const [verificationModal, setVerificationModal] = useState(null); // user object with verificationData
  // 6. NID IMAGE MODAL STATE
  const [nidImageModal, setNidImageModal] = useState(null); // { url }

  // 1. FETCH DATA
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { "x-auth-token": token } };

      const [reqRes, mileRes] = await Promise.all([
        axios.get("/api/admin/verifications", config),
        axios.get("/api/admin/milestones/pending", config),
      ]);

      setRequests(reqRes.data);
      setMilestones(mileRes.data);
      setLoading(false);
    } catch (err) {
      toast.error("Access Denied. Admins Only.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. HANDLE USER VERIFICATION
  const handleVerification = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/admin/verify-user/${id}`,
        { status },
        { headers: { "x-auth-token": token } },
      );
      toast.success(
        status === "approved" ? "User Verified!" : "Request Rejected.",
      );
      setRequests(requests.filter((r) => r._id !== id));
    } catch (err) {
      toast.error("Action failed.");
    }
  };

  // 3. HANDLE MILESTONE ACTION (Approve/Reject)
  const handleMilestoneAction = async (campaignId, milestoneId, action) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint =
        action === "approve"
          ? "/api/admin/milestone/approve"
          : "/api/admin/milestone/reject";

      await axios.put(
        endpoint,
        { campaignId, milestoneId },
        { headers: { "x-auth-token": token } },
      );

      const successMsg =
        action === "approve" ? "💰 Funds Released!" : "❌ Milestone Rejected.";
      toast.success(successMsg);

      // Update local state
      setMilestones(milestones.filter((m) => m.milestone._id !== milestoneId));
    } catch (err) {
      toast.error(err.response?.data?.msg || "Action Failed");
    }
  };

  // Helper: Group Milestones by Campaign
  const groupedMilestones = milestones.reduce((acc, item) => {
    if (!acc[item.campaignId]) {
      acc[item.campaignId] = { title: item.campaignTitle, items: [] };
    }
    acc[item.campaignId].items.push(item);
    return acc;
  }, {});

  if (loading)
    return (
      <div className="text-center mt-20 text-emerald-500 animate-pulse font-bold">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen pt-24 px-6 bg-gray-50 dark:bg-black text-gray-900 dark:text-white pb-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
          <FiShield className="text-emerald-500" /> Admin Dashboard
        </h1>

        {/* TABS */}
        <div className="flex gap-4 mb-8 border-b border-gray-800 pb-1">
          <button
            onClick={() => setActiveTab("verifications")}
            className={`pb-3 px-4 font-bold border-b-2 transition-all ${
              activeTab === "verifications"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-gray-500 hover:text-white"
            }`}
          >
            User Verifications ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab("milestones")}
            className={`pb-3 px-4 font-bold border-b-2 transition-all ${
              activeTab === "milestones"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-gray-500 hover:text-white"
            }`}
          >
            Milestone Payouts ({milestones.length})
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-6">
          {activeTab === "verifications" && (
            <div className="grid gap-6">
              {requests.length === 0 ? (
                <p className="text-gray-500 text-center py-20">
                  No pending requests.
                </p>
              ) : (
                requests.map((req) => (
                  <div
                    key={req._id}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center gap-4">
                        {req.avatar ? (
                          <img
                            src={req.avatar}
                            alt={req.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-xl font-bold text-white">
                            {req.name[0]}
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-lg">{req.name}</h3>
                          <p className="text-gray-500 text-sm">{req.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded">
                              Verification Pending
                            </span>
                            {req.verificationData?.submittedAt && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <FiCalendar size={10} />
                                {new Date(
                                  req.verificationData.submittedAt,
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 w-full md:w-auto">
                        <button
                          onClick={() => setVerificationModal(req)}
                          className="flex-1 md:flex-none px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition flex items-center justify-center gap-2"
                        >
                          <FiEye /> View Details
                        </button>
                        <button
                          onClick={() =>
                            handleVerification(req._id, "rejected")
                          }
                          className="flex-1 md:flex-none px-4 py-2 text-sm font-bold text-red-500 bg-red-500/10 rounded-lg hover:bg-red-500/20"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() =>
                            handleVerification(req._id, "approved")
                          }
                          className="flex-1 md:flex-none px-4 py-2 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500"
                        >
                          Verify User
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "milestones" && (
            <div className="space-y-8">
              {Object.keys(groupedMilestones).length === 0 ? (
                <p className="text-gray-500 text-center py-20">
                  No pending milestone payouts.
                </p>
              ) : (
                Object.entries(groupedMilestones).map(
                  ([campaignId, { title, items }]) => (
                    <div
                      key={campaignId}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm"
                    >
                      {/* CAMPAIGN HEADER */}
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                          {title}
                          <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                            {items.length} Requests
                          </span>
                        </h3>
                      </div>

                      {/* MILESTONE LIST */}
                      <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {items.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                          >
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-bold text-base text-gray-800 dark:text-gray-200">
                                  {item.milestone.title}
                                </h4>
                                {item.milestone.status ===
                                  "pending_approval" && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded border border-blue-500/20">
                                    Proof Ready
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 max-w-xl">
                                {item.milestone.description}
                              </p>
                              <div className="mt-2 text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                ৳{item.milestone.amount.toLocaleString()}
                              </div>
                            </div>

                            <div className="flex gap-3 w-full md:w-auto">
                              {/* VIEW PROOF */}
                              {item.milestone.proofUrl && (
                                <button
                                  onClick={() =>
                                    setProofModal({
                                      url: item.milestone.proofUrl,
                                      desc: item.milestone.proofDescription,
                                      title: item.milestone.title,
                                      date: item.milestone.submittedAt,
                                    })
                                  }
                                  className="flex-1 md:flex-none px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition flex items-center justify-center gap-2"
                                >
                                  <FiFileText /> Proof
                                </button>
                              )}

                              {/* REJECT */}
                              <button
                                onClick={() =>
                                  handleMilestoneAction(
                                    campaignId,
                                    item.milestone._id,
                                    "reject",
                                  )
                                }
                                className="flex-1 md:flex-none px-4 py-2 text-sm font-bold text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition"
                              >
                                Reject
                              </button>

                              {/* APPROVE */}
                              <button
                                onClick={() =>
                                  handleMilestoneAction(
                                    campaignId,
                                    item.milestone._id,
                                    "approve",
                                  )
                                }
                                className="flex-1 md:flex-none px-6 py-2 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                              >
                                <FiCheck /> Approve
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                )
              )}
            </div>
          )}
        </div>

        {/* PROOF MODAL */}
        <AnimatePresence>
          {proofModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 border border-gray-700 w-full max-w-2xl rounded-2xl p-6 relative flex flex-col max-h-[90vh]"
              >
                <button
                  onClick={() => setProofModal(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <FiX size={24} />
                </button>
                <h3 className="text-xl font-bold mb-1 text-white">
                  Proof of Work
                </h3>
                <p className="text-emerald-400 text-sm font-bold mb-4">
                  {proofModal.title}
                </p>

                <div className="flex-1 overflow-y-auto min-h-0 bg-black/50 rounded-lg p-2 mb-4 border border-gray-800 flex items-center justify-center">
                  <img
                    src={proofModal.url}
                    alt="Proof"
                    className="max-w-full max-h-[60vh] object-contain rounded"
                  />
                </div>

                <div className="bg-gray-800 p-4 rounded-xl">
                  <p className="text-gray-400 text-xs uppercase font-bold mb-1">
                    Description
                  </p>
                  <p className="text-gray-200 text-sm">{proofModal.desc}</p>
                  <p className="text-gray-500 text-xs mt-2 text-right">
                    Submitted: {new Date(proofModal.date).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* VERIFICATION DETAILS MODAL */}
        <AnimatePresence>
          {verificationModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 w-full max-w-2xl rounded-2xl p-6 relative flex flex-col max-h-[90vh]"
              >
                <button
                  onClick={() => setVerificationModal(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  <FiX size={24} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  {verificationModal.avatar ? (
                    <img
                      src={verificationModal.avatar}
                      alt={verificationModal.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600 dark:text-white">
                      {verificationModal.name[0]}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {verificationModal.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {verificationModal.email}
                    </p>
                    {verificationModal.verificationData?.submittedAt && (
                      <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                        <FiCalendar size={12} />
                        Applied:{" "}
                        {new Date(
                          verificationModal.verificationData.submittedAt,
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Verification Data */}
                <div className="flex-1 overflow-y-auto space-y-4">
                  {/* NID Number */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-1">
                      <FiCreditCard className="text-emerald-500" />
                      <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                        NID Number
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {verificationModal.verificationData?.nidNumber || "N/A"}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-1">
                      <FiPhone className="text-emerald-500" />
                      <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                        Phone Number
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {verificationModal.verificationData?.phone || "N/A"}
                    </p>
                  </div>

                  {/* Address */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-1">
                      <FiMapPin className="text-emerald-500" />
                      <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                        Full Address
                      </span>
                    </div>
                    <p className="text-base text-gray-900 dark:text-white">
                      {verificationModal.verificationData?.address || "N/A"}
                    </p>
                  </div>

                  {/* NID Image */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <FiFileText className="text-emerald-500" />
                      <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                        NID Image
                      </span>
                    </div>
                    {verificationModal.verificationData?.nidImage ? (
                      <div className="bg-black/10 dark:bg-black/50 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                        <img
                          src={verificationModal.verificationData.nidImage}
                          alt="NID Document"
                          className="max-w-full max-h-[300px] object-contain rounded mx-auto cursor-pointer hover:opacity-90 transition"
                          onClick={() =>
                            setNidImageModal({
                              url: verificationModal.verificationData.nidImage,
                            })
                          }
                        />
                        <p className="text-xs text-center text-gray-500 mt-2">
                          Click image to open full size
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500">No image uploaded</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      handleVerification(verificationModal._id, "rejected");
                      setVerificationModal(null);
                    }}
                    className="flex-1 px-4 py-3 text-sm font-bold text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition flex items-center justify-center gap-2"
                  >
                    <FiX /> Reject Request
                  </button>
                  <button
                    onClick={() => {
                      handleVerification(verificationModal._id, "approved");
                      setVerificationModal(null);
                    }}
                    className="flex-1 px-4 py-3 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <FiCheck /> Approve & Verify
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* NID IMAGE MODAL */}
        <AnimatePresence>
          {nidImageModal && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-gray-900 border border-gray-700 w-full max-w-4xl rounded-2xl p-4 relative"
              >
                <button
                  onClick={() => setNidImageModal(null)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-white"
                >
                  <FiX size={24} />
                </button>
                <div className="flex items-center justify-center max-h-[80vh]">
                  <img
                    src={nidImageModal.url}
                    alt="NID Full"
                    className="max-w-full max-h-[80vh] object-contain rounded"
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
