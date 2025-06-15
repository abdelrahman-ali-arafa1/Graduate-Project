'use client';

import { motion } from "framer-motion";
import { 
  FaUserTie, 
  FaEnvelope, 
  FaBuilding, 
  FaEdit, 
  FaTrash, 
  FaGraduationCap 
} from "react-icons/fa";

const ProfileCard = ({ 
  instructor, 
  onEditClick, 
  onDeleteClick 
}) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-indigo-900/40 p-6 border border-blue-800/30 shadow-xl"
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
      initial="hidden"
      animate="visible"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
      <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-10">
        <motion.div 
          className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 flex items-center justify-center shadow-lg border-4 border-blue-800/30 animate-float"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        >
          <span className="text-blue-400 text-5xl font-extrabold animate-pulse select-none">
            {instructor.name?.charAt(0).toUpperCase() || '?'}
          </span>
        </motion.div>
        <div className="flex-1 min-w-0">
          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight flex items-center gap-2">
            {instructor.name || 'Unknown'}
            <span className="ml-2 px-2 py-0.5 rounded bg-blue-900/40 text-xs text-blue-300 font-semibold animate-fadeIn">Instructor</span>
          </h2>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-blue-900/20 text-blue-400 text-sm flex items-center cursor-pointer group" title="Copy Email" onClick={() => navigator.clipboard.writeText(instructor.email)}>
              <FaEnvelope className="mr-2" /> {instructor.email || 'N/A'}
              <span className="ml-1 opacity-0 group-hover:opacity-100 text-xs text-blue-200 transition-opacity">Copy</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-900/20 text-indigo-400 text-sm flex items-center">
              <FaUserTie className="mr-2" /> {instructor.lecturerRole || 'N/A'}
            </span>
            <span className="px-3 py-1 rounded-full bg-green-900/20 text-green-400 text-sm flex items-center">
              <FaBuilding className="mr-2" /> {instructor.lecturerDepartment || 'N/A'}
            </span>
            <span className="px-3 py-1 rounded-full bg-yellow-900/20 text-yellow-400 text-sm flex items-center">
              <FaGraduationCap className="mr-2" /> {instructor.lecturerCourses?.length || 0} Courses
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-xs">
            <span>User ID: <span className="text-gray-400 cursor-pointer group" title="Copy ID" onClick={() => navigator.clipboard.writeText(instructor._id)}>{instructor._id?.slice(0, 8)}...<span className="ml-1 opacity-0 group-hover:opacity-100 text-xs text-blue-200 transition-opacity">Copy</span></span></span>
          </div>
        </div>
        <div className="flex flex-col gap-3 min-w-[120px]">
          <motion.button 
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-300 shadow-md group"
            whileHover={{ scale: 1.06, boxShadow: "0 8px 24px rgba(59,130,246,0.15)" }}
            whileTap={{ scale: 0.97 }}
            onClick={onEditClick}
          >
            <FaEdit className="mr-2" />
            <span>Edit</span>
          </motion.button>
          <motion.button 
            className="flex items-center bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-all duration-300 shadow-md group"
            whileHover={{ scale: 1.06, boxShadow: "0 8px 24px rgba(239,68,68,0.15)" }}
            whileTap={{ scale: 0.97 }}
            onClick={onDeleteClick}
          >
            <FaTrash className="mr-2" />
            <span>Delete</span>
          </motion.button>
        </div>
      </div>
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
      />
    </motion.div>
  );
};

export default ProfileCard; 