import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiArrowLeft, FiHeart, FiClock, FiArrowUpRight } from "react-icons/fi";

const YourImpact = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonations = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:5000/api/payment/my-donations",
          {
            headers: { "x-auth-token": token },
          },
        );
        setDonations(res.data || []);
      } catch (err) {
        console.error(
          "Donation history fetch failed",
          err.response?.data || err.message,
        );
        toast.error("Could not load donation history");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [navigate]);

  const totalDonated = useMemo(
    () => donations.reduce((sum, d) => sum + Number(d.amount || 0), 0),
    [donations],
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-28 px-6 pb-16 max-w-5xl mx-auto">
        <div className="text-center text-emerald-500 animate-pulse">
          Loading your impact...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-16 max-w-5xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors font-medium"
      >
        <FiArrowLeft size={18} /> Back
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center">
          <FiHeart size={20} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Impact
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Track where you have donated and how much support you have provided.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Total donated
          </p>
          <p className="text-3xl font-extrabold text-emerald-500 mt-2">
            ৳{totalDonated.toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Donations made
          </p>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
            {donations.length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Last donation
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
            {donations[0]?.date
              ? new Date(donations[0].date).toLocaleString()
              : "—"}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
            Donation history
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <FiClock />
            Chronological order
          </div>
        </div>

        {donations.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            No donations yet. Support a campaign to see it here.
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {donations.map((d) => (
              <div
                key={d._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center">
                    <FiArrowUpRight />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      ৳{Number(d.amount || 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {d.campaignId?.title || "Campaign"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(d.date).toLocaleString()} • Status: {d.status}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Txn:</span>
                  <span className="font-mono text-[11px] text-gray-700 dark:text-gray-200">
                    {d.transactionId}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default YourImpact;
