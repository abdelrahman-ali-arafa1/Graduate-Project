import React from "react";
import { motion } from "framer-motion";
import { FaUserGraduate, FaBook, FaCommentAlt, FaCalendarAlt, FaEye } from "react-icons/fa";

const ApologyCard = ({ apology, getStatusColor, getStatusIcon, formatDate, handleViewDetails }) => {
  return (
    <motion.div
      className="bg-[#1a1f2e] rounded-xl border border-[#2a2f3e] p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden relative"
      whileHover={{ scale: 1.02 }}
      onClick={() => handleViewDetails(apology)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Status badge */}
      <div className="absolute top-4 right-4">
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(apology.status)} flex items-center gap-1.5 shadow-sm`}>
          {getStatusIcon(apology.status)} 
          <span className="capitalize">{apology.status}</span>
        </div>
      </div>
      
      {/* Student info */}
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center mr-3 border border-purple-600/30">
          <FaUserGraduate className="text-purple-400 text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">{apology.student?.name}</h3>
          <p className="text-gray-400 text-sm">{apology.student?.department} - Level {apology.student?.level}</p>
        </div>
      </div>

      {/* Course and description info with icons */}
      <div className="mb-6 bg-[#141824] p-3 rounded-lg border border-[#2a2f3e]">
        <p className="text-gray-300 flex items-center text-sm mb-2">
          <span className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center mr-2">
            <FaBook className="text-blue-400 text-xs" />
          </span>
          <span className="text-gray-400">Course:</span>
          <span className="font-medium text-white ml-1 flex-1 truncate">{apology.course?.courseName}</span>
        </p>
        <p className="text-gray-300 flex items-start text-sm">
          <span className="w-6 h-6 rounded-full bg-green-600/20 flex items-center justify-center mr-2 mt-0.5">
            <FaCommentAlt className="text-green-400 text-xs" />
          </span>
          <span>
            <span className="text-gray-400">Description:</span>
            <span className="font-medium text-white ml-1 block">{apology.description}</span>
          </span>
        </p>
      </div>

      {/* Footer with date */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-[#2a2f3e]">
        <div className="flex items-center gap-1.5">
          <FaCalendarAlt className="text-purple-400" />
          <span>{formatDate(apology.createdAt, "MMM dd, yyyy")}</span>
        </div>
        <div className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300">
          <FaEye />
          <span>View Details</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ApologyCard; 