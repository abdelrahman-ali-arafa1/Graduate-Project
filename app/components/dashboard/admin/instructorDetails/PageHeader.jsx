'use client';

import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

const PageHeader = () => {
  const router = useRouter();
  
  return (
    <motion.div 
      className="flex items-center mb-6"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { 
            type: "spring", 
            stiffness: 260, 
            damping: 20, 
            duration: 0.5 
          }
        }
      }}
    >
      <button 
        onClick={() => router.push('/dashboard/admin')}
        className="mr-4 bg-[#1a1f2e]/80 hover:bg-[#1a1f2e] text-white p-2 rounded-lg transition-colors"
      >
        <FaArrowLeft />
      </button>
      <div>
        <h1 className="text-2xl font-bold text-white">Instructor Details</h1>
        <p className="text-gray-400">View and manage instructor information</p>
      </div>
    </motion.div>
  );
};

export default PageHeader; 