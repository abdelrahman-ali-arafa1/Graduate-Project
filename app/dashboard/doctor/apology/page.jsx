"use client";

import React from "react";
import { FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import useApologies from "@/app/hooks/useApologies"; 

// Components
import PageHeader from "@/app/components/dashboard/doctor/apology/PageHeader";
import FiltersBar from "@/app/components/dashboard/doctor/apology/FiltersBar";
import FiltersSummary from "@/app/components/dashboard/doctor/apology/FiltersSummary";
import ApologiesList from "@/app/components/dashboard/doctor/apology/ApologiesList";
import LoadingState from "@/app/components/dashboard/doctor/apology/LoadingState";
import ErrorState from "@/app/components/dashboard/doctor/apology/ErrorState";
import ApologyModal from "@/app/components/dashboard/doctor/apology/ApologyModal";

const InstructorApologiesPage = () => {
  // Get states and functions from custom hook with doctor role explicitly
  const {
    filteredApologies,
    totalApologies,
    selectedApology,
    showModal,
    courseFilter,
    searchQuery,
    statusFilter,
    loading,
    error,
    setCourseFilter,
    setSearchQuery,
    setStatusFilter,
    handleViewDetails,
    handleCloseModal,
    getStatusColor,
    getStatusIcon: getIconName,
    formatDate,
    getFullImageUrl,
    coursesForDropdown,
    statuses
  } = useApologies({
    role: 'doctor',
    initialCourseFilter: 'all',
    initialStatusFilter: 'all'
  });
  
  // Function to render status icon based on the name
  const getStatusIcon = (status) => {
    const iconName = getIconName(status);
    switch (iconName) {
      case 'FaClock': return <FaClock />;
      case 'FaCheckCircle': return <FaCheckCircle />;
      case 'FaTimesCircle': return <FaTimesCircle />;
      default: return null;
    }
  };

  // Show loading state
  if (loading) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="p-6 w-full">
      {/* Page Header */}
      <PageHeader totalApologies={totalApologies} />
      
      {/* Filters Bar */}
      <FiltersBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        courseFilter={courseFilter}
        setCourseFilter={setCourseFilter}
        statuses={statuses}
        coursesForDropdown={coursesForDropdown}
      />
      
      {/* Filters Summary */}
      <FiltersSummary 
        filteredApologies={filteredApologies}
        statusFilter={statusFilter}
        getStatusColor={getStatusColor}
        getStatusIcon={getStatusIcon}
      />
      
      {/* Apologies List */}
      <ApologiesList 
        filteredApologies={filteredApologies}
        statusFilter={statusFilter}
        getStatusColor={getStatusColor}
        getStatusIcon={getStatusIcon}
        formatDate={formatDate}
        handleViewDetails={handleViewDetails}
        setCourseFilter={setCourseFilter}
        setStatusFilter={setStatusFilter}
      />
      
      {/* Apology Details Modal */}
      <ApologyModal
        showModal={showModal}
        selectedApology={selectedApology}
        handleCloseModal={handleCloseModal}
        getStatusColor={getStatusColor}
        getStatusIcon={getStatusIcon}
        formatDate={formatDate}
        getFullImageUrl={getFullImageUrl}
      />
    </div>
  );
};

export default InstructorApologiesPage; 