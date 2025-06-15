"use client";

import { motion } from "framer-motion";
import { useAddInstructor } from "@/app/hooks/useAddInstructor";

// Import Step Components
import BasicInfo from "@/app/components/dashboard/admin/addDoctor/BasicInfo";
import ProfessionalInfo from "@/app/components/dashboard/admin/addDoctor/ProfessionalInfo";
import CourseSelection from "@/app/components/dashboard/admin/addDoctor/CourseSelection";

// Import UI Components
import PageHeader from "@/app/components/dashboard/admin/addDoctor/PageHeader";
import StepsIndicator from "@/app/components/dashboard/admin/addDoctor/StepsIndicator";
import StepNavigation from "@/app/components/dashboard/admin/addDoctor/StepNavigation";
import SuccessNotification from "@/app/components/dashboard/admin/addDoctor/SuccessNotification";
import ErrorMessage from "@/app/components/dashboard/admin/addDoctor/ErrorMessage";
import FormContainer from "@/app/components/dashboard/admin/addDoctor/FormContainer";

const AddDoctor = () => {
  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -100 }
  };

  const {
    // State
    currentStep,
    newUser,
    errors,
    formSubmitted,
    successNotification,
    selectedDepartment,
    selectedLevel,
    filteredCourses,
    
    // Loading states
    isLoadingCourses,
    isAdding,
    
    // Actions
    handleInputChange,
    validateField,
    handleDepartmentSelect,
    handleRoleSelect,
    handleCourseSelect,
    handleNextStep,
    handlePrevStep,
    handleAddUser,
    clearFilters,
    setSelectedDepartment,
    setSelectedLevel,
    
    // Constants
    levels,
    departments,
    roles
  } = useAddInstructor();

  return (
    <motion.div 
      className="w-full space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with Steps Indicator */}
      <div className="relative">
        <PageHeader />
        <div className="absolute right-8 top-1/2 -translate-y-1/2">
          <StepsIndicator currentStep={currentStep} />
        </div>
      </div>

      {/* Form Content */}
      <FormContainer>
        {currentStep === 1 && (
          <BasicInfo 
            newUser={newUser}
            handleInputChange={handleInputChange}
            validateField={validateField}
            errors={errors}
            formSubmitted={formSubmitted}
            pageVariants={pageVariants}
          />
        )}
        
        {currentStep === 2 && (
          <ProfessionalInfo 
            newUser={newUser}
            errors={errors}
            formSubmitted={formSubmitted}
            pageVariants={pageVariants}
            handleDepartmentSelect={handleDepartmentSelect}
            handleRoleSelect={handleRoleSelect}
            departments={departments}
            roles={roles}
          />
        )}
        
        {currentStep === 3 && (
          <CourseSelection 
            newUser={newUser}
            handleCourseSelect={handleCourseSelect}
            errors={errors}
            formSubmitted={formSubmitted}
            pageVariants={pageVariants}
            filteredCourses={filteredCourses}
            isLoadingCourses={isLoadingCourses}
            selectedDepartment={selectedDepartment}
            selectedLevel={selectedLevel}
            setSelectedDepartment={setSelectedDepartment}
            setSelectedLevel={setSelectedLevel}
            clearFilters={clearFilters}
            levels={levels}
            departments={departments}
          />
        )}
        
        {/* Navigation Buttons */}
        <StepNavigation 
          currentStep={currentStep}
          handlePrevStep={handlePrevStep}
          handleNextStep={handleNextStep}
          handleAddUser={handleAddUser}
          isAdding={isAdding}
        />

        {/* Error message */}
        <ErrorMessage error={errors.submit} />
      </FormContainer>
      
      {/* Success notification */}
      <SuccessNotification show={successNotification} />
    </motion.div>
  );
};

export default AddDoctor; 