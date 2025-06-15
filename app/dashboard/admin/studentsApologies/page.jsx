"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaInbox, FaCheckCircle, FaTimesCircle, FaClock, FaEye, FaCommentAlt, FaImage, FaCalendarAlt, FaUserGraduate, FaBook, FaSync, FaSearch, FaFilter, FaBuilding, FaSpinner } from "react-icons/fa";
import Image from "next/image";
import useApologies from "@/app/hooks/useApologies";

// مكون الصفحة الرئيسي
const AdminApologiesPage = () => {
  const {
    filteredApologies,
    totalApologies,
    selectedApology,
    showModal,
    updateReason,
    statusFilter,
    searchQuery,
    departmentFilter,
    loading,
    isUpdating,
    error,
    setUpdateReason,
    setStatusFilter,
    setSearchQuery,
    setDepartmentFilter,
    handleViewDetails,
    handleCloseModal,
    handleUpdateStatus,
    refetch,
    getStatusColor,
    getStatusIcon,
    formatDate,
    getFullImageUrl,
    statuses,
    departments,
  } = useApologies({
    role: 'admin',
  });

  const getStatusIconComponent = (status) => {
    const iconName = getStatusIcon(status);
    switch (iconName) {
      case "FaClock": return <FaClock />;
      case "FaCheckCircle": return <FaCheckCircle />;
      case "FaTimesCircle": return <FaTimesCircle />;
      default: return null;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const cardVariants = {
    hover: { scale: 1.03, boxShadow: "0 8px 24px rgba(99, 102, 241, 0.2)" },
  };

  if (loading && !totalApologies) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <FaSpinner className="text-indigo-400 text-5xl animate-spin" />
        <p className="ml-4 text-white text-lg">Loading Apologies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[500px] text-red-500">
        <FaTimesCircle className="text-5xl mb-4" />
        <p className="text-lg">Error: {error.data?.message || error.message || "Failed to fetch apologies"}</p>
        <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-indigo-600 rounded-lg text-white">Retry</button>
      </div>
    );
  }

  return (
    <motion.div
      className="p-4 sm:p-6 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between" variants={itemVariants}>
        <div className="flex items-center mb-4 sm:mb-0">
            <div className="w-16 h-16 rounded-full bg-indigo-600/20 flex items-center justify-center mr-4">
                <FaInbox className="text-indigo-400 text-3xl" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-white mb-1">Student Apologies</h1>
                <p className="text-gray-400">Total Apologies: <span className="font-bold text-white">{totalApologies}</span></p>
            </div>
        </div>
        <button onClick={() => refetch()} className={`p-2 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-colors ${loading ? 'animate-spin' : ''}`} title="Refresh Data">
            <FaSync className="text-xl" />
        </button>
      </motion.div>

      <motion.div className="bg-[#1a1f2e] p-4 rounded-xl border border-[#2a2f3e] mb-6 flex flex-col md:flex-row gap-4 items-center justify-between" variants={itemVariants}>
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 rounded-lg bg-[#2a2f3e] text-white border border-[#3b4152] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div className="flex items-center gap-2">
            <p className="text-gray-400"><FaFilter /></p>
            {statuses.map((status, index) => (
                <button key={status || `status-filter-${index}`} onClick={() => setStatusFilter(status)} className={`px-4 py-2 text-sm rounded-lg transition-colors capitalize ${statusFilter === status ? 'bg-indigo-600 text-white' : 'bg-[#2a2f3e] text-gray-300 hover:bg-indigo-500/20'}`}>
                    {status}
                </button>
            ))}
        </div>

        <div className="relative w-full md:w-auto">
            <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="w-full md:w-48 p-2 pl-10 pr-4 rounded-lg bg-[#2a2f3e] text-white border border-[#3b4152] focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
                {departments.map((dept, index) => (<option key={dept || `dept-option-${index}`} value={dept}>{dept === 'all' ? 'All Departments' : dept}</option>))}
            </select>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants}>
        {filteredApologies.length > 0 ? (
          filteredApologies.map((apology, index) => (
            <motion.div
              key={apology._id || `apology-row-${index}`}
              className="bg-[#1a1f2e] rounded-xl border border-[#2a2f3e] p-5 shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
              variants={{ ...itemVariants, ...cardVariants }}
              whileHover="hover"
              onClick={() => handleViewDetails(apology)}
            >
                <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center mr-3 shrink-0">
                        <FaUserGraduate className="text-indigo-400 text-xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white truncate">{apology.student?.name}</h3>
                        <p className="text-gray-400 text-sm truncate">{apology.student?.email}</p>
                    </div>
                    <div className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(apology.status)} flex items-center gap-1.5`}>
                        {getStatusIconComponent(apology.status)}
                        <span className="capitalize">{apology.status}</span>
                    </div>
                </div>
                
                <p className="text-gray-300 flex items-center text-sm mb-1"><FaBook className="mr-2 text-indigo-400" /> Course: <span className="font-medium text-white ml-1">{apology.course?.courseName}</span></p>
                <p className="text-gray-300 flex items-center text-sm mb-4"><FaCommentAlt className="mr-2 text-gray-400" /> Description: <span className="font-medium text-white ml-1 truncate">{apology.description}</span></p>

                {apology.image && (
                    <div className="relative w-full h-40 bg-gray-800 rounded-lg overflow-hidden mb-4">
                        <Image 
                            src={getFullImageUrl(apology.image)} 
                            alt="Attachment" 
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                            className="object-cover rounded-lg"
                            onError={(e) => {
                                console.error("Image failed to load:", apology.image);
                                e.currentTarget.src = "/images/placeholder-image.jpg";
                            }}
                        />
                    </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-700 pt-3 mt-3">
                    <span className="flex items-center gap-1.5"><FaCalendarAlt />{formatDate(apology.createdAt, "MMM dd, yyyy")}</span>
                    <span className="flex items-center gap-1.5 hover:text-indigo-400"><FaEye /> See Details</span>
                </div>
            </motion.div>
          ))
        ) : (
          <motion.div className="col-span-full text-center py-10 bg-[#1a1f2e] rounded-xl border border-[#2a2f3e] text-gray-400" variants={itemVariants}>
            <FaInbox className="text-6xl mb-4 text-indigo-400 mx-auto" />
            <p className="text-xl">No Apologies Found</p>
            <p className="text-sm mt-2">There are no apologies matching your current filters.</p>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {showModal && selectedApology && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-[#1a1f2e] rounded-xl border border-[#2a2f3e] shadow-2xl w-full max-w-2xl" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center"><FaEye className="mr-3 text-indigo-400" /> Apology Details</h2>
                        <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors"><FaTimesCircle className="text-2xl" /></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="bg-[#2a2f3e] p-4 rounded-lg border border-[#3b4152]">
                            <h3 className="text-lg font-semibold text-white mb-2 flex items-center"><FaUserGraduate className="mr-2 text-indigo-400" /> Student Info</h3>
                            <p className="text-gray-300">Name: <span className="font-medium text-white">{selectedApology.student?.name}</span></p>
                            <p className="text-gray-300">Email: <span className="font-medium text-white">{selectedApology.student?.email}</span></p>
                            <p className="text-gray-300">Level: <span className="font-medium text-white">{selectedApology.student?.level}</span></p>
                            <p className="text-gray-300">Department: <span className="font-medium text-white">{selectedApology.student?.department}</span></p>
                        </div>
                        <div className="bg-[#2a2f3e] p-4 rounded-lg border border-[#3b4152]">
                            <h3 className="text-lg font-semibold text-white mb-2 flex items-center"><FaCommentAlt className="mr-2 text-green-400" /> Apology Content</h3>
                            <p className="text-gray-300">Course: <span className="font-medium text-white">{selectedApology.course?.courseName}</span></p>
                            <p className="text-gray-300">Description: <span className="font-medium text-white">{selectedApology.description}</span></p>
                            <p className="text-gray-300 flex items-center">Status: <span className={`px-2 py-1 rounded-full text-xs font-semibold ml-2 ${getStatusColor(selectedApology.status)} flex items-center gap-1 capitalize`}>{getStatusIconComponent(selectedApology.status)} {selectedApology.status}</span></p>
                            <p className="text-gray-400 text-xs mt-1">Submitted: {formatDate(selectedApology.createdAt, "PPP 'at' p")}</p>
                        </div>
                    </div>

                    {selectedApology.image && getFullImageUrl(selectedApology.image) && (
                        <div className="bg-[#2a2f3e] p-4 rounded-lg border border-[#3b4152] mb-4">
                            <h3 className="text-lg font-semibold text-white mb-2 flex items-center"><FaImage className="mr-2 text-red-400" /> Attachment</h3>
                            <div className="relative w-full h-64 bg-gray-800 rounded-lg overflow-hidden">
                                <Image 
                                    src={getFullImageUrl(selectedApology.image)} 
                                    alt="Apology attachment" 
                                    fill
                                    sizes="(max-width: 768px) 100vw, 600px"
                                    className="object-contain rounded-lg"
                                    onError={(e) => {
                                        console.error("Modal image failed to load:", selectedApology.image);
                                        e.currentTarget.src = "/images/placeholder-image.jpg"; 
                                    }}
                                />
                            </div>
                        </div>
                    )}
                    
                    {selectedApology.status === 'pending' && (
                        <div className="bg-[#2a2f3e] p-4 rounded-lg border border-[#3b4152] mb-4">
                            <h3 className="text-lg font-semibold text-white mb-2 flex items-center"><FaCommentAlt className="mr-2 text-yellow-400" /> Add reason (optional)</h3>
                            <textarea value={updateReason} onChange={(e) => setUpdateReason(e.target.value)} placeholder="Add a reason for acceptance or rejection..." className="w-full p-3 rounded-lg bg-[#1a1f2e] text-white border border-[#3b4152] focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24"></textarea>
                        </div>
                    )}
                    
                    <div className="flex flex-col md:flex-row gap-3 justify-end pt-4 border-t border-gray-700">
                      {selectedApology.status === 'pending' ? (
                        <>
                          <button onClick={() => handleUpdateStatus('accepted')} disabled={isUpdating} className="px-6 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                            {isUpdating ? <FaSpinner className="animate-spin mr-2" /> : <FaCheckCircle className="mr-2" />} Accept
                          </button>
                          <button onClick={() => handleUpdateStatus('rejected')} disabled={isUpdating} className="px-6 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                            {isUpdating ? <FaSpinner className="animate-spin mr-2" /> : <FaTimesCircle className="mr-2" />} Reject
                          </button>
                        </>
                      ) : (
                        <p className="text-gray-400">This apology has already been <span className="font-bold">{selectedApology.status}</span>.</p>
                      )}
                      <button onClick={handleCloseModal} className="px-6 py-2 rounded-lg bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-gray-500/30 transition-colors">Close</button>
                    </div>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminApologiesPage; 