import React from "react";
import { motion } from "framer-motion";
import CourseCard from "./CourseCard";
import EmptyState from "./EmptyState";

const CoursesList = ({
  filteredCourses,
  handleCourseSelect,
  getSemesterCategory,
  clearFilters,
  selectedDepartment,
  selectedLevel,
  selectedSemester
}) => {
  // Check if any filters are applied
  const hasFilters = selectedDepartment || selectedLevel || selectedSemester;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-medium text-[var(--foreground)]">Available Courses</h2>
        
        {hasFilters && (
          <button 
            onClick={clearFilters}
            className="text-xs sm:text-sm text-[#7950f2] hover:text-[#9775fa] flex items-center gap-1"
          >
            <span>Clear filters</span>
          </button>
        )}
      </div>
      
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredCourses.map((course, index) => (
            <CourseCard
              key={course._id || `course-list-item-${index}`}
              course={course}
              index={index}
              getSemesterCategory={getSemesterCategory}
              onClick={handleCourseSelect}
            />
          ))}
        </div>
      ) : (
        <EmptyState 
          hasFilters={hasFilters} 
          clearFilters={clearFilters} 
        />
      )}
    </motion.div>
  );
};

export default CoursesList; 