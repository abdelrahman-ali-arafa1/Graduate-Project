'use client';

import { motion } from "framer-motion";
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaPercentage 
} from "react-icons/fa";

const StatisticsCards = ({ instructorStats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <motion.div 
        className="bg-[#1a1f2e] p-5 rounded-xl border border-[#2a2f3e] transition-colors shadow-md group"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)", scale: 1.04 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[var(--foreground-secondary)] font-medium">Present</h4>
          <span className="bg-green-900/30 p-2 rounded-lg">
            <FaCheckCircle className="text-green-400" />
          </span>
        </div>
        <div className="flex items-end gap-2">
          <p className="text-3xl font-bold text-green-400">{instructorStats?.present ?? 0}</p>
          <span className="text-xs text-green-400 font-semibold">actions</span>
        </div>
        <p className="text-xs text-[var(--foreground-secondary)] mt-2">Actions Present</p>
      </motion.div>
      
      <motion.div 
        className="bg-[#1a1f2e] p-5 rounded-xl border border-[#2a2f3e] transition-colors shadow-md group"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)", scale: 1.04 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[var(--foreground-secondary)] font-medium">Absent</h4>
          <span className="bg-red-900/30 p-2 rounded-lg">
            <FaTimesCircle className="text-red-400" />
          </span>
        </div>
        <div className="flex items-end gap-2">
          <p className="text-3xl font-bold text-red-400">{instructorStats?.absent ?? 0}</p>
          <span className="text-xs text-red-400 font-semibold">actions</span>
        </div>
        <p className="text-xs text-[var(--foreground-secondary)] mt-2">Actions Absent</p>
      </motion.div>
      
      <motion.div 
        className="bg-[#1a1f2e] p-5 rounded-xl border border-[#2a2f3e] transition-colors shadow-md group"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)", scale: 1.04 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[var(--foreground-secondary)] font-medium">Attendance Rate</h4>
          <span className="bg-purple-900/30 p-2 rounded-lg">
            <FaPercentage className="text-purple-400" />
          </span>
        </div>
        <div className="flex items-end gap-2">
          <p className="text-3xl font-bold text-purple-400">{instructorStats?.showQttendanceRate ?? "0%"}</p>
          <span className="text-xs text-purple-400 font-semibold">Rate</span>
        </div>
        <p className="text-xs text-[var(--foreground-secondary)] mt-2">Overall attendance</p>
      </motion.div>
    </div>
  );
};

export default StatisticsCards; 