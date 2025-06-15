"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/components/providers/LanguageProvider";
import { itemVariants } from "./constants/animationVariants";

const PageHeader = ({ totalInstructors }) => {
  const { t, isRTL } = useLanguage();
  const router = useRouter();

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-indigo-900/40 p-8 border border-blue-800/30"
      variants={itemVariants}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
      
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <motion.h1 
            className="text-3xl font-bold text-white mb-3 flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {t('instructorsManagement') || 'Instructors Management'}
            </span>
            <span className="ml-3 px-2 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-md border border-blue-500/30">
              {totalInstructors} {t('total') || 'Total'}
            </span>
          </motion.h1>
          <motion.p 
            className="text-blue-200/80 max-w-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {t('instructorsManagementDescription') || 'Manage and view all lecturer accounts. Add new instructors, edit their information, or remove them from the system.'}
          </motion.p>
        </div>
        
        <motion.button
          onClick={() => router.push('/dashboard/admin/addDoctor')}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-5 rounded-lg transition-all duration-300 backdrop-blur-sm shadow-lg shadow-blue-900/20 border border-blue-500/50"
          whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}
          whileTap={{ scale: 0.97 }}
        >
          <FaPlus className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('addNewInstructor') || 'Add New Instructor'}
        </motion.button>
      </div>
      
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
      />
    </motion.div>
  );
};

export default PageHeader; 