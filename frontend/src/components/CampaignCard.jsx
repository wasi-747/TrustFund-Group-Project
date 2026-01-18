import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

const CampaignCard = ({ camp }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch((e) => console.log("Autoplay prevented", e));
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reset video to start
    }
  };

  return (
    <div
      className="group bg-white/5 border border-white/10 hover:border-emerald-500/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="h-48 overflow-hidden relative bg-black">
        {/* 1. Base Image (Always visible initially) */}
        <img
          src={
            camp.image || "https://via.placeholder.com/800x400?text=No+Image"
          }
          alt={camp.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isHovered && camp.video ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* 2. Hover Video (Hidden unless hovered) */}
        {camp.video && (
          <video
            ref={videoRef}
            src={camp.video}
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        <div className="absolute top-4 left-4">
          <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
            {camp.category || "General"}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 truncate">
          {camp.title}
        </h3>
        <p className="text-gray-400 text-sm mb-6 line-clamp-2 h-10">
          {camp.description}
        </p>

        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-medium text-gray-400 mb-2">
            <span className="text-emerald-400">
              ${camp.currentAmount || 0} raised
            </span>
            <span>${camp.targetAmount} goal</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{
                width: `${Math.min(
                  ((camp.currentAmount || 0) / camp.targetAmount) * 100,
                  100
                )}%`,
              }}
            ></div>
          </div>
        </div>

        <Link to={`/campaign/${camp._id}`}>
          <button className="w-full py-3 rounded-lg font-semibold text-sm bg-white/5 hover:bg-emerald-600 hover:text-white border border-white/10 hover:border-emerald-600 text-gray-300 transition-all duration-300">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;
