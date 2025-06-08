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
      <div className="bg-[var(--secondary)] rounded-xl p-8 shadow-md max-w-md w-full text-center">
        <div className="w-16 h-16 bg-[var(--primary-light)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaBookOpen className="text-[var(--primary)] text-2xl" />
        </div>
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">
          No Course Selected
        </h2>
        <p className="text-[var(--foreground-secondary)] mb-6">
          Please select a course to view student data
        </p>
        <motion.button
          onClick={() => router.push("/dashboard/doctor/subjects?from=students")}
          className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white py-3 px-6 rounded-lg w-full flex items-center justify-center gap-2"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaBookOpen className="text-lg" />
          <span>Select Course</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NoCourse; 