import React from "react";
import { motion } from "framer-motion";
import { FaChalkboardTeacher, FaFilter, FaExclamationTriangle } from "react-icons/fa";

const EmptyState = ({ hasFilters, clearFilters, isError, errorMessage }) => {
  // If there's an error, show error message
  if (isError) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="min-h-[400px] flex justify-center items-center"
      >
        <div className="bg-red-900/20 text-red-400 p-6 rounded-lg max-w-md text-center">
          <FaExclamationTriangle className="mx-auto text-3xl mb-3" />
          <h2 className="text-xl font-medium mb-2">Error Loading Courses</h2>
          <p>{errorMessage || "Failed to load courses. Please try again later."}</p>
        </div>
      </motion.div>
    );
  }

  // If there are no courses due to filters or no assigned courses
  return (
    <motion.div 
      className="bg-[#232738] rounded-xl p-5 sm:p-6 md:p-8 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center">
        <FaChalkboardTeacher className="text-2xl sm:text-3xl md:text-4xl text-gray-600 mb-3" />
        {hasFilters ? (
          <>
            <p className="text-sm text-[var(--foreground-secondary)] mb-2">
              No courses found matching your filters.
            </p>
            <button 
              onClick={clearFilters}
              className="text-[#7950f2] hover:underline text-xs sm:text-sm"
            >
              Clear all filters
            </button>
          </>
        ) : (
          <p className="text-sm text-[var(--foreground-secondary)] mb-2">
            You don't have any assigned courses yet.
            <br />
            <span className="text-xs mt-2 block">
              Please contact the administrator to assign courses to your account.
            </span>
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default EmptyState; 