import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FaEye, FaTimesCircle, FaUserGraduate, FaCommentAlt, FaCalendarAlt, FaImage } from "react-icons/fa";

const ApologyModal = ({
  showModal,
  selectedApology,
  handleCloseModal,
  getStatusColor,
  getStatusIcon,
  formatDate,
  getFullImageUrl
}) => {
  return (
    <AnimatePresence>
      {showModal && selectedApology && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseModal}
        >
          <motion.div
            className="bg-[#1a1f2e] rounded-xl border border-[#2a2f3e] shadow-2xl w-full max-w-xl transform scale-95 opacity-0 overflow-auto max-h-[90vh]"
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              {/* Modal Header with status badge */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center mr-2">
                    <FaEye className="text-blue-400 text-sm" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Apology Details</h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(selectedApology.status)} flex items-center gap-1.5`}>
                    {getStatusIcon(selectedApology.status)}
                    <span className="capitalize">{selectedApology.status}</span>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="w-6 h-6 rounded-full bg-[#2a2f3e] flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 transition-colors"
                  >
                    <FaTimesCircle className="text-sm" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Student Info Card */}
                <div className="bg-[#2a2f3e] p-3 rounded-lg border border-[#3b4152]">
                  <div className="flex items-center mb-3">
                    <div className="w-7 h-7 rounded-full bg-purple-600/20 flex items-center justify-center mr-2 border border-purple-600/30">
                      <FaUserGraduate className="text-purple-400 text-xs" />
                    </div>
                    <h3 className="text-base font-semibold text-white">Student Information</h3>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-400 w-20">Name:</span>
                      <span className="font-medium text-white">{selectedApology.student?.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 w-20">Email:</span>
                      <span className="font-medium text-white">{selectedApology.student?.email}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 w-20">Level:</span>
                      <span className="font-medium text-white">{selectedApology.student?.level}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 w-20">Department:</span>
                      <span className="font-medium text-white">{selectedApology.student?.department}</span>
                    </div>
                  </div>
                </div>

                {/* Apology Content Card */}
                <div className="bg-[#2a2f3e] p-3 rounded-lg border border-[#3b4152]">
                  <div className="flex items-center mb-3">
                    <div className="w-7 h-7 rounded-full bg-green-600/20 flex items-center justify-center mr-2 border border-green-600/30">
                      <FaCommentAlt className="text-green-400 text-xs" />
                    </div>
                    <h3 className="text-base font-semibold text-white">Apology Details</h3>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-400 w-20">Course:</span>
                      <span className="font-medium text-white">{selectedApology.course?.courseName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-1">Description:</span>
                      <p className="font-medium text-white bg-[#1a1f2e] p-2 rounded-lg border border-[#3b4152] text-xs">
                        {selectedApology.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Information */}
              <div className="bg-[#2a2f3e] p-3 rounded-lg border border-[#3b4152] mb-4">
                <div className="flex items-center mb-3">
                  <div className="w-7 h-7 rounded-full bg-yellow-600/20 flex items-center justify-center mr-2 border border-yellow-600/30">
                    <FaCalendarAlt className="text-yellow-400 text-xs" />
                  </div>
                  <h3 className="text-base font-semibold text-white">Time Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <span className="text-gray-400 w-20">Submitted:</span>
                    <span className="font-medium text-white">{formatDate(selectedApology.createdAt, "PP 'at' p")}</span>
                  </div>
                  {selectedApology.seenAt && (
                    <div className="flex items-center">
                      <span className="text-gray-400 w-20">Seen:</span>
                      <span className="font-medium text-white">{formatDate(selectedApology.seenAt, "PP 'at' p")}</span>
                    </div>
                  )}
                  {selectedApology.reason && (
                    <div className="col-span-2">
                      <span className="text-gray-400 block mb-1">Reason:</span>
                      <p className="font-medium text-white bg-[#1a1f2e] p-2 rounded-lg border border-[#3b4152] text-xs">
                        {selectedApology.reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Attachment */}
              {selectedApology.image && getFullImageUrl(selectedApology.image) && (
                <div className="bg-[#2a2f3e] p-3 rounded-lg border border-[#3b4152] mb-4">
                  <div className="flex items-center mb-3">
                    <div className="w-7 h-7 rounded-full bg-red-600/20 flex items-center justify-center mr-2 border border-red-600/30">
                      <FaImage className="text-red-400 text-xs" />
                    </div>
                    <h3 className="text-base font-semibold text-white">Attachment</h3>
                  </div>
                  <div className="relative w-full h-56 bg-[#141824] rounded-lg overflow-hidden">
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

              {/* Close button */}
              <div className="flex justify-end pt-3 border-t border-[#2a2f3e]">
                <button 
                  onClick={handleCloseModal}
                  className="px-4 py-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors flex items-center gap-1.5 text-sm"
                >
                  <FaTimesCircle className="text-xs" /> Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ApologyModal; 