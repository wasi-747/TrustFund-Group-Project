import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiArrowRight,
  FiHeart,
  FiAlertTriangle,
  FiBook,
  FiUsers,
  FiTrendingUp
} from "react-icons/fi";
import axios from "axios";

const FundraisingCategories = () => {
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
    { id: "Medical", title: "Medical", icon: FiHeart, desc: "Medical treatments, surgeries, healthcare costs" },
    { id: "Emergency", title: "Emergency", icon: FiAlertTriangle, desc: "Disaster relief, crisis response, urgent needs" },
    { id: "Education", title: "Education", icon: FiBook, desc: "Scholarships, tuition, school supplies" },
    { id: "Nonprofit", title: "Nonprofit", icon: FiUsers, desc: "Charity fundraisers, nonprofit organizations" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Fundraising Categories
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Choose a category that best fits your fundraising needs. Each category has 
            unique tips and resources to help you succeed.
          </p>
        </motion.div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`/dashboard?category=${cat.id}`} className="group block">
                <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <cat.icon className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                          {cat.title}
                        </h3>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <FiTrendingUp className="w-4 h-4" />
                          {categoryCounts[cat.id] || 0} campaigns
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{cat.desc}</p>
                      <span className="text-sm font-medium text-emerald-500 flex items-center gap-1">
                        Browse {cat.title} <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to start fundraising?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Choose your category and create your fundraiser in minutes.
          </p>
          <Link
            to="/create-campaign"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600 transition-colors"
          >
            Start a TrustFund <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FundraisingCategories;
