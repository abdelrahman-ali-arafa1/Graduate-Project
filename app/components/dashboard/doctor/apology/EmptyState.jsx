import React from "react";
import { motion } from "framer-motion";
import { FaInbox, FaFilter, FaBook } from "react-icons/fa";

const EmptyState = ({ statusFilter, setStatusFilter, setCourseFilter }) => {
  return (
    <motion.div
      className="col-span-full text-center py-10 bg-[#1a1f2e] rounded-xl border border-[#2a2f3e] text-gray-400"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-purple-600/10 flex items-center justify-center mb-6 p-4 border border-purple-600/20">
          <FaInbox className="text-6xl text-purple-400" />
        </div>
        <h3 className="text-2xl font-semibold text-white mb-2">No apologies found</h3>
        <p className="text-gray-400 max-w-md mb-6">
          {statusFilter !== "all" 
            ? `There are no ${statusFilter} apologies matching your current filters.`
            : "There are no apologies matching your current filters."}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button 
            onClick={() => setStatusFilter("all")}
            className="px-4 py-2 rounded-lg bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-all border border-purple-600/30 flex items-center gap-2"
          >
            <FaFilter /> Show All Apologies
          </button>
          <button 
            onClick={() => setCourseFilter("all")} 
            className="px-4 py-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-all border border-blue-600/30 flex items-center gap-2"
          >
            <FaBook /> Reset Course Filter
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EmptyState; 