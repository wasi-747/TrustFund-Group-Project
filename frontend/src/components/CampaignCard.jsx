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
      videoRef.current.currentTime = 0;
    }
  };

  const progressPercentage = Math.min(
    ((camp.currentAmount || 0) / camp.targetAmount) * 100,
    100
  );

  return (
    <div
      className="group card-lift bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 hover:border-emerald-500/40 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(16,185,129,0.15)]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="h-48 overflow-hidden relative bg-gradient-to-br from-gray-900 to-black">
        {/* Base Image */}
        <img
          src={
            camp.image || "https://via.placeholder.com/800x400?text=No+Image"
          }
          alt={camp.title}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isHovered && camp.video 
              ? "opacity-0 scale-110" 
              : "opacity-100 scale-100 group-hover:scale-105"
          }`}
        />

        {/* Hover Video */}
        {camp.video && (
          <video
            ref={videoRef}
            src={camp.video}
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-110"
            }`}
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Tag */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-black/70 backdrop-blur-xl text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
            {camp.category || "General"}
          </span>
        </div>

        {/* Hover Indicator */}
        <div className={`absolute bottom-4 right-4 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full transform transition-all duration-300 ${
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}>
          View Campaign →
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 truncate group-hover:text-emerald-400 transition-colors duration-300">
          {camp.title}
        </h3>
        <p className="text-gray-400 text-sm mb-6 line-clamp-2 h-10 leading-relaxed">
          {camp.description}
        </p>

        {/* Enhanced Progress Section */}
        <div className="mb-4 space-y-3">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="text-xl">${camp.currentAmount || 0}</span>
              <span className="text-xs text-gray-500">raised</span>
            </span>
            <span className="text-gray-400 text-xs">
              of ${camp.targetAmount.toLocaleString()} goal
            </span>
          </div>
          
          {/* Modern Progress Bar with Shimmer */}
          <div className="relative w-full bg-gray-800/50 rounded-full h-2 overflow-hidden border border-white/5">
            <div
              className="progress-shimmer h-2 rounded-full relative transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-emerald-400/30 blur-sm" />
            </div>
          </div>
          
          {/* Progress Percentage */}
          <div className="text-right">
            <span className="text-xs font-medium text-emerald-300">
              {progressPercentage.toFixed(0)}% funded
            </span>
          </div>
        </div>

        {/* Enhanced Button */}
        <Link to={`/campaign/${camp._id}`}>
          <button className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-white/5 to-white/10 hover:from-emerald-600 hover:to-emerald-500 border border-white/10 hover:border-emerald-500/50 text-gray-300 hover:text-white transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 relative overflow-hidden group/btn">
            <span className="relative z-10">View Details</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;
