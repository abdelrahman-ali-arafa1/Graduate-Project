import React from 'react';
import { motion } from "framer-motion";

const LoadingIndicator = ({ loading, dashboardData }) => {
  if (!loading || !dashboardData) return null;
  
  return (
    <motion.div 
      className="fixed top-4 right-4 bg-blue-900/70 text-blue-200 py-2 px-4 rounded-lg flex items-center z-50"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="animate-spin h-4 w-4 border-2 border-blue-200 border-t-transparent rounded-full mr-2"></div>
      Refreshing data...
    </motion.div>
  );
};

export default LoadingIndicator; 