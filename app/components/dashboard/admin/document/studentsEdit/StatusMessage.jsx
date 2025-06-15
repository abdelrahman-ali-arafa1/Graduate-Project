import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const StatusMessage = ({ status }) => {
  if (!status) return null;
  
  const isError = status.includes("failed") || status.includes("Failed") || 
                 status.includes("Error") || status.includes("error");
  
  return (
    <AnimatePresence>
      <motion.div
        className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg flex items-center gap-3 shadow-lg ${
          isError ? "bg-red-900/90 text-red-100 border border-red-700" : "bg-green-900/90 text-green-100 border border-green-700"
        }`}
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
      >
        {isError ? (
          <FaTimesCircle className="text-red-300 text-xl flex-shrink-0" />
        ) : (
          <FaCheckCircle className="text-green-300 text-xl flex-shrink-0" />
        )}
        <span className="font-medium">{status}</span>
      </motion.div>
    </AnimatePresence>
  );
};

export default StatusMessage; 