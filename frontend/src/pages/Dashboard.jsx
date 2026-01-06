import React, { useEffect, useState } from "react";
import axios from "axios";
import CampaignCard from "../components/CampaignCard";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import {
  FiTrash2,
  FiSearch,
  FiAlertTriangle,
  FiShield,
  FiLock,
} from "react-icons/fi";

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const userRes = await axios.get(
              "http://localhost:5000/api/auth/me",
              { headers: { "x-auth-token": token } }
            );
            setUser(userRes.data);
          } catch (e) {
            console.log("Session expired");
          }
        }
        const res = await axios.get("http://localhost:5000/api/campaigns/all");
        setCampaigns(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
    });
    socket.on("donation_received", (data) => {
      setCampaigns((prev) =>
        prev.map((c) =>
          c._id === data.campaignId
            ? { ...c, currentAmount: c.currentAmount + data.amount }
            : c
        )
      );
    });
    return () => socket.disconnect();
  }, []);

  const handleDeleteClick = (id) => setDeleteId(id);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/campaigns/${deleteId}`, {
        headers: { "x-auth-token": token },
      });
      setCampaigns(campaigns.filter((c) => c._id !== deleteId));
      toast.success("🗑️ Campaign Deleted Successfully");
      setDeleteId(null);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Delete Failed");
      setDeleteId(null);
    }
  };

  const filteredCampaigns = campaigns.filter((camp) =>
    camp.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-32 px-6 pb-20 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
        <div>
          <h1 className="text-4xl font-bold dark:text-white text-gray-900 tracking-tight mb-2">
            Marketplace
          </h1>
          <div className="text-gray-500 dark:text-gray-400 text-lg flex items-center gap-2">
            {user ? (
              <>
                <span>
                  Logged in as:{" "}
                  <span className="dark:text-white text-gray-900 font-semibold">
                    {user.name}
                  </span>
                </span>
                {user.isVerified ? (
                  <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase tracking-wide">
                    <FiShield size={10} /> Verified Fundraiser
                  </span>
                ) : (
                  <span className="flex items-center gap-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-xs px-2 py-0.5 rounded-full border border-yellow-500/20 font-bold uppercase tracking-wide">
                    <FiLock size={10} />{" "}
                    {user.verificationStatus === "pending"
                      ? "Pending Review"
                      : "Unverified"}
                  </span>
                )}
              </>
            ) : (
              "Invest in verified campaigns."
            )}
          </div>
        </div>

        <div className="w-full md:w-auto flex gap-4 items-center">
          <div className="relative md:w-80 w-full">
            <FiSearch className="absolute left-3 top-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search campaigns..."
              className="p-3 pl-10 w-full dark:bg-white/5 bg-white border dark:border-white/10 border-gray-200 dark:text-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors rounded-lg shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-20 text-emerald-500 font-medium animate-pulse">
          LOADING DATA...
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="text-center mt-20 text-gray-500">
          No campaigns found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredCampaigns.map((camp) => {
            const ownerId =
              typeof camp.owner === "object" ? camp.owner._id : camp.owner;
            const isOwner = user && user._id === ownerId;
            return (
              <div key={camp._id} className="relative group">
                <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm dark:shadow-none hover:shadow-xl transition-all duration-300">
                  <CampaignCard camp={camp} />
                </div>
                {isOwner && (
                  <button
                    onClick={() => handleDeleteClick(camp._id)}
                    className="absolute top-2 right-2 bg-red-600/90 text-white p-2 rounded-lg hover:bg-red-500 shadow-lg transition-all z-20 opacity-0 group-hover:opacity-100"
                    title="Delete Campaign"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl max-w-sm w-full p-6 relative transform scale-100 transition-all">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <FiAlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-2">
                Delete Campaign?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Are you sure? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white text-gray-700 py-2.5 rounded-xl font-semibold border border-gray-200 dark:border-gray-700"
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

export default Dashboard;
