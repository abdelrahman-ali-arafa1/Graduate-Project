import React from 'react';
import { motion } from 'framer-motion';
import { LEVELS, DEPARTMENTS } from '@/app/hooks/constants';

const FiltersCard = ({ selectedLevel, setSelectedLevel, selectedDepartment, setSelectedDepartment }) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-indigo-900/40 p-6 border border-blue-800/30 shadow-xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
    >
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
        <div className="flex flex-col items-center w-full md:w-1/2">
          <div className="mb-2 text-base font-bold text-blue-400 tracking-wide text-center">Level</div>
          <div className="flex flex-row gap-3 justify-center">
            {LEVELS.map((level, index) => (
              <motion.button
                key={level || `level-btn-${index}`}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 border border-transparent text-sm focus:outline-none ${selectedLevel === level ? "bg-blue-500 text-white shadow-lg scale-105" : "bg-[#181c2a] text-gray-200 hover:bg-blue-900/40 hover:border-blue-500"}`}
                onClick={() => setSelectedLevel(level)}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.96 }}
              >
                Level {level}
              </motion.button>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center w-full md:w-1/2">
          <div className="mb-2 text-base font-bold text-purple-400 tracking-wide text-center">Department</div>
          <div className="flex flex-row gap-3 justify-center">
            {DEPARTMENTS.map((dept, index) => (
              <motion.button
                key={dept || `dept-btn-${index}`}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 border border-transparent text-sm focus:outline-none ${selectedDepartment === dept ? "bg-purple-500 text-white shadow-lg scale-105" : "bg-[#181c2a] text-gray-200 hover:bg-purple-900/40 hover:border-purple-500"}`}
                onClick={() => setSelectedDepartment(dept)}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.96 }}
              >
                {dept}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
      />
    </motion.div>
  );
};

export default FiltersCard; 