"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/app/components/providers/LanguageProvider";

const ErrorState = ({ error }) => {
  const { t } = useLanguage();
  
  return (
    <motion.div 
      className="bg-red-900/20 border border-red-500 p-6 rounded-xl text-red-400"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="font-bold text-xl mb-2">{t('errorLoadingData') || 'Error Loading Data'}</h3>
      <p className="mb-2">{error?.error || error || t('failedToFetchInstructorData') || "Failed to fetch instructor data"}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 bg-red-800/30 hover:bg-red-800/50 text-white py-2 px-4 rounded-lg transition-colors"
      >
        {t('retry') || 'Retry'}
      </button>
    </motion.div>
  );
};

export default ErrorState; 