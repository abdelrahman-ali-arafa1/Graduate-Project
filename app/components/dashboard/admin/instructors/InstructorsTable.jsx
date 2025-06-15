"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaSort, FaSortUp, FaSortDown, FaEye, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useCustomScroll } from "@/app/hooks/useCustomScroll";
import { tableVariants, rowVariants } from "./constants/animationVariants";
import { tableColumns } from "./constants/tableColumns";
import { useLanguage } from "@/app/components/providers/LanguageProvider";

const InstructorsTable = ({ 
  sortedLecturers, 
  requestSort, 
  sortConfig, 
  searchTerm,
  roleFilter,
  setSelectedInstructor, 
  setDeleteConfirm 
}) => {
  const router = useRouter();
  const { t } = useLanguage();
  const { containerRef, isHovered, setIsHovered, handleMouseDown } = useCustomScroll();

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return <FaSort className="text-gray-400 ml-1" />;
    }
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="text-blue-500 ml-1" /> 
      : <FaSortDown className="text-blue-500 ml-1" />;
  };

  return (
    <div 
      className="overflow-hidden rounded-lg border border-[#2a2f3e] shadow-inner bg-[#1a1f2e]/50 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-blue-500/20 to-transparent z-10 pointer-events-none" />
      )}
      <div 
        ref={containerRef}
        className={`overflow-y-auto table-scrollbar custom-scrollbar px-1`}
        style={{ 
          maxHeight: "500px",
          minHeight: "300px",
          scrollbarWidth: "thin",
          scrollbarColor: "#3b82f6 #1e293b"
        }}
        onMouseDown={handleMouseDown}
      >
        <motion.table 
          className="w-full border-collapse"
          variants={tableVariants}
          initial="hidden"
          animate="visible"
        >
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#1a1f2e] border-b-2 border-blue-500/30 text-gray-300">
              {tableColumns.map(column => (
                <th key={column.id} className="py-4 px-5 text-left font-semibold">
                  <button 
                    className={`flex items-center focus:outline-none ${column.hoverColor} transition-colors`}
                    onClick={() => requestSort(column.id)}
                  >
                    {column.icon}
                    {t(column.title) || column.title} {getSortIcon(column.id)}
                  </button>
                </th>
              ))}
              <th className="py-4 px-5 text-center font-semibold">{t('actions') || 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2f3e]">
            <AnimatePresence>
              {sortedLecturers.map((lecturer, index) => (
                <motion.tr 
                  key={lecturer._id || `instructor-${index}`}
                  className="text-gray-300 hover:bg-[#2a2f3e]/50 transition-colors"
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -10 }}
                  whileHover="hover"
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center mr-3 shadow-inner">
                        <span className="text-blue-300 font-medium text-lg">{lecturer.name?.charAt(0).toUpperCase() || '?'}</span>
                      </div>
                      <span className="font-medium text-white">{lecturer.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-gray-300">{lecturer.email || 'N/A'}</td>
                  <td className="py-4 px-5">
                    <span className="px-3 py-1.5 rounded-full bg-indigo-900/30 text-indigo-300 text-sm font-medium border border-indigo-800/30">
                      {lecturer.lecturerRole || 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="px-3 py-1.5 rounded-full bg-green-900/30 text-green-300 text-sm font-medium border border-green-800/30">
                      {lecturer.lecturerDepartment || 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center">
                      <span className="px-3 py-1.5 rounded-full bg-yellow-900/30 text-yellow-300 font-medium border border-yellow-800/30">
                        {lecturer.lecturerCourses ? lecturer.lecturerCourses.length : 0}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center justify-center gap-3">
                      <motion.button 
                        className="p-2.5 rounded-lg bg-blue-900/30 text-blue-300 hover:bg-blue-800/50 border border-blue-800/30 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push(`/dashboard/admin/details?id=${lecturer._id}`)}
                        title={t('viewDetails') || "View Details"}
                      >
                        <FaEye />
                      </motion.button>
                      <motion.button 
                        className="p-2.5 rounded-lg bg-red-900/30 text-red-300 hover:bg-red-800/50 border border-red-800/30 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedInstructor(lecturer);
                          setDeleteConfirm(true);
                        }}
                        title={t('deleteInstructor') || "Delete Instructor"}
                      >
                        <FaTrash />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            
            {sortedLecturers.length === 0 && (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <td colSpan="6" className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <FaSearch className="text-4xl text-gray-600" />
                    <p className="text-gray-500 text-lg">
                      {searchTerm || roleFilter ? 
                        (t('noInstructorsFound') || 'No instructors found matching your search criteria') : 
                        (t('noInstructorsAvailable') || 'No instructors available')
                      }
                    </p>
                  </div>
                </td>
              </motion.tr>
            )}
          </tbody>
        </motion.table>
      </div>
    </div>
  );
};

export default InstructorsTable; 