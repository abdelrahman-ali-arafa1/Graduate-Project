import React from 'react';
import { motion } from 'framer-motion';
import { FaFilter } from 'react-icons/fa';
import { LEVELS, DEPARTMENTS } from "@/app/hooks/constants";

const LevelDepartmentFilter = ({ selectedLevel, setSelectedLevel, selectedDepartment, setSelectedDepartment }) => {
  return (
    <motion.div
      className="bg-[#232738] rounded-xl p-6 border border-[#2a2f3e] shadow-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center mb-4">
        <FaFilter className="text-blue-400 mr-2" />
        <h3 className="text-lg font-semibold text-[var(--foreground)]">Data Filters</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
            Level
          </label>
          <div className="grid grid-cols-2 gap-2">
            {LEVELS.map((level, index) => (
              <button
                key={level || `level-filter-btn-${index}`}
                onClick={() => setSelectedLevel(level)}
                className={`py-2 px-3 rounded-lg text-sm transition-colors ${
                  selectedLevel === level
                    ? "bg-blue-600 text-white"
                    : "bg-[#1a1f2e] text-[var(--foreground-secondary)] hover:bg-[#2a2f3e]"
                }`}
              >
                Level {level}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
            Department
          </label>
          <div className="grid grid-cols-2 gap-2">
            {DEPARTMENTS.map((dept, index) => (
              <button
                key={dept || `dept-filter-btn-${index}`}
                onClick={() => setSelectedDepartment(dept)}
                className={`py-2 px-3 rounded-lg text-sm transition-colors ${
                  selectedDepartment === dept
                    ? "bg-purple-600 text-white"
                    : "bg-[#1a1f2e] text-[var(--foreground-secondary)] hover:bg-[#2a2f3e]"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LevelDepartmentFilter; 