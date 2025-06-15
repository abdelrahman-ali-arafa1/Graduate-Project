import React from 'react';
import { motion } from 'framer-motion';
import { FaUserGraduate } from 'react-icons/fa';

const PageTitle = () => {
  return (
    <motion.div
      className="flex items-center gap-4 mb-10"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: "spring" }}
    >
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 flex items-center justify-center shadow-lg border-4 border-blue-800/30">
        <FaUserGraduate className="text-blue-400 text-4xl" />
      </div>
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          Edit Students
          <span className="ml-2 px-2 py-0.5 rounded bg-blue-900/40 text-xs text-blue-300 font-semibold animate-fadeIn">Management</span>
        </h1>
        <p className="text-gray-400">View and edit student information by level and department</p>
      </div>
    </motion.div>
  );
};

export default PageTitle; 