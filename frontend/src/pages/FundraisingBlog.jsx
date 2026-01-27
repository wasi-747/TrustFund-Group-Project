import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiBookOpen } from "react-icons/fi";

const FundraisingBlog = () => {
  const featuredArticles = [
    {
      title: "How to Ask for Donations: 8 Tips for Maximizing Success",
      excerpt: "Learn the best strategies for asking for donations that actually work.",
      category: "Tips",
      date: "Jan 2024"
    },
    {
      title: "How to Write a Fundraiser Story that Inspires Donations",
      excerpt: "Your story is the heart of your fundraiser. Here's how to write one that connects.",
      category: "Writing",
      date: "Jan 2024"
    },
    {
      title: "How to Choose the Best Crowdfunding Platform",
      excerpt: "Compare the top crowdfunding sites and find the right one for your needs.",
      category: "Guide",
      date: "Dec 2023"
    },
  ];

  const recentArticles = [
    { title: "Emergency financial assistance: your complete guide", category: "Emergency" },
    { title: "How to get emergency rent assistance", category: "Housing" },
    { title: "Your ultimate guide to starting an emergency fund", category: "Finance" },
    { title: "How to fundraise for endangered animal nonprofits", category: "Animals" },
    { title: "Creative fundraising ideas to try this year", category: "Ideas" },
    { title: "The best charities to donate to in 2024", category: "Giving" },
  ];

  const categories = [
    "Fundraising Tips", "Fundraising Ideas", "Success Stories", "Nonprofit", "Emergency", "Medical"
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
            <FiBookOpen /> TrustFund Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            TrustFund Fundraising Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Get the latest fundraising trends, proven ideas, and learn from our crowdfunding resources.
          </p>
        </motion.div>
      </div>

      {/* Featured Articles */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Featured Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredArticles.map((article, index) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to="/resources/tips" className="group block h-full">
                <div className="bg-white dark:bg-gray-900/50 p-5 rounded-xl border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 transition-all h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500">{article.date}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-500 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-gray-50 dark:bg-gray-900/30 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat}
                to="/resources/tips"
                className="px-4 py-2 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-emerald-500 hover:text-emerald-500 transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Articles */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">All Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentArticles.map((article, index) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link to="/resources/tips" className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 transition-all">
                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full flex-shrink-0">
                  {article.category}
                </span>
                <span className="font-medium text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                  {article.title}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ready to start your own fundraising journey?
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

export default FundraisingBlog;
