"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaSync } from "react-icons/fa";
import { useLanguage } from "@/app/components/providers/LanguageProvider";

const refreshIconVariants = {
  static: { rotate: 0 },
  rotating: { 
    rotate: 360, 
    transition: { 
      duration: 1,
      ease: "linear",
      repeat: Infinity 
    } 
  }
};

const DashboardHeader = ({ startDate, endDate, handleRefresh, showRefreshAnimation }) => {
  const { t, isRTL } = useLanguage();

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-indigo-900/40 p-4 sm:p-6 border border-blue-800/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
      
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
        <div>
          <motion.h1 
            className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {t('adminDashboard') || 'Admin Dashboard'}
          </motion.h1>
          <motion.p 
            className="text-xs sm:text-sm text-blue-200/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {t('last 7 Days') || 'Last 7 Days'} • {startDate} - {endDate}
          </motion.p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 mt-2 md:mt-0">
          <div className="bg-[#232738] text-white py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg border border-[#2a2f3e] min-w-[120px] sm:min-w-[160px] flex items-center justify-center">
            <span className="text-xs sm:text-sm text-center">{t('All Courses') || 'All Courses'}</span>
          </div>
          
          <motion.button
            onClick={handleRefresh}
            className="flex items-center bg-white/10 hover:bg-white/20 text-white py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/10"
            whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div
              variants={refreshIconVariants}
              animate={showRefreshAnimation ? "rotating" : "static"}
              className="text-xs sm:text-sm"
            >
              <FaSync className={`${isRTL ? 'ml-1 sm:ml-2' : 'mr-1 sm:mr-2'}`} />
            </motion.div>
            <span className="text-xs sm:text-sm">{t('refresh') || 'Refresh'}</span>
          </motion.button>
        </div>
      </div>
      
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
      />
    </motion.div>
  );
};

export default DashboardHeader; 