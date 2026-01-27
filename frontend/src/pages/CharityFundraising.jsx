import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiArrowRight,
  FiHeart,
  FiShield,
  FiDollarSign,
  FiUsers,
  FiCheck,
  FiStar
} from "react-icons/fi";

const CharityFundraising = () => {
  const features = [
    {
      icon: FiHeart,
      title: "Raise for Any Cause",
      description: "Support local charities, international organizations, or causes you care about."
    },
    {
      icon: FiShield,
      title: "Verified Organizations",
      description: "We verify charitable organizations to ensure your donations reach their intended recipients."
    },
    {
      icon: FiDollarSign,
      title: "Direct Transfers",
      description: "Funds go directly to the charity of your choice with transparent tracking."
    },
    {
      icon: FiUsers,
      title: "Community Support",
      description: "Rally your network to support causes that matter to your community."
    },
  ];

  const howToStart = [
    { step: 1, title: "Choose a charity", desc: "Select a verified nonprofit or create one for an unregistered cause" },
    { step: 2, title: "Set your goal", desc: "Decide how much you want to raise" },
    { step: 3, title: "Tell your story", desc: "Explain why this charity matters to you" },
    { step: 4, title: "Share & fundraise", desc: "Spread the word and watch donations come in" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-medium mb-6">
            <FiHeart /> Charity Fundraising
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Fundraise for a Charity
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Create a fundraiser for your favorite charity or nonprofit organization. 
            100% of donations go to the cause you choose.
          </p>
          <Link
            to="/create-campaign"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600 transition-colors"
          >
            Start Charity Fundraiser <FiArrowRight />
          </Link>
        </motion.div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900/50 p-5 rounded-xl border border-gray-200 dark:border-white/10"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                <feature.icon className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How to Start */}
      <div className="bg-gray-50 dark:bg-gray-900/30 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            How to Start a Charity Fundraiser
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {howToStart.map((item) => (
              <div key={item.step} className="bg-white dark:bg-gray-900/50 p-5 rounded-xl border border-gray-200 dark:border-white/10 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Features */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-wrap justify-center gap-6">
          {["Tax Deductible", "Verified Charities", "Secure Payments", "Transparent Tracking"].map((item) => (
            <div key={item} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <FiCheck className="text-emerald-500" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Support a Cause?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start a charity fundraiser or donate to verified nonprofits today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/create-campaign"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600 transition-colors"
            >
              Start Fundraiser
            </Link>
            <Link
              to="/dashboard?category=Nonprofit"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-full hover:border-emerald-500 hover:text-emerald-500 transition-colors"
            >
              Browse Charities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharityFundraising;
