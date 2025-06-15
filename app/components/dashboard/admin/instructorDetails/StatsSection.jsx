'use client';

import { motion } from "framer-motion";
import { FaChartBar } from "react-icons/fa";

import StatisticsCards from "./StatisticsCards";
import { 
  AttendancePieChart, 
  AttendanceBarChart 
} from "./AttendanceCharts";

const StatsSection = ({ instructorStats, statsLoading, statsError }) => {
  return (
    <motion.div 
      className="bg-[#232738] rounded-xl p-6 shadow-md border border-[#2a2f3e] overflow-hidden relative"
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
    >
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <FaChartBar className="mr-3 text-purple-400" /> Attendance Statistics
      </h3>
      
      {statsLoading ? (
        <motion.div 
          className="bg-[#1a1f2e]/50 p-6 rounded-lg flex items-center justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="rounded-full h-10 w-10 border-4 border-t-4 border-purple-500 mb-0 animate-spin"
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="ml-4 text-gray-400">Loading statistics...</p>
        </motion.div>
      ) : statsError ? (
        <motion.div 
          className="bg-[#1a1f2e]/50 p-6 rounded-lg text-center text-gray-400"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p>Failed to load attendance statistics</p>
        </motion.div>
      ) : (
        <>
          {/* Statistics Cards */}
          <StatisticsCards instructorStats={instructorStats} />
          
          {/* Charts Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Pie Chart Section */}
            <motion.div 
              className="bg-[#1a1f2e] p-4 sm:p-6 rounded-xl border border-[#2a2f3e] shadow-md animate-fadeIn overflow-hidden relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-purple-900/5"></div>
              <div className="relative">
                <motion.h4 
                  className="text-base sm:text-lg text-white font-semibold mb-3 sm:mb-4 flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <span className="w-2 h-6 sm:h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mr-2 sm:mr-3"></span>
                  Attendance Distribution
                </motion.h4>
                
                <div className="pt-2">
                  <AttendancePieChart 
                    data={[
                      { name: 'Present', value: instructorStats?.present ?? 0, color: '#4ade80' },
                      { name: 'Absent', value: instructorStats?.absent ?? 0, color: '#f87171' }
                    ]} 
                  />
                  
                  {(!instructorStats?.present && !instructorStats?.absent) && (
                    <div className="text-center text-[var(--foreground-secondary)] text-sm mt-4">
                      No attendance data available for this instructor
                    </div>
                  )}
                </div>
                
                <div className="flex justify-center mt-2 sm:mt-4 gap-4 sm:gap-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-xs sm:text-sm text-[var(--foreground-secondary)]">Present</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                    <span className="text-xs sm:text-sm text-[var(--foreground-secondary)]">Absent</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Bar Chart Section */}
            <motion.div 
              className="bg-[#1a1f2e] p-6 rounded-xl border border-[#2a2f3e] shadow-md animate-fadeIn overflow-hidden relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/5 to-purple-900/5"></div>
              <div className="relative">
                <motion.h4 
                  className="text-lg text-white font-semibold mb-4 flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <span className="w-2 h-8 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-full mr-3"></span>
                  Present vs Absent
                </motion.h4>
                
                <div className="pt-2">
                  <AttendanceBarChart 
                    present={instructorStats?.present ?? 0} 
                    absent={instructorStats?.absent ?? 0} 
                  />
                  
                  {(!instructorStats?.present && !instructorStats?.absent) && (
                    <div className="text-center text-[var(--foreground-secondary)] text-sm mt-4">
                      No attendance data available for this instructor
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default StatsSection; 