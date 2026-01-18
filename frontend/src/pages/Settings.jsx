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
            // 👇 Let Axios set Content-Type automatically for FormData
          },
        }
      );
      toast.success("✅ Submitted! Waiting for Admin Approval.");
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
        }
      );
      setUser(res.data);
      toast.success("✅ Profile updated successfully!");
      setProfileData((prev) => ({ ...prev, avatar: null, cover: null }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
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
            onClick={() => toast.info("Coming soon!")}
            className="w-full text-left px-4 py-3 rounded-xl font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 dark:hover:text-white transition-all flex items-center gap-3"
          >
            <FiCreditCard /> Payment Methods
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

              {user.isVerified ? (
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
              ) : user.verificationStatus === "pending" ? (
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
        </div>
      </div>
    </div>
  );
};

export default Settings;
