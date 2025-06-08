"use client";
import React from "react";
import { motion } from "framer-motion";
import useStudentsPage from "@/app/hooks/useStudentsPage";

// Componentes
import NoCourse from "@/app/components/dashboard/doctor/students/NoCourse";
import CourseInfo from "@/app/components/dashboard/doctor/students/CourseInfo";
import SearchFilters from "@/app/components/dashboard/doctor/students/SearchFilters";
import StudentsTable from "@/app/components/dashboard/doctor/students/StudentsTable";
import LoadingState from "@/app/components/dashboard/doctor/students/LoadingState";
import ErrorDisplay from "@/app/components/dashboard/doctor/students/ErrorDisplay";

const StudentsPage = () => {
  // Obtener lógica y estados desde el hook personalizado
  const {
    selectedCourse,
    hasActiveSession,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    filterDepartment,
    setFilterDepartment,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    selectedDate,
    formattedSessionDates,
    filteredStudents,
    departments,
    toggleSortOrder,
    changeSortBy,
    handleDateChange,
    handleExportToExcel,
    refetchStudents
  } = useStudentsPage();

  // Si no hay curso seleccionado, mostrar mensaje
  if (!selectedCourse) {
    return <NoCourse />;
  }

  // Mostrar estado de carga
  if (isLoading) {
    return <LoadingState />;
  }

  // Mostrar estado de error
  if (error) {
    return <ErrorDisplay error={error} refetchStudents={refetchStudents} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
          Students List
        </h1>
        <p className="text-[var(--foreground-secondary)]">
          View and manage students enrolled in {selectedCourse.courseName} course
        </p>
      </motion.div>

      {/* Información del curso */}
      <CourseInfo 
        selectedCourse={selectedCourse} 
        hasActiveSession={hasActiveSession}
        studentsCount={filteredStudents.length}
      />

      {/* Filtros de búsqueda */}
      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterDepartment={filterDepartment}
        setFilterDepartment={setFilterDepartment}
        sortBy={sortBy}
        sortOrder={sortOrder}
        setSortBy={setSortBy}
        setSortOrder={setSortOrder}
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
        handleExportToExcel={handleExportToExcel}
        formattedSessionDates={formattedSessionDates}
        departments={departments}
        studentsCount={filteredStudents.length}
      />

      {/* Tabla de estudiantes */}
      <StudentsTable 
        filteredStudents={filteredStudents}
        selectedCourse={selectedCourse}
        selectedDate={selectedDate}
        sortBy={sortBy}
        changeSortBy={changeSortBy}
        sortOrder={sortOrder}
      />
    </div>
  );
};

export default StudentsPage; 