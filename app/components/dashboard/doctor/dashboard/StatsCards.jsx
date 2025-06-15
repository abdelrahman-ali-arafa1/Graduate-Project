import React from 'react';
import { motion } from "framer-motion";
import InstructorDashCard from "@/app/components/dashboard/doctor/dashboard/InstructorDashCard";
import { FaChartLine, FaCalendarCheck, FaCalendarTimes } from "react-icons/fa";

const StatsCards = ({ summary }) => {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <InstructorDashCard 
        title="Attendance Rate"
        value={`${summary?.attendanceRate || 0}%`}
        percentage={`${summary?.avgAttendanceRate || 0}% avg`}
        isIncrease={summary?.attendanceRate >= 70}
        icon={<FaChartLine className="text-blue-400" size={20} />}
        color="bg-blue-900"
      />
      <InstructorDashCard 
        title="Present"
        value={summary?.totalPresent || 0}
        percentage={`${summary?.attendanceRate || 0}%`}
        isIncrease={summary?.attendanceRate >= 50}
        icon={<FaCalendarCheck className="text-green-400" size={20} />}
        color="bg-green-900"
      />
      <InstructorDashCard 
        title="Absent"
        value={summary?.totalAbsent || 0}
        percentage={`${100 - (summary?.attendanceRate || 0)}%`}
        isIncrease={false}
        icon={<FaCalendarTimes className="text-red-400" size={20} />}
        color="bg-red-900"
      />
    </motion.div>
  );
};

export default StatsCards; 