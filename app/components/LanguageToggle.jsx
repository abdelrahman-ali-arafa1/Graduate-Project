'use client';

import React from 'react';
import { useLanguage } from './LanguageProvider';
import { Languages } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <motion.button 
      onClick={toggleLanguage}
      className="flex items-center gap-2 bg-[#232738] text-gray-300 px-3 py-1.5 rounded-full border border-gray-700 hover:border-[#7950f2] transition-all shadow-sm"
      aria-label="Toggle language"
      whileHover={{ scale: 1.05, backgroundColor: "#2c2f42" }}
      whileTap={{ scale: 0.95 }}
    >
      <Languages size={18} className="text-primary" />
      <span className="text-xs font-medium">
        {language === 'ar' ? 'EN' : 'عربي'}
      </span>
    </motion.button>
  );
} 