import React from "react";
import { motion } from "framer-motion";
import { FaFilter } from "react-icons/fa";

const FiltersPanel = ({
  levels,
  departments,
  semesters,
  selectedLevel,
  setSelectedLevel,
  selectedDepartment,
  setSelectedDepartment,
  selectedSemester,
  setSelectedSemester
}) => {
  return (
    <motion.div 
      className="mb-6 sm:mb-8 bg-[#232738] rounded-xl p-4 sm:p-5 shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center mb-3 sm:mb-4 text-white">
        <FaFilter className="mr-2 text-sm sm:text-base" />
        <h2 className="text-base sm:text-lg font-medium">Filters</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Levels */}
        <div>
          <h3 className="text-xs sm:text-sm text-white mb-1.5 sm:mb-2">Level</h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {levels.map((level, index) => (
              <motion.button
                key={level || `level-filter-${index}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedLevel(level === selectedLevel ? "" : level)}
                className={`py-1 sm:py-1.5 md:py-2 px-2 sm:px-2.5 md:px-3 rounded-md text-xs sm:text-sm transition-colors ${
                  selectedLevel === level 
                    ? "bg-[#7950f2] text-white" 
                    : "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Level {level}
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Departments */}
        <div>
          <h3 className="text-xs sm:text-sm text-white mb-1.5 sm:mb-2">Department</h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {departments.map((dept, index) => (
              <motion.button
                key={dept || `dept-filter-${index}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDepartment(dept === selectedDepartment ? "" : dept)}
                className={`py-1 sm:py-1.5 md:py-2 px-2 sm:px-2.5 md:px-3 rounded-md text-xs sm:text-sm transition-colors ${
                  selectedDepartment === dept 
                    ? "bg-[#7950f2] text-white" 
                    : "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {dept}
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Semesters */}
        <div>
          <h3 className="text-xs sm:text-sm text-white mb-1.5 sm:mb-2">Semester</h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {semesters.map((sem, index) => (
              <motion.button
                key={sem || `sem-filter-${index}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSemester(sem === selectedSemester ? "" : sem)}
                className={`py-1 sm:py-1.5 md:py-2 px-2 sm:px-2.5 md:px-3 rounded-md text-xs sm:text-sm transition-colors ${
                  selectedSemester === sem 
                    ? "bg-[#7950f2] text-white" 
                    : "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Semester {sem}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FiltersPanel; 