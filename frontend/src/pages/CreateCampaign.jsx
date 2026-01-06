import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateCampaign = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("targetAmount", targetAmount);
    formData.append("image", image);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/campaigns/add", formData, {
        headers: {
          "x-auth-token": token,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/dashboard");
    } catch (err) {
      alert("Error creating campaign.");
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-10 flex justify-center items-center px-4">
      {/* ✨ Glass Form Container */}
      <div className="glass-card w-full max-w-2xl p-8 rounded-2xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          Start a Fundraiser
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Campaign Title
            </label>
            <input
              type="text"
              className="w-full p-3 rounded-xl input-glow"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Description
            </label>
            <textarea
              className="w-full p-3 rounded-xl input-glow"
              rows="4"
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Target Amount ($)
              </label>
              <input
                type="number"
                className="w-full p-3 rounded-xl input-glow"
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                onChange={handleImageChange}
                required
              />
            </div>
          </div>

          <button className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
            Launch Campaign 🚀
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
