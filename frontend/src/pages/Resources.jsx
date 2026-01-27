import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiHeart,
  FiTrendingUp,
  FiUsers,
  FiBookOpen,
  FiHelpCircle,
  FiArrowRight,
  FiCheckCircle,
  FiTarget,
  FiMessageCircle,
  FiShare2,
} from "react-icons/fi";

const Resources = () => {
  const { section } = useParams();

  const content = {
    "how-to-start": {
      title: "How to Start a TrustFund",
      subtitle: "Step-by-step help, examples, and more",
      icon: <FiTarget className="text-emerald-500" size={40} />,
      sections: [
        {
          title: "1. Create Your Campaign",
          description: "Sign up and click 'Start a TrustFund' to begin. Choose a compelling title and set your fundraising goal.",
          icon: <FiCheckCircle className="text-emerald-500" />,
        },
        {
          title: "2. Tell Your Story",
          description: "Share your story authentically. Explain why you're fundraising and how the funds will be used.",
          icon: <FiBookOpen className="text-emerald-500" />,
        },
        {
          title: "3. Add Photos & Videos",
          description: "Campaigns with photos and videos raise more funds. Show donors what their contribution supports.",
          icon: <FiHeart className="text-emerald-500" />,
        },
        {
          title: "4. Share Your Campaign",
          description: "Share on social media, email friends and family, and keep your supporters updated.",
          icon: <FiShare2 className="text-emerald-500" />,
        },
      ],
    },
    tips: {
      title: "Fundraising Tips",
      subtitle: "The ultimate guide to successful fundraising",
      icon: <FiTrendingUp className="text-emerald-500" size={40} />,
      sections: [
        {
          title: "Start Strong",
          description: "Launch with a compelling story and realistic goal. The first 48 hours are crucial for momentum.",
          icon: <FiTarget className="text-emerald-500" />,
        },
        {
          title: "Update Regularly",
          description: "Keep donors engaged with frequent updates on your progress and how funds are being used.",
          icon: <FiMessageCircle className="text-emerald-500" />,
        },
        {
          title: "Say Thank You",
          description: "Personal thank-you messages encourage repeat donations and referrals.",
          icon: <FiHeart className="text-emerald-500" />,
        },
        {
          title: "Expand Your Reach",
          description: "Don't just share once. Post updates across all your social platforms regularly.",
          icon: <FiShare2 className="text-emerald-500" />,
        },
      ],
    },
    ideas: {
      title: "Fundraising Ideas",
      subtitle: "Creative ideas to spark your campaign",
      icon: <FiHeart className="text-emerald-500" size={40} />,
      sections: [
        {
          title: "Personal Challenges",
          description: "Run a marathon, shave your head, or take on a personal challenge that donors can sponsor.",
          icon: <FiTarget className="text-emerald-500" />,
        },
        {
          title: "Community Events",
          description: "Organize bake sales, charity dinners, or community gatherings that bring people together.",
          icon: <FiUsers className="text-emerald-500" />,
        },
        {
          title: "Social Media Campaigns",
          description: "Create viral challenges or hashtag campaigns that encourage sharing and participation.",
          icon: <FiShare2 className="text-emerald-500" />,
        },
        {
          title: "Matching Donations",
          description: "Find sponsors willing to match donations to double the impact of every contribution.",
          icon: <FiTrendingUp className="text-emerald-500" />,
        },
      ],
    },
    blog: {
      title: "Fundraising Blog",
      subtitle: "Resources, tips, and inspiring stories",
      icon: <FiBookOpen className="text-emerald-500" size={40} />,
      sections: [
        {
          title: "Success Stories",
          description: "Read inspiring stories from successful fundraisers who achieved their goals on TrustFund.",
          icon: <FiHeart className="text-emerald-500" />,
        },
        {
          title: "Expert Advice",
          description: "Tips from fundraising experts on how to maximize your campaign's success.",
          icon: <FiTrendingUp className="text-emerald-500" />,
        },
        {
          title: "Platform Updates",
          description: "Stay informed about new features and improvements to the TrustFund platform.",
          icon: <FiCheckCircle className="text-emerald-500" />,
        },
        {
          title: "Community Spotlight",
          description: "Highlighting the amazing work our community members are doing around the world.",
          icon: <FiUsers className="text-emerald-500" />,
        },
      ],
    },
    supporter: {
      title: "Supporter Space",
      subtitle: "Inspiration, FAQs, and where to give",
      icon: <FiHelpCircle className="text-emerald-500" size={40} />,
      sections: [
        {
          title: "Why Donate?",
          description: "Your donation directly helps individuals and causes that matter. Every contribution makes a difference.",
          icon: <FiHeart className="text-emerald-500" />,
        },
        {
          title: "Is My Donation Safe?",
          description: "TrustFund uses secure payment processing and verifies fundraisers to protect your donation.",
          icon: <FiCheckCircle className="text-emerald-500" />,
        },
        {
          title: "How to Choose a Campaign",
          description: "Look for verified fundraisers, clear goals, and regular updates to find trustworthy campaigns.",
          icon: <FiTarget className="text-emerald-500" />,
        },
        {
          title: "Spread the Word",
          description: "Can't donate? Sharing campaigns with your network is equally valuable.",
          icon: <FiShare2 className="text-emerald-500" />,
        },
      ],
    },
  };

  const currentContent = content[section] || content["how-to-start"];

  return (
    <div className="pt-32 px-6 pb-20 max-w-5xl mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-500/10 mb-6">
          {currentContent.icon}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold dark:text-white text-gray-900 tracking-tight mb-4">
          {currentContent.title}
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400">
          {currentContent.subtitle}
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {currentContent.sections.map((item, index) => (
          <div
            key={index}
            className="group p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:shadow-lg dark:hover:shadow-emerald-500/5 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-3xl p-10">
        <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-4">
          Ready to Make a Difference?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xl mx-auto">
          Start your fundraising journey today or explore campaigns that need your support.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/create-campaign"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-700 text-white font-bold rounded-full hover:from-green-400 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all"
          >
            Start a TrustFund <FiArrowRight />
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 dark:text-white text-gray-900 font-bold rounded-full hover:bg-gray-50 dark:hover:bg-white/20 transition-all"
          >
            Explore Campaigns
          </Link>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10">
        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          More Resources
        </h3>
        <div className="flex flex-wrap gap-3">
          {Object.keys(content).map((key) => (
            <Link
              key={key}
              to={`/resources/${key}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                section === key
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-600 dark:hover:text-emerald-400"
              }`}
            >
              {content[key].title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;
