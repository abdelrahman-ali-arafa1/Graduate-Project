"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaFileUpload, FaFileAlt, FaEdit, FaSearch, FaFilter } from 'react-icons/fa';
import { HiDocumentReport } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { IoWarning } from 'react-icons/io5';

const Document = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const [isLoading, setIsLoading] = useState(true);
  const [showNoDataAlert, setShowNoDataAlert] = useState(false);
  
  // Get data from Redux store
  const uploadedData = useSelector((state) => state.dataUpload);
  const hasData = Array.isArray(uploadedData) && uploadedData.length > 0;

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'upload') {
      router.push('/dashboard/pages/document/upload');
    } else if (tab === 'edit') {
      if (hasData) {
        router.push('/dashboard/pages/document/edit');
      } else {
        setShowNoDataAlert(true);
        setTimeout(() => setShowNoDataAlert(false), 3000);
      }
    }
  };

  const handleEditClick = () => {
    if (hasData) {
      router.push('/dashboard/pages/document/edit');
    } else {
      setShowNoDataAlert(true);
      setTimeout(() => setShowNoDataAlert(false), 3000);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 300, damping: 10 }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <motion.div
          animate={{
            rotate: 360,
            borderRadius: ["25%", "25%", "50%", "50%", "25%"]
          }}
          transition={{
            duration: 2,
            ease: "linear",
            repeat: Infinity
          }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent"
        />
      </div>
    );
  }

  return (
    <motion.div 
      className="p-3 sm:p-6 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div 
        className="mb-4 sm:mb-8"
        variants={itemVariants}
      >
        <h1 className="text-xl sm:text-3xl font-bold text-[var(--foreground)] mb-1 sm:mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Document Management
        </h1>
        <p className="text-sm sm:text-base text-[var(--foreground-secondary)]">
          Upload, edit, and manage student documents and excel sheets
        </p>
      </motion.div>

      {/* No Data Alert */}
      <AnimatePresence>
        {showNoDataAlert && (
          <motion.div 
            className="mb-4 sm:mb-6 bg-amber-500/20 border border-amber-500/30 text-amber-200 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center gap-2 sm:gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <IoWarning className="text-amber-500 text-lg sm:text-xl flex-shrink-0" />
            <div>
              <p className="font-medium text-sm sm:text-base text-[var(--foreground)]">No Data Available</p>
              <p className="text-xs sm:text-sm text-[var(--foreground-secondary)]">Please upload an Excel sheet first before accessing the edit page.</p>
            </div>
            <motion.button 
              onClick={() => router.push('/dashboard/pages/document/upload')}
              className="ml-auto bg-amber-500/30 hover:bg-amber-500/40 text-amber-200 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Upload Now
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Filter Bar */}
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-center mb-5 sm:mb-8 gap-3 sm:gap-4"
        variants={itemVariants}
      >
        <div className="relative w-full md:w-1/2">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 sm:gap-2 bg-[#1a1f2e] border border-[#2a2f3e] hover:bg-[#2a2f3e] text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-xs sm:text-sm"
          >
            <FaFilter className="text-xs sm:text-sm" />
            <span>Filter</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors shadow-md shadow-blue-500/20 text-xs sm:text-sm"
            onClick={() => router.push('/dashboard/pages/document/upload')}
          >
            <FaFileUpload className="text-xs sm:text-sm" />
            <span>New Upload</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div 
        className="flex mb-5 sm:mb-8 border-b border-[#2a2f3e] overflow-x-auto scrollbar-none"
        variants={itemVariants}
      >
        <motion.button
          className={`px-3 sm:px-6 py-2 sm:py-3 font-medium relative whitespace-nowrap text-xs sm:text-sm ${
            activeTab === 'upload' ? 'text-blue-400' : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => handleTabChange('upload')}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
        >
          <div className="flex items-center gap-1 sm:gap-2">
            <FaFileUpload className="text-xs sm:text-base" />
            <span>Upload Documents</span>
          </div>
          {activeTab === 'upload' && (
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
              layoutId="activeTab"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>
        
        <motion.button
          className={`px-3 sm:px-6 py-2 sm:py-3 font-medium relative whitespace-nowrap text-xs sm:text-sm ${
            activeTab === 'edit' ? 'text-blue-400' : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => handleTabChange('edit')}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
        >
          <div className="flex items-center gap-1 sm:gap-2">
            <FaEdit className="text-xs sm:text-base" />
            <span>Edit Documents</span>
          </div>
          {activeTab === 'edit' && (
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
              layoutId="activeTab"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>
      </motion.div>

      {/* Main Content Area */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
        variants={containerVariants}
      >
        <motion.div
          className="bg-[#1a1f2e] p-4 sm:p-6 rounded-xl border border-[#2a2f3e] hover:border-blue-500/30 transition-colors"
          variants={cardVariants}
          whileHover="hover"
          onClick={() => router.push('/dashboard/pages/document/upload')}
        >
          <div className="bg-blue-500/10 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <FaFileUpload className="text-blue-400 text-lg sm:text-2xl" />
          </div>
          <h3 className="text-base sm:text-xl font-semibold text-[var(--foreground)] mb-1 sm:mb-2">Upload Excel Sheet</h3>
          <p className="text-xs sm:text-sm text-[var(--foreground-secondary)] mb-3 sm:mb-4">
            Upload student data via Excel spreadsheets for batch processing
          </p>
          <motion.div 
            className="text-blue-400 font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
          >
            Upload Now
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-[#1a1f2e] p-4 sm:p-6 rounded-xl border border-[#2a2f3e] hover:border-purple-500/30 transition-colors"
          variants={cardVariants}
          whileHover="hover"
          onClick={handleEditClick}
        >
          <div className="bg-purple-500/10 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <FaEdit className="text-purple-400 text-lg sm:text-2xl" />
          </div>
          <h3 className="text-base sm:text-xl font-semibold text-[var(--foreground)] mb-1 sm:mb-2">Edit Documents</h3>
          <p className="text-xs sm:text-sm text-[var(--foreground-secondary)] mb-3 sm:mb-4">
            Modify and update existing student data and information
          </p>
          <motion.div 
            className="text-purple-400 font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
          >
            Edit Now
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-[#1a1f2e] p-4 sm:p-6 rounded-xl border border-[#2a2f3e] hover:border-green-500/30 transition-colors"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="bg-green-500/10 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <HiDocumentReport className="text-green-400 text-lg sm:text-2xl" />
          </div>
          <h3 className="text-base sm:text-xl font-semibold text-[var(--foreground)] mb-1 sm:mb-2">Generate Reports</h3>
          <p className="text-xs sm:text-sm text-[var(--foreground-secondary)] mb-3 sm:mb-4">
            Create and export detailed reports from student data
          </p>
          <motion.div 
            className="text-green-400 font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
          >
            Coming Soon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Recent Activity Section */}
      <motion.div 
        className="mt-6 sm:mt-12"
        variants={itemVariants}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-3 sm:mb-6">Recent Activity</h2>
        <div className="bg-[#1a1f2e] rounded-xl border border-[#2a2f3e] overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <p className="text-[var(--foreground-secondary)] text-xs sm:text-sm">No recent activities found</p>
              <motion.button
                className="text-blue-400 text-xs sm:text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Document;
