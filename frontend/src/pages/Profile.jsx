import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAdminMode } from "../context/AdminContext";
// 👇 IMPORT ALL ICONS
import {
  FiUser,
  FiEdit3,
  FiShare2,
  FiPlus,
  FiLink,
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiYoutube,
  FiCheckCircle,
  FiShield,
  FiEye,
  FiEyeOff,
  FiX,
  FiBell,
  FiSettings,
  FiCamera,
  FiTrash2,
  FiUpload,
  FiZap,
  FiUsers,
  FiUmbrella,
  FiBook,
  FiSun,
  FiActivity,
  FiGlobe,
  FiLinkedin,
  FiClock,
  FiExternalLink,
} from "react-icons/fi";
import {
  FaDog,
  FaLeaf,
  FaLightbulb,
  FaHandHoldingHeart,
  FaTiktok,
  FaXTwitter,
  FaTwitch,
} from "react-icons/fa6";

// --- 🎨 CONFIGURATION ---
const CAUSES_LIST = [
  {
    id: "animals",
    label: "Animals",
    icon: <FaDog size={32} />,
    color: "#EAB308",
  },
  {
    id: "arts",
    label: "Arts",
    icon: <FaLightbulb size={32} />,
    color: "#A855F7",
  },
  {
    id: "community",
    label: "Community",
    icon: <FiUsers size={32} />,
    color: "#EC4899",
  },
  {
    id: "crisis",
    label: "Crisis",
    icon: <FiUmbrella size={32} />,
    color: "#3B82F6",
  },
  {
    id: "education",
    label: "Education",
    icon: <FiBook size={32} />,
    color: "#10B981",
  },
  {
    id: "environment",
    label: "Nature",
    icon: <FaLeaf size={32} />,
    color: "#22C55E",
  },
  { id: "faith", label: "Faith", icon: <FiSun size={32} />, color: "#F97316" },
  {
    id: "medical",
    label: "Medical",
    icon: <FiActivity size={32} />,
    color: "#EF4444",
  },
  {
    id: "social",
    label: "Social",
    icon: <FaHandHoldingHeart size={32} />,
    color: "#6366F1",
  },
];

const SOCIAL_PLATFORMS = [
  {
    id: "instagram",
    label: "Instagram",
    icon: <FiInstagram />,
    color: "text-pink-500",
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: <FaTiktok />,
    color: "text-black dark:text-white",
  },
  {
    id: "twitter",
    label: "X (Twitter)",
    icon: <FaXTwitter />,
    color: "text-black dark:text-white",
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: <FiFacebook />,
    color: "text-blue-600",
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: <FiYoutube />,
    color: "text-red-600",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: <FiLinkedin />,
    color: "text-blue-700",
  },
  {
    id: "website",
    label: "Website",
    icon: <FiGlobe />,
    color: "text-gray-500",
  },
];

const COLORS = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
];

// --- 🪄 MAGIC STICKER ANIMATIONS ---
const causeVariants = {
  animals: {
    active: {
      y: [0, -8, 0],
      rotate: [0, -5, 5, 0],
      color: "#EAB308",
      transition: {
        duration: 1.2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 1,
      },
    },
    inactive: { color: "#9CA3AF", y: 0, rotate: 0 },
  },
  arts: {
    active: {
      color: "#F59E0B",
      filter: ["drop-shadow(0 0 0px #F59E0B)", "drop-shadow(0 0 15px #F59E0B)"],
      scale: 1.1,
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
    inactive: { color: "#9CA3AF", filter: "none", scale: 1 },
  },
  community: {
    active: {
      scale: [1, 1.15, 1],
      color: "#EC4899",
      transition: { repeat: Infinity, duration: 3, ease: "easeInOut" },
    },
    inactive: { color: "#9CA3AF", scale: 1 },
  },
  crisis: {
    active: {
      scale: 1.2,
      color: "#3B82F6",
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
    inactive: { color: "#9CA3AF", scale: 1 },
  },
  education: {
    active: {
      rotateY: 180,
      color: "#10B981",
      transition: { duration: 1.5, ease: "easeInOut" },
    },
    inactive: { rotateY: 0, color: "#9CA3AF", transition: { duration: 1.5 } },
  },
  environment: {
    active: {
      rotate: [0, 10, -10, 0],
      color: "#22C55E",
      transition: { repeat: Infinity, duration: 4, ease: "easeInOut" },
    },
    inactive: { color: "#9CA3AF", rotate: 0 },
  },
  faith: {
    active: {
      rotate: 360,
      color: "#F97316",
      transition: { repeat: Infinity, duration: 12, ease: "linear" },
    },
    inactive: { color: "#9CA3AF", rotate: 0 },
  },
  medical: {
    active: {
      scale: [1, 1.25, 1],
      color: "#EF4444",
      transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
    },
    inactive: { color: "#9CA3AF", scale: 1 },
  },
  social: {
    active: {
      rotate: [0, -15, 0],
      color: "#6366F1",
      transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
    },
    inactive: { color: "#9CA3AF", rotate: 0 },
  },
};

const ProfileStrengthCircle = ({ percentage, missing }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const safePercentage = isNaN(percentage) ? 0 : percentage;
  const strokeDashoffset =
    circumference - (safePercentage / 100) * circumference;
  const getColor = () =>
    safePercentage < 40
      ? "#ef4444"
      : safePercentage < 80
      ? "#eab308"
      : "#10b981";

  return (
    <div className="relative flex items-center justify-center w-16 h-16 group cursor-help">
      <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 bg-gray-900/95 backdrop-blur border border-gray-700 text-white text-xs p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 pointer-events-none shadow-2xl transform translate-y-2 group-hover:translate-y-0">
        <div className="font-bold mb-2 border-b border-gray-700 pb-1 flex justify-between items-center">
            <span>Completion</span>
            <span className={safePercentage === 100 ? "text-emerald-400" : "text-white"}>{safePercentage}%</span>
        </div>
        {missing && missing.length > 0 ? (
            <div className="space-y-1">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Items to complete:</p>
                <ul className="space-y-1 text-[10px] text-gray-300">
                    {missing.map((item, i) => <li key={i} className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-red-400"></span> {item}</li>)}
                </ul>
            </div>
        ) : (
            <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">🎉 100% Complete! Amazing!</p>
        )}
        {/* Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-gray-900/95"></div>
      </div>
      <svg width="64" height="64" className="transform -rotate-90">
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-gray-200 dark:text-gray-800"
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx="32"
          cy="32"
          r={radius}
          stroke={getColor()}
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-[10px] font-bold dark:text-white text-gray-700">
        {safePercentage}%
      </div>
    </div>
  );
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();

  // ⚙️ MODALS
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showCausesModal, setShowCausesModal] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);
  const [showSocialsModal, setShowSocialsModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);

  // 📝 DATA
  const [bioInput, setBioInput] = useState("");
  const [socialsInput, setSocialsInput] = useState({});
  const [selectedCauses, setSelectedCauses] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [pinInput, setPinInput] = useState({
    title: "",
    desc: "",
    link: "",
    color: "bg-emerald-500",
  });
  const [linkInput, setLinkInput] = useState({ title: "", url: "" });

  const { theme, toggleTheme } = useTheme();
  const { isAdminMode, toggleAdminMode } = useAdminMode(); // 👈 USE CONTEXT

  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const [pendingUploads, setPendingUploads] = useState({
    cover: null,
    avatar: null,
  });
  const [previews, setPreviews] = useState({ cover: null, avatar: null });
  const [activeMenu, setActiveMenu] = useState(null);

  // 1. FETCH USER
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { "x-auth-token": token },
        });
        setUser(res.data);
        setBioInput(res.data.bio || "");
        setSocialsInput(res.data.socials || {});
        setSelectedCauses(res.data.topCauses || []);
        setIsPublic(res.data.isPublic ?? true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    const hasSeenIntro = localStorage.getItem("hasSeenProfileIntro");
    if (!hasSeenIntro) setTimeout(() => setShowOnboarding(true), 500);
  }, []);

  // --- UPDATE LOGIC ---
  const handleUpdateProfile = async (updateData) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    Object.keys(updateData).forEach((key) => {
      if (typeof updateData[key] === "object")
        formData.append(key, JSON.stringify(updateData[key]));
      else formData.append(key, updateData[key]);
    });

    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/profile-update",
        formData,
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser(res.data);
      toast.success("Saved successfully!");
      return true;
    } catch (err) {
      toast.error("Failed to save.");
      return false;
    }
  };

  const saveBio = async () => {
    if (bioInput.trim().length < 20) {
      return toast.warn(
        "Bio is too short! Please write at least 20 characters."
      );
    }
    if (await handleUpdateProfile({ bio: bioInput })) setShowBioModal(false);
  };

  const saveSocials = async () => {
    if (await handleUpdateProfile({ socials: socialsInput }))
      setShowSocialsModal(false);
  };
  const saveCauses = async () => {
    if (await handleUpdateProfile({ topCauses: selectedCauses }))
      setShowCausesModal(false);
  };
  const toggleVisibility = async (val) => {
    setIsPublic(val);
    await handleUpdateProfile({ isPublic: val });
  };

  const handleSavePin = async () => {
    if (!pinInput.title) return toast.warning("Title is required");
    const newPin = { ...pinInput, id: Date.now().toString() };
    const currentPins = user.highlights?.pins || [];
    const updatedHighlights = {
      ...user.highlights,
      pins: [...currentPins, newPin],
    };
    if (await handleUpdateProfile({ highlights: updatedHighlights })) {
      setPinInput({ title: "", desc: "", link: "", color: "bg-emerald-500" });
      setShowPinModal(false);
    }
  };

  const handleDeletePin = async (id) => {
    const updatedPins = user.highlights.pins.filter((p) => p.id !== id);
    const updatedHighlights = { ...user.highlights, pins: updatedPins };
    handleUpdateProfile({ highlights: updatedHighlights });
  };

  const handleSaveLink = async () => {
    if (!linkInput.title || !linkInput.url)
      return toast.warning("Title and URL required");
    const newLink = { ...linkInput, id: Date.now().toString() };
    const currentLinks = user.highlights?.links || [];
    const updatedHighlights = {
      ...user.highlights,
      links: [...currentLinks, newLink],
    };
    if (await handleUpdateProfile({ highlights: updatedHighlights })) {
      setLinkInput({ title: "", url: "" });
      setShowLinkModal(false);
    }
  };

  const handleDeleteLink = async (id) => {
    const updatedLinks = user.highlights.links.filter((l) => l.id !== id);
    const updatedHighlights = { ...user.highlights, links: updatedLinks };
    handleUpdateProfile({ highlights: updatedHighlights });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
      setPendingUploads((prev) => ({ ...prev, [type]: file }));
      setActiveMenu(null);
      toast.info("Image selected. Click 'Save Changes'!");
    }
  };

  const saveImageChanges = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    if (pendingUploads.avatar)
      formData.append(
        pendingUploads.avatar === "REMOVE" ? "removeAvatar" : "avatar",
        pendingUploads.avatar === "REMOVE" ? "true" : pendingUploads.avatar
      );
    if (pendingUploads.cover)
      formData.append(
        pendingUploads.cover === "REMOVE" ? "removeCover" : "cover",
        pendingUploads.cover === "REMOVE" ? "true" : pendingUploads.cover
      );

    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/profile-update",
        formData,
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser(res.data);
      setPendingUploads({ cover: null, avatar: null });
      setPreviews({ cover: null, avatar: null });
      toast.success("Images Saved!");
    } catch (err) {
      toast.error("Failed to save images.");
    }
  };

  const triggerUpload = (type) => {
    if (type === "cover") coverInputRef.current.click();
    if (type === "avatar") avatarInputRef.current.click();
    setActiveMenu(null);
  };

  const handleRemovePhoto = (type) => {
    setPreviews((prev) => ({ ...prev, [type]: "REMOVE" }));
    setPendingUploads((prev) => ({ ...prev, [type]: "REMOVE" }));
    setActiveMenu(null);
  };

  const calculateStrength = () => {
    if (!user) return 0;
    let score = 10;
    if (user.avatar) score += 20;
    if (user.cover) score += 10;
    if (user.bio?.length > 5) score += 20;
    if (user.topCauses?.length > 0) score += 15;
    if (user.socials && Object.values(user.socials).some((v) => v?.length > 0))
      score += 10;
    if (user.highlights?.pins?.length > 0) score += 15;
    return Math.min(score, 100);
  };

  const getMissingItems = () => {
    if (!user) return [];
    const missing = [];
    if (!user.avatar) missing.push("Upload Avatar (+20%)");
    if (!user.cover) missing.push("Upload Cover (+10%)");
    if (!user.bio || user.bio.length < 5) missing.push("Write Bio (+20%)");
    if (!user.topCauses?.length) missing.push("Select Causes (+15%)");
    if (!user.socials || !Object.values(user.socials).some((v) => v?.length > 0))
      missing.push("Link Socials (+10%)");
    if (!user.highlights?.pins?.length) missing.push("Add Check/Highlight (+15%)");
    return missing;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Copied to clipboard!");
  };

  if (loading)
    return (
      <div className="text-center mt-40 text-emerald-500 font-bold text-xl animate-pulse">
        Loading Profile...
      </div>
    );
  if (!user)
    return (
      <div className="text-center mt-40 text-red-500 font-bold">
        Failed to load user. Check Backend.
      </div>
    );

  const displayCover =
    previews.cover && previews.cover !== "REMOVE"
      ? previews.cover
      : previews.cover === "REMOVE"
      ? null
      : user?.cover;
  const displayAvatar =
    previews.avatar && previews.avatar !== "REMOVE"
      ? previews.avatar
      : previews.avatar === "REMOVE"
      ? null
      : user?.avatar;

  return (
    <div className="min-h-screen pt-20 pb-32 dark:bg-black bg-gray-50/30 dark:text-white text-gray-900 transition-colors duration-300">
      <input
        type="file"
        ref={coverInputRef}
        onChange={(e) => handleFileChange(e, "cover")}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={avatarInputRef}
        onChange={(e) => handleFileChange(e, "avatar")}
        accept="image/*"
        className="hidden"
      />

      {/* Floating Save Bar */}
      <AnimatePresence>
        {(pendingUploads.cover || pendingUploads.avatar) && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-10 left-0 right-0 z-[100] flex justify-center pointer-events-none"
          >
            <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 pointer-events-auto border border-emerald-500/50">
              <span className="font-medium text-sm">Unsaved image changes</span>
              <button
                onClick={saveImageChanges}
                className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-sm font-bold"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔴 ADMIN TOGGLE (FIXED TOP RIGHT) */}
      {user && user.role === "admin" && (
        <div className="fixed top-24 right-5 z-[50]">
          <button
            onClick={() => toggleAdminMode(!isAdminMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-xl border transition-all ${
              isAdminMode
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-gray-800 text-gray-400 border-gray-700 hover:text-white"
            }`}
          >
            <FiShield size={18} />
            {isAdminMode ? "Admin Mode: ON" : "Admin Mode: OFF"}
          </button>
        </div>
      )}

      {/* --- MODALS --- */}

      {/* Causes Modal */}
      <AnimatePresence>
        {showCausesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="dark:bg-black/90 bg-white border dark:border-white/10 border-gray-200 w-full max-w-2xl rounded-3xl p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setShowCausesModal(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-red-500"
              >
                <FiX size={24} />
              </button>
              <h2 className="text-3xl font-bold mb-2">Show what you support</h2>
              <p className="text-gray-500 mb-8">
                Tap an icon to add it to your profile.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {CAUSES_LIST.map((cause) => {
                  const isSelected = selectedCauses.includes(cause.id);
                  return (
                    <div
                      key={cause.id}
                      onClick={() => {
                        if (isSelected)
                          setSelectedCauses(
                            selectedCauses.filter((c) => c !== cause.id)
                          );
                        else {
                          if (selectedCauses.length >= 3)
                            toast.warning("Max 3 causes allowed");
                          else setSelectedCauses([...selectedCauses, cause.id]);
                        }
                      }}
                      className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center gap-3 transition-colors duration-200 cursor-pointer ${
                        isSelected
                          ? "border-transparent bg-gray-50 dark:bg-white/10"
                          : "dark:border-white/10 border-gray-200 bg-white dark:bg-transparent hover:border-gray-400"
                      }`}
                    >
                      <motion.div
                        className="text-4xl"
                        variants={causeVariants[cause.id]}
                        whileHover="hover"
                        animate={isSelected ? "active" : "inactive"}
                      >
                        {cause.icon}
                      </motion.div>
                      <span
                        className={`text-sm font-bold ${
                          isSelected
                            ? "text-black dark:text-white"
                            : "text-gray-400"
                        }`}
                      >
                        {cause.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={saveCauses}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bio Modal */}
      <AnimatePresence>
        {showBioModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 w-full max-w-lg rounded-3xl p-6 relative"
            >
              <button
                onClick={() => setShowBioModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
              >
                <FiX size={24} />
              </button>
              <h2 className="text-xl font-bold mb-4">About You</h2>
              <textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                className="w-full h-32 bg-gray-50 dark:bg-black border dark:border-gray-700 border-gray-300 rounded-xl p-4 outline-none resize-none mb-2 focus:border-emerald-500"
                placeholder="Tell your story (minimum 20 characters)..."
              />
              <div className="flex justify-between items-center mb-6">
                <span
                  className={`text-xs ${
                    bioInput.length < 20 ? "text-red-500" : "text-emerald-500"
                  }`}
                >
                  {bioInput.length} / 20 min chars
                </span>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={saveBio}
                  className="bg-emerald-600 text-white font-bold px-6 py-2 rounded-full"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Socials Modal */}
      <AnimatePresence>
        {showSocialsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 w-full max-w-lg rounded-3xl p-6 relative h-[80vh] flex flex-col"
            >
              <button
                onClick={() => setShowSocialsModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
              >
                <FiX size={24} />
              </button>
              <h2 className="text-xl font-bold mb-4">Edit social handles</h2>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {SOCIAL_PLATFORMS.map((p) => (
                  <div key={p.id} className="flex items-center gap-4">
                    <div className={`text-2xl ${p.color}`}>{p.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-bold mb-1">{p.label}</p>
                      <input
                        type="text"
                        placeholder={p.id === "instagram" ? "Username" : "URL"}
                        value={socialsInput[p.id] || ""}
                        onChange={(e) =>
                          setSocialsInput({
                            ...socialsInput,
                            [p.id]: e.target.value,
                          })
                        }
                        className="w-full bg-gray-50 dark:bg-black border dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t dark:border-gray-800 flex justify-end">
                <button
                  onClick={saveSocials}
                  className="bg-emerald-600 text-white font-bold px-8 py-3 rounded-full"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pin & Link Modals */}
      <AnimatePresence>
        {showPinModal && (
          <motion.div className="fixed inset-0 z-[80] bg-black/80 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white dark:bg-gray-900 w-full max-w-md p-6 rounded-3xl relative"
            >
              <button
                onClick={() => setShowPinModal(false)}
                className="absolute top-4 right-4"
              >
                <FiX />
              </button>
              <h2 className="text-xl font-bold mb-4 dark:text-white">
                Add Pin
              </h2>
              <div className="space-y-3">
                <input
                  placeholder="Title"
                  className="w-full p-2 border rounded dark:bg-black dark:border-gray-700 dark:text-white"
                  value={pinInput.title}
                  onChange={(e) =>
                    setPinInput({ ...pinInput, title: e.target.value })
                  }
                />
                <textarea
                  placeholder="Desc"
                  className="w-full p-2 border rounded dark:bg-black dark:border-gray-700 dark:text-white"
                  value={pinInput.desc}
                  onChange={(e) =>
                    setPinInput({ ...pinInput, desc: e.target.value })
                  }
                />
                <input
                  placeholder="Link"
                  className="w-full p-2 border rounded dark:bg-black dark:border-gray-700 dark:text-white"
                  value={pinInput.link}
                  onChange={(e) =>
                    setPinInput({ ...pinInput, link: e.target.value })
                  }
                />
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setPinInput({ ...pinInput, color: c })}
                      className={`w-6 h-6 rounded-full ${c} ${
                        pinInput.color === c
                          ? "ring-2 ring-black dark:ring-white"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={handleSavePin}
                className="mt-4 w-full bg-emerald-600 text-white p-2 rounded-full font-bold"
              >
                Save
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showLinkModal && (
          <motion.div className="fixed inset-0 z-[80] bg-black/80 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white dark:bg-gray-900 w-full max-w-md p-6 rounded-3xl relative"
            >
              <button
                onClick={() => setShowLinkModal(false)}
                className="absolute top-4 right-4"
              >
                <FiX />
              </button>
              <h2 className="text-xl font-bold mb-4 dark:text-white">
                Add Link
              </h2>
              <div className="space-y-3">
                <input
                  placeholder="Title"
                  className="w-full p-2 border rounded dark:bg-black dark:border-gray-700 dark:text-white"
                  value={linkInput.title}
                  onChange={(e) =>
                    setLinkInput({ ...linkInput, title: e.target.value })
                  }
                />
                <input
                  placeholder="URL"
                  className="w-full p-2 border rounded dark:bg-black dark:border-gray-700 dark:text-white"
                  value={linkInput.url}
                  onChange={(e) =>
                    setLinkInput({ ...linkInput, url: e.target.value })
                  }
                />
              </div>
              <button
                onClick={handleSaveLink}
                className="mt-4 w-full bg-emerald-600 text-white p-2 rounded-full font-bold"
              >
                Save
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences Modal */}
      <AnimatePresence>
        {showPreferencesModal && (
          <motion.div className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white dark:bg-black w-full max-w-lg p-6 rounded-3xl relative"
            >
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="absolute top-4 right-4"
              >
                <FiX />
              </button>
              <h2 className="text-2xl font-bold mb-4 dark:text-white">
                Settings
              </h2>
              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Visibility
                </h3>
                <div className="flex gap-2 bg-gray-100 dark:bg-white/10 p-1 rounded-xl">
                  <button
                    onClick={() => toggleVisibility(false)}
                    className={`flex-1 py-2 rounded-lg font-bold ${
                      !isPublic
                        ? "bg-white dark:bg-gray-800 shadow text-emerald-600"
                        : "text-gray-500"
                    }`}
                  >
                    Private
                  </button>
                  <button
                    onClick={() => toggleVisibility(true)}
                    className={`flex-1 py-2 rounded-lg font-bold ${
                      isPublic
                        ? "bg-white dark:bg-gray-800 shadow text-emerald-600"
                        : "text-gray-500"
                    }`}
                  >
                    Public
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Theme
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {["light", "dark", "system"].map((m) => (
                    <button
                      key={m}
                      onClick={() => toggleTheme(m)}
                      className={`p-3 border rounded-xl capitalize ${
                        theme === m
                          ? "border-emerald-500 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                          : ""
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setShowPreferencesModal(false)}
                  className="bg-emerald-600 text-white font-bold px-8 py-3 rounded-full hover:bg-emerald-500 transition"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= PROFILE UI ================= */}
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* HEADER */}
        <div className="relative mb-6 group">
          <div className="h-48 md:h-72 w-full relative rounded-b-[2.5rem] overflow-hidden shadow-xl bg-gray-100 dark:bg-gray-800 border-x border-b dark:border-gray-700 border-gray-200">
            {displayCover ? (
              <img src={displayCover} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800"></div>
            )}
            <button
              onClick={() =>
                setActiveMenu(activeMenu === "cover" ? null : "cover")
              }
              className="absolute top-4 right-4 bg-white/80 dark:bg-black/50 p-2 rounded-full backdrop-blur-sm hover:scale-110 transition shadow-sm"
            >
              <FiCamera className="dark:text-white text-gray-700" />
            </button>
            {activeMenu === "cover" && (
              <div className="absolute top-14 right-4 bg-white dark:bg-gray-900 border dark:border-white/10 rounded-xl shadow-xl w-40 z-40 overflow-hidden">
                <button
                  onClick={() => triggerUpload("cover")}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  Upload New
                </button>
                <button
                  onClick={() => handleRemovePhoto("cover")}
                  className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="relative group/avatar">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-900 shadow-2xl overflow-hidden bg-white dark:bg-gray-800">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-300 dark:text-gray-600">
                    {user?.name?.charAt(0)}
                  </div>
                )}
                <div
                  onClick={() =>
                    setActiveMenu(activeMenu === "avatar" ? null : "avatar")
                  }
                  className="absolute inset-0 bg-black/30 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center cursor-pointer transition-opacity backdrop-blur-[1px]"
                >
                  <FiCamera className="text-white text-2xl" />
                </div>
              </div>
              {activeMenu === "avatar" && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 border dark:border-white/10 rounded-xl shadow-xl w-40 z-50 overflow-hidden">
                  <button
                    onClick={() => triggerUpload("avatar")}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    Upload New
                  </button>
                  <button
                    onClick={() => handleRemovePhoto("avatar")}
                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="text-center pt-16 pb-8">
          <h1 className="text-3xl font-extrabold dark:text-white text-gray-900 flex items-center justify-center gap-2">
            {user?.name}{" "}
            {user?.isVerified && (
              <FiCheckCircle
                className="text-blue-500 text-xl"
                title="Verified"
              />
            )}
          </h1>
          {user?.username && (
            <p className="text-gray-500 font-medium">@{user.username}</p>
          )}

          <div className="flex justify-center items-center gap-6 mt-6 mb-4 text-sm font-medium text-gray-500">
            <span className="hover:text-black dark:hover:text-white cursor-pointer transition">
              <b>0</b> followers
            </span>
            <span className="hover:text-black dark:hover:text-white cursor-pointer transition">
              <b>0</b> following
            </span>
          </div>

          {/* 👁️ VISIBILITY TOGGLE (PILL SHAPE) */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowPreferencesModal(true)}
              className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-4 py-1.5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition"
            >
              {isPublic ? <FiEye /> : <FiEyeOff />}
              <span>
                Your profile is {isPublic ? "public" : "private"}.{" "}
                <span className="underline decoration-emerald-500 decoration-2">
                  Change visibility
                </span>
              </span>
            </button>
          </div>

          {/* 🛡️ VERIFY IDENTITY ALERT (Restored) */}
          {!user?.isVerified && (
            <div className="mb-8">
              <Link
                to="/settings"
                state={{ tab: "verification" }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30 text-xs font-bold hover:bg-yellow-500/20 transition animate-pulse"
              >
                <FiShield size={14} /> Verify Identity to Start Fundraising
              </Link>
            </div>
          )}

          <div className="flex justify-center mb-6">
            <ProfileStrengthCircle percentage={calculateStrength()} missing={getMissingItems()} />
          </div>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 font-bold text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            Share profile
          </button>
        </div>

        {/* 3. PRO STYLE BIO BOX */}
        <div className="mb-12 max-w-2xl mx-auto">
          {user?.bio ? (
            // FILLED STATE
            <div className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 text-center shadow-sm group">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-2 rounded-full text-2xl">
                ❝
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed font-serif italic">
                "{user.bio}"
              </p>
              <button
                onClick={() => setShowBioModal(true)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition"
              >
                <FiEdit3 />
              </button>
            </div>
          ) : (
            // EMPTY STATE
            <div
              className="border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center bg-transparent group hover:border-emerald-500 transition-colors cursor-pointer"
              onClick={() => setShowBioModal(true)}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Tell your story
              </h3>
              <p className="text-sm font-medium text-gray-500 mb-4">
                Tell others what you care about.
              </p>
              <button className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-gray-900 dark:border-white text-gray-900 dark:text-white font-bold text-sm hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                <FiPlus /> Add bio
              </button>
            </div>
          )}
        </div>

        {/* CAUSES - STATIC BOX + MAGIC ICON */}
        <div className="mb-12 text-center">
          {selectedCauses.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6 mb-6">
              {selectedCauses.map((id) => {
                const cause = CAUSES_LIST.find((c) => c.id === id);
                return cause ? (
                  // 🛑 STATIC BOX (NO onClick here, only in modal)
                  <div
                    key={id}
                    className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center gap-3 transition-colors duration-200 cursor-default ${
                      selectedCauses.includes(cause.id)
                        ? "border-transparent bg-gray-50 dark:bg-white/10"
                        : "dark:border-white/10 border-gray-200 bg-white dark:bg-transparent hover:border-gray-400"
                    }`}
                  >
                    {/* 🪄 MAGIC ICON */}
                    <motion.div
                      className="text-4xl"
                      variants={causeVariants[cause.id]}
                      whileHover="hover"
                      animate="active"
                    >
                      {cause.icon}
                    </motion.div>
                    <span
                      className={`text-sm font-bold ${
                        selectedCauses.includes(cause.id)
                          ? "text-black dark:text-white"
                          : "text-gray-400"
                      }`}
                    >
                      {cause.label}
                    </span>
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            // Empty State
            <div className="flex flex-col items-center">
              <div className="flex justify-center gap-3 mb-4 opacity-30 grayscale">
                <div className="w-12 h-12 rounded-2xl bg-pink-200"></div>
                <div className="w-12 h-12 rounded-2xl bg-green-200"></div>
                <div className="w-12 h-12 rounded-2xl bg-blue-200"></div>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                Show the world what you support.
              </p>
              <button
                onClick={() => setShowCausesModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition"
              >
                <FiPlus /> Add causes
              </button>
            </div>
          )}

          {/* EDIT CAUSES BUTTON (Visible if causes exist) */}
          {selectedCauses.length > 0 && (
            <button
              onClick={() => setShowCausesModal(true)}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition"
            >
              <FiEdit3 /> Edit causes
            </button>
          )}
        </div>

        <hr className="border-gray-200 dark:border-gray-800 mb-12" />

        {/* HIGHLIGHTS - FUNCTIONAL MODALS CONNECTED */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold dark:text-white text-gray-900">
              Highlights
            </h3>
            <button
              onClick={() =>
                setActiveMenu(activeMenu === "highlight" ? null : "highlight")
              }
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500"
            >
              <FiEdit3 size={16} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* PINS */}
            {user?.highlights?.pins && user.highlights.pins.length > 0 ? (
              user.highlights.pins.map((pin) => (
                <div
                  key={pin.id}
                  className="relative rounded-2xl p-6 text-white overflow-hidden shadow-lg group"
                >
                  <div
                    className={`absolute inset-0 ${
                      pin.color || "bg-emerald-500"
                    }`}
                  ></div>
                  <div className="relative z-10">
                    <h4 className="font-bold text-lg mb-1">{pin.title}</h4>
                    <p className="text-sm opacity-90 mb-3 line-clamp-2">
                      {pin.desc}
                    </p>
                    <div className="flex justify-between items-center">
                      <a
                        href={pin.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition"
                      >
                        View Link
                      </a>
                      <button
                        onClick={() => {
                          const newPins = user.highlights.pins.filter(
                            (p) => p.id !== pin.id
                          );
                          handleUpdateProfile({
                            highlights: { ...user.highlights, pins: newPins },
                          });
                        }}
                        className="text-white/50 hover:text-white"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Empty Pin State
              <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center bg-transparent">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 w-full h-24 rounded-xl mb-4 flex items-center justify-center text-emerald-500">
                  <FiZap size={32} />
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Highlight a fundraiser or nonprofit by pinning it here.
                </p>
                <button
                  onClick={() => setShowPinModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition"
                >
                  <FiPlus /> Add pin
                </button>
              </div>
            )}

            {/* LINKS */}
            <div className="space-y-3">
              {user?.highlights?.links && user.highlights.links.length > 0 ? (
                user.highlights.links.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-transparent hover:border-emerald-500 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-gray-500">
                        <FiExternalLink />
                      </div>
                      <span className="font-bold text-sm">{link.title}</span>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-500 hover:underline text-xs font-bold"
                      >
                        Open
                      </a>
                      <button
                        onClick={() => {
                          const newLinks = user.highlights.links.filter(
                            (l) => l.id !== link.id
                          );
                          handleUpdateProfile({
                            highlights: { ...user.highlights, links: newLinks },
                          });
                        }}
                        className="text-red-400 hover:text-red-500"
                      >
                        <FiX />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                // Empty Link State
                <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center bg-transparent h-full flex flex-col justify-center items-center">
                  <div className="w-24 h-2 bg-emerald-500 rounded-full mb-6"></div>
                  <p className="text-sm text-gray-500 mb-4">
                    Start adding important links.
                  </p>
                  <button
                    onClick={() => setShowLinkModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition"
                  >
                    <FiPlus /> Add links
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 6. YOUR ACTIVITY */}
        <div className="mb-16 text-center">
          <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-2 flex items-center justify-center gap-2">
            Your activity <FiClock className="text-gray-400" size={16} />
          </h3>
          <p className="text-gray-500 text-sm mb-8">
            No recent activity to display.
          </p>
        </div>

        {/* 7. SOCIALS & FOOTER */}
        <div className="text-center pb-20">
          <div className="flex justify-center items-center gap-4 mb-6 flex-wrap">
            {SOCIAL_PLATFORMS.map((p) => {
              const link = user?.socials?.[p.id];
              if (!link) return null;
              const href =
                p.id === "instagram"
                  ? `https://instagram.com/${link}`
                  : p.id === "twitter"
                  ? `https://x.com/${link}`
                  : link;
              return (
                <a
                  key={p.id}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform ${p.color}`}
                >
                  {p.icon}
                </a>
              );
            })}
          </div>
          <button
            onClick={() => setShowSocialsModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition mb-12"
          >
            <FiPlus /> Add social handles
          </button>

          <div className="relative overflow-hidden rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 md:p-12 text-left flex items-center justify-between">
            <div className="z-10 relative max-w-md">
              <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-2">
                Share your profile and inspire others to help.
              </h2>
              <button
                onClick={handleCopyLink}
                className="mt-4 flex items-center gap-2 text-emerald-600 font-bold hover:underline"
              >
                Share profile <FiShare2 />
              </button>
            </div>
            <div className="hidden md:block absolute right-0 top-0 h-full w-1/3 opacity-50">
              <div className="absolute top-10 right-10 w-16 h-16 rounded-full bg-blue-100 border-4 border-white"></div>
              <div className="absolute bottom-10 right-20 w-12 h-12 rounded-full bg-pink-100 border-4 border-white"></div>
              <div className="absolute top-1/2 right-1/2 w-20 h-20 rounded-full bg-emerald-100 border-4 border-white flex items-center justify-center text-2xl">
                💖
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

