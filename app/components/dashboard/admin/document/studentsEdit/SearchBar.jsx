import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const SearchBar = ({ 
  searchQuery, 
  setSearchQuery, 
  filterByCourse, 
  setFilterByCourse, 
  showAdvancedFilters, 
  setShowAdvancedFilters, 
  resetFilters,
  courses
}) => {
  // Toggle advanced filters
  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
    if (showAdvancedFilters) {
      // Reset advanced filters when hiding
      setFilterByCourse("");
    }
  };

  return (
    <motion.div
      className="mt-8 bg-[#232738] rounded-xl p-4 sm:p-5 shadow-md border border-[#2a2f3e]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Box */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            placeholder="Search by name, email or ID..."
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>
          )}
        </div>
        
        {/* Advanced Filters Toggle */}
        <div className="flex gap-2">
          <button 
            onClick={toggleAdvancedFilters}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${showAdvancedFilters ? "bg-blue-600 text-white" : "bg-[#1a1f2e] text-gray-300 hover:bg-[#2a2f3e]"}`}
          >
            <FaFilter />
            <span>Advanced Filters</span>
          </button>
          
          {(searchQuery || filterByCourse) && (
            <button 
              onClick={resetFilters}
              className="px-4 py-2 rounded-lg bg-[#1a1f2e] text-gray-300 hover:bg-[#2a2f3e] flex items-center gap-2"
            >
              <FaTimes />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Advanced Filter Options */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div 
            className="mt-4 p-4 bg-[#1a1f2e] rounded-lg border border-[#2a2f3e]"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Filter by Course</label>
                <select
                  value={filterByCourse}
                  onChange={(e) => setFilterByCourse(e.target.value)}
                  className="w-full p-2 bg-[#232738] border border-[#2a2f3e] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Courses</option>
                  {courses.map((course, index) => (
                    <option key={course._id || `course-filter-option-${index}`} value={course._id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar; 