'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/app/components/providers/LanguageProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useInstructorDetails } from "@/app/hooks/useInstructorDetails";
import { useInstructorManagement } from "@/app/hooks/useInstructorManagement";

// Import Components
import LoadingState from "@/app/components/dashboard/admin/instructorDetails/LoadingState";
import ErrorState from "@/app/components/dashboard/admin/instructorDetails/ErrorState";
import PageHeader from "@/app/components/dashboard/admin/instructorDetails/PageHeader";
import ProfileCard from "@/app/components/dashboard/admin/instructorDetails/ProfileCard";
import CoursesList from "@/app/components/dashboard/admin/instructorDetails/CoursesList";
import StatsSection from "@/app/components/dashboard/admin/instructorDetails/StatsSection";
import {
  AddCourseModal,
  DeleteCourseModal,
  CourseDetailsModal,
  DeleteInstructorModal
} from "@/app/components/dashboard/admin/instructorDetails/ModalComponents";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    }
  },
  exit: { opacity: 0, y: -20 }
};

const Details = () => {
  // Get URL params
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');
  
  // Internationalization
  const { t, isRTL } = useLanguage();
  
  // State for delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  
  // Use our custom hook for instructor details management
  const {
    // Data
    instructor,
    instructorStats,
    courses,
    
    // State
    selectedCourseId,
    showAddCourseModal,
    deleteCourseId,
    selectedCourseDetails,
    
    // Loading states
    isLoading,
    statsLoading,
    coursesLoading,
    addCourseLoading,
    deleteCourseLoading,
    
    // Errors
    fetchError,
    statsError,
    addCourseError,
    deleteCourseError,
    
    // Actions
    setSelectedCourseId,
    setShowAddCourseModal,
    setDeleteCourseId,
    setSelectedCourseDetails,
    handleAddCourse,
    handleDeleteCourse
  } = useInstructorDetails(userId);

  // Use instructor management hook for deletion
  const { deleteInstructor, isDeleting: isDeletingInstructor } = useInstructorManagement();
  
  // State for success messages
  const [addCourseSuccess, setAddCourseSuccess] = useState("");

  // Handle add course submission
  const onAddCourseSubmit = async () => {
    const result = await handleAddCourse();
    if (result?.success) {
        setAddCourseSuccess("Course added successfully!");
      // Reset success message after 3 seconds
      setTimeout(() => setAddCourseSuccess(""), 3000);
    }
  };
  
  // Handle delete course submission
  const onDeleteCourseSubmit = async () => {
    await handleDeleteCourse();
  };
  
  // Handle instructor deletion
  const onDeleteInstructor = async () => {
    try {
      setDeleteError(null);
      // Call the delete instructor function from the custom hook
      const result = await deleteInstructor(userId);
      if (result.success) {
        // Navigate back to instructors list on success
        router.push('/dashboard/admin/instructors');
      } else {
        // Show error message
        setDeleteError(result.error || 'Failed to delete instructor');
      }
    } catch (error) {
      console.error('Error during deletion:', error);
      setDeleteError('An unexpected error occurred. Please try again.');
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (fetchError || !instructor) {
    return <ErrorState fetchError={fetchError} />;
  }

  return (
    <motion.div 
      className="w-full space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <PageHeader />
      
      {/* Instructor Profile Card */}
      <ProfileCard 
        instructor={instructor} 
        onEditClick={() => alert('Edit functionality to be implemented')}
        onDeleteClick={() => setDeleteConfirm(true)}
      />

      {/* Courses Section */}
      <CoursesList 
        instructor={instructor}
        courses={courses}
        onAddCourseClick={() => setShowAddCourseModal(true)}
        onDeleteCourse={setDeleteCourseId}
        onShowCourseDetails={setSelectedCourseDetails}
      />

      {/* Statistics Section */}
      <StatsSection 
        instructorStats={instructorStats}
        statsLoading={statsLoading}
        statsError={statsError}
      />

      {/* Modals */}
      <AddCourseModal
        showModal={showAddCourseModal}
        onClose={() => setShowAddCourseModal(false)}
        courses={courses}
        selectedCourseId={selectedCourseId}
        onSelectCourse={setSelectedCourseId}
        onSubmit={onAddCourseSubmit}
        isLoading={addCourseLoading}
        error={addCourseError}
        success={addCourseSuccess}
        instructorCourses={instructor?.lecturerCourses || []}
      />
      
      <DeleteCourseModal
        courseId={deleteCourseId}
        onClose={() => setDeleteCourseId(null)}
        onDelete={onDeleteCourseSubmit}
        isLoading={deleteCourseLoading}
        error={deleteCourseError}
        courses={courses}
      />
      
      <CourseDetailsModal
        courseDetails={selectedCourseDetails}
        onClose={() => setSelectedCourseDetails(null)}
      />
      
      <DeleteInstructorModal
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onDelete={onDeleteInstructor}
        instructorName={instructor?.name || 'this instructor'}
        isLoading={isDeletingInstructor}
        error={deleteError}
      />
    </motion.div>
  );
};

export default Details; 