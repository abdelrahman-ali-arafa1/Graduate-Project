import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCheckmarkCircle, IoWarning } from 'react-icons/io5';

const StatusMessage = ({ uploadStatus, statusMessage }) => {
  if (!uploadStatus) return null;
  
  const isError = uploadStatus === 'error';
  
  return (
    <AnimatePresence>
      <motion.div
        className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg flex items-center max-w-md ${
          isError ? 'bg-red-900/90 border border-red-700' : 'bg-green-900/90 border border-green-700'
        }`}
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {isError ? (
          <IoWarning className="text-red-300 text-xl mr-3 flex-shrink-0" />
        ) : (
          <IoCheckmarkCircle className="text-green-300 text-xl mr-3 flex-shrink-0" />
        )}
        <p className={`text-sm ${isError ? 'text-red-100' : 'text-green-100'}`}>
          {statusMessage}
        </p>
      </motion.div>
    </AnimatePresence>
  );
};

export default StatusMessage; 