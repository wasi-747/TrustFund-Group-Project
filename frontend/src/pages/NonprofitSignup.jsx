import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiArrowRight,
  FiShield,
  FiDollarSign,
  FiUsers,
  FiCheck,
  FiTrendingUp,
  FiGlobe,
  FiHeart,
  FiMail
} from "react-icons/fi";

const NonprofitSignup = () => {
  const benefits = [
    {
      icon: FiShield,
      title: "Verified Badge",
      description: "Get a verified nonprofit badge that builds donor trust and credibility."
    },
    {
      icon: FiDollarSign,
      title: "Lower Fees",
      description: "Registered nonprofits enjoy reduced platform fees on all donations."
    },
    {
      icon: FiUsers,
      title: "Team Access",
      description: "Add team members to manage campaigns and track donations."
    },
    {
      icon: FiTrendingUp,
      title: "Analytics Dashboard",
      description: "Access detailed analytics and reporting for your fundraising efforts."
    },
    {
      icon: FiGlobe,
      title: "Custom Page",
      description: "Create a branded organization page to showcase all your campaigns."
    },
    {
      icon: FiMail,
      title: "Donor Management",
      description: "Access donor information to build lasting relationships."
    },
  ];

  const requirements = [
    "Valid 501(c)(3) or equivalent nonprofit registration",
    "EIN or Tax ID number",
    "Organization bank account",
    "Authorized representative contact"
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
            <FiShield /> For Nonprofits
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Sign Up as a Nonprofit
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            TrustFund for Nonprofits helps charitable organizations raise more with 
            verified status, lower fees, and powerful fundraising tools.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600 transition-colors"
          >
            Register Your Nonprofit <FiArrowRight />
          </Link>
        </motion.div>
      </div>

      {/* Benefits */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Why Register as a Nonprofit?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900/50 p-5 rounded-xl border border-gray-200 dark:border-white/10"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                <benefit.icon className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{benefit.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-gray-50 dark:bg-gray-900/30 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            What You'll Need
          </h2>
          <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-white/10">
            <div className="space-y-3">
              {requirements.map((req) => (
                <div key={req} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <FiCheck className="text-emerald-500 flex-shrink-0" />
                  {req}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { value: "50K+", label: "Nonprofits" },
            { value: "$1B+", label: "Raised" },
            { value: "10M+", label: "Donors" },
            { value: "150+", label: "Countries" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-white/10">
              <div className="text-2xl font-bold text-emerald-500">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-emerald-500 rounded-2xl p-8 text-center text-white">
          <FiHeart className="w-10 h-10 mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-3">Ready to Get Started?</h2>
          <p className="mb-5 opacity-90 text-sm">
            Join thousands of nonprofits raising money on TrustFund.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-emerald-600 font-bold rounded-full hover:bg-gray-100 transition-colors"
          >
            Register Now <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NonprofitSignup;
