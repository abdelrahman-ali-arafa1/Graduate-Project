"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInstructorManagement } from "@/app/hooks/useInstructorManagement";
import { containerVariants } from "./constants/animationVariants";
import PageHeader from "./PageHeader";
import StatsSection from "./StatsSection";
import SearchAndFilterBar from "./SearchAndFilterBar";
import InstructorsTable from "./InstructorsTable";
import DeleteModal from "./DeleteModal";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

const InstructorsManagement = () => {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  // Use our custom hook for instructor management
  const {
    lecturers,
    filteredLecturers,
    sortedLecturers,
    uniqueRoles,
    isLoading,
    fetchError,
    isDeleting,
    searchTerm,
    setSearchTerm,
    sortConfig,
    requestSort,
    roleFilter,
    setRoleFilter,
    deleteInstructor
  } = useInstructorManagement();

  // Calculate statistics for the StatsCards
  const stats = useMemo(() => {
    const totalInstructors = lecturers.length;
    
    // Count unique departments
    const departments = new Set();
    lecturers.forEach(lecturer => {
      if (lecturer.lecturerDepartment) {
        departments.add(lecturer.lecturerDepartment);
      }
    });
    
    // Count total courses
    let totalCourses = 0;
    lecturers.forEach(lecturer => {
      totalCourses += lecturer.lecturerCourses?.length || 0;
    });
    
    // Calculate average courses per instructor
    const avgCoursesPerInstructor = totalInstructors > 0 
      ? Math.round((totalCourses / totalInstructors) * 10) / 10
      : 0;
    
    return {
      totalInstructors,
      departments: departments.size,
      totalCourses,
      avgCoursesPerInstructor
    };
  }, [lecturers]);

  // Handle deletion of an instructor
  const handleDelete = async () => {
    try {
      if (!selectedInstructor) return;
      
      setDeleteError(null);
      const result = await deleteInstructor(selectedInstructor._id);
      
      if (result.success) {
        // Close modal after successful deletion
        setDeleteConfirm(false);
        setSelectedInstructor(null);
      } else {
        // Show error message
        setDeleteError(result.error || 'Failed to delete instructor');
      }
    } catch (error) {
      console.error('Error during deletion:', error);
      setDeleteError('An unexpected error occurred. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setDeleteConfirm(false);
    setSelectedInstructor(null);
    setDeleteError(null);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (fetchError) {
    return <ErrorState error={fetchError} />;
  }

  return (
    <motion.div 
      className="w-full space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <PageHeader totalInstructors={stats.totalInstructors} />
      
      <StatsSection stats={stats} />

      <motion.div 
        className="bg-[#232738] rounded-xl p-6 shadow-lg border border-[#2a2f3e] overflow-hidden relative mb-6"
        variants={containerVariants}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />

        <div className="relative">
          <SearchAndFilterBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            uniqueRoles={uniqueRoles}
          />
          
          <InstructorsTable 
            sortedLecturers={sortedLecturers}
            requestSort={requestSort}
            sortConfig={sortConfig}
            searchTerm={searchTerm}
            roleFilter={roleFilter}
            setSelectedInstructor={setSelectedInstructor}
            setDeleteConfirm={setDeleteConfirm}
          />
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && selectedInstructor && (
          <DeleteModal 
            isOpen={deleteConfirm}
            instructor={selectedInstructor}
            isDeleting={isDeleting}
            deleteError={deleteError}
            onClose={handleCloseModal}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InstructorsManagement; 