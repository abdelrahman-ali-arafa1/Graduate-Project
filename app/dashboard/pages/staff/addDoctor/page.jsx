"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaBuilding, FaUserTie, FaBook, FaChevronLeft, FaChevronRight, FaPlus, FaCheck, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { useGetCoursesQuery } from "@/app/Redux/features/coursesApiSlice";
import { useRouter } from "next/navigation";
import { useAddStaffUserMutation, useGetAllUsersQuery } from "@/app/Redux/features/usersApiSlice";

const AddDoctor = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    lecturerRole: "",
    lecturerDepartment: "",
    lecturerCourses: [],
  });
  
  // Form validation state
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // API hooks
  const { data, error, isLoading: isLoadingCourses } = useGetCoursesQuery();
  const [addStaffUser, { isLoading: isAdding, isError, isSuccess }] = useAddStaffUserMutation();
  const { data: allUsersData, isLoading: isLoadingUsers } = useGetAllUsersQuery();

  const FetchedCourses = data?.data || [];

  // Filters for courses
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  
  const levels = ["1", "2", "3", "4"];
  const departments = ["CS", "IS", "AI", "BIO"];
  
  const roles = ["instructor", "assistant"];

  // Memoized filtered courses
  const filteredCourses = useMemo(() => {
    return FetchedCourses.filter(
      (course) =>
        (!selectedDepartment || course.department === selectedDepartment) &&
        (!selectedLevel || course.level === selectedLevel)
    );
  }, [FetchedCourses, selectedDepartment, selectedLevel]);

  // Handle course selection
  const handleCourseSelect = (courseId) => {
    setNewUser((prev) => {
      const isAlreadySelected = prev.lecturerCourses.includes(courseId);
      return {
        ...prev,
        lecturerCourses: isAlreadySelected
          ? prev.lecturerCourses.filter((id) => id !== courseId)
          : [...prev.lecturerCourses, courseId],
      };
    });
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Remove validation while typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validate single field
  const validateField = (name, value) => {
    let errorMessage = "";
    
    switch (name) {
      case "name":
        if (!value.trim()) {
          errorMessage = "Name is required";
        } else if (value.trim().length < 3) {
          errorMessage = "Name must be at least 3 characters";
        }
        break;
        
      case "email":
        if (!value.trim()) {
          errorMessage = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errorMessage = "Email is invalid";
        }
        break;
        
      case "password":
        if (!value) {
          errorMessage = "Password is required";
        } else if (value.length < 6) {
          errorMessage = "Password must be at least 6 characters";
        }
        // Check password confirmation match if it exists
        if (newUser.passwordConfirm && value !== newUser.passwordConfirm) {
          setErrors(prev => ({
            ...prev,
            passwordConfirm: "Passwords do not match"
          }));
        } else if (newUser.passwordConfirm) {
          setErrors(prev => ({
            ...prev,
            passwordConfirm: ""
          }));
        }
        break;
        
      case "passwordConfirm":
        if (!value) {
          errorMessage = "Please confirm password";
        } else if (value !== newUser.password) {
          errorMessage = "Passwords do not match";
        }
        break;
        
      default:
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
    
    return !errorMessage;
  };

  // Handle department selection
  const handleDepartmentSelect = (dept) => {
    setNewUser(prev => ({
      ...prev,
      lecturerDepartment: dept
    }));
    setSelectedDepartment(dept);
  };

  // Handle role selection
  const handleRoleSelect = (role) => {
    setNewUser(prev => ({
      ...prev,
      lecturerRole: role
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate all fields
    if (!validateField("name", newUser.name)) newErrors.name = errors.name || "Name is required";
    if (!validateField("email", newUser.email)) newErrors.email = errors.email || "Email is required";
    if (!validateField("password", newUser.password)) newErrors.password = errors.password || "Password is required";
    if (!validateField("passwordConfirm", newUser.passwordConfirm)) newErrors.passwordConfirm = errors.passwordConfirm || "Please confirm password";
    
    if (currentStep === 2) {
      if (!newUser.lecturerRole) newErrors.lecturerRole = "Role is required";
      if (!newUser.lecturerDepartment) newErrors.lecturerDepartment = "Department is required";
    }
    
    if (currentStep === 3 && newUser.lecturerCourses.length === 0) {
      newErrors.courses = "Please select at least one course";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = async () => {
    if (currentStep === 1) {
      // تحقق من صحة النموذج أولاً
      if (!validateForm()) {
        setFormSubmitted(true);
        return;
      }
      // تحقق من البريد الإلكتروني إذا كان مستخدم
      if (allUsersData && allUsersData.data) {
        const emailExists = allUsersData.data.some(
          (user) => user.email && user.email.toLowerCase() === newUser.email.toLowerCase()
        );
        if (emailExists) {
          setErrors((prev) => ({ ...prev, email: "This email is already in use" }));
          setFormSubmitted(true);
          return;
        }
      }
    }
    if (validateForm()) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setFormSubmitted(true);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Handle form submission
  const handleAddUser = async () => {
    if (!validateForm()) {
      setFormSubmitted(true);
      return;
    }
    
    try {
      await addStaffUser(newUser).unwrap();
      
      // Success notification
      const notification = document.getElementById('notification');
      if (notification) {
        notification.classList.remove('hidden');
        notification.classList.add('flex');
        
        setTimeout(() => {
          notification.classList.add('hidden');
          notification.classList.remove('flex');
          router.push("/dashboard/pages/staff");
        }, 2000);
      } else {
        router.push("/dashboard/pages/staff");
      }
    } catch (error) {
      console.error("Failed to add user:", error);

      // Extract error message if available
      const errorMessage = error?.data?.errors?.[0]?.msg || "An unexpected error occurred. Please try again.";
      setErrors(prev => ({ ...prev, submit: errorMessage }));
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -100 }
  };

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <motion.div 
      className="w-full space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-indigo-900/40 p-8 border border-blue-800/30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <Link href="/dashboard/pages/staff" className="flex items-center text-blue-400 hover:text-blue-300 mb-4 transition-colors group">
              <FaArrowLeft className="mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform" /> Back to Instructors
            </Link>
            <h1 className="text-3xl font-bold text-white mb-3 flex items-center">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Add New Instructor
              </span>
            </h1>
            <p className="text-blue-200/80 max-w-lg">
              Create a new instructor account by filling out the required information in the following steps.
            </p>
          </div>
          
          {/* Steps indicator */}
          <div className="flex items-center space-x-3">
            {[1, 2, 3].map((step) => (
              <motion.div 
                key={step} 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === step 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white' 
                    : currentStep > step 
                      ? 'bg-gradient-to-r from-green-600 to-green-500 text-white' 
                      : 'bg-[#1a1f2e] text-gray-400'
                } border ${
                  currentStep === step 
                    ? 'border-blue-400/50 shadow-md shadow-blue-500/20' 
                    : currentStep > step 
                      ? 'border-green-400/50 shadow-md shadow-green-500/20' 
                      : 'border-gray-700'
                }`}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: currentStep >= step ? "0 0 10px rgba(59, 130, 246, 0.3)" : "none"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {currentStep > step ? <FaCheck className="text-sm" /> : <span>{step}</span>}
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: currentStep / 3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </motion.div>

      {/* Form Content */}
      <div className="bg-[#232738] rounded-xl p-6 shadow-lg border border-[#2a2f3e] overflow-hidden relative">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />

        <div className="relative">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={{ duration: 0.4 }}
                className="py-6"
              >
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <span className="bg-blue-600/20 text-blue-400 p-2 rounded-lg mr-3">1</span>
                  Basic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <motion.div 
                    className="form-group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-gray-300 mb-2 font-medium">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={newUser.name}
                        onChange={handleInputChange}
                        onBlur={(e) => validateField("name", e.target.value)}
                        className={`bg-[#1a1f2e] text-white py-3 pl-10 pr-4 rounded-lg border ${
                          errors.name ? 'border-red-500' : 'border-[#2a2f3e] group-hover:border-blue-500/50'
                        } w-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all`}
                        placeholder="Enter full name"
                      />
                    </div>
                    {errors.name && (
                      <motion.p 
                        className="text-red-500 text-sm mt-1 flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.name}
                      </motion.p>
                    )}
                  </motion.div>
                  
                  {/* Email */}
                  <motion.div 
                    className="form-group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-gray-300 mb-2 font-medium">Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-500 group-hover:text-purple-400 transition-colors" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleInputChange}
                        onBlur={(e) => validateField("email", e.target.value)}
                        className={`bg-[#1a1f2e] text-white py-3 pl-10 pr-4 rounded-lg border ${
                          errors.email ? 'border-red-500' : 'border-[#2a2f3e] group-hover:border-purple-500/50'
                        } w-full focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all`}
                        placeholder="Enter email address"
                      />
                    </div>
                    {errors.email && (
                      <motion.p 
                        className="text-red-500 text-sm mt-1 flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.email}
                      </motion.p>
                    )}
                  </motion.div>
                  
                  {/* Password */}
                  <motion.div 
                    className="form-group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-gray-300 mb-2 font-medium">Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-500 group-hover:text-green-400 transition-colors" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={newUser.password}
                        onChange={handleInputChange}
                        onBlur={(e) => validateField("password", e.target.value)}
                        className={`bg-[#1a1f2e] text-white py-3 pl-10 pr-4 rounded-lg border ${
                          errors.password ? 'border-red-500' : 'border-[#2a2f3e] group-hover:border-green-500/50'
                        } w-full focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all`}
                        placeholder="Enter password"
                      />
                    </div>
                    {errors.password && (
                      <motion.p 
                        className="text-red-500 text-sm mt-1 flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.password}
                      </motion.p>
                    )}
                  </motion.div>
                  
                  {/* Confirm Password */}
                  <motion.div 
                    className="form-group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-gray-300 mb-2 font-medium">Confirm Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-500 group-hover:text-yellow-400 transition-colors" />
                      </div>
                      <input
                        type="password"
                        name="passwordConfirm"
                        value={newUser.passwordConfirm}
                        onChange={handleInputChange}
                        onBlur={(e) => validateField("passwordConfirm", e.target.value)}
                        className={`bg-[#1a1f2e] text-white py-3 pl-10 pr-4 rounded-lg border ${
                          errors.passwordConfirm ? 'border-red-500' : 'border-[#2a2f3e] group-hover:border-yellow-500/50'
                        } w-full focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all`}
                        placeholder="Confirm password"
                      />
                    </div>
                    {errors.passwordConfirm && (
                      <motion.p 
                        className="text-red-500 text-sm mt-1 flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.passwordConfirm}
                      </motion.p>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}
            
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={{ duration: 0.4 }}
                className="py-6"
              >
                <h2 className="text-2xl font-semibold text-white mb-8 flex items-center">
                  <span className="bg-purple-600/20 text-purple-400 p-2 rounded-lg mr-3">2</span>
                  Professional Information
                </h2>
                
                <div className="space-y-10">
                  {/* Department */}
                  <motion.div 
                    className="form-group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-gray-300 mb-3 text-lg font-medium flex items-center">
                      <FaBuilding className="mr-2 text-blue-400" />
                      Department
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
                      {departments.map((dept, index) => (
                        <motion.button
                          key={dept}
                          onClick={() => handleDepartmentSelect(dept)}
                          className={`py-4 px-3 rounded-lg ${
                            newUser.lecturerDepartment === dept
                              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20'
                              : 'bg-[#1a1f2e] text-gray-300 hover:bg-[#2a2f3e] border border-[#2a2f3e] hover:border-blue-500/30'
                          } transition-all flex flex-col items-center gap-2`}
                          whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
                          whileTap={{ scale: 0.97 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + index * 0.1 }}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            newUser.lecturerDepartment === dept
                              ? 'bg-white/20'
                              : 'bg-[#2a2f3e]'
                          }`}>
                            {dept === "CS" && (
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${newUser.lecturerDepartment === dept ? 'text-white' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                              </svg>
                            )}
                            {dept === "IS" && (
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${newUser.lecturerDepartment === dept ? 'text-white' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm12 0H5v10h10V5z" clipRule="evenodd" />
                                <path d="M4 12h12v2H4v-2z" />
                                <path d="M4 9h12v2H4V9z" />
                                <path d="M4 6h12v2H4V6z" />
                              </svg>
                            )}
                            {dept === "AI" && (
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${newUser.lecturerDepartment === dept ? 'text-white' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clipRule="evenodd" />
                              </svg>
                            )}
                            {dept === "BIO" && (
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${newUser.lecturerDepartment === dept ? 'text-white' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                              </svg>
                            )}
                          </div>
                          <span className="font-medium">{dept}</span>
                          {newUser.lecturerDepartment === dept && (
                            <motion.div 
                              className="absolute -top-1 -right-1 bg-blue-500 text-white p-1 rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                    {errors.lecturerDepartment && formSubmitted && (
                      <motion.p 
                        className="text-red-500 text-sm mt-2 flex items-center justify-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.lecturerDepartment}
                      </motion.p>
                    )}
                  </motion.div>
                  
                  {/* Role */}
                  <motion.div 
                    className="form-group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-gray-300 mb-3 text-lg font-medium flex items-center">
                      <FaUserTie className="mr-2 text-purple-400" />
                      Academic Role
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
                      {roles.map((role, index) => (
                        <motion.button
                          key={role}
                          onClick={() => handleRoleSelect(role)}
                          className={`py-5 px-4 rounded-lg relative ${
                            newUser.lecturerRole === role
                              ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md shadow-purple-500/20'
                              : 'bg-[#1a1f2e] text-gray-300 hover:bg-[#2a2f3e] border border-[#2a2f3e] hover:border-purple-500/30'
                          } transition-all`}
                          whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
                          whileTap={{ scale: 0.97 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                              newUser.lecturerRole === role
                                ? 'bg-white/20'
                                : 'bg-[#2a2f3e]'
                            }`}>
                              {role === "instructor" ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${newUser.lecturerRole === role ? 'text-white' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4L3 9L12 14L21 9L12 4Z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9V14.5L12 19.5L21 14.5V9" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 11.5V16" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16L17 16.5C17 17.6046 14.7614 18.5 12 18.5C9.23858 18.5 7 17.6046 7 16.5V16" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${newUser.lecturerRole === role ? 'text-white' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7H17" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 12H17" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17H13" />
                                </svg>
                              )}
                            </div>
                            <div className="text-left">
                              <span className="font-medium text-lg capitalize block">{role}</span>
                              <span className="text-xs opacity-70 block mt-1">
                                {role === "instructor" 
                                  ? "Professor with teaching & research duties" 
                                  : "Teaching assistant supporting professors"}
                              </span>
                            </div>
                          </div>
                          {newUser.lecturerRole === role && (
                            <motion.div 
                              className="absolute -top-1 -right-1 bg-purple-500 text-white p-1 rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                    {errors.lecturerRole && formSubmitted && (
                      <motion.p 
                        className="text-red-500 text-sm mt-2 flex items-center justify-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.lecturerRole}
                      </motion.p>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}
            
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={{ duration: 0.4 }}
                className="py-6"
              >
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <span className="bg-green-600/20 text-green-400 p-2 rounded-lg mr-3">3</span>
                  Course Assignment
                </h2>
                
                <div className="space-y-6">
                  {/* Filters */}
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {/* Level Filter */}
                    <div className="form-group">
                      <label className="block text-gray-300 mb-2 font-medium">Level</label>
                      <div className="flex flex-wrap gap-2">
                        {levels.map((level) => (
                          <motion.button
                            key={level}
                            onClick={() => setSelectedLevel(prev => prev === level ? "" : level)}
                            className={`px-4 py-2 rounded-lg border ${
                              selectedLevel === level
                                ? 'bg-green-600/30 border-green-500/50 text-green-300 shadow-md shadow-green-500/10'
                                : 'bg-[#1a1f2e] border-[#2a2f3e] text-gray-300 hover:bg-[#2a2f3e] hover:border-green-500/30'
                            } transition-all text-sm flex items-center gap-2`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${selectedLevel === level ? 'text-green-400' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                            </svg>
                            Level {level}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Department Filter */}
                    <div className="form-group">
                      <label className="block text-gray-300 mb-2 font-medium">Department</label>
                      <div className="flex flex-wrap gap-2">
                        {departments.map((dept) => (
                          <motion.button
                            key={dept}
                            onClick={() => setSelectedDepartment(prev => prev === dept ? "" : dept)}
                            className={`px-4 py-2 rounded-lg border ${
                              selectedDepartment === dept
                                ? 'bg-blue-600/30 border-blue-500/50 text-blue-300 shadow-md shadow-blue-500/10'
                                : 'bg-[#1a1f2e] border-[#2a2f3e] text-gray-300 hover:bg-[#2a2f3e] hover:border-blue-500/30'
                            } transition-all text-sm flex items-center gap-2`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaBuilding className={selectedDepartment === dept ? 'text-blue-400' : 'text-gray-500'} />
                            {dept}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Course Selection */}
                  <motion.div 
                    className="form-group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-gray-300 font-medium">Select Courses</label>
                      <span className="text-sm bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30">
                        {newUser.lecturerCourses.length} selected
                      </span>
                    </div>
                    <div className="bg-[#1a1f2e] rounded-lg border border-[#2a2f3e] p-4 min-h-[250px] max-h-[350px] overflow-y-auto custom-scrollbar shadow-inner">
                      {isLoadingCourses ? (
                        <div className="flex items-center justify-center h-full py-12">
                          <div className="flex flex-col items-center gap-3">
                            <motion.div
                              className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                            <p className="text-gray-400">Loading courses...</p>
                          </div>
                        </div>
                      ) : filteredCourses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {filteredCourses.map((course, index) => (
                            <motion.button
                              key={course._id}
                              onClick={() => handleCourseSelect(course._id)}
                              className={`p-4 rounded-lg border ${
                                newUser.lecturerCourses.includes(course._id)
                                  ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 border-blue-500/50 text-white shadow-md shadow-blue-500/10'
                                  : 'bg-[#232738] border-[#2a2f3e] text-gray-300 hover:bg-[#2a2f3e] hover:border-blue-500/30'
                              } transition-all flex items-start gap-3 text-left`}
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                            >
                              <div className={`mt-1 p-2 rounded-lg ${
                                newUser.lecturerCourses.includes(course._id)
                                  ? 'bg-blue-500/20'
                                  : 'bg-[#1a1f2e]'
                              }`}>
                                <FaBook className={newUser.lecturerCourses.includes(course._id) ? 'text-blue-300' : 'text-gray-500'} />
                              </div>
                              <div>
                                <div className="font-medium">{course.courseName}</div>
                                <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                                  <span className="bg-[#1a1f2e] px-2 py-1 rounded border border-[#2a2f3e]">{course.department}</span>
                                  <span className="bg-[#1a1f2e] px-2 py-1 rounded border border-[#2a2f3e]">Level {course.level}</span>
                                </div>
                              </div>
                              {newUser.lecturerCourses.includes(course._id) && (
                                <div className="absolute top-2 right-2 bg-blue-500/20 p-1 rounded-full">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full py-12 text-gray-500">
                          <motion.div 
                            className="bg-[#232738] p-4 rounded-full mb-4"
                            animate={{ 
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                          >
                            <FaBook className="text-4xl opacity-50" />
                          </motion.div>
                          <p className="text-center">No courses found. Try adjusting your filters.</p>
                          <motion.button
                            onClick={() => {
                              setSelectedLevel("");
                              setSelectedDepartment("");
                            }}
                            className="mt-4 px-4 py-2 bg-[#232738] text-blue-400 rounded-lg border border-blue-500/30 hover:bg-[#2a2f3e]"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Clear Filters
                          </motion.button>
                        </div>
                      )}
                    </div>
                    {errors.courses && formSubmitted && (
                      <motion.p 
                        className="text-red-500 text-sm mt-2 flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.courses}
                      </motion.p>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <motion.button
              onClick={handlePrevStep}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
                currentStep === 1
                  ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                  : 'bg-[#1a1f2e] text-gray-300 hover:bg-[#2a2f3e] border border-[#2a2f3e] hover:border-blue-500/30'
              } transition-all`}
              whileHover={currentStep !== 1 ? { scale: 1.03, x: -3 } : {}}
              whileTap={currentStep !== 1 ? { scale: 0.97 } : {}}
              disabled={currentStep === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span>Previous</span>
            </motion.button>
            
            {currentStep < 3 ? (
              <motion.button
                onClick={handleNextStep}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-md shadow-blue-500/20 border border-blue-500/50"
                whileHover={{ scale: 1.03, x: 3 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>Next</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.button>
            ) : (
              <motion.button
                onClick={handleAddUser}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-8 py-3 rounded-lg flex items-center gap-2 shadow-md shadow-green-500/20 border border-green-500/50"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={isAdding}
              >
                {isAdding ? (
                  <>
                    <motion.div 
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    <span>Add Instructor</span>
                  </>
                )}
              </motion.button>
            )}
          </div>

          {/* Error message */}
          {errors.submit && (
            <motion.div 
              className="mt-6 bg-red-900/30 border border-red-500/50 text-red-300 px-6 py-4 rounded-lg flex items-center gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errors.submit}</span>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Success notification */}
      <div 
        id="notification" 
        className="fixed top-4 right-4 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-4 rounded-lg shadow-xl hidden items-center gap-3 z-50 border border-green-500/50"
      >
        <div className="bg-white/20 p-2 rounded-full">
          <FaCheck className="text-lg" />
        </div>
        <div>
          <h4 className="font-medium">Success!</h4>
          <p className="text-sm text-green-100">Instructor added successfully!</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AddDoctor;
