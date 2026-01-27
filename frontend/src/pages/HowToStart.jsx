import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiEdit3, 
  FiShare2, 
  FiDollarSign,
  FiArrowRight,
  FiCheck,
  FiHelpCircle,
  FiUsers,
  FiHeart,
  FiShield
} from "react-icons/fi";

const HowToStart = () => {
  const steps = [
    {
      icon: FiEdit3,
      title: "Create your fundraiser",
      description: "Our tools help you create a compelling fundraiser in minutes. Add your story, photos, and set your goal."
    },
    {
      icon: FiShare2,
      title: "Share with your network",
      description: "Share your fundraiser link with friends, family, and on social media to reach more donors."
    },
    {
      icon: FiDollarSign,
      title: "Receive your funds",
      description: "Securely receive the funds you raise directly to your bank account. It's fast and easy."
    },
  ];

  const faqs = [
    { q: "Is it okay to raise money for myself?", a: "Absolutely! Many people use TrustFund to cover personal expenses like medical bills, education costs, or unexpected emergencies." },
    { q: "Can I create a fundraiser for someone else?", a: "Yes! You can start a fundraiser on behalf of a friend, family member, or anyone in need. Funds can be transferred directly to them." },
    { q: "Can I create a fundraiser for a charity?", a: "Yes! Nonprofits and charities can use TrustFund to raise funds for their causes." },
    { q: "Are there any fees to fundraise?", a: "TrustFund is free to start. We only charge a small platform fee when you receive donations." },
    { q: "How long will it take to receive my funds?", a: "Once your identity is verified, funds are typically transferred within 2-5 business days." },
    { q: "Are there tips for making my fundraiser succeed?", a: "Yes! Share often, post updates, thank your donors, and use high-quality photos to tell your story." },
  ];

  const categories = [
    "Medical", "Emergency", "Education", "Nonprofit", "Memorial", "Animals", "Community", "Sports"
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Start Fundraising on TrustFund
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Start a fundraiser for what you're passionate about. With millions raised, 
            TrustFund is the most trusted online fundraising platform.
          </p>
          <Link
            to="/create-campaign"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600 transition-colors"
          >
            Start a TrustFund <FiArrowRight />
          </Link>
        </motion.div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          How to start a TrustFund
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-white/10 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-7 h-7 text-emerald-500" />
              </div>
              <div className="text-sm text-emerald-500 font-medium mb-2">Step {index + 1}</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-gray-50 dark:bg-gray-900/30 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            What do people fundraise for?
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/dashboard?category=${cat}`}
                className="px-4 py-2 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-emerald-500 hover:text-emerald-500 transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Features */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: FiShield, title: "Safe & Secure", desc: "Your donations are protected" },
            { icon: FiUsers, title: "Millions Trust Us", desc: "Join millions of fundraisers" },
            { icon: FiHeart, title: "Making Impact", desc: "Real change, real stories" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-white/10">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center flex items-center justify-center gap-2">
          <FiHelpCircle className="text-emerald-500" /> Questions about fundraising
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white dark:bg-gray-900/50 p-5 rounded-xl border border-gray-200 dark:border-white/10"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{faq.q}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-emerald-500 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Ready to Start?</h2>
          <p className="mb-5 opacity-90 text-sm">
            Join millions of people fundraising for causes they care about.
          </p>
          <Link
            to="/create-campaign"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-emerald-600 font-bold rounded-full hover:bg-gray-100 transition-colors"
          >
            Start Your TrustFund <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowToStart;
