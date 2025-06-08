import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaBookOpen } from "react-icons/fa";

const NoCourse = () => {
  const router = useRouter();
  
  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[400px]"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-[var(--secondary)] rounded-xl p-6 sm:p-8 shadow-md max-w-md w-full text-center mx-4 sm:mx-auto">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[var(--primary-light)]/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <FaBookOpen className="text-[var(--primary)] text-xl sm:text-2xl" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)] mb-2 sm:mb-3">No Course Selected</h2>
        <p className="text-[var(--foreground-secondary)] text-sm sm:text-base mb-4 sm:mb-6">Please select a course before generating a QR code for attendance</p>
        <motion.button
          onClick={() => router.push('/dashboard/doctor/subjects')}
          className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg w-full flex items-center justify-center gap-2"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaBookOpen className="text-base sm:text-lg" />
          <span className="text-sm sm:text-base">Select Course</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NoCourse; 