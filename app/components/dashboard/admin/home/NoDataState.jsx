"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaSync } from "react-icons/fa";
import { useLanguage } from "@/app/components/providers/LanguageProvider";

const NoDataState = ({ handleRefresh }) => {
  const { t, isRTL } = useLanguage();

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-6 text-[var(--foreground)]">{t('adminDashboard') || 'Admin Dashboard'}</h1>
      <div className="bg-[#232738] rounded-xl p-6 shadow-md">
        <p className="text-[var(--foreground-secondary)]">{t('noAttendanceData') || 'No attendance data available'}</p>
        <motion.button 
          onClick={handleRefresh}
          className="mt-4 bg-blue-800/30 hover:bg-blue-800/50 text-[var(--foreground)] py-2 px-4 rounded-lg transition-colors flex items-center"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaSync className={`${isRTL ? 'ml-2' : 'mr-2'}`} /> {t('retry') || 'Retry'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NoDataState; 