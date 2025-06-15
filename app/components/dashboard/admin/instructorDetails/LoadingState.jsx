'use client';

import { motion } from "framer-motion";

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <motion.div
        className="rounded-full h-16 w-16 border-4 border-t-4 border-blue-500 mb-6"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <motion.p 
        className="text-gray-300 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Loading instructor data...
      </motion.p>
    </div>
  );
};

export default LoadingState; 