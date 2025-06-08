import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaBookOpen, FaInfoCircle, FaLock, FaUserGraduate } from "react-icons/fa";

const CourseInfo = ({ 
  selectedCourse, 
  hasActiveSession,
  studentsCount
}) => {
  const router = useRouter();

  return (
    <motion.div
      className="bg-[var(--secondary)] rounded-xl p-6 shadow-md border-l-4 border-[var(--primary)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
            {selectedCourse.courseName}
          </h2>
          <div className="flex items-center gap-3">
            <span className="bg-[var(--background-secondary)] text-[var(--foreground-secondary)] text-sm px-2 py-1 rounded-full">
              {selectedCourse.department}
            </span>
            <span className="text-[var(--foreground-secondary)] text-sm">
              Level {selectedCourse.level}
            </span>
            <span className="text-[var(--foreground-secondary)] text-sm">
              Semester {selectedCourse.semester || "1"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[var(--background-secondary)] px-3 py-1 rounded-full text-sm flex items-center">
            <FaUserGraduate className="mr-2 text-[var(--primary)]" />
            <span>{studentsCount} Students</span>
          </div>
          {hasActiveSession ? (
            <div className="bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5">
              <FaLock className="text-xs" />
              <span>Active Session in Progress</span>
            </div>
          ) : (
            <motion.button
              onClick={() => router.push("/dashboard/doctor/subjects?from=students")}
              className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaBookOpen className="text-xs" />
              <span>Change Course</span>
            </motion.button>
          )}
        </div>
      </div>
      {hasActiveSession && (
        <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-sm flex items-start gap-3">
          <FaInfoCircle className="text-yellow-500 mt-0.5 flex-shrink-0" />
          <p className="text-[var(--foreground-secondary)]">
            You cannot change the course while an attendance session is active. Please end the current session in the Take Attendance page first.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default CourseInfo; 