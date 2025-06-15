"use client";

import { motion } from "framer-motion";

const ErrorMessage = ({ error }) => {
  if (!error) return null;
  
  return (
    <motion.div 
      className="mt-6 bg-red-900/30 border border-red-500/50 text-red-300 px-6 py-4 rounded-lg flex items-center gap-3"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{error}</span>
    </motion.div>
  );
};

export default ErrorMessage; 