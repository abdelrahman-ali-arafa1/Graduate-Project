import React from "react";
import { motion } from "framer-motion";

const ErrorDisplay = ({ error, refetchStudents }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[400px] flex justify-center items-center"
    >
      <div className="bg-red-900/20 text-red-400 p-6 rounded-lg max-w-md text-center">
        <h2 className="text-xl font-medium mb-2">Error Loading Student Data</h2>
        <p>{error.message || "Failed to load student data. Please try again."}</p>
        <button
          onClick={refetchStudents}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Retry
        </button>
      </div>
    </motion.div>
  );
};

export default ErrorDisplay; 