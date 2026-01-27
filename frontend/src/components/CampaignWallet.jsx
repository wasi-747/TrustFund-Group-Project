import React, { useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiLock,
  FiCheckCircle,
  FiDollarSign,
  FiArrowUpRight,
  FiArrowDownRight,
} from "react-icons/fi";

const methods = [
  { id: "bkash", label: "bKash" },
  { id: "nagad", label: "Nagad" },
  { id: "rocket", label: "Rocket" },
  { id: "bank", label: "Bank Transfer" },
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const CampaignWallet = ({ campaign, onWithdrawSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState(0);
  const [gatewayStep, setGatewayStep] = useState("idle");
  const [trxId, setTrxId] = useState(null);

  const wallet = campaign.wallet || {};
  const available = wallet.availableBalance || 0;
  const withdrawn = wallet.totalWithdrawn || campaign.withdrawnAmount || 0;
  const locked = useMemo(() => {
    const totalRaised = wallet.totalRaised || campaign.currentAmount || 0;
    const calc = totalRaised - available - withdrawn;
    return Math.max(calc, wallet.lockedAmount || 0);
  }, [wallet, campaign.currentAmount, available, withdrawn]);

  const openModal = () => {
    setShowModal(true);
    setAmount(available);
    setSelectedMethod(null);
    setAccountNumber("");
    setGatewayStep("idle");
    setTrxId(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setGatewayStep("idle");
  };

  const startWithdraw = async () => {
    if (!selectedMethod) return toast.warning("Select a withdrawal method");
    if (!accountNumber) return toast.warning("Enter an account number");
    const numeric = Number(amount) || 0;
    if (numeric <= 0) return toast.warning("Enter an amount to withdraw");
    if (numeric > available)
      return toast.error("Amount exceeds available balance");

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to withdraw");
      return;
    }

    try {
      setGatewayStep("connecting");
      await wait(2000);
      setGatewayStep("processing");
      await wait(1000);

      const res = await axios.post(
        `/api/campaigns/${campaign._id}/withdraw`,
        {
          amount: numeric,
          method: selectedMethod,
          accountNumber,
        },
        { headers: { "x-auth-token": token } },
      );

      setGatewayStep("success");
      setTrxId(res.data?.trxId);
      toast.success("Withdrawal submitted");
      onWithdrawSuccess?.(res.data?.campaign);
    } catch (err) {
      console.error(err);
      setGatewayStep("idle");
      toast.error(err.response?.data?.msg || "Withdrawal failed");
    }
  };

  return (
    <div className="mb-10 bg-indigo-900/20 border border-indigo-500/30 p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          🏦 Campaign Wallet
        </h3>
        <button
          onClick={openModal}
          disabled={available < 500}
          className="px-4 py-2 rounded-lg font-bold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Withdraw Funds
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-white shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gray-800 text-amber-400">
            <FiLock size={22} />
          </div>
          <div>
            <p className="text-xs uppercase text-gray-400 font-bold">
              Locked in Escrow
            </p>
            <p className="text-2xl font-extrabold">
              ৳{locked.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-white shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gray-800 text-emerald-400">
            <FiCheckCircle size={22} />
          </div>
          <div>
            <p className="text-xs uppercase text-gray-400 font-bold">
              Available to Withdraw
            </p>
            <p className="text-2xl font-extrabold">
              ৳{available.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-white shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gray-800 text-cyan-400">
            <FiDollarSign size={22} />
          </div>
          <div>
            <p className="text-xs uppercase text-gray-400 font-bold">
              Total Withdrawn
            </p>
            <p className="text-2xl font-extrabold">
              ৳{withdrawn.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl p-6 text-white relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-6">Select Withdrawal Method</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {methods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id)}
                  className={`p-3 rounded-xl border text-sm font-bold transition ${
                    selectedMethod === m.id
                      ? "border-emerald-500 text-emerald-400 bg-emerald-500/10"
                      : "border-gray-700 text-gray-300 hover:border-emerald-500/60"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs uppercase text-gray-400 font-bold mb-2">
                  Account Number
                </label>
                <input
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-3 rounded-lg bg-black/40 border border-gray-700 focus:border-emerald-500 outline-none"
                  placeholder="Enter destination number"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-gray-400 font-bold mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-3 rounded-lg bg-black/40 border border-gray-700 focus:border-emerald-500 outline-none"
                  placeholder="Max available"
                />
              </div>
            </div>

            <div className="bg-black/40 border border-gray-800 rounded-xl p-4 mb-4">
              {gatewayStep === "idle" && (
                <p className="text-gray-400 text-sm">
                  Ready to connect to mock SSLCommerz gateway.
                </p>
              )}
              {gatewayStep === "connecting" && (
                <p className="text-gray-200 text-sm animate-pulse">
                  Connecting to Gateway...
                </p>
              )}
              {gatewayStep === "processing" && (
                <p className="text-gray-200 text-sm animate-pulse">
                  Processing Payout...
                </p>
              )}
              {gatewayStep === "success" && (
                <div className="text-emerald-400">
                  <p className="font-bold">
                    Success! Funds will settle shortly.
                  </p>
                  {trxId && (
                    <p className="text-sm text-gray-300">
                      Transaction ID: {trxId}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <FiArrowUpRight /> Min withdraw 500 BDT. <FiArrowDownRight />{" "}
                Available: ৳{available.toLocaleString()}
              </div>
              <button
                onClick={startWithdraw}
                disabled={
                  available < 500 ||
                  gatewayStep === "connecting" ||
                  gatewayStep === "processing"
                }
                className="px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-white disabled:opacity-50"
              >
                Confirm Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignWallet;
