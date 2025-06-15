"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaArrowUp, FaChartLine, FaCalendarAlt } from "react-icons/fa";
import { useLanguage } from "@/app/components/providers/LanguageProvider";

const PerformanceSummary = ({ summary, attendanceData }) => {
  const { t } = useLanguage();

  // Fix NaN issues by checking if the value is a valid number
  const safeRate = (rate) => isNaN(rate) ? 0 : rate;
  const overallAttendanceRate = safeRate(summary.overallAttendanceRate);

  return (
    <motion.div 
      className="bg-[#232738] rounded-xl p-4 sm:p-5 shadow-md border border-[#2a2f3e] overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
        <h3 className="text-base sm:text-lg font-medium text-gray-300">{t('performanceSummary') || 'Performance Summary'}</h3>
        <div className="bg-blue-900/30 text-blue-300 py-1 px-2 sm:px-3 rounded-full text-xs font-medium self-start sm:self-auto">
          {t('weeklyReport') || 'Weekly Report'}
        </div>
      </div>
      
      <div className="relative">
        <div className="flex flex-col space-y-3 sm:space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs sm:text-sm text-gray-400">{t('overallAttendanceRate') || 'Overall Attendance Rate'}</span>
              <span className="text-xs sm:text-sm font-medium text-white">{overallAttendanceRate}%</span>
            </div>
            <div className="w-full bg-[#1a1f2e] rounded-full h-2 sm:h-2.5 mb-3 sm:mb-4">
              <motion.div 
                className="bg-blue-600 h-2 sm:h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${overallAttendanceRate}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <motion.div 
              className="bg-[#1a1f2e]/50 rounded-lg p-3 sm:p-4 border border-[#2a2f3e]/50"
              whileHover={{ y: -5, backgroundColor: "rgba(42, 47, 62, 0.5)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs">{t('bestDay') || 'Best Day'}</p>
                  <p className="text-white font-medium mt-1 text-xs sm:text-sm">
                    {attendanceData.length > 0 
                      ? attendanceData.sort((a, b) => parseInt(safeRate(b.attendanceRate)) - parseInt(safeRate(a.attendanceRate)))[0].day
                      : '-'
                    }
                  </p>
                </div>
                <div className="bg-green-900/30 p-1.5 sm:p-2 rounded-lg">
                  <FaArrowUp className="text-green-400 text-xs sm:text-sm" />
                </div>
              </div>
              <p className="text-green-400 text-base sm:text-lg font-bold mt-2">
                {attendanceData.length > 0 
                  ? `${safeRate(attendanceData.sort((a, b) => parseInt(safeRate(b.attendanceRate)) - parseInt(safeRate(a.attendanceRate)))[0].attendanceRate)}%`
                  : '0%'
                }
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-[#1a1f2e]/50 rounded-lg p-3 sm:p-4 border border-[#2a2f3e]/50"
              whileHover={{ y: -5, backgroundColor: "rgba(42, 47, 62, 0.5)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs">{t('averageAttendance') || 'Average Attendance'}</p>
                  <p className="text-white font-medium mt-1 text-xs sm:text-sm">{t('weekly') || 'Weekly'}</p>
                </div>
                <div className="bg-blue-900/30 p-1.5 sm:p-2 rounded-lg">
                  <FaChartLine className="text-blue-400 text-xs sm:text-sm" />
                </div>
              </div>
              <p className="text-blue-400 text-base sm:text-lg font-bold mt-2">{overallAttendanceRate}%</p>
            </motion.div>
            
            <motion.div 
              className="bg-[#1a1f2e]/50 rounded-lg p-3 sm:p-4 border border-[#2a2f3e]/50"
              whileHover={{ y: -5, backgroundColor: "rgba(42, 47, 62, 0.5)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs">{t('totalSessions') || 'Total Sessions'}</p>
                  <p className="text-white font-medium mt-1 text-xs sm:text-sm">{t('weekly') || 'Weekly'}</p>
                </div>
                <div className="bg-purple-900/30 p-1.5 sm:p-2 rounded-lg">
                  <FaCalendarAlt className="text-purple-400 text-xs sm:text-sm" />
                </div>
              </div>
              <p className="text-purple-400 text-base sm:text-lg font-bold mt-2">{attendanceData.length}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PerformanceSummary; 