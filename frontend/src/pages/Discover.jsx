import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FiHeart, 
  FiAlertTriangle, 
  FiBook, 
  FiUsers,
  FiArrowRight,
  FiTrendingUp
} from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";

const Discover = () => {
  const [categoryCounts, setCategoryCounts] = useState({});

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const res = await axios.get("/api/campaigns");
        const counts = {};
        res.data.forEach(campaign => {
          const cat = campaign.category || "Other";
          counts[cat] = (counts[cat] || 0) + 1;
        });
        setCategoryCounts(counts);
      } catch (err) {
        console.error("Failed to fetch campaigns");
      }
    };
    fetchCategoryCounts();
  }, []);

  const categories = [
    {
      id: "Medical",
      title: "Medical",
      description: "Help cover medical expenses, treatments, surgeries, and healthcare costs for those in need.",
      icon: FiHeart,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop"
    },
    {
      id: "Emergency",
      title: "Emergency",
      description: "Support disaster relief, crisis response, and urgent help for families facing unexpected emergencies.",
      icon: FiAlertTriangle,
      image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&h=400&fit=crop"
    },
    {
      id: "Education",
      title: "Education",
      description: "Fund scholarships, school supplies, tuition fees, and educational programs for students.",
      icon: FiBook,
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=400&fit=crop"
    },
    {
      id: "Nonprofit",
      title: "Nonprofit & Charity",
      description: "Support registered nonprofits and charitable organizations making a difference in communities.",
      icon: FiUsers,
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=400&fit=crop"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Browse fundraisers by{" "}
              <span className="text-emerald-500">category</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
              People around the world are raising money for what they are passionate about. 
              Find a cause you care about and make a difference today.
            </p>
            <Link
              to="/create-campaign"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600 transition-colors"
            >
              Start a TrustFund <FiArrowRight />
            </Link>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={cardVariants}>
              <Link to={`/dashboard?category=${category.id}`} className="group block">
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50 hover:border-emerald-500/50 transition-all duration-300">
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    
                    {/* Category Icon */}
                    <div className="absolute top-4 left-4">
                      <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md">
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Campaign Count Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium">
                        <FiTrendingUp className="w-4 h-4" />
                        {categoryCounts[category.id] || 0} campaigns
                      </div>
                    </div>

                    {/* Title on Image */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {category.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-500">
                      Browse {category.title} fundraisers
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-white/10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-500 mb-2">$50M+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Raised</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-500 mb-2">
                {Object.values(categoryCounts).reduce((a, b) => a + b, 0) || "10K+"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Campaigns</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-500 mb-2">500K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Donors</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-500 mb-2">150+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to make a difference?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Whether you're raising funds for yourself, a loved one, or a cause you care about, 
            TrustFund makes it easy to start fundraising.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/create-campaign"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600 transition-colors"
            >
              Start Fundraising
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-full hover:border-emerald-500 hover:text-emerald-500 transition-colors"
            >
              View All Campaigns
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Discover;
