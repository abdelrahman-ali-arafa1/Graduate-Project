"use client";
import React from 'react';
import { motion } from "framer-motion";

// Custom hook
import useSubjectsPage from "@/app/hooks/useSubjectsPage";

// Components
import FiltersPanel from "@/app/components/dashboard/doctor/subjects/FiltersPanel";
import CoursesList from "@/app/components/dashboard/doctor/subjects/CoursesList";
import LoadingState from "@/app/components/dashboard/doctor/subjects/LoadingState";
import EmptyState from "@/app/components/dashboard/doctor/subjects/EmptyState";

const DoctorSubjects = () => {
  // Get states and functions from custom hook
  const {
    filteredCourses,
    instructorCoursesIds,
    selectedDepartment,
    setSelectedDepartment,
    selectedLevel,
    setSelectedLevel,
    selectedSemester,
    setSelectedSemester,
    levels,
    departments,
    semesters,
    getSemesterCategory,
    handleCourseSelect,
    clearFilters,
    isLoading,
    error
  } = useSubjectsPage();

  // Show loading state while fetching data
  if (isLoading) {
    return <LoadingState />;
  }
  
  // Show error state if there's an error
  if (error) {
    return <EmptyState isError={true} errorMessage={error.message} />;
  }

  return (
    <div>
      {/* Page Title */}
      <motion.div 
        className="mb-6 sm:mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-1 sm:mb-2">
          Your Assigned Courses
        </h1>
        <p className="text-sm text-[var(--foreground-secondary)]">
          Select a course to manage attendance
        </p>
      </motion.div>
      
      {/* Filters */}
      <FiltersPanel 
        levels={levels}
        departments={departments}
        semesters={semesters}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        selectedSemester={selectedSemester}
        setSelectedSemester={setSelectedSemester}
      />
      
      {/* Courses List */}
      <CoursesList 
        filteredCourses={filteredCourses}
        handleCourseSelect={handleCourseSelect}
        getSemesterCategory={getSemesterCategory}
        clearFilters={clearFilters}
        selectedDepartment={selectedDepartment}
        selectedLevel={selectedLevel}
        selectedSemester={selectedSemester}
      />
    </div>
  );
};

export default DoctorSubjects;
