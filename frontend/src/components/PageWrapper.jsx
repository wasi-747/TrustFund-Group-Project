import React from "react";
import { motion } from "framer-motion";

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Start: Invisible and slightly down
      animate={{ opacity: 1, y: 0 }} // End: Visible and in place
      exit={{ opacity: 0, y: -20 }} // Leave: Fade out and move up
      transition={{ duration: 0.3, ease: "easeInOut" }} // Smooth timing
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
