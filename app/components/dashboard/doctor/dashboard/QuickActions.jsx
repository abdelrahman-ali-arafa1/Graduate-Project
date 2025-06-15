import React from 'react';
import { motion } from "framer-motion";
import Link from "next/link";
import { FaCalendarCheck, FaUserGraduate, FaBookOpen, FaChalkboardTeacher } from "react-icons/fa";

const QuickActions = () => {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Link href="/dashboard/doctor/takeAttendance">
        <div className="bg-[#7950f2] hover:bg-[#6c40e0] text-white p-4 rounded-xl flex items-center gap-3 transition-colors">
          <div className="bg-white/20 p-3 rounded-lg">
            <FaCalendarCheck size={20} />
          </div>
          <div>
            <h4 className="font-medium">Take Attendance</h4>
            <p className="text-xs opacity-80">QR code or manual</p>
          </div>
        </div>
      </Link>
      
      <Link href="/dashboard/doctor/students">
        <div className="bg-[#232738] hover:bg-[#2a2f3e] text-white p-4 rounded-xl flex items-center gap-3 transition-colors border border-[#2a2f3e]">
          <div className="bg-blue-900/30 p-3 rounded-lg">
            <FaUserGraduate className="text-blue-400" size={20} />
          </div>
          <div>
            <h4 className="font-medium">Students</h4>
            <p className="text-xs text-gray-400">View all students</p>
          </div>
        </div>
      </Link>
      
      <Link href="/dashboard/doctor/subjects">
        <div className="bg-[#232738] hover:bg-[#2a2f3e] text-white p-4 rounded-xl flex items-center gap-3 transition-colors border border-[#2a2f3e]">
          <div className="bg-green-900/30 p-3 rounded-lg">
            <FaBookOpen className="text-green-400" size={20} />
          </div>
          <div>
            <h4 className="font-medium">Courses</h4>
            <p className="text-xs text-gray-400">Manage your courses</p>
          </div>
        </div>
      </Link>
      
      <Link href="/dashboard/doctor/manualAttendance">
        <div className="bg-[#232738] hover:bg-[#2a2f3e] text-white p-4 rounded-xl flex items-center gap-3 transition-colors border border-[#2a2f3e]">
          <div className="bg-yellow-900/30 p-3 rounded-lg">
            <FaChalkboardTeacher className="text-yellow-400" size={20} />
          </div>
          <div>
            <h4 className="font-medium">Manual Records</h4>
            <p className="text-xs text-gray-400">Edit attendance records</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default QuickActions; 