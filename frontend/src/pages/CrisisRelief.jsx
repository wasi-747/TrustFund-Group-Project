import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiAlertTriangle, 
  FiShield, 
  FiUsers, 
  FiDollarSign,
  FiArrowRight,
  FiCheck,
  FiHeart,
  FiZap
} from "react-icons/fi";
import axios from "axios";

const CrisisRelief = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get("/api/campaigns");
        const emergencyCampaigns = res.data
          .filter(c => c.category === "Emergency")
          .slice(0, 6);
        setCampaigns(emergencyCampaigns);
      } catch (err) {
        console.error("Failed to fetch campaigns");
      }
    };
    fetchCampaigns();
  }, []);

  const howWeHelp = [
    {
      icon: FiShield,
      title: "Verified Hub Pages",
      description: "We create dedicated pages for major crises with verified fundraisers."
    },
    {
      icon: FiZap,
      title: "Fast Fund Distribution",
      description: "Our systems ensure funds are distributed quickly to verified individuals."
    },
    {
      icon: FiUsers,
      title: "Expert Coaching",
      description: "We provide guidance on setting up effective fundraisers."
    },
    {
      icon: FiDollarSign,
      title: "Transparent Grants",
      description: "TrustFund provides additional grants to verified campaigns."
    },
  ];

  const faqs = [
    { q: "How does TrustFund stop fraud?", a: "Our Trust & Safety team reviews campaigns 24/7, using advanced technology and human verification." },
    { q: "How much does it cost?", a: "TrustFund is free to start. We only deduct a small platform fee when you receive donations." },
    { q: "How can I withdraw funds?", a: "Once verified, you can withdraw funds to your bank account within 2-5 business days." },
    { q: "What if my campaign is under review?", a: "Reviews typically take 24-48 hours. Continue sharing while we verify your information." },
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
            <FiAlertTriangle /> Crisis Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            When bad things happen, <span className="text-emerald-500">good people show up.</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            TrustFund is here to help you and your community. Discover how to set up a fundraiser 
            for yourself, a loved one, or a nonprofit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/create-campaign"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600 transition-colors"
            >
              Start a Fundraiser <FiArrowRight />
            </Link>
            <Link
              to="/dashboard?category=Emergency"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-full hover:border-emerald-500 hover:text-emerald-500 transition-colors"
            >
              Donate Now
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Active Relief Efforts */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Hubs for Verified Crisis Relief
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-2xl mx-auto">
          These verified campaigns are responding to active crises.
        </p>
        
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign, index) => (
              <motion.div
                key={campaign._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/campaign/${campaign._id}`} className="group block">
                  <div className="bg-white dark:bg-gray-900/50 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 transition-all">
                    {/* Image */}
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={campaign.image || "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&h=300&fit=crop"}
                        alt={campaign.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {campaign.isVerified && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                          <FiCheck className="w-3 h-3" /> Verified
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-emerald-500 transition-colors">
                        {campaign.title}
                      </h3>
                      
                      {/* Progress */}
                      <div className="mb-2">
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-emerald-500">${campaign.currentAmount?.toLocaleString()}</span>
                        <span className="text-gray-500 dark:text-gray-400">of ${campaign.targetAmount?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No active emergency campaigns at the moment.
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            to="/dashboard?category=Emergency"
            className="inline-flex items-center gap-2 text-emerald-500 font-semibold hover:underline"
          >
            View all crisis relief campaigns <FiArrowRight />
          </Link>
        </div>
      </div>

      {/* How We Help */}
      <div className="bg-gray-50 dark:bg-gray-900/30 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            How TrustFund Helps in a Crisis
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
            15 years of expertise, here when you need it most
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {howWeHelp.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900/50 p-5 rounded-xl border border-gray-200 dark:border-white/10"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900/50 p-5 rounded-xl border border-gray-200 dark:border-white/10"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{faq.q}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-emerald-500 rounded-2xl p-8 text-center text-white">
          <FiHeart className="w-10 h-10 mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-3">
            Ready to Help Someone in Need?
          </h2>
          <p className="mb-5 opacity-90 text-sm">
            Your donation can make a real difference in someone's life.
          </p>
          <Link
            to="/dashboard?category=Emergency"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-emerald-600 font-bold rounded-full hover:bg-gray-100 transition-colors"
          >
            Donate Now <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CrisisRelief;
