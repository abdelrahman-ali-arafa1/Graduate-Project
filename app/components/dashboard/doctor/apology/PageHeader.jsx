import React from "react";
import { motion } from "framer-motion";
import { FaBook } from "react-icons/fa";

const PageHeader = ({ totalApologies }) => {
  return (
    <motion.div
      className="mb-8 flex items-center justify-between"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center">
        <div className="w-16 h-16 rounded-full bg-purple-600/20 flex items-center justify-center mr-4 border border-purple-600/30">
          <FaBook className="text-purple-400 text-3xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Student Apologies
          </h1>
          <p className="text-gray-400">View and manage student absence apologies for your courses</p>
        </div>
      </div>
      
      <div className="hidden sm:flex items-center bg-[#1a1f2e] px-6 py-3 rounded-lg border border-[#2a2f3e]">
        <div className="flex items-center gap-3">
          <span className="text-gray-400">Total Apologies:</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            {totalApologies}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default PageHeader; 