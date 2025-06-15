import React from 'react';
import { motion } from "framer-motion";
import InstructorLineChart from "@/app/components/dashboard/doctor/dashboard/InstructorLineChart";
import InstructorPieChart from "@/app/components/dashboard/doctor/dashboard/InstructorPieChart";

const ChartsSection = ({ lineChartData, pieChartData, selectedTimeRange }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Line Chart */}
      <motion.div 
        className="lg:col-span-2 bg-[#232738] rounded-xl p-5 shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-300">
            {selectedTimeRange === "this week" ? "Daily Attendance" : "Weekly Attendance"}
          </h3>
          <div className="text-sm text-gray-400">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span> Present
            <span className="inline-block w-3 h-3 rounded-full bg-red-500 mx-1 ml-3"></span> Absent
          </div>
        </div>
        {lineChartData.length > 0 ? (
          <InstructorLineChart data={lineChartData} />
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400">
            No attendance data available
          </div>
        )}
      </motion.div>
      
      {/* Pie Chart */}
      <motion.div
        className="bg-[#232738] rounded-xl p-5 shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-lg font-medium mb-4 text-gray-300">Attendance Distribution</h3>
        {pieChartData.length > 0 && pieChartData.some(item => item.value > 0) ? (
          <InstructorPieChart data={pieChartData} />
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400">
            No attendance data available
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ChartsSection; 