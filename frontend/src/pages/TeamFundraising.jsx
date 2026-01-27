import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiArrowRight,
  FiUsers,
  FiTarget,
  FiShare2,
  FiAward,
  FiHeart,
  FiCheck
} from "react-icons/fi";

const TeamFundraising = () => {
  const benefits = [
    {
      icon: FiUsers,
      title: "Multiply Your Impact",
      description: "Team members can share with their own networks, dramatically expanding your reach."
    },
    {
      icon: FiTarget,
      title: "Set Team Goals",
      description: "Create friendly competition with individual goals that contribute to the team total."
    },
    {
      icon: FiShare2,
      title: "Easy Coordination",
      description: "Manage your team from one dashboard. Track progress and celebrate milestones together."
    },
    {
      icon: FiAward,
      title: "Recognition",
      description: "Highlight top fundraisers and thank all team members for their contributions."
    },
  ];

  const steps = [
    { step: 1, title: "Create your fundraiser", desc: "Start a campaign and set your team goal" },
    { step: 2, title: "Invite team members", desc: "Add friends, family, or colleagues to your team" },
    { step: 3, title: "Set individual goals", desc: "Each member can have their own target" },
    { step: 4, title: "Share & raise together", desc: "Everyone shares and you reach goals faster" },
  ];

  const useCases = [
    "Sports team uniforms and equipment",
    "School club trips and events",
    "Church mission trips",
    "Charity walks and marathons",
    "Community projects",
    "Memorial and tribute funds"
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
            <FiUsers /> Team Fundraising
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Raise More Together
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Team fundraising lets you rally friends, family, and colleagues to raise money together. 
            Multiply your impact and reach your goal faster.
          </p>
          <Link
            to="/create-campaign"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600 transition-colors"
          >
            Start Team Fundraiser <FiArrowRight />
          </Link>
        </motion.div>
      </div>

      {/* Benefits */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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

      {/* How It Works */}
      <div className="bg-gray-50 dark:bg-gray-900/30 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            How Team Fundraising Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {steps.map((item) => (
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

      {/* Use Cases */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Perfect For
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {useCases.map((useCase) => (
            <div key={useCase} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-full text-sm text-gray-700 dark:text-gray-300">
              <FiCheck className="text-emerald-500" />
              {useCase}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-emerald-500 rounded-2xl p-8 text-center text-white">
          <FiHeart className="w-10 h-10 mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-3">Ready to Rally Your Team?</h2>
          <p className="mb-5 opacity-90 text-sm">
            Start a team fundraiser and watch your impact multiply.
          </p>
          <Link
            to="/create-campaign"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-emerald-600 font-bold rounded-full hover:bg-gray-100 transition-colors"
          >
            Start Team Fundraiser <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeamFundraising;
