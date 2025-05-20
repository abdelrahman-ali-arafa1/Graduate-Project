'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <motion.button
      onClick={toggleTheme}
      className="relative rounded-full w-12 h-6 flex items-center justify-center transition-colors duration-300 focus:outline-none"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="sr-only">Toggle {isDark ? 'Light' : 'Dark'} Mode</span>
      
      <div 
        className={`w-full h-full rounded-full p-0.5 ${isDark ? 'bg-[#2c2f42]' : 'bg-[#232738]'}`}
      >
        <motion.div 
          className={`flex items-center justify-center w-5 h-5 rounded-full ${
            isDark ? 'bg-[#7950f2]' : 'bg-gray-700'
          }`}
          initial={false}
          animate={{ 
            x: isDark ? 'calc(100% - 4px)' : '0%',
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {isDark ? (
            <FaMoon className="text-white text-xs" />
          ) : (
            <FaSun className="text-[#7950f2] text-xs" />
          )}
        </motion.div>
      </div>
    </motion.button>
  );
} 