import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaFacebook, FaYoutube, FaXTwitter, FaInstagram } from "react-icons/fa6";

const Footer = () => {
  const [moreResourcesOpen, setMoreResourcesOpen] = useState(false);

  return (
    <footer className="bg-white dark:bg-black/95 border-t border-gray-200 dark:border-white/10 mt-auto backdrop-blur-md">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Donate Column */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              Donate
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/dashboard" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/dashboard?category=Emergency" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Crisis relief
                </Link>
              </li>
              <li>
                <Link to="/dashboard?category=Medical" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Social Impact Funds
                </Link>
              </li>
              <li>
                <Link to="/resources/supporter" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Supporter Space
                </Link>
              </li>
            </ul>
          </div>

          {/* Fundraise Column */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              Fundraise
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/resources/how-to-start" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  How to start a TrustFund
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Fundraising categories
                </Link>
              </li>
              <li>
                <Link to="/create-campaign" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Team fundraising
                </Link>
              </li>
              <li>
                <Link to="/resources/blog" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Fundraising Blog
                </Link>
              </li>
              <li>
                <Link to="/dashboard?category=Nonprofit" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Charity fundraising
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Sign up as a nonprofit
                </Link>
              </li>
            </ul>
          </div>

          {/* About Column */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              About
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/resources/how-to-start" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  How TrustFund works
                </Link>
              </li>
              <li>
                <Link to="/resources/supporter" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  TrustFund Giving Guarantee
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Supported countries
                </Link>
              </li>
              <li>
                <Link to="/resources/tips" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/resources/blog" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  About TrustFund
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/resources/blog" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Newsroom
                </Link>
              </li>
              <li>
                <Link to="/resources/tips" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Fundraising tips
                </Link>
              </li>
              <li>
                <Link to="/resources/ideas" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Fundraising ideas
                </Link>
              </li>
              <li>
                <Link to="/resources/supporter" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  TrustFund for nonprofits
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* More Resources Expandable */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
          <button
            onClick={() => setMoreResourcesOpen(!moreResourcesOpen)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            More resources
            {moreResourcesOpen ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          
          {moreResourcesOpen && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
              <Link to="/resources/tips" className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400">
                Success stories
              </Link>
              <Link to="/resources/ideas" className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400">
                Creative campaigns
              </Link>
              <Link to="/resources/blog" className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400">
                Community updates
              </Link>
              <Link to="/resources/supporter" className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400">
                Donor FAQs
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="bg-gray-50 dark:bg-black/80 border-t border-gray-200 dark:border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Left Side - Language & Copyright */}
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <select className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/10 rounded-full text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-emerald-500">
                <option>English (United States)</option>
                <option>বাংলা (Bangladesh)</option>
              </select>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                © 2024-2026 TrustFund
              </div>
            </div>

            {/* Center - Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Privacy Notice</a>
              <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Legal</a>
              <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Accessibility</a>
              <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Cookie Policy</a>
            </div>

            {/* Right Side - Social & App Links */}
            <div className="flex items-center gap-4">
              {/* Social Icons */}
              <div className="flex items-center gap-3">
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <FaFacebook size={20} />
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <FaYoutube size={20} />
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <FaXTwitter size={20} />
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <FaInstagram size={20} />
                </a>
              </div>

              {/* App Store Badges */}
              <div className="hidden md:flex items-center gap-2">
                <a href="#" className="block">
                  <div className="px-3 py-1.5 bg-black dark:bg-gray-800 border dark:border-white/10 text-white text-xs rounded-lg flex items-center gap-1.5 hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.9 17.39c-.26.56-.55 1.08-.88 1.57-.45.68-.82 1.15-1.11 1.42-.45.44-.93.67-1.44.68-.37 0-.81-.1-1.32-.31-.51-.21-.98-.31-1.41-.31-.45 0-.93.1-1.45.31-.52.21-.93.32-1.24.32-.49.01-.97-.22-1.45-.69-.31-.29-.7-.78-1.17-1.48-.5-.74-.91-1.6-1.24-2.57-.35-1.05-.53-2.07-.53-3.05 0-1.13.24-2.1.73-2.92.38-.64.89-1.15 1.52-1.52.63-.38 1.31-.57 2.05-.58.39 0 .91.12 1.55.35.63.23 1.04.35 1.22.35.13 0 .58-.14 1.33-.42.71-.26 1.31-.37 1.79-.33 1.33.11 2.32.63 2.99 1.57-1.19.72-1.78 1.73-1.76 3.03.01 1.01.38 1.85 1.10 2.53.33.31.69.55 1.10.73-.09.26-.18.5-.29.75z"/>
                    </svg>
                    <span>App Store</span>
                  </div>
                </a>
                <a href="#" className="block">
                  <div className="px-3 py-1.5 bg-black dark:bg-gray-800 border dark:border-white/10 text-white text-xs rounded-lg flex items-center gap-1.5 hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                    </svg>
                    <span>Google Play</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
