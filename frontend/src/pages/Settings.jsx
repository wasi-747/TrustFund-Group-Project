import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiShield,
  FiUser,
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiUploadCloud,
  FiX,
  FiCamera,
  FiImage,
  FiArrowLeft,
  FiAtSign,
  FiType,
  FiDollarSign,
  FiArrowUpRight,
  FiArrowDownRight,
  FiSmartphone,
} from "react-icons/fi";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  const navigate = useNavigate();
  const location = useLocation();

  // --- VERIFICATION STATE ---
  const [verificationData, setVerificationData] = useState({
    nidNumber: "",
    phone: "",
    address: "",
    nidImage: null,
  });
  const [nidPreview, setNidPreview] = useState(null);

  // --- PROFILE DATA STATE ---
  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    avatar: null,
    cover: null,
  });

  const [previews, setPreviews] = useState({
    avatar: null,
    cover: null,
  });

  // --- PAYMENT & WALLET STATE ---
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [newMethod, setNewMethod] = useState({
    brand: "Visa",
    last4: "",
    holder: "",
    expiry: "",
  });
  const [wallet, setWallet] = useState({ balance: 0, pending: 0 });
  const [transactions, setTransactions] = useState([]);
  const [donationHistory, setDonationHistory] = useState([]);
  const [ownedCampaigns, setOwnedCampaigns] = useState([]);
  const [showWithdrawPlanner, setShowWithdrawPlanner] = useState(false);
  const [allocations, setAllocations] = useState([]); // {id,title,available,amount}
  const [withdrawMethod, setWithdrawMethod] = useState("mobile");
  const [withdrawDetails, setWithdrawDetails] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    walletNumber: "",
    note: "",
  });
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);

  const withdrawOptions = [
    {
      id: "mobile",
      label: "Mobile banking (bKash/Nagad/Rocket)",
      descriptor: "Routed via SSLCommerz wallet checkout",
      icon: FiSmartphone,
    },
    {
      id: "card",
      label: "Cards (Visa / Mastercard / Amex)",
      descriptor: "Processed through SSLCommerz card gateway",
      icon: FiCreditCard,
    },
    {
      id: "bank",
      label: "Bank transfer",
      descriptor: "Manual settlement from TrustFund ops",
      icon: FiShield,
    },
  ];

  const sortHistory = (items = []) =>
    [...items].sort(
      (a, b) =>
        new Date(b.createdAt || b.date || 0) -
        new Date(a.createdAt || a.date || 0),
    );

  // 1. Fetch User Data
  useEffect(() => {
    const fetchData = async () => {
      if (location.state && location.state.tab) {
        setActiveTab(location.state.tab);
      }

      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { "x-auth-token": token },
        });
        setUser(res.data);

        setProfileData((prev) => ({
          ...prev,
          name: res.data.name || "",
          username: res.data.username || "",
        }));

        setPreviews({
          avatar: res.data.avatar || null,
          cover: res.data.cover || null,
        });

        // Hydrate payment + wallet data (fallbacks if backend doesn't return them)
        setPaymentMethods(res.data.paymentMethods || []);
        setWallet({
          balance: res.data.walletBalance || 0,
          pending: res.data.pendingPayout || 0,
        });
        setTransactions(sortHistory(res.data.walletHistory || []));

        // Fetch owned campaigns to compute available balances
        try {
          const campRes = await axios.get("/api/campaigns/all", {
            headers: { "x-auth-token": token },
          });
          const mine = (campRes.data || []).filter((c) => {
            const ownerId = typeof c.owner === "object" ? c.owner._id : c.owner;
            return ownerId === res.data._id;
          });
          const withAvail = mine.map((c) => ({
            id: c._id,
            title: c.title,
            available: Number(c.wallet?.availableBalance || 0),
          }));
          setOwnedCampaigns(withAvail);
          const totalAvail = withAvail.reduce((sum, c) => sum + c.available, 0);
          setWallet((prev) => ({ ...prev, balance: totalAvail }));
        } catch (err) {
          console.error(
            "Campaign fetch failed",
            err.response?.data || err.message,
          );
        }

        // Fetch withdrawal history for this user
        try {
          const withdrawalsRes = await axios.get(
            "http://localhost:5000/api/payment/my-withdrawals",
            {
              headers: { "x-auth-token": token },
            },
          );

          const mappedWithdrawals = (withdrawalsRes.data || []).map((w) => ({
            id: w._id,
            type: "withdrawal",
            amount: w.amount,
            status: (w.status || "completed").toLowerCase(),
            createdAt: w.createdAt,
            note: w.method ? `Withdraw via ${w.method}` : "Withdrawal",
          }));

          setTransactions(sortHistory(mappedWithdrawals));
        } catch (err) {
          console.error(
            "Withdrawal history fetch failed",
            err.response?.data || err.message,
          );
        }

        // Fetch donation history so we can render a unified timeline
        try {
          const donationRes = await axios.get(
            "http://localhost:5000/api/payment/my-donations",
            {
              headers: { "x-auth-token": token },
            },
          );

          const mappedDonations = (donationRes.data || []).map((d) => ({
            id: d._id,
            type: "donation",
            amount: d.amount,
            status: (d.status || "paid").toLowerCase(),
            createdAt: d.date,
            note: d.campaignId?.title
              ? `Donated to ${d.campaignId.title}`
              : "Donation",
            campaignTitle: d.campaignId?.title,
            campaignId: d.campaignId?._id || d.campaignId,
          }));

          setDonationHistory(sortHistory(mappedDonations));
        } catch (err) {
          console.error(
            "Donation history fetch failed",
            err.response?.data || err.message,
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.state]);

  // --- HANDLERS ---

  const handleNidChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.warning("File size is too large. Max 5MB allowed.");
        return;
      }
      setVerificationData({ ...verificationData, nidImage: file });
      setNidPreview(URL.createObjectURL(file));
    }
  };

  const submitVerification = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!verificationData.nidImage) {
      toast.error("Please upload an image of your NID.");
      return;
    }

    const formData = new FormData();
    formData.append("nidNumber", verificationData.nidNumber);
    formData.append("phone", verificationData.phone);
    formData.append("address", verificationData.address);
    formData.append("nidImage", verificationData.nidImage);

    try {
      await axios.post(
        "http://localhost:5000/api/verification/submit",
        formData,
        {
          headers: {
            "x-auth-token": token,
          },
        },
      );
      toast.success("Submitted! Waiting for Admin Approval.");
      setUser({ ...user, verificationStatus: "pending" });
    } catch (err) {
      console.error("Submit Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.msg || "Submission Failed");
    }
  };

  const handlePhotoChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.warning("File size too large (Max 5MB)");
        return;
      }
      setProfileData((prev) => ({ ...prev, [type]: file }));
      setPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const removePhoto = (type) => {
    setProfileData((prev) => ({ ...prev, [type]: "REMOVE" }));
    setPreviews((prev) => ({ ...prev, [type]: null }));
  };

  const saveProfileSettings = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("name", profileData.name);
    formData.append("username", profileData.username);

    if (profileData.avatar === "REMOVE")
      formData.append("removeAvatar", "true");
    else if (profileData.avatar) formData.append("avatar", profileData.avatar);

    if (profileData.cover === "REMOVE") formData.append("removeCover", "true");
    else if (profileData.cover) formData.append("cover", profileData.cover);

    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/profile-images",
        formData,
        {
          headers: {
            "x-auth-token": token,
          },
        },
      );
      setUser(res.data);
      toast.success("Profile updated successfully!");
      setProfileData((prev) => ({ ...prev, avatar: null, cover: null }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const maskCard = (last4) => `•••• ${last4 || "____"}`;

  const handleAddPaymentMethod = () => {
    if (!newMethod.holder || !newMethod.last4 || !newMethod.expiry) {
      toast.warning("Please fill all card details");
      return;
    }
    if (newMethod.last4.length !== 4) {
      toast.warning("Card last 4 digits must be 4 numbers");
      return;
    }
    const entry = {
      id: Date.now(),
      brand: newMethod.brand,
      last4: newMethod.last4,
      holder: newMethod.holder,
      expiry: newMethod.expiry,
      addedAt: new Date().toISOString(),
    };
    const updated = [entry, ...paymentMethods];
    setPaymentMethods(updated);
    setNewMethod({ brand: "Visa", last4: "", holder: "", expiry: "" });
    toast.success("Card saved to your account");
  };

  const handleRemoveMethod = (id) => {
    setPaymentMethods(paymentMethods.filter((m) => m.id !== id));
    toast.info("Payment method removed");
  };

  const addDemoBalance = (amount = 5000) => {
    const demoId = "demo-campaign";
    const existing = ownedCampaigns.find((c) => c.id === demoId);
    const updated = existing
      ? ownedCampaigns.map((c) =>
          c.id === demoId ? { ...c, available: c.available + amount } : c,
        )
      : [
          ...ownedCampaigns,
          {
            id: demoId,
            title: "Demo Campaign (Test Withdraw)",
            available: amount,
          },
        ];

    setOwnedCampaigns(updated);
    const totalAvail = updated.reduce(
      (s, c) => s + Number(c.available || 0),
      0,
    );
    setWallet((prev) => ({ ...prev, balance: totalAvail }));
    toast.info(`Added ৳${amount.toLocaleString()} demo balance for testing`);
  };

  const handleStartWithdraw = () => {
    const totalAvail = ownedCampaigns.reduce((s, c) => s + c.available, 0);
    if (totalAvail <= 0) {
      toast.warning("No available balance to withdraw");
      return;
    }

    const spread = ownedCampaigns.map((c) => ({ ...c, amount: c.available }));
    setAllocations(spread);
    setShowWithdrawPlanner(true);
  };

  const updateAllocation = (id, value) => {
    const numeric = Number(value) || 0;
    setAllocations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, amount: numeric } : a)),
    );
  };

  const totalAllocated = allocations.reduce(
    (sum, a) => sum + (Number(a.amount) || 0),
    0,
  );

  const validateWithdrawDetails = () => {
    if (withdrawMethod === "mobile") {
      if (!withdrawDetails.walletNumber.trim()) {
        toast.warning("Enter your mobile wallet number to withdraw");
        return false;
      }
    }

    if (withdrawMethod === "card") {
      if (!withdrawDetails.accountNumber.trim()) {
        toast.warning("Add the card number or last 4 digits");
        return false;
      }
      if (!withdrawDetails.accountName.trim()) {
        toast.warning("Add the name on card for verification");
        return false;
      }
    }

    if (withdrawMethod === "bank") {
      if (!withdrawDetails.accountName.trim()) {
        toast.warning("Bank account holder name is required");
        return false;
      }
      if (!withdrawDetails.bankName.trim()) {
        toast.warning("Bank name is required");
        return false;
      }
      if (!withdrawDetails.accountNumber.trim()) {
        toast.warning("Bank account number is required");
        return false;
      }
    }

    return true;
  };

  const handleConfirmWithdraw = async () => {
    const amount = Number(totalAllocated);
    if (!amount || amount <= 0)
      return toast.warning("Allocate an amount to withdraw");

    const methodLabel =
      withdrawOptions.find((o) => o.id === withdrawMethod)?.label ||
      withdrawMethod;

    if (!validateWithdrawDetails()) return;

    for (const a of allocations) {
      if ((Number(a.amount) || 0) > a.available) {
        return toast.error("Allocation exceeds a campaign's available balance");
      }
    }

    const token = localStorage.getItem("token");
    const allocationsToProcess = allocations.filter(
      (a) => Number(a.amount) > 0,
    );
    if (allocationsToProcess.length === 0)
      return toast.warning("Select at least one campaign to withdraw from");

    setIsSubmittingWithdraw(true);
    const successfulTrx = [];
    const failures = [];

    for (const a of allocationsToProcess) {
      const accountNumber =
        withdrawDetails.walletNumber || withdrawDetails.accountNumber;

      // Allow demo campaigns to bypass backend for testing
      if (a.id === "demo-campaign") {
        successfulTrx.push({
          campaignId: a.id,
          amount: Number(a.amount),
          trxId: `DEMO-${Date.now()}`,
        });
        continue;
      }

      try {
        const resp = await axios.post(
          `/api/campaigns/${a.id}/withdraw`,
          {
            amount: Number(a.amount),
            method: methodLabel,
            accountNumber,
            note: withdrawDetails.note,
          },
          { headers: { "x-auth-token": token } },
        );

        successfulTrx.push({
          campaignId: a.id,
          amount: Number(a.amount),
          trxId: resp.data?.trxId,
        });
      } catch (err) {
        console.error(
          "Withdraw error",
          err.response?.data || err.message || "Unknown error",
        );
        failures.push({
          campaignId: a.id,
          msg: err.response?.data?.msg || "Withdrawal failed",
        });
      }
    }

    if (successfulTrx.length === 0) {
      setIsSubmittingWithdraw(false);
      toast.error(
        failures[0]?.msg || "Could not submit withdrawal. Please try again.",
      );
      return;
    }

    const successIds = new Set(successfulTrx.map((t) => t.campaignId));
    const updatedCampaigns = allocations.map((a) => {
      if (!successIds.has(a.id)) return a;
      const successAmt =
        successfulTrx.find((t) => t.campaignId === a.id)?.amount || 0;
      return {
        ...a,
        available: Math.max(a.available - successAmt, 0),
      };
    });
    setOwnedCampaigns(updatedCampaigns);
    const newTotal = updatedCampaigns.reduce((s, c) => s + c.available, 0);
    setWallet((prev) => ({
      ...prev,
      balance: newTotal,
    }));

    const newEntries = successfulTrx.map((t) => ({
      id: t.trxId || `${t.campaignId}-${Date.now()}`,
      type: "withdrawal",
      amount: t.amount,
      createdAt: new Date().toISOString(),
      status: "completed",
      note: `Withdraw via ${methodLabel}`,
    }));

    setTransactions((prev) => sortHistory([...newEntries, ...(prev || [])]));

    setWithdrawDetails({
      accountName: "",
      accountNumber: "",
      bankName: "",
      walletNumber: "",
      note: "",
    });
    setIsSubmittingWithdraw(false);

    const successTotal = successfulTrx.reduce(
      (s, t) => s + Number(t.amount || 0),
      0,
    );

    toast.success(
      `Withdrawal of ৳${successTotal.toLocaleString()} via ${methodLabel} requested!`,
    );
    setShowWithdrawPlanner(false);
  };

  if (loading)
    return (
      <div className="text-center mt-32 text-emerald-500 animate-pulse">
        Loading Settings...
      </div>
    );

  return (
    <div className="min-h-screen pt-28 px-6 pb-20 max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors font-medium"
      >
        <FiArrowLeft size={20} /> Back
      </button>

      <h1 className="text-3xl font-bold dark:text-white text-gray-900 mb-8">
        Account Settings
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* SIDEBAR */}

        {showWithdrawPlanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-3xl p-6 relative shadow-2xl">
              <button
                onClick={() => setShowWithdrawPlanner(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <FiX size={22} />
              </button>
              <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-2">
                Allocate withdrawal across campaigns
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Total available: ৳
                {ownedCampaigns
                  .reduce((s, c) => s + c.available, 0)
                  .toLocaleString()}{" "}
                • Allocated: ৳{totalAllocated.toLocaleString()}
              </p>

              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {allocations.map((a) => (
                  <div
                    key={a.id}
                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-white/5 bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                  >
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {a.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Available: ৳{a.available.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Allocate</span>
                      <input
                        type="number"
                        min="0"
                        max={a.available}
                        value={a.amount}
                        onChange={(e) => updateAllocation(a.id, e.target.value)}
                        className="w-28 px-3 py-2 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-gray-700 focus:border-emerald-500 outline-none dark:text-white"
                      />
                    </div>
                  </div>
                ))}
                {allocations.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No owned campaigns with available balance.
                  </p>
                )}
              </div>

              <div className="mt-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-white/5 space-y-3">
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                  Withdrawal details
                </h4>

                {withdrawMethod === "mobile" && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                        Wallet number (bKash/Nagad/Rocket)
                      </label>
                      <input
                        type="text"
                        value={withdrawDetails.walletNumber}
                        onChange={(e) =>
                          setWithdrawDetails((prev) => ({
                            ...prev,
                            walletNumber: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-gray-700 focus:border-emerald-500 outline-none dark:text-white"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                  </div>
                )}

                {withdrawMethod === "card" && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                        Name on card
                      </label>
                      <input
                        type="text"
                        value={withdrawDetails.accountName}
                        onChange={(e) =>
                          setWithdrawDetails((prev) => ({
                            ...prev,
                            accountName: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-gray-700 focus:border-emerald-500 outline-none dark:text-white"
                        placeholder="Cardholder name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                        Card number / last 4
                      </label>
                      <input
                        type="text"
                        value={withdrawDetails.accountNumber}
                        onChange={(e) =>
                          setWithdrawDetails((prev) => ({
                            ...prev,
                            accountNumber: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-gray-700 focus:border-emerald-500 outline-none dark:text-white"
                        placeholder="1234"
                      />
                    </div>
                  </div>
                )}

                {withdrawMethod === "bank" && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                        Account holder name
                      </label>
                      <input
                        type="text"
                        value={withdrawDetails.accountName}
                        onChange={(e) =>
                          setWithdrawDetails((prev) => ({
                            ...prev,
                            accountName: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-gray-700 focus:border-emerald-500 outline-none dark:text-white"
                        placeholder="Account holder"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                        Bank name
                      </label>
                      <input
                        type="text"
                        value={withdrawDetails.bankName}
                        onChange={(e) =>
                          setWithdrawDetails((prev) => ({
                            ...prev,
                            bankName: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-gray-700 focus:border-emerald-500 outline-none dark:text-white"
                        placeholder="Bank / branch"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                        Account number
                      </label>
                      <input
                        type="text"
                        value={withdrawDetails.accountNumber}
                        onChange={(e) =>
                          setWithdrawDetails((prev) => ({
                            ...prev,
                            accountNumber: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-gray-700 focus:border-emerald-500 outline-none dark:text-white"
                        placeholder="0000 0000 0000"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Note for TrustFund ops (optional)
                  </label>
                  <textarea
                    value={withdrawDetails.note}
                    onChange={(e) =>
                      setWithdrawDetails((prev) => ({
                        ...prev,
                        note: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-gray-700 focus:border-emerald-500 outline-none dark:text-white h-20"
                    placeholder="Add payout reference, branch code, etc."
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
                <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span>
                    Allocated total: ৳{totalAllocated.toLocaleString()}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {withdrawOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isActive = withdrawMethod === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setWithdrawMethod(opt.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition text-left ${
                            isActive
                              ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400 text-emerald-700 dark:text-emerald-200"
                              : "bg-white dark:bg-black border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                          }`}
                        >
                          <Icon size={16} />
                          <div className="flex flex-col leading-tight text-xs">
                            <span className="font-semibold">{opt.label}</span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {opt.descriptor}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <button
                  onClick={handleConfirmWithdraw}
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md active:scale-95 disabled:opacity-50"
                  disabled={
                    allocations.length === 0 ||
                    totalAllocated <= 0 ||
                    isSubmittingWithdraw
                  }
                >
                  {isSubmittingWithdraw
                    ? "Submitting..."
                    : "Confirm Allocation"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="w-full md:w-64 shrink-0 space-y-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
              activeTab === "profile"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 dark:hover:text-white"
            }`}
          >
            <FiUser /> Profile Details
          </button>
          <button
            onClick={() => setActiveTab("verification")}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
              activeTab === "verification"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 dark:hover:text-white"
            }`}
          >
            <FiShield /> Identity Verification
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
              activeTab === "payments"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 dark:hover:text-white"
            }`}
          >
            <FiCreditCard /> Payment & Wallet
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b dark:border-gray-800 border-gray-100">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <FiUser size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold dark:text-white text-gray-900">
                    Public Profile
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Update your public information
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold dark:text-gray-300 text-gray-700 mb-2">
                      Display Name
                    </label>
                    <div className="relative">
                      <FiType className="absolute left-4 top-3.5 text-gray-500" />
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 focus:border-emerald-500 outline-none dark:text-white text-gray-900 transition-all"
                        placeholder="Your Name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold dark:text-gray-300 text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <FiAtSign className="absolute left-4 top-3.5 text-gray-500" />
                      <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            username: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 focus:border-emerald-500 outline-none dark:text-white text-gray-900 transition-all"
                        placeholder="username"
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-200 dark:bg-gray-800 my-6"></div>

                <div>
                  <label className="block text-sm font-bold dark:text-gray-300 text-gray-700 mb-3">
                    Cover Photo
                  </label>
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-dashed dark:border-gray-700 border-gray-300 group hover:border-emerald-500 transition-all bg-gray-50 dark:bg-black/20">
                    {previews.cover ? (
                      <>
                        <img
                          src={previews.cover}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => removePhoto("cover")}
                            className="bg-red-500/80 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-red-600 transition"
                          >
                            <FiX /> Remove
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-emerald-500 transition-colors">
                        <FiImage size={32} className="mb-2" />
                        <span className="text-sm font-medium">
                          Click to upload cover
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(e, "cover")}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold dark:text-gray-300 text-gray-700 mb-3">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 dark:border-gray-800 border-white shadow-lg group bg-gray-100 dark:bg-gray-800">
                      {previews.avatar ? (
                        <img
                          src={previews.avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FiUser size={32} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <FiCamera className="text-white" size={20} />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoChange(e, "avatar")}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex gap-3">
                        <div className="relative">
                          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-white text-sm font-bold rounded-lg transition">
                            Change
                          </button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePhotoChange(e, "avatar")}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                        {previews.avatar && (
                          <button
                            onClick={() => removePhoto("avatar")}
                            className="px-4 py-2 border dark:border-gray-700 border-gray-300 dark:text-gray-300 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t dark:border-gray-800 border-gray-100 flex justify-end">
                  <button
                    onClick={saveProfileSettings}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "verification" && (
            <div className="dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b dark:border-gray-800 border-gray-100">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <FiShield size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold dark:text-white text-gray-900">
                    Identity Verification
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Required to start fundraising
                  </p>
                </div>
              </div>

              {user?.isVerified ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
                  <FiCheckCircle className="text-5xl text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-2">
                    You are Verified!
                  </h3>
                  <p className="text-gray-500 dark:text-gray-300">
                    Your identity has been confirmed. You can now create
                    unlimited campaigns.
                  </p>
                </div>
              ) : user?.verificationStatus === "pending" ? (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 text-center">
                  <FiClock className="text-5xl text-yellow-500 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-2">
                    Verification Pending
                  </h3>
                  <p className="text-gray-500 dark:text-gray-300">
                    We are reviewing your documents. This usually takes 24
                    hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={submitVerification} className="space-y-6">
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3">
                    <FiAlertCircle className="text-blue-500 mt-1 shrink-0" />
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      Please provide your legal details exactly as they appear
                      on your Government ID.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold dark:text-gray-400 text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="+880 17..."
                        className="w-full dark:bg-black bg-white border dark:border-gray-700 border-gray-300 p-3 rounded-xl dark:text-white text-gray-900 focus:border-emerald-500 outline-none"
                        value={verificationData.phone}
                        onChange={(e) =>
                          setVerificationData({
                            ...verificationData,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold dark:text-gray-400 text-gray-700 mb-2">
                        NID Number
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="National ID No."
                        className="w-full dark:bg-black bg-white border dark:border-gray-700 border-gray-300 p-3 rounded-xl dark:text-white text-gray-900 focus:border-emerald-500 outline-none"
                        value={verificationData.nidNumber}
                        onChange={(e) =>
                          setVerificationData({
                            ...verificationData,
                            nidNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold dark:text-gray-400 text-gray-700 mb-2">
                      Full Address
                    </label>
                    <textarea
                      required
                      placeholder="House, Road, Area, City..."
                      className="w-full dark:bg-black bg-white border dark:border-gray-700 border-gray-300 p-3 rounded-xl dark:text-white text-gray-900 focus:border-emerald-500 outline-none h-24 resize-none"
                      value={verificationData.address}
                      onChange={(e) =>
                        setVerificationData({
                          ...verificationData,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold dark:text-gray-400 text-gray-700 mb-2">
                      Upload NID Photo
                    </label>
                    {!nidPreview ? (
                      <div className="relative border-2 border-dashed dark:border-gray-700 border-gray-300 rounded-xl p-8 text-center hover:border-emerald-500 dark:hover:bg-white/5 hover:bg-gray-50 transition-all group cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleNidChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-12 h-12 dark:bg-gray-800 bg-gray-100 rounded-full flex items-center justify-center text-emerald-500 mb-3 group-hover:scale-110 transition-transform">
                            <FiUploadCloud size={24} />
                          </div>
                          <p className="dark:text-white text-gray-900 font-medium">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            SVG, PNG, JPG (max. 5MB)
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative rounded-xl overflow-hidden border dark:border-gray-700 border-gray-300 bg-gray-100 dark:bg-black group">
                        <img
                          src={nidPreview}
                          alt="NID"
                          className="w-full h-64 object-contain"
                        />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => {
                              setVerificationData({
                                ...verificationData,
                                nidImage: null,
                              });
                              setNidPreview(null);
                            }}
                            className="bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                          >
                            <FiX /> Remove Image
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t dark:border-gray-800 border-gray-100">
                    <button
                      type="submit"
                      disabled={!verificationData.nidImage}
                      className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg ${
                        verificationData.nidImage
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20"
                          : "dark:bg-gray-800 bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Submit Documents
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === "payments" && (
            <div className="dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-3xl p-8 shadow-xl space-y-8">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b dark:border-gray-800 border-gray-100">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <FiCreditCard size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold dark:text-white text-gray-900">
                    Payment Methods & Wallet
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Manage saved cards and track available funds.
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* WALLET */}
                <div className="dark:bg-black/40 bg-gray-50 border dark:border-gray-800 border-gray-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Available Across Campaigns
                      </p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-extrabold text-emerald-500">
                          ৳{wallet.balance.toLocaleString()}
                        </span>
                        <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-bold">
                          BDT
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                        <FiClock /> Pending: ৳{wallet.pending.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-gray-900 border dark:border-gray-800 border-gray-200 shadow-sm text-emerald-500">
                      <FiDollarSign size={26} />
                    </div>
                  </div>

                  <div className="mt-2">
                    <label className="block text-sm font-bold dark:text-gray-300 text-gray-700 mb-2">
                      Withdraw funds
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleStartWithdraw}
                        className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/20 active:scale-95"
                      >
                        Request Withdraw
                      </button>
                      <button
                        onClick={() => addDemoBalance(5000)}
                        className="px-5 py-3 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold shadow-md active:scale-95"
                      >
                        Add Demo Balance
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      Opens the allocation planner so you can choose amounts per
                      campaign. Demo balance withdraws are mocked for testing.
                    </p>
                  </div>

                  <div className="mt-3 p-4 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
                    Locked escrow left after a campaign meets its goal moves
                    into the TrustFund fund so we can donate to urgent cases. A
                    small percentage of that escrow becomes TrustFund revenue to
                    keep operations sustainable.
                  </div>

                  <div className="mt-4 border-t dark:border-gray-800 border-gray-200 pt-4 space-y-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold dark:text-gray-300 text-gray-800">
                        Withdrawal History
                      </p>
                      <span className="text-xs text-gray-500">Latest 10</span>
                    </div>
                    {transactions.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No withdrawals yet.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {transactions.slice(0, 10).map((t) => (
                          <div
                            key={t.id}
                            className="flex items-center justify-between p-3 rounded-xl border dark:border-gray-800 border-gray-200 dark:bg-white/5"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                <FiArrowDownRight />
                              </div>
                              <div>
                                <p className="font-bold dark:text-white text-gray-900 capitalize">
                                  Withdrawal
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(t.createdAt).toLocaleString()}
                                </p>
                                {t.note && (
                                  <p className="text-[11px] text-gray-500">
                                    {t.note}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-extrabold text-gray-900 dark:text-white">
                                ৳{t.amount?.toLocaleString?.() || t.amount}
                              </p>
                              <p className="text-xs text-gray-500 capitalize">
                                {t.status || "pending"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-4 border-t dark:border-gray-800 border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold dark:text-gray-300 text-gray-800">
                          Donation History
                        </p>
                        <span className="text-xs text-gray-500">Latest 10</span>
                      </div>
                      {donationHistory.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          No donations yet.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {donationHistory.slice(0, 10).map((d) => (
                            <div
                              key={d.id}
                              className="flex items-center justify-between p-3 rounded-xl border dark:border-gray-800 border-gray-200 dark:bg-white/5"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                  <FiArrowUpRight />
                                </div>
                                <div>
                                  <p className="font-bold dark:text-white text-gray-900">
                                    Donated ৳
                                    {Number(d.amount || 0).toLocaleString()}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(
                                      d.createdAt || d.date,
                                    ).toLocaleString()}
                                  </p>
                                  {d.note && (
                                    <p className="text-[11px] text-gray-500">
                                      {d.note}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500 capitalize">
                                  {d.status || "paid"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* PAYMENT METHODS */}
                <div className="dark:bg-black/40 bg-gray-50 border dark:border-gray-800 border-gray-200 rounded-2xl p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold dark:text-gray-300 text-gray-800">
                      Saved payment methods
                    </p>
                    <span className="text-xs text-gray-500">
                      Securely stored
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold dark:text-gray-300 text-gray-700 mb-2">
                        Card Brand
                      </label>
                      <select
                        value={newMethod.brand}
                        onChange={(e) =>
                          setNewMethod({ ...newMethod, brand: e.target.value })
                        }
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 focus:border-emerald-500 outline-none dark:text-white text-gray-900"
                      >
                        <option>Visa</option>
                        <option>Mastercard</option>
                        <option>Amex</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold dark:text-gray-300 text-gray-700 mb-2">
                        Last 4 Digits
                      </label>
                      <input
                        type="number"
                        value={newMethod.last4}
                        onChange={(e) =>
                          setNewMethod({ ...newMethod, last4: e.target.value })
                        }
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 focus:border-emerald-500 outline-none dark:text-white text-gray-900"
                        placeholder="1234"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold dark:text-gray-300 text-gray-700 mb-2">
                        Expiry
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newMethod.expiry}
                          onChange={(e) =>
                            setNewMethod({
                              ...newMethod,
                              expiry: e.target.value,
                            })
                          }
                          className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 focus:border-emerald-500 outline-none dark:text-white text-gray-900"
                          placeholder="MM/YY"
                        />
                        <button
                          onClick={handleAddPaymentMethod}
                          className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md active:scale-95"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm font-bold dark:text-gray-300 text-gray-700 mb-2">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        value={newMethod.holder}
                        onChange={(e) =>
                          setNewMethod({ ...newMethod, holder: e.target.value })
                        }
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 focus:border-emerald-500 outline-none dark:text-white text-gray-900"
                        placeholder="Cardholder name"
                      />
                    </div>
                  </div>

                  {paymentMethods.length === 0 ? (
                    <div className="border border-dashed dark:border-gray-700 border-gray-300 rounded-2xl p-6 text-center">
                      <p className="text-sm text-gray-500">
                        No cards saved yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {paymentMethods.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-900 border dark:border-gray-800 border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                              {m.brand?.[0] || "C"}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white">
                                {m.brand} {maskCard(m.last4)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {m.holder} • Exp {m.expiry}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveMethod(m.id)}
                            className="text-sm text-red-500 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
