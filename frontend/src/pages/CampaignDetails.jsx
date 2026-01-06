import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { FiTrash2, FiAlertTriangle } from "react-icons/fi";

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState(500);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/campaigns/${id}`
        );
        setCampaign(res.data);
        if (token) {
          try {
            const userRes = await axios.get(
              "http://localhost:5000/api/auth/me",
              {
                headers: { "x-auth-token": token },
              }
            );
            setUser(userRes.data);
          } catch (e) {
            console.log("Token expired");
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id, token]);

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("donation_received", (data) => {
      if (data.campaignId === id) {
        setCampaign((prev) => ({
          ...prev,
          currentAmount: prev.currentAmount + data.amount,
        }));
        toast.success(`🎉 New Donation: ৳${data.amount}!`);
      }
    });
    return () => socket.disconnect();
  }, [id]);

  const handleDonate = async () => {
    if (!token) return toast.warning("Please login to donate!");
    if (!donationAmount || parseInt(donationAmount) < 50) {
      return toast.warning("Minimum donation amount is 50 BDT");
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/payment/init",
        { campaignId: id, amount: donationAmount },
        { headers: { "x-auth-token": token } }
      );
      if (res.data.url) window.location.replace(res.data.url);
    } catch (err) {
      toast.error(err.response?.data || "Payment Init Failed");
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/campaigns/${id}`, {
        headers: { "x-auth-token": token },
      });

      // 👇 UNIFIED POPUP MESSAGE
      toast.success("🗑️ Campaign Deleted Successfully");

      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Delete Failed");
      setShowDeleteModal(false);
    }
  };

  if (!campaign)
    return <div className="text-white text-center mt-20">Loading...</div>;

  const ownerId =
    typeof campaign.owner === "object" ? campaign.owner._id : campaign.owner;
  const isOwner = user && user._id === ownerId;
  const progress = Math.min(
    (campaign.currentAmount / campaign.targetAmount) * 100,
    100
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 max-w-5xl mx-auto">
      <div className="fixed top-24 right-6 z-50 bg-gray-900 border border-gray-700 px-4 py-2 rounded-full flex items-center gap-2 shadow-xl">
        <div
          className={`w-3 h-3 rounded-full ${
            isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
          }`}
        ></div>
        <span className="text-xs font-bold text-gray-300">
          {isConnected ? "LIVE UPDATES ON" : "DISCONNECTED"}
        </span>
      </div>

      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="w-full bg-black relative group">
          {campaign.video ? (
            <video
              src={campaign.video}
              controls
              className="w-full max-h-[600px] object-contain mx-auto"
              poster={campaign.image}
            />
          ) : (
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full h-96 object-cover"
            />
          )}
        </div>

        <div className="p-8 md:p-12">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-white">{campaign.title}</h1>
            {isOwner && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 bg-red-500/10 text-red-500 border border-red-500/50 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all font-semibold"
              >
                <FiTrash2 /> Delete
              </button>
            )}
          </div>

          <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex justify-between text-white mb-2">
              <span className="text-2xl font-bold">
                ৳ {campaign.currentAmount}
              </span>
              <span className="text-gray-400">
                of ৳ {campaign.targetAmount}
              </span>
            </div>
            <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-10 bg-gradient-to-r from-emerald-900/30 to-black p-6 rounded-2xl border border-emerald-500/30">
            <h3 className="text-white font-bold mb-4">Support this Cause</h3>
            <div className="flex gap-4">
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="w-full p-4 bg-black/50 border border-gray-600 rounded-xl text-white outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleDonate}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 rounded-xl"
              >
                Donate
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Minimum donation: 50 BDT
            </p>
          </div>
          <p className="text-gray-300 whitespace-pre-line leading-relaxed">
            {campaign.description}
          </p>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-sm w-full p-6 relative">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/30 mb-4">
              <FiAlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-2">
                Delete Campaign?
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                Are you sure? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-xl font-semibold border border-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-xl font-semibold shadow-lg shadow-red-900/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetails;
