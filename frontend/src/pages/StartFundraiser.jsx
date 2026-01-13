import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiChevronRight,
  FiChevronLeft,
  FiUploadCloud,
  FiCheck,
  FiVideo,
  FiYoutube,
  FiImage,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";

const StartFundraiser = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // 👇 New State for Validation Loading
  const [isValidating, setIsValidating] = useState(false);

  // New State for AI Titles
  const [suggestedTitles, setSuggestedTitles] = useState([]);

  // Store ALL form data here
  const [formData, setFormData] = useState({
    country: "Bangladesh",
    zipCode: "",
    category: "Medical",
    beneficiaryType: "myself",
    targetAmount: "",
    title: "",
    description: "",
    youtubeLink: "",
  });

  // Media States
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  // --- HANDLERS ---
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImage = (e) => setImageFile(e.target.files[0]);

  const handleVideo = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.warning("Video file is too large! Max 50MB.");
        return;
      }
      setVideoFile(file);
    }
  };

  // --- 🔒 VALIDATION LOGIC ---
  const validateStep = () => {
    switch (step) {
      case 1: // Location & Category
        if (!formData.country.trim()) {
          toast.warning("Please enter your country.");
          return false;
        }
        if (!formData.zipCode.trim()) {
          toast.warning("Please enter a zip code.");
          return false;
        }
        return true;

      case 2: // Goal & Beneficiary
        if (!formData.targetAmount || formData.targetAmount <= 0) {
          toast.warning("Please enter a valid goal amount.");
          return false;
        }
        return true;

      case 3: // Media (BOTH MANDATORY)
        if (!imageFile) {
          toast.warning("⚠️ A cover photo is required to continue.");
          return false;
        }
        if (!videoFile) {
          toast.warning("⚠️ A short video is required to continue.");
          return false;
        }
        return true;

      case 4: // Story Only
        if (!formData.description.trim() || formData.description.length < 20) {
          toast.warning("Please tell us your story (at least 20 chars).");
          return false;
        }
        return true;

      case 5: // Title Only
        if (!formData.title.trim()) {
          toast.warning("Please give your campaign a title.");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  // --- 🤖 SMART NAVIGATION (The Gatekeeper) ---
  const handleNext = async () => {
    // 1. Run basic client-side validation first
    if (!validateStep()) return;

    // 2. SPECIAL CHECK: If we are on Step 4 (Story), validate with AI
    if (step === 4) {
      setIsValidating(true);
      try {
        // Call the AI Validate Endpoint
        // 👇 UPDATED: Removed "http://localhost:5000"
        await axios.post("/api/ai/enhance", {
          text: formData.description,
          action: "validate", // 👈 This triggers the Spam Check
        });

        // ✅ If success (200 OK), AI says it's VALID. Move next.
        setStep(step + 1);
        toast.success("✅ Story Verified!");
      } catch (err) {
        // 🛑 If AI says INVALID (400 Bad Request)
        const msg = err.response?.data?.error || "Story validation failed.";
        toast.error("⚠️ " + msg);
        // We do NOT advance step here. User stays on Step 4.
      } finally {
        setIsValidating(false);
      }
    }
    // 3. For all other steps, just move next normally
    else {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  // --- ⚡ AI: ENHANCE STORY ---
  const handleAIEnhance = async () => {
    const text = formData.description;
    const wordCount = text.trim().split(/\s+/).length;

    if (wordCount < 3) {
      toast.warning("✍️ Please write a few words first!");
      return;
    }

    setLoading(true);
    try {
      // 👇 UPDATED: Converted fetch to axios & removed hardcoded URL
      const response = await axios.post("/api/ai/enhance", {
        text,
        action: "enhance",
      });
      const data = response.data;

      if (data.enhancedText) {
        setFormData({ ...formData, description: data.enhancedText });
        toast.success("✨ Story Enhanced by AI!");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to enhance text");
    } finally {
      setLoading(false);
    }
  };

  // --- ⚡ AI: SUGGEST TITLES ---
  const handleSuggestTitles = async () => {
    const text = formData.description;
    if (text.length < 20) {
      toast.warning("Please write your story in Step 4 first!");
      return;
    }

    setLoading(true);
    try {
      // 👇 UPDATED: Converted fetch to axios & removed hardcoded URL
      const response = await axios.post("/api/ai/enhance", {
        text,
        action: "suggest_title",
      });
      const data = response.data;

      // Backend returns "Title 1 | Title 2 | Title 3" via 'enhancedText'
      if (data.enhancedText) {
        const titles = data.enhancedText.split("|").map((t) => t.trim());
        setSuggestedTitles(titles);
        toast.success("✨ AI Generated Titles!");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to generate titles");
    } finally {
      setLoading(false);
    }
  };

  // --- FINAL SUBMIT ---
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Please Login to Publish!");
      return navigate("/login");
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));

      if (imageFile) data.append("image", imageFile);
      if (videoFile) data.append("video", videoFile);

      // 👇 UPDATED: Removed "http://localhost:5000"
      await axios.post("/api/campaigns/create", data, {
        headers: { "x-auth-token": token },
      });

      toast.success("🚀 Fundraiser Launched Successfully!");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.msg || err.message || "Unknown Error";

      if (err.response?.status === 401 || msg === "Token is not valid") {
        toast.error("⚠️ Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error("❌ Error: " + msg);
      }
    }
  };

  // --- LEFT SIDE CONTENT ---
  const stepContent = {
    1: {
      question: "Where will the funds go?",
      instruction:
        "Choose the primary location and category. This information helps verify your campaign.",
    },
    2: {
      question: "Who are you fundraising for?",
      instruction:
        "Transparency is key. Let donors know who the direct beneficiary is.",
    },
    3: {
      question: "Bring your story to life.",
      instruction:
        "A picture is worth a thousand words, and a video is worth a million. Both are required to build maximum trust.",
    },
    4: {
      question: "Tell your story.",
      instruction:
        "Explain the 'why'. Be honest and detailed. Use our AI tool to refine your grammar.",
    },
    5: {
      question: "Give it a Title.",
      instruction:
        "Create a catchy title. You can write your own or let AI suggest some based on your story!",
    },
    6: {
      question: "Ready to launch?",
      instruction:
        "Review all your details one last time. You are about to make a difference.",
    },
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 lg:px-12 flex justify-center">
      <div className="w-full max-w-6xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Progress Bar (6 Steps) */}
        <div className="w-full bg-gray-800/50 h-1.5">
          <div
            className="bg-gradient-to-r from-emerald-500 to-emerald-300 h-1.5 transition-all duration-500 ease-out"
            style={{ width: `${(step / 6) * 100}%` }}
          ></div>
        </div>

        {/* SPLIT VIEW GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-5 h-full min-h-[600px]">
          {/* --- LEFT SIDE --- */}
          <div className="col-span-2 bg-gray-900/80 p-10 lg:p-16 flex flex-col justify-center border-r border-gray-800/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>

            <div className="relative z-10 animate-fade-in-up">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
                {stepContent[step].question}
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed mb-8">
                {stepContent[step].instruction}
              </p>
            </div>
            <div className="text-emerald-400 text-sm font-semibold uppercase tracking-wider relative z-10">
              Step {step} of 6
            </div>
          </div>

          {/* --- RIGHT SIDE --- */}
          <div className="col-span-3 p-10 lg:p-16 flex flex-col justify-center bg-black/20 overflow-y-auto max-h-[800px]">
            <div className="animate-fade-in">
              {/* STEP 1: Location & Category */}
              {step === 1 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-emerald-500 outline-none transition-all placeholder-gray-500"
                        placeholder="e.g., Bangladesh"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-emerald-500 outline-none transition-all placeholder-gray-500"
                        placeholder="e.g., 1234"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-emerald-500 outline-none transition-all appearance-none"
                    >
                      <option value="Medical">Medical</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Education">Education</option>
                      <option value="Nonprofit">Nonprofit</option>
                    </select>
                  </div>
                  <button
                    onClick={handleNext}
                    className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl mt-4 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    Continue <FiChevronRight className="text-xl" />
                  </button>
                </div>
              )}

              {/* STEP 2: Goal & Beneficiary */}
              {step === 2 && (
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-4">
                      Beneficiary
                    </label>
                    <div className="flex flex-col md:flex-row gap-4">
                      {["myself", "someone-else", "charity"].map((type) => (
                        <button
                          key={type}
                          onClick={() =>
                            setFormData({ ...formData, beneficiaryType: type })
                          }
                          className={`flex-1 p-4 border-2 rounded-xl capitalize transition-all font-medium ${
                            formData.beneficiaryType === type
                              ? "bg-emerald-600/20 border-emerald-500 text-white shadow-sm"
                              : "border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-gray-800/30"
                          }`}
                        >
                          {type.replace("-", " ")}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Goal Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-medium">
                        $
                      </span>
                      <input
                        type="number"
                        name="targetAmount"
                        value={formData.targetAmount}
                        onChange={handleChange}
                        className="w-full p-4 pl-10 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-2xl font-bold focus:border-emerald-500 outline-none transition-all"
                        placeholder="10000"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={prevStep}
                      className="flex-1 bg-gray-800/50 text-gray-300 py-4 rounded-xl hover:bg-gray-700/50 transition-all flex items-center justify-center gap-2 font-medium"
                    >
                      <FiChevronLeft className="text-xl" /> Back
                    </button>
                    {/* 🛠️ FIXED: Changed w-full to flex-1 to fix layout */}
                    <button
                      onClick={handleNext}
                      className="flex-1 bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                      Continue <FiChevronRight className="text-xl" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Media */}
              {step === 3 && (
                <div className="space-y-8">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                      <FiImage className="text-emerald-400" /> Cover Photo{" "}
                      <span className="text-xs text-red-400 font-bold">
                        (Required)
                      </span>
                    </label>
                    <div
                      className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer group ${
                        imageFile
                          ? "border-emerald-500/50 bg-emerald-500/10"
                          : "border-gray-700/80 hover:border-emerald-500/50 hover:bg-gray-800/30"
                      }`}
                    >
                      <input
                        type="file"
                        onChange={handleImage}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        accept="image/*"
                      />
                      <div className="flex flex-col items-center justify-center">
                        {imageFile ? (
                          <>
                            <FiCheck className="text-3xl text-emerald-400 mb-2 animate-bounce" />
                            <span className="font-bold text-sm text-white break-all">
                              {imageFile.name}
                            </span>
                          </>
                        ) : (
                          <>
                            <FiUploadCloud className="text-3xl text-gray-500 mb-2 group-hover:text-emerald-400 transition-colors" />
                            <span className="text-sm font-semibold text-gray-300">
                              Upload Photo
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                      <FiVideo className="text-purple-400" /> Short Video{" "}
                      <span className="text-xs text-red-400 font-bold">
                        (Required)
                      </span>
                    </label>
                    <div
                      className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer group ${
                        videoFile
                          ? "border-purple-500/50 bg-purple-500/10"
                          : "border-gray-700/80 hover:border-purple-500/50 hover:bg-gray-800/30"
                      }`}
                    >
                      <input
                        type="file"
                        onChange={handleVideo}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        accept="video/*"
                      />
                      <div className="flex flex-col items-center justify-center">
                        {videoFile ? (
                          <>
                            <FiCheck className="text-3xl text-purple-400 mb-2 animate-bounce" />
                            <span className="font-bold text-sm text-white break-all">
                              {videoFile.name}
                            </span>
                          </>
                        ) : (
                          <>
                            <FiVideo className="text-3xl text-gray-500 mb-2 group-hover:text-purple-400 transition-colors" />
                            <span className="text-sm font-semibold text-gray-300">
                              Upload Video appeal
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                      <FiYoutube className="text-red-500" /> YouTube Link{" "}
                      <span className="text-xs text-gray-500">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="youtubeLink"
                      value={formData.youtubeLink}
                      onChange={handleChange}
                      className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-red-500/50 outline-none transition-all placeholder-gray-600"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={prevStep}
                      className="flex-1 bg-gray-800/50 text-gray-300 py-4 rounded-xl hover:bg-gray-700/50 transition-all flex items-center justify-center gap-2 font-medium"
                    >
                      <FiChevronLeft className="text-xl" /> Back
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex-1 bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                      Continue <FiChevronRight className="text-xl" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Story Description Only */}
              {step === 4 && (
                <div className="space-y-8">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="12"
                      className="w-full p-5 bg-gray-800/50 border border-gray-700 rounded-xl text-white leading-relaxed focus:border-emerald-500 outline-none transition-all resize-none placeholder-gray-600"
                      placeholder="Explain what happened and how the funds will be used..."
                    ></textarea>
                    {/* ✨ AI BUTTON */}
                    <button
                      onClick={handleAIEnhance}
                      disabled={loading}
                      className={`absolute right-4 bottom-4 px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 border shadow-md backdrop-blur-md ${
                        loading
                          ? "bg-gray-700/80 text-gray-400"
                          : "bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white border-purple-400/30 hover:from-purple-500/90 hover:to-pink-500/90"
                      }`}
                    >
                      {loading ? (
                        "Enhancing..."
                      ) : (
                        <>
                          <BsStars className="text-lg" /> AI Enhance
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={prevStep}
                      className="flex-1 bg-gray-800/50 text-gray-300 py-4 rounded-xl hover:bg-gray-700/50 transition-all flex items-center justify-center gap-2 font-medium"
                    >
                      <FiChevronLeft className="text-xl" /> Back
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={isValidating}
                      className={`flex-1 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg ${
                        isValidating
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20"
                      }`}
                    >
                      {isValidating ? (
                        <>🤖 Validating Story...</>
                      ) : (
                        <>
                          Continue <FiChevronRight className="text-xl" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: Title & AI Suggestions */}
              {step === 5 && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Campaign Title
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="flex-1 p-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-xl font-bold focus:border-emerald-500 outline-none transition-all placeholder-gray-600"
                        placeholder="e.g. Help John Walk Again"
                      />
                      <button
                        onClick={handleSuggestTitles}
                        disabled={loading}
                        className="px-6 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-purple-500/30"
                      >
                        {loading ? (
                          <FiRefreshCw className="animate-spin" />
                        ) : (
                          <BsStars />
                        )}{" "}
                        Suggest
                      </button>
                    </div>
                  </div>

                  {/* Suggestions Display */}
                  {suggestedTitles.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-400">
                        AI Suggestions (Click to apply):
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {suggestedTitles.map((title, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              setFormData({ ...formData, title: title })
                            }
                            className="text-left p-3 rounded-lg bg-purple-900/20 border border-purple-500/30 text-purple-200 hover:bg-purple-600 hover:text-white transition-all text-sm font-medium"
                          >
                            {title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={prevStep}
                      className="flex-1 bg-gray-800/50 text-gray-300 py-4 rounded-xl hover:bg-gray-700/50 transition-all flex items-center justify-center gap-2 font-medium"
                    >
                      <FiChevronLeft className="text-xl" /> Back
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex-1 bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                      Review <FiChevronRight className="text-xl" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: Review & Launch */}
              {step === 6 && (
                <div className="space-y-8">
                  <div className="bg-gray-800/40 p-8 rounded-2xl border border-gray-700/50 space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-emerald-400 uppercase tracking-wider mb-1">
                        Title
                      </h4>
                      <p className="text-2xl font-bold text-white">
                        {formData.title}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-emerald-400 uppercase tracking-wider mb-1">
                          Goal
                        </h4>
                        <p className="text-xl font-semibold text-white">
                          ${formData.targetAmount}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-emerald-400 uppercase tracking-wider mb-1">
                          Category
                        </h4>
                        <p className="text-xl font-semibold text-white">
                          {formData.category}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-emerald-400 uppercase tracking-wider mb-2">
                        Story
                      </h4>
                      <div className="p-5 bg-black/30 rounded-xl border border-white/5 max-h-60 overflow-y-auto">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                          {formData.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={prevStep}
                      className="flex-1 bg-gray-800/50 text-gray-300 py-4 rounded-xl hover:bg-gray-700/50 transition-all flex items-center justify-center gap-2 font-medium"
                    >
                      <FiChevronLeft className="text-xl" /> Edit
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/30 hover:from-emerald-500 hover:to-teal-500 transition-all flex items-center justify-center gap-2"
                    >
                      🚀 Launch Fundraiser
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartFundraiser;
