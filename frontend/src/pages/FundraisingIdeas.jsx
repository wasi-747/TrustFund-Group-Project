import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiArrowRight,
  FiStar,
  FiCalendar,
  FiHeart,
  FiBook,
  FiUsers,
  FiHome
} from "react-icons/fi";

const FundraisingIdeas = () => {
  const creativeIdeas = [
    "Host an art gala or workshop",
    "Organize a talent show",
    "Sell crafts or handmade items online",
    "Host a walk-a-thon or marathon",
    "Hold a pancake breakfast",
    "Create a movie night event",
    "Organize a trivia night",
    "Start a bake sale",
    "Host a car wash",
    "Organize a charity auction"
  ];

  const seasonalIdeas = [
    { season: "Winter", ideas: ["Gift-wrapping station", "Holiday cookie sale", "Winter carnival"] },
    { season: "Spring", ideas: ["March Madness bracket", "Garden sale", "Spring cleaning sale"] },
    { season: "Summer", ideas: ["Potluck and yard sale", "Beach cleanup event", "Summer camp fundraiser"] },
    { season: "Autumn", ideas: ["Book sale", "Pumpkin patch event", "Fall festival"] },
  ];

  const causeIdeas = [
    { icon: FiHeart, cause: "Medical", ideas: ["Hospital visit fundraiser", "Medical equipment drive", "Treatment fund"] },
    { icon: FiHome, cause: "Emergency", ideas: ["Disaster relief fund", "Emergency shelter support", "Crisis response"] },
    { icon: FiBook, cause: "Education", ideas: ["Scholarship fund", "School supplies drive", "Tuition assistance"] },
    { icon: FiUsers, cause: "Nonprofit", ideas: ["Charity run/walk", "Volunteer event", "Awareness campaign"] },
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
            The Best Fundraising Ideas
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Get the most out of your fundraising efforts with these creative ideas 
            to reach your goal, no matter your cause.
          </p>
          <Link
            to="/create-campaign"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600 transition-colors"
          >
            Start Fundraising <FiArrowRight />
          </Link>
        </motion.div>
      </div>

      {/* Creative Ideas */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <FiStar className="text-emerald-500" /> Creative Fundraising Ideas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {creativeIdeas.map((idea, index) => (
            <motion.div
              key={idea}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              className="p-4 bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-white/10 text-center"
            >
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{idea}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Seasonal Ideas */}
      <div className="bg-gray-50 dark:bg-gray-900/30 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FiCalendar className="text-emerald-500" /> Seasonal Fundraising Ideas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {seasonalIdeas.map((season) => (
              <div key={season.season} className="bg-white dark:bg-gray-900/50 p-5 rounded-xl border border-gray-200 dark:border-white/10">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">{season.season}</h3>
                <ul className="space-y-2">
                  {season.ideas.map((idea) => (
                    <li key={idea} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">•</span> {idea}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ideas by Cause */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Fundraising Ideas by Cause
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {causeIdeas.map((item) => (
            <Link
              key={item.cause}
              to={`/dashboard?category=${item.cause}`}
              className="group bg-white dark:bg-gray-900/50 p-5 rounded-xl border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">{item.cause}</h3>
              </div>
              <ul className="space-y-1">
                {item.ideas.map((idea) => (
                  <li key={idea} className="text-sm text-gray-600 dark:text-gray-400">• {idea}</li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-emerald-500 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Ready to Try These Ideas?</h2>
          <p className="mb-5 opacity-90 text-sm">
            Start your fundraiser today and put these creative ideas to work.
          </p>
          <Link
            to="/create-campaign"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-emerald-600 font-bold rounded-full hover:bg-gray-100 transition-colors"
          >
            Create Your Fundraiser <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FundraisingIdeas;
