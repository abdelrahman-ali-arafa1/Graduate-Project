"use client";

import React from "react";
import { motion } from "framer-motion";
import AdminLineChart from "@/app/components/dashboard/admin/AdminLineChart";
import AdminPieChart from "@/app/components/dashboard/admin/AdminPieChart";
import { useLanguage } from "@/app/components/providers/LanguageProvider";

const OverviewTab = ({ data, pieChartData }) => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <motion.div 
          className="lg:col-span-2 bg-[#232738] rounded-xl p-3 sm:p-5 shadow-md border border-[#2a2f3e] overflow-hidden relative"
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
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 relative gap-2">
            <h3 className="text-base sm:text-lg font-medium text-gray-300">{t('weeklyAttendanceTrends') || 'Weekly Attendance Trends'}</h3>
            <div className="text-xs sm:text-sm text-gray-400 flex flex-wrap gap-3">
              <span className="inline-flex items-center">
                <span className="inline-block w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-green-500 mr-1"></span> {t('present') || 'Present'}
              </span>
              <span className="inline-flex items-center">
                <span className="inline-block w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-red-500 mr-1"></span> {t('absent') || 'Absent'}
              </span>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="min-h-[200px] sm:min-h-[300px]"
          >
            <AdminLineChart data={data} />
          </motion.div>
        </motion.div>
        
        <motion.div
          className="bg-[#232738] rounded-xl p-3 sm:p-5 shadow-md border border-[#2a2f3e] overflow-hidden relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
          
          <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-gray-300 relative">{t('attendanceDistribution') || 'Attendance Distribution'}</h3>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="min-h-[180px] sm:min-h-[220px]"
          >
            <AdminPieChart data={pieChartData} />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OverviewTab; 