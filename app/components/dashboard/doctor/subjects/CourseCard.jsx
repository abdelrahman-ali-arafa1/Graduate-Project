import React from "react";
import { motion } from "framer-motion";
import { FaBookOpen } from "react-icons/fa";

const CourseCard = ({ course, index, getSemesterCategory, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 * (index % 9) }}
      whileHover={{ translateY: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <button
        className="bg-[#232738] w-full h-full rounded-xl p-3 sm:p-4 md:p-5 text-left transition-all border-2 border-transparent hover:border-[#7950f2]/50 flex flex-col"
        onClick={() => onClick(course)}
      >
        <div className="flex justify-between items-start mb-2 sm:mb-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-[#7950f2]/20 rounded-lg flex items-center justify-center">
            <FaBookOpen className="text-[#7950f2] text-xs sm:text-sm md:text-base" />
          </div>
          <span className="text-2xs sm:text-xs bg-gray-700/50 text-gray-300 px-1.5 sm:px-2 py-0.5 rounded-full">
            {course.department}
          </span>
        </div>
        
        <h3 className="text-sm sm:text-base md:text-lg font-medium text-white mb-1 line-clamp-2">
          {course.courseName}
        </h3>
        
        <div className="mt-auto pt-2 sm:pt-3 border-t border-gray-700 flex justify-between items-center">
          <span className="text-2xs sm:text-xs text-gray-400">Level {course.level}</span>
          <div className="flex flex-col items-end">
            <span className="text-2xs sm:text-xs text-gray-400">Semester {course.semester || "1"}</span>
            <span className="text-2xs sm:text-xs text-gray-400">
              {getSemesterCategory(course.semester) === "1" ? "First Term" : "Second Term"}
            </span>
          </div>
        </div>
      </button>
    </motion.div>
  );
};

export default CourseCard; 