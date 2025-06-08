import React from "react";
import { motion } from "framer-motion";

const CourseInfo = ({ selectedCourse, sessionId, remainingTime }) => {
  return (
    <motion.div 
      className="bg-[var(--secondary)] rounded-xl p-4 sm:p-6 shadow-md border-l-4 border-[var(--primary)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-[var(--foreground)] mb-1 sm:mb-2">
            {selectedCourse.courseName}
          </h2>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="bg-[var(--background-secondary)] text-[var(--foreground-secondary)] text-xs sm:text-sm px-2 py-0.5 sm:py-1 rounded-full">
              {selectedCourse.department}
            </span>
            <span className="text-[var(--foreground-secondary)] text-xs sm:text-sm">
              Level {selectedCourse.level}
            </span>
            <span className="text-[var(--foreground-secondary)] text-xs sm:text-sm">
              Semester {selectedCourse.semester || "1"}
            </span>
          </div>
        </div>
        
        {sessionId && (
          <div className="bg-green-900/30 text-green-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex items-center mt-2 sm:mt-0 self-start">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-1.5 sm:mr-2 animate-pulse"></span>
            {remainingTime ? (
              <span>Session Active: {remainingTime.minutes}m {remainingTime.seconds}s</span>
            ) : (
              <span>Session Active</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CourseInfo; 