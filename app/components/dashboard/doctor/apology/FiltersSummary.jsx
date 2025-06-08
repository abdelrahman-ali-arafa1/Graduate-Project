import React from "react";
import { motion } from "framer-motion";

const FiltersSummary = ({ filteredApologies, statusFilter, getStatusColor, getStatusIcon }) => {
  return (
    <motion.div 
      className="mb-6 flex items-center justify-between" 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="flex items-center">
        <span className="text-gray-400 mr-2">Showing:</span>
        <span className="font-semibold text-white bg-[#1a1f2e] px-3 py-1 rounded-lg border border-[#2a2f3e]">
          {filteredApologies.length} {filteredApologies.length === 1 ? 'Apology' : 'Apologies'}
        </span>
      </div>
      
      {filteredApologies.length > 0 && statusFilter !== "all" && (
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full ${getStatusColor(statusFilter)} flex items-center gap-1.5`}>
            {getStatusIcon(statusFilter)} 
            <span className="capitalize">{statusFilter}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FiltersSummary; 