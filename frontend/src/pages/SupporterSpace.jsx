import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiHeart, 
  FiBookOpen, 
  FiGift, 
  FiUsers,
  FiArrowRight,
  FiStar,
  FiShield,
  FiTrendingUp
} from "react-icons/fi";
import axios from "axios";

const SupporterSpace = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get("/api/campaigns");
        const nonprofitCampaigns = res.data
          .filter(c => c.category === "Nonprofit")
          .slice(0, 4);
        setCampaigns(nonprofitCampaigns);
      } catch (err) {
        console.error("Failed to fetch campaigns");
      }
    };
    fetchCampaigns();
  }, []);

  const popularArticles = [
    {
      id: 1,
      title: "10 Random Acts of Kindness Ideas Under $10",
      excerpt: "Surprise someone today with one of these simple but meaningful ideas.",
      author: "TrustFund Team",
      category: "Inspiration"
    },
    {
      id: 2,
      title: "Best Practices for Donating Safely Online",
      excerpt: "Learn how to protect yourself and ensure your donations reach those in need.",
      author: "TrustFund Team",
      category: "Safety"
    },
    {
      id: 3,
      title: "Discover 10 Charities That Change Children's Lives",
      excerpt: "Charities for kids seeking mentorship and medical resources.",
      author: "TrustFund Team",
      category: "Charities"
    },
    {
      id: 4,
      title: "More Ways to Help Beyond Donating",
      excerpt: "You can help further the causes you care about with these ideas.",
      author: "TrustFund Team",
      category: "Tips"
    },
  ];

  const topics = [
    { name: "Holiday Giving", icon: FiGift },
    { name: "Animal Charities", icon: FiHeart },
    { name: "Veterans Support", icon: FiShield },
    { name: "Children's Charities", icon: FiUsers },
    { name: "Humanitarian Aid", icon: FiTrendingUp },
    { name: "Community Stories", icon: FiBookOpen },
  ];

  const givingGuarantee = [
    "100% of your donation goes to the fundraiser",
    "Full refund if something isn't right",
    "24/7 fraud protection and monitoring",
    "Verified organizer identities",
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-medium mb-6">
            <FiStar /> For Supporters
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Supporter Space
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Powerful ways to make a difference with top places to donate, 
            community stories, and tips on giving.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600 transition-colors"
          >
            Find a Fundraiser <FiArrowRight />
          </Link>
        </motion.div>
      </div>

      {/* Popular Articles */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular</h2>
          <Link to="/resources/blog" className="text-emerald-500 font-semibold hover:underline flex items-center gap-1 text-sm">
            See more <FiArrowRight />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to="/resources/tips" className="group block h-full">
                <div className="bg-white dark:bg-gray-900/50 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 transition-all h-full">
                  <div className="p-5">
                    <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 dark:text-white mt-3 mb-2 line-clamp-2 group-hover:text-emerald-500 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      by {article.author}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Featured Charities */}
      {campaigns.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Best Charities to Donate to on TrustFund
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {campaigns.map((campaign) => (
              <Link key={campaign._id} to={`/campaign/${campaign._id}`} className="group block">
                <div className="bg-white dark:bg-gray-900/50 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 transition-all">
                  <div className="h-28 overflow-hidden">
                    <img 
                      src={campaign.image || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=200&fit=crop"} 
                      alt={campaign.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-1 group-hover:text-emerald-500 transition-colors">
                      {campaign.title}
                    </h3>
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ${campaign.currentAmount?.toLocaleString()} raised
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Browse Topics */}
      <div className="bg-gray-50 dark:bg-gray-900/30 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Browse More Topics
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {topics.map((topic, index) => (
              <motion.div
                key={topic.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  to="/resources/ideas"
                  className="group block p-5 bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 transition-all text-center"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-emerald-500/20 transition-colors">
                    <topic.icon className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                    {topic.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Giving Guarantee */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8 border border-gray-200 dark:border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                  <FiShield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  TrustFund Giving Guarantee
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                We protect your donation. If something isn't right, we'll refund your donation in full.
              </p>
              <Link
                to="/resources/how-to-start"
                className="inline-flex items-center gap-2 text-emerald-500 font-semibold hover:underline text-sm"
              >
                Learn more <FiArrowRight />
              </Link>
            </div>
            <div className="space-y-2">
              {givingGuarantee.map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 text-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <FiStar className="w-3 h-3 text-emerald-500" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Explore verified charitable organizations making a real difference.
          </p>
          <Link
            to="/dashboard?category=Nonprofit"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600 transition-colors"
          >
            Browse Charities <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SupporterSpace;
