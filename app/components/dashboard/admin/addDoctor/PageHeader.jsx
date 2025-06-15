"use client";

import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

const PageHeader = () => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-indigo-900/40 p-8 border border-blue-800/30"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
      
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <Link href="/dashboard/admin" className="flex items-center text-blue-400 hover:text-blue-300 mb-4 transition-colors group">
            <FaArrowLeft className="mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform" /> Back to Instructors
          </Link>
          <h1 className="text-3xl font-bold text-white mb-3 flex items-center">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Add New Instructor
            </span>
          </h1>
          <p className="text-blue-200/80 max-w-lg">
            Create a new instructor account by filling out the required information in the following steps.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PageHeader; 