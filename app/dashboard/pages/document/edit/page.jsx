"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaTable, FaSearch, FaFilter, FaSort, FaSave, FaDownload, FaPlus, FaFileUpload } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import DocumentTable from '@/app/components/document/DocumentTable';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { IoWarning } from 'react-icons/io5';

const DocumentEdit = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const uploadedData = useSelector((state) => state.dataUpload);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [showRedirectMessage, setShowRedirectMessage] = useState(false);
    const [redirectCountdown, setRedirectCountdown] = useState(3);

    // Check if data exists
    const hasData = Array.isArray(uploadedData) && uploadedData.length > 0;

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false);
            
            // If no data, show message and redirect to upload page
            if (!hasData) {
                setShowRedirectMessage(true);
                
                // Set up countdown timer
                const countdownInterval = setInterval(() => {
                    setRedirectCountdown(prev => {
                        if (prev <= 1) {
                            clearInterval(countdownInterval);
                            router.push('/dashboard/pages/document/upload');
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
                
                return () => clearInterval(countdownInterval);
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [hasData, router]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                when: "beforeChildren",
                staggerChildren: 0.1
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

    // If no data and not loading, show redirect message
    if (!hasData) {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-full bg-[#0f1219]">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-[#1a1f2e] p-8 rounded-xl border border-[#2a2f3e] max-w-md w-full text-center shadow-xl shadow-black/20"
                >
                    <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, rotate: [0, 10, 0] }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                        className="mx-auto mb-6 bg-amber-500/20 w-20 h-20 rounded-full flex items-center justify-center"
                    >
                        <IoWarning className="text-amber-500 text-5xl" />
                    </motion.div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2">No Data Available</h2>
                    <p className="text-[var(--foreground-secondary)] mb-6">
                        You need to upload an Excel sheet before you can edit data.
                        Redirecting you to the upload page in <span className="text-amber-400 font-bold">{redirectCountdown}</span> seconds...
                    </p>
                    
                    <div className="w-full bg-[#232738] h-2 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-amber-500"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3, ease: "linear" }}
                        />
                    </div>
                    
                    <motion.button
                        onClick={() => router.push('/dashboard/pages/document/upload')}
                        className="mt-6 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors shadow-md shadow-amber-500/20"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaFileUpload />
                        <span>Go to Upload Now</span>
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div 
            className="p-6 w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div 
                className="mb-8 flex items-center"
                variants={itemVariants}
            >
                <motion.button
                    onClick={() => router.push('/dashboard/pages/document')}
                    className="mr-4 p-2 rounded-full bg-[#1a1f2e] hover:bg-[#2a2f3e] transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FaArrowLeft className="text-gray-400" />
                </motion.button>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        Edit Student Data
                    </h1>
                    <p className="text-gray-400">
                        Modify and manage uploaded student information
                    </p>
                </div>
            </motion.div>

            {/* Main Content */}
            <motion.div variants={containerVariants}>
                {/* Controls Section */}
                <motion.div 
                    className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4"
                    variants={itemVariants}
                >
                    <div className="relative w-full md:w-1/2">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, department..."
                            className="w-full pl-10 pr-4 py-3 bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <motion.div className="relative group">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 bg-[#1a1f2e] border border-[#2a2f3e] hover:bg-[#2a2f3e] text-white px-4 py-3 rounded-lg transition-colors"
                            >
                                <FaFilter />
                                <span>Filter</span>
                            </motion.button>
                            <motion.div 
                                className="absolute right-0 mt-2 w-48 bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg shadow-lg z-10 overflow-hidden origin-top-right hidden group-hover:block"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.1 }}
                            >
                                <div className="py-1">
                                    {['All', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'CS', 'IS', 'AI', 'BIO'].map((filter) => (
                                        <button
                                            key={filter}
                                            className={`block px-4 py-2 text-sm w-full text-left ${
                                                selectedFilter === filter.toLowerCase() 
                                                    ? 'bg-purple-500/20 text-purple-300' 
                                                    : 'text-gray-300 hover:bg-[#2a2f3e]'
                                            }`}
                                            onClick={() => setSelectedFilter(filter.toLowerCase())}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 bg-[#1a1f2e] border border-[#2a2f3e] hover:bg-[#2a2f3e] text-white px-4 py-3 rounded-lg transition-colors"
                        >
                            <FaSort />
                            <span>Sort</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-4 py-3 rounded-lg transition-colors shadow-md shadow-green-500/20"
                        >
                            <FaSave />
                            <span>Save</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-4 py-3 rounded-lg transition-colors shadow-md shadow-purple-500/20"
                        >
                            <FaDownload />
                            <span>Export</span>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Data Summary Cards */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                    variants={itemVariants}
                >
                    <motion.div 
                        className="bg-[#1a1f2e] p-6 rounded-xl border border-[#2a2f3e] hover:border-blue-500/30 transition-colors"
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm">Total Students</p>
                                <h3 className="text-2xl font-bold text-white mt-1">
                                    {uploadedData?.length || 0}
                                </h3>
                            </div>
                            <div className="bg-blue-500/20 p-3 rounded-lg">
                                <FaTable className="text-blue-400" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        className="bg-[#1a1f2e] p-6 rounded-xl border border-[#2a2f3e] hover:border-purple-500/30 transition-colors"
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[var(--foreground-secondary)] text-sm">Departments</p>
                                <h3 className="text-2xl font-bold text-[var(--foreground)] mt-1">
                                    4
                                </h3>
                            </div>
                            <div className="bg-purple-500/20 p-3 rounded-lg">
                                <FaFilter className="text-purple-400" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        className="bg-[#1a1f2e] p-6 rounded-xl border border-[#2a2f3e] hover:border-green-500/30 transition-colors"
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[var(--foreground-secondary)] text-sm">Levels</p>
                                <h3 className="text-2xl font-bold text-[var(--foreground)] mt-1">
                                    4
                                </h3>
                            </div>
                            <div className="bg-green-500/20 p-3 rounded-lg">
                                <FaSort className="text-green-400" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        className="bg-[#1a1f2e] p-6 rounded-xl border border-[#2a2f3e] hover:border-pink-500/30 transition-colors"
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm">Add Student</p>
                                <button className="text-pink-400 font-medium mt-1 flex items-center gap-1">
                                    <FaPlus className="text-xs" /> New Entry
                                </button>
                            </div>
                            <div className="bg-pink-500/20 p-3 rounded-lg">
                                <FaPlus className="text-pink-400" />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Table Component */}
                <motion.div 
                    className="bg-[#1a1f2e] rounded-xl border border-[#2a2f3e] overflow-hidden"
                    variants={itemVariants}
                >
                    <DocumentTable searchTerm={searchTerm} selectedFilter={selectedFilter} />
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default DocumentEdit;
