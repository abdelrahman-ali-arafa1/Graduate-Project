"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaChartLine, FaChartPie } from "react-icons/fa";
import { useLanguage } from "@/app/components/providers/LanguageProvider";

const tabVariants = {
  inactive: { 
    opacity: 0.7,
    scale: 0.95,
    backgroundColor: "rgba(26, 31, 46, 0.5)"
  },
  active: { 
    opacity: 1,
    scale: 1,
    backgroundColor: "rgba(42, 47, 62, 0.8)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
  }
};

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();

  return (
    <motion.div 
      className="flex flex-wrap gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium transition-all duration-300 bg-[#232738] ${activeTab === 'overview' ? 'text-white' : 'text-gray-400'}`}
        onClick={() => setActiveTab('overview')}
        variants={tabVariants}
        animate={activeTab === 'overview' ? 'active' : 'inactive'}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <FaChartLine className="text-blue-400 text-xs sm:text-sm" />
        {t('overview') || 'Overview'}
      </motion.button>
      
      <motion.button
        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium transition-all duration-300 bg-[#232738] ${activeTab === 'details' ? 'text-white' : 'text-gray-400'}`}
        onClick={() => setActiveTab('details')}
        variants={tabVariants}
        animate={activeTab === 'details' ? 'active' : 'inactive'}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <FaChartPie className="text-purple-400 text-xs sm:text-sm" />
        {t('details') || 'Details'}
      </motion.button>
    </motion.div>
  );
};

export default TabNavigation; 