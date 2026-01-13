import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiCheckCircle, FiArrowLeft } from "react-icons/fi"; // Icons for buttons

const CreateCampaign = () => {
  // 👇 1. Add Step State
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    category: "General",
    deadline: "",
  });
  const [file, setFile] = useState(null);

  // Loading States
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isValidating, setIsValidating] = useState(false); // For the "Next" button

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // AI ENHANCE (Optional helper for Step 1)
  const handleEnhance = async () => {
    const text = formData.description;
    if (text.trim().split(/\s+/).length < 3) {
      alert("Please write a bit more first!");
      return;
    }
    setIsEnhancing(true);
    try {
      // 👇 UPDATED: Removed "http://localhost:5000"
      // Used fetch here, but updated URL. (Ideally switch to axios for consistency)
      const response = await axios.post("/api/ai/enhance", { text });
      const data = response.data;

      setFormData((prev) => ({ ...prev, description: data.enhancedText }));
    } catch (error) {
      alert(error.response?.data?.error || "Failed to enhance");
    } finally {
      setIsEnhancing(false);
    }
  };

  // 👇 2. THE NEW "NEXT" HANDLER (The Gatekeeper)
  const handleNext = async (e) => {
    e.preventDefault();

    // Client-side check
    if (!formData.description || formData.description.length < 20) {
      alert(
        "Please write a meaningful description (at least 20 chars) before continuing."
      );
      return;
    }

    setIsValidating(true);

    try {
      // 🤖 Call AI to VALIDATE the story
      // 👇 UPDATED: Removed "http://localhost:5000"
      const res = await axios.post("/api/ai/enhance", {
        text: formData.description,
        action: "validate", // 👈 Strict Spam Check
      });

      // ✅ If AI says OK (200 status), go to Step 2
      setStep(2);
    } catch (err) {
      // 🛑 If AI says INVALID (400 status)
      const errorMsg = err.response?.data?.error || "Invalid content detected.";
      alert("⚠️ Blocked: " + errorMsg);
      // We do NOT change the step, user stays on Step 1
    } finally {
      setIsValidating(false);
    }
  };

  // FINAL PUBLISH (Step 2)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("targetAmount", formData.targetAmount);
      data.append("category", formData.category);
      if (formData.deadline) data.append("deadline", formData.deadline);
      if (file) data.append("image", file);

      // 👇 UPDATED: Removed "http://localhost:5000"
      await axios.post("/api/campaigns/create", data, {
        headers: { "x-auth-token": token },
      });

      alert("✅ Campaign Created Successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.msg || "Submission Failed";
      alert("Failed: " + errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen pt-24 pb-12 px-4">
      <div className="w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-10 rounded-2xl shadow-2xl relative">
        {/* Progress Indicator */}
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <div
            className={`text-sm font-bold ${
              step === 1 ? "text-emerald-400" : "text-gray-500"
            }`}
          >
            1. Write Story
          </div>
          <div
            className={`text-sm font-bold ${
              step === 2 ? "text-emerald-400" : "text-gray-500"
            }`}
          >
            2. Campaign Details
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {step === 1 ? "Tell Your Story" : "Finalize Details"}
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            {step === 1
              ? "Start with a strong description to unlock the next step."
              : "Add a title and goal to publish."}
          </p>
        </div>

        {/* --- STEP 1: STORY FORM --- */}
        {step === 1 && (
          <form className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Description
                </label>
                <button
                  type="button"
                  onClick={handleEnhance}
                  disabled={isEnhancing}
                  className="text-xs px-3 py-1 rounded-full border border-purple-500/50 text-purple-300 hover:bg-purple-500/20 transition"
                >
                  {isEnhancing ? "✨ Enhancing..." : "✨ AI Enhance"}
                </button>
              </div>

              <textarea
                name="description"
                rows="8"
                value={formData.description}
                className="w-full p-4 rounded-lg bg-white/5 border border-white/10 text-white focus:border-emerald-500 outline-none transition resize-none placeholder-gray-600"
                placeholder="I am raising funds for..."
                onChange={handleChange}
              ></textarea>
            </div>

            {/* 👇 THE GATEKEEPER BUTTON */}
            <button
              onClick={handleNext}
              disabled={isValidating}
              className={`w-full py-4 rounded-lg font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                isValidating
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-500"
              }`}
            >
              {isValidating ? (
                "🤖 Checking with AI..."
              ) : (
                <>
                  Next: Choose Title <FiArrowRight />
                </>
              )}
            </button>
          </form>
        )}

        {/* --- STEP 2: DETAILS FORM --- */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Campaign Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                className="w-full p-4 rounded-lg bg-white/5 border border-white/10 text-white focus:border-emerald-500 outline-none"
                placeholder="e.g. Help John Walk Again"
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Goal Amount ($)
                </label>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  className="w-full p-4 rounded-lg bg-white/5 border border-white/10 text-white focus:border-emerald-500 outline-none"
                  placeholder="10000"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Cover Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-gray-300"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-4 rounded-lg font-bold text-gray-400 bg-white/5 hover:bg-white/10 transition"
              >
                <FiArrowLeft className="inline mr-2" /> Back
              </button>

              <button className="w-2/3 py-4 rounded-lg font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg transition">
                Publish Campaign <FiCheckCircle className="inline ml-2" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateCampaign;
