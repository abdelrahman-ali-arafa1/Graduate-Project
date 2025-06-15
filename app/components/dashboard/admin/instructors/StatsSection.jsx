"use client";

import React from "react";
import { FaUserTie, FaBuilding, FaBook, FaChalkboardTeacher } from "react-icons/fa";
import StatsCard from "@/app/components/ui/StatsCard";

const StatsSection = ({ stats }) => {
  const { totalInstructors, departments, totalCourses, avgCoursesPerInstructor } = stats;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard 
        title="Total Instructors" 
        value={totalInstructors} 
        icon={<FaUserTie size={24} className="text-blue-400" />} 
        color="blue" 
        description="Active teaching staff"
        className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 border-blue-800/30 hover:shadow-blue-900/20"
      />
      <StatsCard 
        title="Departments" 
        value={departments} 
        icon={<FaBuilding size={24} className="text-purple-400" />} 
        color="purple" 
        description="Academic departments"
        className="bg-gradient-to-br from-purple-900/30 to-purple-800/10 border-purple-800/30 hover:shadow-purple-900/20"
      />
      <StatsCard 
        title="Total Courses" 
        value={totalCourses} 
        icon={<FaBook size={24} className="text-green-400" />} 
        color="green" 
        description="Assigned to instructors"
        className="bg-gradient-to-br from-green-900/30 to-green-800/10 border-green-800/30 hover:shadow-green-900/20"
      />
      <StatsCard 
        title="Avg. Courses" 
        value={avgCoursesPerInstructor} 
        icon={<FaChalkboardTeacher size={24} className="text-yellow-400" />} 
        color="yellow" 
        description="Per instructor"
        className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/10 border-yellow-800/30 hover:shadow-yellow-900/20"
      />
    </div>
  );
};

export default StatsSection; 