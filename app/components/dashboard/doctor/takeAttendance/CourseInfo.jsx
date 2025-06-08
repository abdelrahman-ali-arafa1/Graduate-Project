import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaBookOpen, FaInfoCircle, FaLock } from "react-icons/fa";

const CourseInfo = ({ 
  selectedCourse, 
  sessionActive,
  hasActiveSession
}) => {
  const router = useRouter();

  return (
    <motion.div 
      className="bg-[var(--secondary)] rounded-xl p-4 sm:p-6 shadow-md border-l-4 border-[var(--primary)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 sm:gap-0">
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
        
        {sessionActive && (
          <div className="bg-green-900/30 text-green-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex items-center self-start">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-1.5 sm:mr-2 animate-pulse"></span>
            Session Active
          </div>
        )}
      </div>
      <div className="mt-3 sm:mt-4 text-right">
        {hasActiveSession ? (
          <div className="flex items-center justify-end gap-2">
            <div className="text-yellow-500 text-xs sm:text-sm flex items-center">
              <FaLock className="mr-1.5 text-xs" />
              <span>Course locked during active session</span>
            </div>
          </div>
        ) : (
          <motion.button
            onClick={() => router.push('/dashboard/doctor/subjects')}
            className="text-[var(--primary)] hover:text-[var(--primary-light)] text-xs sm:text-sm flex items-center gap-1 ml-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaBookOpen className="text-xs" />
            <span>Change Course</span>
          </motion.button>
        )}
      </div>
      {hasActiveSession && (
        <div className="mt-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-xs sm:text-sm flex items-start gap-3">
          <FaInfoCircle className="text-yellow-500 mt-0.5 flex-shrink-0" />
          <p className="text-[var(--foreground-secondary)]">
            You must end the current attendance session before changing to another course.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default CourseInfo; 