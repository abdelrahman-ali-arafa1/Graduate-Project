import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const DashboardHeader = ({
  selectedCourse,
  selectedTimeRange,
  setSelectedTimeRange,
  isDropdownOpen,
  toggleDropdown,
  handleCourseSelect,
  filteredCourses,
  coursesLoading,
  loading,
  dropdownRef
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-white">Instructor Dashboard</h2>
        <p className="text-gray-400 text-sm">Attendance statistics and analytics</p>
      </motion.div>

      <motion.div
        className="flex flex-wrap gap-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {/* Course Filter Dropdown */}
        <div className="relative z-10" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center justify-between bg-[#1a1f2e] text-white px-3 py-2 rounded-md border border-[#2a2f3e] text-sm focus:outline-none focus:ring-2 focus:ring-[#7950f2] focus:border-transparent min-w-[160px]"
          >
            <span className="truncate max-w-[120px]">
              {selectedCourse ? selectedCourse.courseName : "Select Course"}
            </span>
            <FaChevronDown className={`ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute mt-2 w-full bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto z-20"
              >
                {coursesLoading ? (
                  <div className="px-4 py-3 text-center text-gray-400">
                    <div className="inline-block h-4 w-4 border-2 border-t-2 border-gray-500 rounded-full animate-spin mr-2"></div>
                    Loading courses...
                  </div>
                ) : filteredCourses.length === 0 ? (
                  <div className="px-4 py-3 text-center text-gray-400">
                    No courses available
                  </div>
                ) : (
                  filteredCourses.map((course, index) => (
                    <motion.button
                      key={course._id || `course-header-${index}`}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      onClick={() => handleCourseSelect(course)}
                      className={`w-full text-left px-4 py-2 hover:bg-[#2a2f3e] text-white transition-colors duration-150 ${
                        selectedCourse && selectedCourse._id === course._id ? 'bg-[#2a2f3e] border-l-4 border-[#7950f2]' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="truncate">{course.courseName}</span>
                        {selectedCourse && selectedCourse._id === course._id && (
                          <span className="ml-auto text-[#7950f2]">✓</span>
                        )}
                      </div>
                    </motion.button>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Time Range Filter */}
        <div className="relative">
          <select 
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="bg-[#1a1f2e] text-white px-3 py-2 rounded-md border border-[#2a2f3e] text-sm focus:outline-none focus:ring-2 focus:ring-[#7950f2] focus:border-transparent appearance-none pr-8"
            disabled={loading}
          >
            <option value="this week">This Week</option>
            <option value="this month">This Month</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            {loading ? (
              <div className="h-4 w-4 border-2 border-t-2 border-blue-400 rounded-full animate-spin"></div>
            ) : (
              <FaChevronDown className="text-gray-400" />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHeader; 
 