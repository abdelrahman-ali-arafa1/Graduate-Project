"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useGetCoursesQuery } from "@/app/store/features/coursesApiSlice";
import { useDashboardDoctor } from "@/app/hooks/useDashboardDoctor";

// Components
import DashboardHeader from "@/app/components/dashboard/doctor/dashboard/DashboardHeader";
import LoadingState from "@/app/components/dashboard/doctor/dashboard/LoadingState";
import ErrorState from "@/app/components/dashboard/doctor/dashboard/ErrorState";
import StatsCards from "@/app/components/dashboard/doctor/dashboard/StatsCards";
import ChartsSection from "@/app/components/dashboard/doctor/dashboard/ChartsSection";
import QuickActions from "@/app/components/dashboard/doctor/dashboard/QuickActions";
import LoadingIndicator from "@/app/components/dashboard/doctor/dashboard/LoadingIndicator";

const InstructorDashboard = () => {
  // Use dashboard hook
  const {
    selectedCourse,
    setSelectedCourse,
    selectedTimeRange,
    setSelectedTimeRange,
    isDropdownOpen,
    dashboardData,
    loading,
    error,
    toggleDropdown,
    handleCourseSelect,
    handleRefresh,
    calculateSummary,
    preparePieChartData,
    prepareLineChartData,
    getFilteredCourses,
    initializeSelectedCourse
  } = useDashboardDoctor();

  // Refs
  const dropdownRef = useRef(null);

  // Get courses data
  const { data: coursesData, isLoading: coursesLoading } = useGetCoursesQuery();
  
  // Log courses data for debugging
  useEffect(() => {
    if (coursesData) {
      console.log("All courses from API:", coursesData);
    }
  }, [coursesData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // setIsDropdownOpen(false); // Removed in favor of hook state
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter courses to only show instructor's courses
  const filteredCourses = React.useMemo(() => {
    return getFilteredCourses(coursesData);
  }, [coursesData, getFilteredCourses]);

  // Set initial selected course when courses are loaded
  useEffect(() => {
    initializeSelectedCourse(filteredCourses);
  }, [filteredCourses, initializeSelectedCourse]);

  // Loading state
  if (coursesLoading || (loading && !dashboardData)) {
    return <LoadingState />;
  }

  // Error state
  if (error || (!coursesLoading && filteredCourses.length === 0)) {
    return (
      <ErrorState 
        error={error} 
        filteredCourses={filteredCourses} 
        handleRefresh={handleRefresh} 
      />
    );
  }

  // Calculate summary and prepare chart data
  const summary = calculateSummary();
  const pieChartData = preparePieChartData();
  const lineChartData = prepareLineChartData();

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Loading Indicator */}
      <LoadingIndicator loading={loading} dashboardData={dashboardData} />

      {/* Dashboard Header */}
      <DashboardHeader 
        selectedCourse={selectedCourse}
        selectedTimeRange={selectedTimeRange}
        setSelectedTimeRange={setSelectedTimeRange}
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={toggleDropdown}
        handleCourseSelect={handleCourseSelect}
        filteredCourses={filteredCourses}
        coursesLoading={coursesLoading}
        loading={loading}
        dropdownRef={dropdownRef}
      />

      {/* Stats Cards */}
      <StatsCards summary={summary} />
      
      {/* Charts */}
      <ChartsSection 
        lineChartData={lineChartData} 
        pieChartData={pieChartData}
        selectedTimeRange={selectedTimeRange}
      />

      {/* Quick Actions */}
      <QuickActions />
    </motion.div>
  );
};

export default InstructorDashboard;
