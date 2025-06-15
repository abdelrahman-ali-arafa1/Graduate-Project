"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaTimesCircle, FaSync } from "react-icons/fa";
import { useLanguage } from "@/app/components/providers/LanguageProvider";

const ErrorState = ({ error, handleRefresh }) => {
  const { t, isRTL } = useLanguage();

  return (
    <motion.div 
      className="bg-red-900/20 border border-red-500 p-6 rounded-xl text-red-400"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center mb-4"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-red-900/30 p-3 rounded-full mr-4">
          <FaTimesCircle className="text-red-500 text-xl" />
        </div>
        <h3 className="font-bold text-xl">{t('errorLoadingData') || 'Error Loading Data'}</h3>
      </motion.div>
      
      <motion.p 
        className="mb-2 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {error || t('serverConnectionError') || 'Server connection error'}
      </motion.p>
      
      <motion.p 
        className="mt-2 text-red-300/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {t('pleaseRefresh') || 'Please refresh the page'}
      </motion.p>
      
      <motion.button 
        onClick={handleRefresh}
        className="mt-6 bg-red-800/30 hover:bg-red-800/50 text-white py-3 px-6 rounded-lg transition-colors flex items-center"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        <FaSync className={`${isRTL ? 'ml-2' : 'mr-2'}`} /> {t('retry') || 'Retry'}
      </motion.button>
    </motion.div>
  );
};

export default ErrorState; 