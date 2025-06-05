"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilter, FaSave, FaEdit, FaUserGraduate, FaCheckCircle, FaTimesCircle, FaEnvelope, FaBuilding, FaGraduationCap, FaTrash, FaEye, FaPlus, FaBook, FaSearch, FaTimes } from "react-icons/fa";
import Link from 'next/link';
import Image from 'next/image';
import { FaFileUpload } from 'react-icons/fa';

const levels = ["1", "2", "3", "4"];
const departments = ["CS", "IS", "AI", "BIO"];

const StudentsEditPage = () => {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [isTableHovered, setIsTableHovered] = useState(false);
  const tableContainerRef = useRef(null);
  const scrollTimerRef = useRef(null);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  
  // Search and advanced filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterByCourse, setFilterByCourse] = useState("");
  
  // Add/Remove Course States
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [addCourseLoading, setAddCourseLoading] = useState(false);
  const [addCourseError, setAddCourseError] = useState("");
  const [addCourseSuccess, setAddCourseSuccess] = useState("");
  const [deleteCourseId, setDeleteCourseId] = useState(null);
  const [deleteCourseLoading, setDeleteCourseLoading] = useState(false);
  const [deleteCourseError, setDeleteCourseError] = useState("");

  // Fetch all students from API
  useEffect(() => {
    if (!selectedLevel || !selectedDepartment) {
      setFilteredStudents([]);
      return;
    }
    setLoading(true);
    fetch("https://attendance-eslamrazeen-eslam-razeens-projects.vercel.app/api/attendanceQRCode/studentInfo")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.data || []);
        // Filter by level and department
        setFilteredStudents(
          (data.data || []).filter(
            (s) =>
              (s.level?.toString() === selectedLevel) &&
              (s.department?.toUpperCase() === selectedDepartment)
          )
        );
      })
      .catch(() => setFilteredStudents([]))
      .finally(() => setLoading(false));
  }, [selectedLevel, selectedDepartment]);

  // Apply search and advanced filters
  useEffect(() => {
    if (!selectedLevel || !selectedDepartment || students.length === 0) {
      return;
    }
    
    // Start with basic level and department filter
    let filtered = students.filter(
      (s) =>
        (s.level?.toString() === selectedLevel) &&
        (s.department?.toUpperCase() === selectedDepartment)
    );
    
    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (student) =>
          student.name?.toLowerCase().includes(query) ||
          student.email?.toLowerCase().includes(query) ||
          student._id?.toLowerCase().includes(query)
      );
    }
    
    // Apply course filter if selected
    if (filterByCourse) {
      filtered = filtered.filter(
        (student) =>
          student.courses?.some((course) => course._id === filterByCourse)
      );
    }
    
    setFilteredStudents(filtered);
  }, [students, selectedLevel, selectedDepartment, searchQuery, filterByCourse]);

  // Fetch all courses once on mount
  useEffect(() => {
    setCoursesLoading(true);
    fetch("https://attendance-eslamrazeen-eslam-razeens-projects.vercel.app/api/attendanceQRCode/courses")
      .then(res => res.json())
      .then(data => setCourses(data.data || []))
      .catch(() => setCourses([]))
      .finally(() => setCoursesLoading(false));
  }, []);

  // Start editing a student
  const handleEdit = (idx) => {
    setEditIndex(idx);
    setEditData(filteredStudents[idx]);
    setStatus("");
  };

  // View student details and courses
  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowStudentDetails(true);
  };

  // Handle input change
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterByCourse("");
  };
  
  // Toggle advanced filters
  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
    if (!showAdvancedFilters) {
      // Reset advanced filters when showing
      setFilterByCourse("");
    }
  };

  // Save changes
  const handleSave = async (studentId) => {
    setSaving(true);
    setStatus("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token")?.replace(/"/g, "") : "";
      const res = await fetch(
        `https://attendance-eslamrazeen-eslam-razeens-projects.vercel.app/api/attendanceQRCode/studentInfo/${studentId}`,
        {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
          },
          body: JSON.stringify({
            name: editData.name,
            // Only include email if it has changed
            ...(editData.email !== filteredStudents[editIndex].email && { email: editData.email })
          }),
        }
      );
      if (res.ok) {
        setStatus("Saved successfully!");
        // Update local data
        const updated = [...filteredStudents];
        updated[editIndex] = { ...editData };
        setFilteredStudents(updated);
        setEditIndex(null);
      } else {
        let errorMsg = "Failed to save. Try again.";
        try {
          const errorData = await res.json();
          if (errorData && errorData.message) errorMsg = errorData.message;
        } catch {}
        setStatus(errorMsg);
        console.error("PATCH error:", errorMsg);
      }
    } catch {
      setStatus("Failed to save. Try again.");
    }
    setSaving(false);
  };

  // Add course to student
  const handleAddCourse = async () => {
    if (!selectedCourseId || !selectedStudent) return;
    setAddCourseLoading(true);
    setAddCourseError("");
    setAddCourseSuccess("");
    try {
      const token = localStorage.getItem("token")?.replace(/"/g, "");
      const res = await fetch("https://attendance-eslamrazeen-eslam-razeens-projects.vercel.app/api/attendanceQRCode/studentInfo/addCourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          studentId: selectedStudent._id, 
          courseId: selectedCourseId 
        })
      });
      const data = await res.json();
      if (res.ok) {
        setAddCourseSuccess("Course added successfully!");
        setShowAddCourseModal(false);
        
        // Update the student object in the state
        const updatedStudent = {
          ...selectedStudent,
          courses: [...(selectedStudent.courses || []), { _id: selectedCourseId }]
        };
        setSelectedStudent(updatedStudent);
        
        // Update in the filteredStudents array
        const studentIndex = filteredStudents.findIndex(s => s._id === selectedStudent._id);
        if (studentIndex !== -1) {
          const updatedStudents = [...filteredStudents];
          updatedStudents[studentIndex] = updatedStudent;
          setFilteredStudents(updatedStudents);
        }
        
        // Update in the all students array
        const allStudentIndex = students.findIndex(s => s._id === selectedStudent._id);
        if (allStudentIndex !== -1) {
          const updatedAllStudents = [...students];
          updatedAllStudents[allStudentIndex] = updatedStudent;
          setStudents(updatedAllStudents);
        }
      } else {
        setAddCourseError(data.message || "Failed to add course");
      }
    } catch (err) {
      setAddCourseError("Network error");
    } finally {
      setAddCourseLoading(false);
    }
  };

  // Remove course from student
  const handleRemoveCourse = async () => {
    if (!deleteCourseId || !selectedStudent) return;
    setDeleteCourseLoading(true);
    setDeleteCourseError("");
    try {
      const token = localStorage.getItem("token")?.replace(/"/g, "");
      const res = await fetch(`https://attendance-eslamrazeen-eslam-razeens-projects.vercel.app/api/attendanceQRCode/studentInfo/removeCourse/${deleteCourseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          studentId: selectedStudent._id 
        })
      });
      const data = await res.json();
      if (res.ok) {
        // Update the student object in the state
        const updatedStudent = {
          ...selectedStudent,
          courses: (selectedStudent.courses || []).filter(course => course._id !== deleteCourseId)
        };
        setSelectedStudent(updatedStudent);
        
        // Update in the filteredStudents array
        const studentIndex = filteredStudents.findIndex(s => s._id === selectedStudent._id);
        if (studentIndex !== -1) {
          const updatedStudents = [...filteredStudents];
          updatedStudents[studentIndex] = updatedStudent;
          setFilteredStudents(updatedStudents);
        }
        
        // Update in the all students array
        const allStudentIndex = students.findIndex(s => s._id === selectedStudent._id);
        if (allStudentIndex !== -1) {
          const updatedAllStudents = [...students];
          updatedAllStudents[allStudentIndex] = updatedStudent;
          setStudents(updatedAllStudents);
        }
        
        setDeleteCourseId(null);
      } else {
        setDeleteCourseError(data.message || "Failed to remove course");
      }
    } catch (err) {
      setDeleteCourseError("Network error");
    } finally {
      setDeleteCourseLoading(false);
    }
  };

  // Optional: Handle scroll to show/hide scrollbar hint - Keep if needed for overlay
  const handleScroll = () => {
    // This function can be kept if the subtle gradient overlay is desired during scroll
    // For now, focusing on the main scrollbar style
  };

  useEffect(() => {
    // Clean up any previous scroll listeners if re-running
    const tableContainer = tableContainerRef.current;
    // Add listener if you want the overlay hint
    // if (tableContainer) { tableContainer.addEventListener('scroll', handleScroll); }
    // return () => { if (tableContainer) { tableContainer.removeEventListener('scroll', handleScroll); } };
  }, []);

  // Add handleDelete function
  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token")?.replace(/"/g, "") : "";
        const res = await fetch(
          `https://attendance-eslamrazeen-eslam-razeens-projects.vercel.app/api/attendanceQRCode/studentInfo/${studentId}`,
          {
            method: "DELETE",
            headers: {
              ...(token && { "Authorization": `Bearer ${token}` })
            },
          }
        );

        if (res.ok) {
          // Remove the deleted student from the filteredStudents state
          setFilteredStudents(filteredStudents.filter(student => student._id !== studentId));
          // Also remove from the all students array
          setStudents(students.filter(student => student._id !== studentId));
          setStatus("Student deleted successfully!");
        } else {
          let errorMsg = "Failed to delete student.";
          try {
            const errorData = await res.json();
            if (errorData && errorData.message) errorMsg = errorData.message;
          } catch {}
          setStatus(`Error deleting student: ${errorMsg}`);
          console.error("DELETE error:", errorMsg);
        }
      } catch (error) {
        setStatus(`Error deleting student: ${error.message}`);
        console.error("DELETE error:", error);
      }
    }
  };

  return (
    <motion.div className="w-full min-h-screen bg-gradient-to-br from-[#181c2a] to-[#232738] py-10 px-2 sm:px-8">
      {/* Header */}
      <motion.div
        className="flex items-center gap-4 mb-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 flex items-center justify-center shadow-lg border-4 border-blue-800/30">
          <FaUserGraduate className="text-blue-400 text-4xl" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Edit Students
            <span className="ml-2 px-2 py-0.5 rounded bg-blue-900/40 text-xs text-blue-300 font-semibold animate-fadeIn">Management</span>
          </h1>
          <p className="text-gray-400">View and edit student information by level and department</p>
        </div>
      </motion.div>
      
      {/* Filters Card */}
      <motion.div
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-indigo-900/40 p-6 border border-blue-800/30 shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="flex flex-col items-center w-full md:w-1/2">
            <div className="mb-2 text-base font-bold text-blue-400 tracking-wide text-center">Level</div>
            <div className="flex flex-row gap-3 justify-center">
              {levels.map((level) => (
                <motion.button
                  key={level}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 border border-transparent text-sm focus:outline-none ${selectedLevel === level ? "bg-blue-500 text-white shadow-lg scale-105" : "bg-[#181c2a] text-gray-200 hover:bg-blue-900/40 hover:border-blue-500"}`}
                  onClick={() => setSelectedLevel(level)}
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Level {level}
                </motion.button>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center w-full md:w-1/2">
            <div className="mb-2 text-base font-bold text-purple-400 tracking-wide text-center">Department</div>
            <div className="flex flex-row gap-3 justify-center">
              {departments.map((dept) => (
                <motion.button
                  key={dept}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 border border-transparent text-sm focus:outline-none ${selectedDepartment === dept ? "bg-purple-500 text-white shadow-lg scale-105" : "bg-[#181c2a] text-gray-200 hover:bg-purple-900/40 hover:border-purple-500"}`}
                  onClick={() => setSelectedDepartment(dept)}
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {dept}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
        />
      </motion.div>
      
      {/* Search and Advanced Filter */}
      {(selectedLevel && selectedDepartment) && (
        <motion.div
          className="mt-8 bg-[#232738] rounded-xl p-4 sm:p-5 shadow-md border border-[#2a2f3e]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Box */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="Search by name, email or ID..."
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            
            {/* Advanced Filter Toggle */}
            <button
              onClick={toggleAdvancedFilters}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showAdvancedFilters 
                  ? "bg-blue-600 text-white" 
                  : "bg-[#1a1f2e] text-gray-300 hover:bg-[#1a1f2e]/80"
              }`}
            >
              <FaFilter />
              <span>Advanced Filters</span>
            </button>
            
            {/* Clear Filters */}
            {(searchQuery || filterByCourse) && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-4 py-2 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded-lg transition-colors"
              >
                <FaTimes />
                <span>Clear Filters</span>
              </button>
            )}
          </div>
          
          {/* Advanced Filter Panel */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-[#2a2f3e] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Filter by Course */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Filter by Course
                    </label>
                    <select
                      value={filterByCourse}
                      onChange={(e) => setFilterByCourse(e.target.value)}
                      className="w-full p-2 bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg text-white"
                    >
                      <option value="">All Courses</option>
                      {courses.map(course => (
                        <option key={course._id} value={course._id}>
                          {course.courseName} ({course.courseCode || 'No Code'})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Add more filters here as needed */}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
      
      {/* Student Count */}
      <motion.div
        className="mt-8 mb-4 text-gray-400 text-sm flex justify-between items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <span>Showing {filteredStudents.length} students</span>
        {searchQuery && (
          <span className="text-blue-400">
            Search results for: "{searchQuery}"
          </span>
        )}
      </motion.div>

      {/* Students Table Card */}
      <motion.div
        className="bg-[#232738] rounded-xl p-6 shadow-md border border-[#2a2f3e] overflow-x-auto relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
        style={{ maxHeight: '650px' }}
        onMouseEnter={() => setIsTableHovered(true)}
        onMouseLeave={() => setIsTableHovered(false)}
      >
        {/* Custom Scrollbar Overlay - Appears on Hover */}
        {isTableHovered && (
          <motion.div 
            className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-blue-500/20 to-transparent z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
        {/* Table Container with Custom Scrollbar */}
        <div
          ref={tableContainerRef}
          className={`overflow-y-auto table-scrollbar custom-scrollbar ${isTableHovered ? 'scrollbar-visible' : ''}`}
          style={{
            maxHeight: '600px',
            /* Apply some scrollbar styles here as fallback/reinforcement */
            scrollbarWidth: 'thin', /* For Firefox */
            scrollbarColor: '#3b82f6 #181c2a', /* For Firefox */
            paddingRight: '12px', /* Add space for the custom scrollbar */
            boxSizing: 'content-box' /* Ensure padding doesn't affect width */
          }}
        >
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#1a1f2e] border-b-2 border-blue-500/30 text-gray-300">
                <th className="py-3 px-4 text-left text-base font-bold tracking-wider">
                  <span className="flex items-center gap-2">
                    <FaUserGraduate className="text-blue-400" /> Name
                  </span>
                </th>
                <th className="py-3 px-4 text-left text-base font-bold tracking-wider">
                  <span className="flex items-center gap-2">
                    <FaEnvelope className="text-purple-400" /> Email
                  </span>
                </th>
                <th className="py-3 px-4 text-center text-base font-bold tracking-wider">
                  <span className="flex items-center gap-2 justify-center">
                    <FaGraduationCap className="text-indigo-400" /> Level
                  </span>
                </th>
                <th className="py-3 px-4 text-center text-base font-bold tracking-wider">
                  <span className="flex items-center gap-2 justify-center">
                    <FaBuilding className="text-green-400" /> Department
                  </span>
                </th>
                <th className="py-3 px-4 text-center text-base font-bold tracking-wider">
                  <span className="flex items-center gap-2 justify-center">
                    <FaEdit className="text-blue-400" /> Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2f3e]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center text-blue-400 py-8 animate-pulse">Loading students...</td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-8">
                    {searchQuery ? 
                      `No students found matching "${searchQuery}"` : 
                      "No students found for selected filter."
                    }
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredStudents.map((student, idx) => (
                    <motion.tr
                      key={student._id}
                      className="text-gray-300 hover:bg-[#2a2f3e]/50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2, delay: idx * 0.03 }}
                    >
                      <td className="px-4 py-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center mr-2 shadow-inner">
                            <span className="text-blue-300 font-medium text-base">{student.name?.charAt(0).toUpperCase() || '?'}</span>
                          </div>
                          {editIndex === idx ? (
                            <input name="name" value={editData.name} onChange={handleChange} className="bg-gray-800 text-white px-2 py-1 rounded w-full outline-none border border-blue-500 focus:ring-2 focus:ring-blue-400 text-sm" />
                          ) : (
                            <span className="font-medium text-white text-sm">{student.name}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {editIndex === idx ? (
                          <input name="email" value={editData.email} onChange={handleChange} className="bg-gray-800 text-white px-2 py-1 rounded w-full outline-none border border-blue-500 focus:ring-2 focus:ring-blue-400 text-sm" />
                        ) : (
                          <span className="text-sm">{student.email}</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-900/30 text-indigo-300 text-xs font-medium border border-indigo-800/30">
                          {student.level}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-green-900/30 text-green-300 text-xs font-medium border border-green-800/30">
                          {student.department}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {editIndex === idx ? (
                            <motion.button
                              className="flex items-center justify-center w-8 h-8 bg-green-600/30 hover:bg-green-600/50 text-green-400 border border-green-500/30 rounded-md transition-colors shadow-md text-sm"
                              onClick={() => handleSave(student._id)}
                              disabled={saving}
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              <FaCheckCircle className="text-green-300 text-base" />
                            </motion.button>
                          ) : (
                            <motion.button
                              className="flex items-center justify-center w-8 h-8 bg-blue-900/30 text-blue-300 hover:bg-blue-800/50 border border-blue-800/30 rounded-md transition-colors text-sm"
                              onClick={() => handleEdit(idx)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              <FaEdit className="text-blue-300 text-base"/>
                            </motion.button>
                          )}
                          <motion.button
                            className="flex items-center justify-center w-8 h-8 bg-purple-900/30 text-purple-300 hover:bg-purple-800/50 border border-purple-800/30 rounded-md transition-colors text-sm"
                            onClick={() => handleViewDetails(student)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <FaEye className="text-purple-300 text-base"/>
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(student._id)}
                            className="flex items-center justify-center w-8 h-8 bg-red-500/30 text-red-400 hover:bg-red-500/50 border border-red-500/30 rounded-md transition-colors text-sm"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaTrash className="text-red-300 text-base" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
          {status && (
            <motion.div 
              className={`mt-6 text-center font-semibold rounded-lg py-3 px-4 ${status.includes("success") ? "bg-green-900/30 text-green-400 border border-green-700" : "bg-red-900/30 text-red-400 border border-red-700"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {status}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Student Details Modal */}
      {showStudentDetails && selectedStudent && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-[#232738] p-8 rounded-xl shadow-lg w-full max-w-4xl relative max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-400 text-xl"
              onClick={() => setShowStudentDetails(false)}
            >
              &times;
            </button>
            
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 flex items-center justify-center shadow-lg border-4 border-blue-800/30">
                  <span className="text-blue-300 font-bold text-4xl">{selectedStudent.name?.charAt(0).toUpperCase() || '?'}</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedStudent.name}</h2>
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-900/20 text-blue-400 text-sm flex items-center">
                    <FaEnvelope className="mr-2" /> {selectedStudent.email || 'N/A'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-indigo-900/20 text-indigo-400 text-sm flex items-center">
                    <FaGraduationCap className="mr-2" /> Level: {selectedStudent.level || 'N/A'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-green-900/20 text-green-400 text-sm flex items-center">
                    <FaBuilding className="mr-2" /> {selectedStudent.department || 'N/A'}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  Student ID: <span className="text-gray-300">{selectedStudent._id}</span>
                </div>
              </div>
            </div>
            
            {/* Courses Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <FaBook className="mr-3 text-yellow-400" /> Enrolled Courses
                </h3>
                <button
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md"
                  onClick={() => setShowAddCourseModal(true)}
                >
                  <FaPlus /> Add Course
                </button>
              </div>
              
              {selectedStudent.courses && selectedStudent.courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedStudent.courses.map((course, index) => {
                    // Find course details from the courses list
                    const courseDetails = courses.find(c => c._id === course._id) || course;
                    return (
                      <motion.div 
                        key={course._id || index}
                        className="bg-[#1a1f2e] p-4 rounded-xl border border-[#2a2f3e] transition-colors shadow-md group cursor-pointer relative overflow-hidden"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FaBook className="text-yellow-400" />
                            <span className="text-sm text-blue-300 font-medium">Course {index + 1}</span>
                          </div>
                          <span className="text-xs text-gray-500">{(course._id || '').substring(0, 8)}...</span>
                        </div>
                        <h4 className="text-gray-200 font-medium truncate" title={courseDetails.courseName}>
                          {courseDetails.courseName || 'Unknown Course'}
                        </h4>
                        {courseDetails.courseCode && (
                          <p className="text-sm text-gray-400 mt-1">{courseDetails.courseCode}</p>
                        )}
                        <div className="mt-3 flex justify-end">
                          <button
                            className="text-red-500 hover:text-red-700 bg-transparent border-none outline-none"
                            title="Remove Course"
                            onClick={() => setDeleteCourseId(course._id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-[#1a1f2e]/50 p-6 rounded-lg text-center text-gray-400">
                  <FaBook className="mx-auto text-3xl text-gray-500 mb-3 opacity-50" />
                  <p>No courses enrolled for this student</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#232738] p-8 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-400 text-xl"
              onClick={() => setShowAddCourseModal(false)}
            >
              &times;
            </button>
            <h2 className="text-lg font-bold text-white mb-4">Add Course to Student</h2>
            <select
              className="w-full p-2 rounded-lg bg-[#1a1f2e] text-white mb-4 border border-[#2a2f3e]"
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
            >
              <option value="">Select a course</option>
              {courses
                .filter(course => !selectedStudent.courses?.some(c => c._id === course._id))
                .map(course => (
                  <option key={course._id} value={course._id}>
                    {course.courseName} - {course.courseCode || 'No Code'} ({course.department || 'N/A'})
                  </option>
                ))}
            </select>
            {addCourseError && <div className="text-red-400 mb-2">{addCourseError}</div>}
            {addCourseSuccess && <div className="text-green-400 mb-2">{addCourseSuccess}</div>}
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-2 disabled:opacity-50"
              onClick={handleAddCourse}
              disabled={addCourseLoading || !selectedCourseId}
            >
              {addCourseLoading ? "Adding..." : "Add Course"}
            </button>
          </div>
        </div>
      )}

      {/* Remove Course Confirmation Modal */}
      {deleteCourseId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#232738] p-8 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-400 text-xl"
              onClick={() => setDeleteCourseId(null)}
            >
              &times;
            </button>
            <h2 className="text-lg font-bold text-white mb-4">Confirm Remove Course</h2>
            <div className="text-gray-300 mb-6">
              Are you sure you want to remove
              <span className="text-red-400 font-bold mx-1">"{(courses.find(c => c._id === deleteCourseId)?.courseName) || "this course"}"</span>
              from the student's enrolled courses?
            </div>
            {deleteCourseError && <div className="text-red-400 mb-2">{deleteCourseError}</div>}
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600 transition-colors"
                onClick={() => setDeleteCourseId(null)}
                disabled={deleteCourseLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                onClick={handleRemoveCourse}
                disabled={deleteCourseLoading}
              >
                {deleteCourseLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2 animate-spin inline-block"></span>
                    Removing...
                  </>
                ) : (
                  <>
                    <FaTrash className="mr-2" /> Remove
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StudentsEditPage; 