import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { FiTrash2, FiAlertTriangle } from "react-icons/fi";
import MilestoneTracker from "../components/MilestoneTracker";

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState(500);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState("story");

  const [donations, setDonations] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // Withdrawal State
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/campaigns/${id}`
        );
        setCampaign(res.data);
        setDonations(res.data.donators || []);
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
    
    // Listen for new individual donations
    socket.on("new_donation", (data) => {
        if (data.campaignId === id) {
            setDonations(prev => [data.donation, ...prev]);
        }
    });

    // Listen for withdrawal updates
    socket.on("funds_withdrawn", (data) => {
        if (data.campaignId === id) {
             setCampaign(prev => ({
                 ...prev,
                 withdrawnAmount: data.withdrawnAmount
             }));
             toast.info(`💸 Owner withdrew ৳${data.amount}`);
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
        { campaignId: id, amount: donationAmount, isAnonymous },
        { headers: { "x-auth-token": token } }
      );
      if (res.data.url) window.location.replace(res.data.url);
    } catch (err) {
      toast.error(err.response?.data || "Payment Init Failed");
    }
  };

  const handleWithdraw = async () => {
      if (!withdrawAmount || Number(withdrawAmount) <= 0) return toast.warning("Enter a valid amount");
      
      try {
          setIsWithdrawing(true);
          const res = await axios.post(
              "http://localhost:5000/api/campaigns/withdraw",
              { campaignId: id, amount: withdrawAmount },
              { headers: { "x-auth-token": token } }
          );
          setCampaign(res.data);
          toast.success("Funds withdrawn successfully!");
          setWithdrawAmount("");
      } catch (err) {
          toast.error(err.response?.data?.msg || "Withdrawal Failed");
      } finally {
          setIsWithdrawing(false);
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

          {/* 🏦 OWNER WALLET & WITHDRAWAL SECTION */}
          {isOwner && (
              <div className="mb-10 bg-indigo-900/20 border border-indigo-500/30 p-6 rounded-2xl">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          🏦 Campaign Wallet
                      </h3>
                      <div className="text-right">
                          <p className="text-gray-400 text-xs uppercase tracking-wider">Available to Withdraw</p>
                          <p className="text-2xl font-bold text-indigo-400">
                              ৳{((campaign.releasedAmount || 0) - (campaign.withdrawnAmount || 0)).toLocaleString()}
                          </p>
                      </div>
                  </div>

                  <div className="flex gap-4">
                      <div className="flex-1">
                          <input 
                              type="number" 
                              placeholder="Enter amount to withdraw"
                              value={withdrawAmount}
                              onChange={(e) => setWithdrawAmount(e.target.value)}
                              className="w-full p-3 bg-black/40 border border-indigo-500/30 rounded-xl text-white outline-none focus:border-indigo-500 transition-all"
                          />
                      </div>
                      <button 
                          onClick={handleWithdraw}
                          disabled={isWithdrawing}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                          {isWithdrawing ? "Processing..." : "Withdraw Funds"}
                      </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                      * Funds are released only after milestone verification. Withdrawals are instant (Dummy).
                  </p>
              </div>
          )}

          {/* 💰 MILESTONE TRACKER */}
          {/* OLD MILESTONE PLACEMENT REMOVED - MOVED TO TABS */}

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
            <p className="text-xs text-gray-500 mt-2 flex items-center justify-between">
              <span>Minimum donation: 50 BDT</span>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                    type="checkbox" 
                    checked={isAnonymous} 
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-900 text-emerald-500 focus:ring-emerald-500 transition"
                />
                <span className="text-gray-400 group-hover:text-emerald-400 transition-colors font-medium">Donate Anonymously</span>
              </label>
            </p>
          </div>
          </div>

          
          {/* MAIN CARD FOR TABS */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 min-h-[500px]">
              {/* TABS */}
              <div className="flex gap-8 border-b border-gray-700 mb-6">
                {["story", "milestones", "transparency"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${
                            activeTab === tab 
                            ? "text-emerald-400" 
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] rounded-full"></span>
                        )}
                    </button>
                ))}
              </div>

              {/* TAB CONTENT */}
              <div>
                {activeTab === "story" && (
                    <p className="text-gray-300 whitespace-pre-line leading-relaxed animate-fade-in text-lg">
                        {campaign.description}
                    </p>
                )}

                {activeTab === "milestones" && (
                   <div className="animate-fade-in">
                       {campaign.milestones && campaign.milestones.length > 0 ? (
                            <MilestoneTracker
                            milestones={campaign.milestones}
                            releasedAmount={campaign.releasedAmount}
                            campaignId={id}
                            isOwner={user && campaign.owner && (user._id === campaign.owner._id || user._id === campaign.owner)}
                            onRefresh={() => {
                                axios.get(`http://localhost:5000/api/campaigns/${id}`)
                                    .then(res => setCampaign(res.data))
                                    .catch(err => console.error(err));
                            }}
                            />
                       ) : (
                           <p className="text-gray-500 italic">No milestones set for this campaign.</p>
                       )}
                   </div>
                )}

                {activeTab === "transparency" && (
                    <div className="animate-fade-in space-y-6">
                        <div className="bg-emerald-900/10 border border-emerald-500/20 p-6 rounded-2xl">
                            <h4 className="text-emerald-400 font-bold mb-2">🛡️ Public Ledger</h4>
                            <p className="text-sm text-gray-400 mb-4">
                                All withdrawals are verified by our admin team against proof of work.
                                This ensures your donations are used exactly as promised.
                            </p>
                            
                            <div className="overflow-hidden rounded-xl border border-gray-700">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-gray-800 text-gray-200 uppercase font-bold">
                                        <tr>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Purpose</th>
                                            <th className="p-4 text-right">Amount</th>
                                            <th className="p-4 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800 bg-gray-900/50">
                                        {campaign.milestones
                                            .filter(m => m.status === "approved")
                                            .map((m, idx) => (
                                            <tr key={idx}>
                                                <td className="p-4">{new Date(m.updatedAt).toLocaleDateString()}</td>
                                                <td className="p-4 text-white font-medium">{m.title}</td>
                                                <td className="p-4 text-right text-emerald-400 font-bold">৳{m.amount.toLocaleString()}</td>
                                                <td className="p-4 text-center">
                                                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs font-bold border border-emerald-500/20">
                                                        VERIFIED
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {campaign.milestones.filter(m => m.status === "approved").length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="p-8 text-center text-gray-600 italic">
                                                    No funds have been withdrawn yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
              </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - RECENT DONATIONS */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    Live Donations
                </h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {donations.length > 0 ? (
                        donations.map((d, i) => (
                            <div key={i} className="flex gap-3 items-start animate-fade-in-up">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                                    {d.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-300">
                                        <span className="font-bold text-white">{d.name}</span> donated <span className="text-emerald-400 font-bold">৳{d.amount}</span>
                                    </p>
                                    {d.message && (
                                        <p className="text-xs text-gray-500 italic mt-1">"{d.message}"</p>
                                    )}
                                    <p className="text-[10px] text-gray-600 mt-1">{new Date(d.date).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm italic">Be the first to donate!</p>
                    )}
                </div>
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
