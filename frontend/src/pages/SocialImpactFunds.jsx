import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiHeart, 
  FiHome, 
  FiCloud, 
  FiBook, 
  FiDroplet,
  FiArrowRight,
  FiCheck
} from "react-icons/fi";
import axios from "axios";

const SocialImpactFunds = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get("/api/campaigns");
        // Get Medical campaigns for display
        const medicalCampaigns = res.data
          .filter(c => c.category === "Medical")
          .slice(0, 4);
        setCampaigns(medicalCampaigns);
      } catch (err) {
        console.error("Failed to fetch campaigns");
      }
    };
    fetchCampaigns();
  }, []);

  const funds = [
    {
      id: 1,
      title: "The Essentials Fund",
      description: "Every day, hundreds of people start fundraisers for basic necessities like food, housing, and utilities. The Essentials Fund distributes cash grants to help individuals make ends meet.",
      icon: FiHome,
      raised: "$2.5M+",
      helped: "5,000+ families",
      image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=400&fit=crop"
    },
    {
      id: 2,
      title: "The Weather Resilience Fund",
      description: "The Weather Resilience Fund supports local resilience efforts, ensuring that vulnerable communities are better prepared for increasingly intense weather conditions.",
      icon: FiCloud,
      raised: "$1.8M+",
      helped: "50+ communities",
      image: "https://images.unsplash.com/photo-1527482937786-6f4c6d7c0a9b?w=800&h=400&fit=crop"
    },
    {
      id: 3,
      title: "The Education & Opportunity Fund",
      description: "Teachers often spend their own money to give their students the best learning experience possible. This fund supports educators and organizations dedicated to helping students grow.",
      icon: FiBook,
      raised: "$1.2M+",
      helped: "200+ schools",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop"
    },
    {
      id: 4,
      title: "Clean Water Initiative Fund",
      description: "Access to clean water is a basic human right. This fund helps install water purification systems and wells in communities where families drink contaminated water.",
      icon: FiDroplet,
      raised: "$800K+",
      helped: "30+ villages",
      image: "https://images.unsplash.com/photo-1541544741670-3f9f3984e95f?w=800&h=400&fit=crop"
    },
  ];

  const impactStats = [
    { label: "Total Distributed", value: "$6.3M+" },
    { label: "Lives Impacted", value: "50,000+" },
    { label: "Partner Organizations", value: "200+" },
    { label: "Countries Reached", value: "15+" },
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
            <FiHeart /> Powered by TrustFund
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Social Impact Funds
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Donate to a cause that directly impacts millions of people in need. 
            Your contribution goes to verified programs making real change.
          </p>
          <Link
            to="/dashboard?category=Medical"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600 transition-colors"
          >
            Browse All Funds <FiArrowRight />
          </Link>
        </motion.div>
      </div>

      {/* Impact Stats */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {impactStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-5 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-white/10"
            >
              <div className="text-2xl font-bold text-emerald-500 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Funds Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Choose a Fund to Support
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {funds.map((fund, index) => (
            <motion.div
              key={fund.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white dark:bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 transition-all">
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={fund.image}
                    alt={fund.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute top-4 left-4">
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md">
                      <fund.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-bold text-white">{fund.title}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {fund.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-emerald-500 font-semibold">{fund.raised}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">raised</span>
                    </div>
                    <div>
                      <span className="text-emerald-500 font-semibold">{fund.helped}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    to="/dashboard?category=Medical"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors"
                  >
                    Donate Now <FiArrowRight />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Active Medical Campaigns */}
      {campaigns.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Active Medical Campaigns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campaigns.map((campaign) => (
              <Link key={campaign._id} to={`/campaign/${campaign._id}`} className="group block">
                <div className="bg-white dark:bg-gray-900/50 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 transition-all">
                  <div className="h-32 overflow-hidden">
                    <img 
                      src={campaign.image || "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop"} 
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
                      ${campaign.currentAmount?.toLocaleString()} of ${campaign.targetAmount?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8 border border-gray-200 dark:border-white/10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            How Your Donation Makes Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "You Donate", desc: "100% of your donation goes directly to the fund" },
              { step: "2", title: "We Verify", desc: "Our team identifies verified individuals in need" },
              { step: "3", title: "Funds Distributed", desc: "Cash grants are sent directly to those who need them" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap justify-center gap-6 text-center">
          {["Verified Organizations", "Transparent Reporting", "100% Goes to Cause", "Tax Deductible"].map((item) => (
            <div key={item} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
              <FiCheck className="text-emerald-500" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialImpactFunds;
