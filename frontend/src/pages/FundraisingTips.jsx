import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiEdit3, 
  FiImage, 
  FiTarget,
  FiShare2,
  FiMessageCircle,
  FiHeart,
  FiArrowRight,
  FiRefreshCw,
  FiUsers,
  FiVideo
} from "react-icons/fi";

const FundraisingTips = () => {
  const tips = [
    {
      number: 1,
      icon: FiEdit3,
      title: "Write a descriptive fundraiser title",
      description: "Your title is the first thing people see. Make it clear, compelling, and specific about what you're raising money for."
    },
    {
      number: 2,
      icon: FiMessageCircle,
      title: "Craft a compelling fundraiser story",
      description: "Share your story with emotion and authenticity. Explain why this cause matters and how donations will make a difference."
    },
    {
      number: 3,
      icon: FiImage,
      title: "Choose high-quality photos",
      description: "Photos help donors connect with your cause. Use clear, well-lit images that tell your story visually."
    },
    {
      number: 4,
      icon: FiTarget,
      title: "Use realistic fundraising goals",
      description: "Set a goal that's achievable but meaningful. You can always increase it later as you gain momentum."
    },
    {
      number: 5,
      icon: FiShare2,
      title: "Use smart social media tools",
      description: "Share your fundraiser on Facebook, Twitter, Instagram, and WhatsApp. Personal messages work better than generic posts."
    },
    {
      number: 6,
      icon: FiUsers,
      title: "Share beyond social media",
      description: "Email friends and family, reach out to local media, and ask supporters to share with their networks."
    },
    {
      number: 7,
      icon: FiMessageCircle,
      title: "Be specific when sharing",
      description: "When asking for donations, be specific about what the money will be used for and why it matters."
    },
    {
      number: 8,
      icon: FiRefreshCw,
      title: "Post regular updates",
      description: "Keep donors informed about your progress. Updates show accountability and encourage more donations."
    },
    {
      number: 9,
      icon: FiHeart,
      title: "Thank your donors",
      description: "A personal thank you goes a long way. Acknowledge every donation and show genuine gratitude."
    },
  ];

  const moreResources = [
    { title: "Tips for sharing your fundraiser", link: "/resources/tips", icon: FiShare2 },
    { title: "Using video in your fundraiser", link: "/resources/blog", icon: FiVideo },
    { title: "Team fundraising guide", link: "/team-fundraising", icon: FiUsers },
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
            9 Tips for a Successful Fundraiser
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            What does it take to have a successful fundraiser? No matter what cause 
            you're raising money for, these tips will help you succeed.
          </p>
        </motion.div>
      </div>

      {/* Tips Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tips.map((tip, index) => (
            <motion.div
              key={tip.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-white dark:bg-gray-900/50 p-5 rounded-xl border border-gray-200 dark:border-white/10"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <tip.icon className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="text-sm font-medium text-emerald-500">Tip {tip.number}</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{tip.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tip.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* More Resources */}
      <div className="bg-gray-50 dark:bg-gray-900/30 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            More Fundraising Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {moreResources.map((resource) => (
              <Link
                key={resource.title}
                to={resource.link}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <resource.icon className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                  {resource.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to create your fundraiser?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Put these tips into action and start raising money for your cause today.
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

export default FundraisingTips;
