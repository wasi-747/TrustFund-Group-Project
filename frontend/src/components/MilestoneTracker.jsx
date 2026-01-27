import React, { useState, useEffect } from "react";
import { FiCheckCircle, FiLock, FiClock, FiUpload, FiX } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import socket from "../utils/socket";

const MilestoneTracker = ({
  milestones,
  releasedAmount,
  campaignId,
  isOwner,
  onRefresh,
}) => {
  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [proofDesc, setProofDesc] = useState("");
  const [uploading, setUploading] = useState(false);

  // ⚡ REAL-TIME UPDATES
  React.useEffect(() => {
    const handleMilestoneUpdated = (data) => {
      if (data.campaignId === campaignId) {
        if (data.status === "approved") {
          toast.success(`✅ Milestone approved. ৳${data.amount} released.`);
        } else if (data.status === "rejected") {
          toast.error(`❌ Milestone rejected.`);
        }
        if (onRefresh) onRefresh();
      }
    };

    socket.on("milestone_updated", handleMilestoneUpdated);
    return () => socket.off("milestone_updated", handleMilestoneUpdated);
  }, [campaignId, onRefresh]);

  // Helper to open modal
  const handleOpenProof = (milestone) => {
    setSelectedMilestone(milestone);
    setShowProofModal(true);
  };

  // Handle Submit
  const handleSubmitProof = async (e) => {
    e.preventDefault();
    if (!proofFile || !proofDesc) {
      return toast.warning(
        "Please provide both an image/file and a description.",
      );
    }

    const formData = new FormData();
    formData.append("campaignId", campaignId);
    formData.append("milestoneId", selectedMilestone._id);
    formData.append("proof", proofFile);
    formData.append("description", proofDesc);

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      await axios.put("/api/campaigns/milestone/submit-proof", formData, {
        headers: {
          "x-auth-token": token,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Proof submitted for review!");
      setShowProofModal(false);
      setProofFile(null);
      setProofDesc("");
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error("Failed to submit proof.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (!milestones || milestones.length === 0) return null;

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center border-b dark:border-white/10 border-gray-100 pb-2">
        <h3 className="text-xl font-bold dark:text-white text-gray-900">
          Milestone Tracker
        </h3>
        <span className="text-emerald-500 font-bold text-sm">
          Released: ৳{releasedAmount?.toLocaleString() || 0}
        </span>
      </div>

      {milestones.map((milestone, index) => {
        const isApproved = milestone.status === "approved";
        const isPending = milestone.status === "pending_approval";

        return (
          <div
            key={milestone._id || index}
            className={`relative pl-8 pb-8 border-l-2 last:pb-0 ${
              isApproved
                ? "border-emerald-500"
                : isPending
                  ? "border-yellow-500"
                  : "border-gray-200 dark:border-gray-800"
            }`}
          >
            {/* Dot Icon */}
            <div
              className={`absolute -left-[11px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white dark:bg-black ${
                isApproved
                  ? "border-emerald-500 text-emerald-500"
                  : isPending
                    ? "border-yellow-500 text-yellow-500"
                    : "border-gray-300 text-gray-400 dark:border-gray-700"
              }`}
            >
              {isApproved ? (
                <FiCheckCircle size={14} />
              ) : isPending ? (
                <FiClock size={14} />
              ) : (
                <FiLock size={14} />
              )}
            </div>

            {/* Content */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                isApproved
                  ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-500/20"
                  : "bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-lg dark:text-white text-gray-900">
                  {milestone.title}
                </h4>
                <span
                  className={`text-xs px-2 py-1 rounded font-bold uppercase ${
                    isApproved
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                      : isPending
                        ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400"
                        : "bg-gray-200 text-gray-500 dark:bg-white/10 dark:text-gray-400"
                  }`}
                >
                  {isApproved ? "Released" : isPending ? "In Review" : "Locked"}
                </span>
              </div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold mb-2">
                ৳{milestone.amount.toLocaleString()}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {milestone.description}
              </p>

              {/* ACTION: Submit Proof (Only for Owner + Locked) */}
              {isOwner && milestone.status === "locked" && (
                <button
                  onClick={() => handleOpenProof(milestone)}
                  className="mt-3 flex items-center gap-2 text-xs font-bold bg-gray-900 text-white dark:bg-white dark:text-black px-3 py-1.5 rounded-lg hover:opacity-80 transition"
                >
                  <FiUpload /> Submit Proof
                </button>
              )}
              {/* Show Status Message if Pending */}
              {isOwner && isPending && (
                <div className="mt-2 text-xs text-yellow-500 font-medium">
                  Proof submitted. Waiting for admin approval.
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Proof Submission Modal */}
      {showProofModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md p-6 rounded-2xl relative border dark:border-gray-800">
            <button
              onClick={() => setShowProofModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <FiX size={24} />
            </button>
            <h3 className="text-xl font-bold mb-4 dark:text-white">
              Submit Proof of Work
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Upload an image (receipt, photo of work) and describe what you did
              to request release of funds for <b>{selectedMilestone?.title}</b>.
            </p>

            <form onSubmit={handleSubmitProof} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Proof Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProofFile(e.target.files[0])}
                  className="w-full text-sm dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Description
                </label>
                <textarea
                  value={proofDesc}
                  onChange={(e) => setProofDesc(e.target.value)}
                  placeholder="e.g., Bought 50 blankets, attached receipt."
                  className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-black text-sm outline-none focus:border-emerald-500"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Submit for Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneTracker;
