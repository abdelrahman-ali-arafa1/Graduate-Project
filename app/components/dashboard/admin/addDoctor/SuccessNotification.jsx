"use client";

import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";

const SuccessNotification = ({ show }) => {
  if (!show) return null;
  
  return (
    <motion.div 
      className="fixed top-4 right-4 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 z-50 border border-green-500/50"
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
    >
      <div className="bg-white/20 p-2 rounded-full">
        <FaCheck className="text-lg" />
      </div>
      <div>
        <h4 className="font-medium">Success!</h4>
        <p className="text-sm text-green-100">Instructor added successfully!</p>
      </div>
    </motion.div>
  );
};

export default SuccessNotification; 