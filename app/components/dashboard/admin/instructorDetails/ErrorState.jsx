'use client';

import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

const ErrorState = ({ fetchError }) => {
  const router = useRouter();
  
  return (
    <motion.div 
      className="bg-red-900/20 border border-red-500 p-6 rounded-xl text-red-400"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="font-bold text-xl mb-2">Error Loading Data</h3>
      <p className="mb-2">{fetchError?.error || "Instructor not found"}</p>
      <button 
        onClick={() => router.push('/dashboard/admin')}
        className="mt-4 bg-red-800/30 hover:bg-red-800/50 text-white py-2 px-4 rounded-lg transition-colors flex items-center"
      >
        <FaArrowLeft className="mr-2" /> Back to Instructors
      </button>
    </motion.div>
  );
};

export default ErrorState; 