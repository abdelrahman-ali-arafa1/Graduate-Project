'use client';

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserTie, FaEnvelope, FaBook, FaBuilding, FaEdit, FaTrash, FaArrowLeft, FaCalendarAlt, FaGraduationCap, FaChartBar, FaCheckCircle, FaTimesCircle, FaPercentage, FaPlus } from "react-icons/fa";
import { useLanguage } from "@/app/components/LanguageProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useInstructorManagement } from "@/app/hooks/useInstructorManagement";
import { useGetInstructorStatsQuery } from "@/app/Redux/features/attendanceApiSlice";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector, Tooltip, Legend } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, ResponsiveContainer as BarResponsiveContainer } from "recharts";

const Details = () => {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');

  // Use our custom hook for instructor management
  const {
    isLoading,
    fetchError,
    getInstructorById,
    deleteInstructor,
    isDeleting
  } = useInstructorManagement();
  
  // Get the specific lecturer by ID
  const lecturer = getInstructorById(userId);

  // Fetch instructor statistics
  const { 
    data: instructorStats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useGetInstructorStatsQuery(userId, {
    skip: !userId
  });

  // Animation variants
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20, 
        duration: 0.5 
      }
    }
  };

  const courseVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
      borderColor: "rgba(59, 130, 246, 0.5)",
      transition: { duration: 0.2 }
    }
  };

  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [addCourseLoading, setAddCourseLoading] = useState(false);
  const [addCourseError, setAddCourseError] = useState("");
  const [addCourseSuccess, setAddCourseSuccess] = useState("");
  const [deleteCourseId, setDeleteCourseId] = useState(null);
  const [deleteCourseLoading, setDeleteCourseLoading] = useState(false);
  const [deleteCourseError, setDeleteCourseError] = useState("");
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);

  // Fetch all courses once on mount
  useEffect(() => {
    fetch("https://attendance-eslamrazeen-eslam-razeens-projects.vercel.app/api/attendanceQRCode/courses")
      .then(res => res.json())
      .then(data => setCourses(data.data || []))
      .catch(() => setCourses([]));
  }, []);

  // Add course to instructor
  const handleAddCourse = async () => {
    if (!selectedCourseId) return;
    setAddCourseLoading(true);
    setAddCourseError("");
    setAddCourseSuccess("");
    try {
      const token = localStorage.getItem("token")?.replace(/"/g, "");
      const res = await fetch("https://attendance-eslamrazeen-eslam-razeens-projects.vercel.app/api/attendanceQRCode/users/addCourses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId: lecturer._id, courseId: selectedCourseId })
      });
      const data = await res.json();
      if (res.ok) {
        setAddCourseSuccess("Course added successfully!");
        setShowAddCourseModal(false);
        window.location.reload();
      } else {
        setAddCourseError(data.message || "Failed to add course");
      }
    } catch (err) {
      setAddCourseError("Network error");
    } finally {
      setAddCourseLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteError(null);
      const result = await deleteInstructor(userId);
      if (result.success) {
        // Show success message and redirect
        router.push('/dashboard/pages/staff');
      } else {
        // Show error message
        setDeleteError(result.error || 'Failed to delete instructor');
      }
    } catch (error) {
      console.error('Error during deletion:', error);
      setDeleteError('An unexpected error occurred. Please try again.');
    }
  };

  // حذف كورس من الإنستراكتور
  const handleDeleteCourse = async () => {
    if (!deleteCourseId) return;
    setDeleteCourseLoading(true);
    setDeleteCourseError("");
    try {
      const token = localStorage.getItem("token")?.replace(/"/g, "");
      const res = await fetch(`https://attendance-eslamrazeen-eslam-razeens-projects.vercel.app/api/attendanceQRCode/users/deleteCourses/${deleteCourseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId: lecturer._id })
      });
      const data = await res.json();
      if (res.ok) {
        setDeleteCourseId(null);
        window.location.reload();
      } else {
        setDeleteCourseError(data.message || "Failed to delete course");
      }
    } catch (err) {
      setDeleteCourseError("Network error");
    } finally {
      setDeleteCourseLoading(false);
    }
  };

  const isNew = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffInDays = (now - created) / (1000 * 60 * 60 * 24);
    return diffInDays < 7; // أقل من أسبوع
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <motion.div
          className="rounded-full h-16 w-16 border-4 border-t-4 border-blue-500 mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.p 
          className="text-gray-300 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading instructor data...
        </motion.p>
      </div>
    );
  }

  if (fetchError || !lecturer) {
    return (
      <motion.div 
        className="bg-red-900/20 border border-red-500 p-6 rounded-xl text-red-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="font-bold text-xl mb-2">Error Loading Data</h3>
        <p className="mb-2">{fetchError?.error || "Instructor not found"}</p>
        <button 
          onClick={() => router.push('/dashboard/pages/staff')}
          className="mt-4 bg-red-800/30 hover:bg-red-800/50 text-white py-2 px-4 rounded-lg transition-colors flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back to Instructors
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="w-full space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div 
        className="flex items-center mb-6"
        variants={itemVariants}
      >
        <button 
          onClick={() => router.push('/dashboard/pages/staff')}
          className="mr-4 bg-[#1a1f2e]/80 hover:bg-[#1a1f2e] text-white p-2 rounded-lg transition-colors"
        >
          <FaArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Instructor Details</h1>
          <p className="text-gray-400">View and manage instructor information</p>
        </div>
      </motion.div>

      <motion.div
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-indigo-900/40 p-6 border border-blue-800/30 shadow-xl"
        variants={itemVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
        <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-10">
          <motion.div 
            className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 flex items-center justify-center shadow-lg border-4 border-blue-800/30 animate-float"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          >
            <span className="text-blue-400 text-5xl font-extrabold animate-pulse select-none">
              {lecturer.name?.charAt(0).toUpperCase() || '?'}
            </span>
          </motion.div>
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight flex items-center gap-2">
              {lecturer.name || 'Unknown'}
              <span className="ml-2 px-2 py-0.5 rounded bg-blue-900/40 text-xs text-blue-300 font-semibold animate-fadeIn">Instructor</span>
            </h2>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-blue-900/20 text-blue-400 text-sm flex items-center cursor-pointer group" title="Copy Email" onClick={() => navigator.clipboard.writeText(lecturer.email)}>
                <FaEnvelope className="mr-2" /> {lecturer.email || 'N/A'}
                <span className="ml-1 opacity-0 group-hover:opacity-100 text-xs text-blue-200 transition-opacity">Copy</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-900/20 text-indigo-400 text-sm flex items-center">
                <FaUserTie className="mr-2" /> {lecturer.lecturerRole || 'N/A'}
              </span>
              <span className="px-3 py-1 rounded-full bg-green-900/20 text-green-400 text-sm flex items-center">
                <FaBuilding className="mr-2" /> {lecturer.lecturerDepartment || 'N/A'}
              </span>
              <span className="px-3 py-1 rounded-full bg-yellow-900/20 text-yellow-400 text-sm flex items-center">
                <FaGraduationCap className="mr-2" /> {lecturer.lecturerCourses?.length || 0} Courses
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-xs">
              <span>User ID: <span className="text-gray-400 cursor-pointer group" title="Copy ID" onClick={() => navigator.clipboard.writeText(lecturer._id)}>{lecturer._id.slice(0, 8)}...<span className="ml-1 opacity-0 group-hover:opacity-100 text-xs text-blue-200 transition-opacity">Copy</span></span></span>
            </div>
          </div>
          <div className="flex flex-col gap-3 min-w-[120px]">
            <motion.button 
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-300 shadow-md group"
              whileHover={{ scale: 1.06, boxShadow: "0 8px 24px rgba(59,130,246,0.15)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => alert('Edit functionality to be implemented')}
            >
              <FaEdit className="mr-2" />
              <span>Edit</span>
            </motion.button>
            <motion.button 
              className="flex items-center bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-all duration-300 shadow-md group"
              whileHover={{ scale: 1.06, boxShadow: "0 8px 24px rgba(239,68,68,0.15)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setDeleteConfirm(true)}
              disabled={isDeleting}
            >
              <FaTrash className="mr-2" />
              <span>Delete</span>
            </motion.button>
          </div>
        </div>
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
        />
      </motion.div>

      <motion.div 
        className="bg-[#232738] rounded-xl p-6 shadow-md border border-[#2a2f3e] overflow-hidden relative"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <FaBook className="mr-3 text-yellow-400" /> Assigned Courses
          </h3>
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md"
            onClick={() => setShowAddCourseModal(true)}
          >
            <FaPlus /> Add Course
          </button>
        </div>
        {/* Modal */}
        {showAddCourseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-[#232738] p-8 rounded-xl shadow-lg w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-red-400 text-xl"
                onClick={() => setShowAddCourseModal(false)}
              >
                &times;
              </button>
              <h2 className="text-lg font-bold text-white mb-4">Assign Course to Instructor</h2>
              <select
                className="w-full p-2 rounded-lg bg-[#1a1f2e] text-white mb-4 border border-[#2a2f3e]"
                value={selectedCourseId}
                onChange={e => setSelectedCourseId(e.target.value)}
              >
                <option value="">Select a course</option>
                {courses
                  .filter(course => !lecturer.lecturerCourses.some(c => c._id === course._id))
                  .map(course => (
                    <option key={course._id} value={course._id}>
                      {course.courseName} - {course.courseCode} ({course.department})
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
        
        {lecturer.lecturerCourses && lecturer.lecturerCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {lecturer.lecturerCourses.map((course, index) => {
                // ابحث عن تفاصيل الكورس من قائمة الكورسات الكاملة
                const courseDetails = courses.find(c => c._id === course._id) || course;
                return (
                  <motion.div 
                    key={course._id}
                    className="bg-[#1a1f2e] p-4 rounded-xl border border-[#2a2f3e] transition-colors shadow-md group cursor-pointer relative overflow-hidden"
                    variants={courseVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FaBook className="text-yellow-400" />
                        <span className="text-sm text-blue-300 font-medium">Course {index + 1}</span>
                      </div>
                      <span className="text-xs text-gray-500">{course._id.substring(0, 8)}...</span>
                    </div>
                    <h4 className="text-gray-200 font-medium truncate" title={course.courseName}>{course.courseName}</h4>
                    <div className="mt-2 flex items-center text-xs text-gray-400 gap-2">
                      <FaCalendarAlt className="mr-1" /> Added recently
                      <button
                        className="ml-auto text-blue-400 hover:underline hover:text-blue-300 bg-transparent border-none outline-none"
                        onClick={() => setSelectedCourseDetails(courseDetails)}
                        title="Show Details"
                        type="button"
                      >
                        Show Details
                      </button>
                      <button
                        className="ml-2 text-red-500 hover:text-red-700 bg-transparent border-none outline-none"
                        title="Delete Course"
                        onClick={() => setDeleteCourseId(course._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            className="bg-[#1a1f2e]/50 p-6 rounded-lg text-center text-gray-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FaBook className="mx-auto text-3xl text-gray-500 mb-3 opacity-50" />
            <p>No courses assigned to this instructor</p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
              onClick={() => alert('Course assignment functionality to be implemented')}
            >
              Assign Courses
            </button>
          </motion.div>
        )}
        {/* Modal تأكيد حذف الكورس */}
        {deleteCourseId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-[#232738] p-8 rounded-xl shadow-lg w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-red-400 text-xl"
                onClick={() => setDeleteCourseId(null)}
              >
                &times;
              </button>
              <h2 className="text-lg font-bold text-white mb-4">Confirm Delete Course</h2>
              <div className="text-gray-200 mb-6">
                Are you sure you want to delete
                <span className="text-red-400 font-bold mx-1">"{(courses.find(c => c._id === deleteCourseId)?.courseName) || "this course"}"</span>
                from the instructor?
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
                  onClick={handleDeleteCourse}
                  disabled={deleteCourseLoading}
                >
                  {deleteCourseLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2 animate-spin inline-block"></span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FaTrash className="mr-2" /> Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div 
        className="bg-[#232738] rounded-xl p-6 shadow-md border border-[#2a2f3e] overflow-hidden relative"
        variants={itemVariants}
      >
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <FaChartBar className="mr-3 text-purple-400" /> Attendance Statistics
        </h3>
        {statsLoading ? (
          <motion.div 
            className="bg-[#1a1f2e]/50 p-6 rounded-lg flex items-center justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="rounded-full h-10 w-10 border-4 border-t-4 border-purple-500 mb-0 animate-spin"
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="ml-4 text-gray-400">Loading statistics...</p>
          </motion.div>
        ) : statsError ? (
          <motion.div 
            className="bg-[#1a1f2e]/50 p-6 rounded-lg text-center text-gray-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p>Failed to load attendance statistics</p>
          </motion.div>
        ) : (
          <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <motion.div 
              className="bg-[#1a1f2e] p-5 rounded-xl border border-[#2a2f3e] transition-colors shadow-md group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)", scale: 1.04 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-gray-400 font-medium">Present</h4>
                <span className="bg-green-900/30 p-2 rounded-lg">
                  <FaCheckCircle className="text-green-400" />
                </span>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-green-400">{instructorStats?.present ?? 0}</p>
                <span className="text-xs text-green-400 font-semibold">actions</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Actions Present</p>
            </motion.div>
            <motion.div 
              className="bg-[#1a1f2e] p-5 rounded-xl border border-[#2a2f3e] transition-colors shadow-md group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)", scale: 1.04 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-gray-400 font-medium">Absent</h4>
                <span className="bg-red-900/30 p-2 rounded-lg">
                  <FaTimesCircle className="text-red-400" />
                </span>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-red-400">{instructorStats?.absent ?? 0}</p>
                <span className="text-xs text-red-400 font-semibold">actions</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Actions Absent</p>
            </motion.div>
            <motion.div 
              className="bg-[#1a1f2e] p-5 rounded-xl border border-[#2a2f3e] transition-colors shadow-md group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)", scale: 1.04 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-gray-400 font-medium">Attendance Rate</h4>
                <span className="bg-purple-900/30 p-2 rounded-lg">
                  <FaPercentage className="text-purple-400" />
                </span>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-purple-400">{instructorStats?.showQttendanceRate ?? "0%"}</p>
                <span className="text-xs text-purple-400 font-semibold">Rate</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Overall attendance</p>
            </motion.div>
          </div>
          
          {/* Charts Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Pie Chart Section */}
            <motion.div 
              className="bg-[#1a1f2e] p-6 rounded-xl border border-[#2a2f3e] shadow-md animate-fadeIn overflow-hidden relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-purple-900/5"></div>
              <div className="relative">
                <motion.h4 
                  className="text-lg text-white font-semibold mb-4 flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <span className="w-2 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mr-3"></span>
                  Attendance Distribution
                </motion.h4>
                
                <div className="pt-2">
                  <AttendancePieChart 
                    data={[
                      { name: 'Present', value: instructorStats?.present ?? 0, color: '#4ade80' },
                      { name: 'Absent', value: instructorStats?.absent ?? 0, color: '#f87171' }
                    ]} 
                  />
                  
                  {(!instructorStats?.present && !instructorStats?.absent) && (
                    <div className="text-center text-gray-400 text-sm mt-4">
                      No attendance data available for this instructor
                    </div>
                  )}
                </div>
                
                <div className="flex justify-center mt-4 gap-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-300">Present</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-300">Absent</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Bar Chart Section */}
            <motion.div 
              className="bg-[#1a1f2e] p-6 rounded-xl border border-[#2a2f3e] shadow-md animate-fadeIn overflow-hidden relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/5 to-purple-900/5"></div>
              <div className="relative">
                <motion.h4 
                  className="text-lg text-white font-semibold mb-4 flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <span className="w-2 h-8 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-full mr-3"></span>
                  Present vs Absent
                </motion.h4>
                
                <div className="pt-2">
                  <AttendanceBarChart present={instructorStats?.present ?? 0} absent={instructorStats?.absent ?? 0} />
                  
                  {(!instructorStats?.present && !instructorStats?.absent) && (
                    <div className="text-center text-gray-400 text-sm mt-4">
                      No attendance data available for this instructor
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
          </>
        )}
      </motion.div>

      {deleteConfirm && (
        <motion.div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-[#1a1f2e] p-6 rounded-xl max-w-md w-full mx-4 border border-red-500/30 shadow-lg shadow-red-500/10"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mr-4">
                <FaTrash className="text-red-500 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-white">Confirm Deletion</h3>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-gray-300">
                Are you sure you want to delete instructor <span className="text-white font-semibold">{lecturer.name}</span>? This action cannot be undone.
              </p>
            </div>
            
            {deleteError && (
              <motion.div 
                className="bg-red-500/20 border border-red-500/40 rounded-lg p-3 mb-6 text-red-300 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {deleteError}
                </div>
              </motion.div>
            )}
            
            <div className="flex justify-end gap-4">
              <motion.button 
                className="px-4 py-2 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setDeleteConfirm(false)}
              >
                Cancel
              </motion.button>
              <motion.button 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(239, 68, 68, 0.2)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash className="mr-2" /> Delete
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal تفاصيل الكورس */}
      {selectedCourseDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#232738] p-8 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-400 text-xl"
              onClick={() => setSelectedCourseDetails(null)}
            >
              &times;
            </button>
            <h2 className="text-lg font-bold text-white mb-4">Course Details</h2>
            <div className="text-gray-200 space-y-2">
              <div><span className="font-semibold text-blue-300">Name:</span> {selectedCourseDetails.courseName}</div>
              <div><span className="font-semibold text-blue-300">Code:</span> {selectedCourseDetails.courseCode}</div>
              <div><span className="font-semibold text-blue-300">Department:</span> {selectedCourseDetails.department}</div>
              <div><span className="font-semibold text-blue-300">Level:</span> {selectedCourseDetails.level}</div>
              <div><span className="font-semibold text-blue-300">Semester:</span> {parseInt(selectedCourseDetails.semester) % 2 === 0 ? 2 : 1}</div>
              <div><span className="font-semibold text-blue-300">ID:</span> {selectedCourseDetails._id}</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// أضف هذه الوظيفة المساعدة بعد دالة Details
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

const describeArc = (x, y, radius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  
  return [
    "M", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "L", x, y,
    "Z"
  ].join(" ");
}

// ثم نضع مكون الـ Pie Chart الجديد كدالة خارجية مستقلة:
const AttendancePieChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const COLORS = ["#4ade80", "#f87171"];
  const RADIAN = Math.PI / 180;

  const renderActiveShape = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="#1a1f2e"
          strokeWidth={1}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
          stroke="#1a1f2e"
          strokeWidth={1}
          opacity={0.5}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={2} />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#fff" fontSize={14} fontWeight="bold">
          {`${payload.name}`}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#fff" fontSize={12}>
          {`${value} actions`}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={36} textAnchor={textAnchor} fill="#9ca3af" fontSize={12}>
          {`(${(percent * 100).toFixed(1)}%)`}
        </text>
      </g>
    );
  };

  // Handle pie chart hover
  const onPieEnter = useCallback((_, index) => {
    setActiveIndex(index);
  }, []);

  // If no data or all values are zero
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  if (data.length === 0 || totalValue === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px]">
        <p className="text-gray-400">No attendance data available</p>
      </div>
    );
  }

  // Custom tooltip that changes color based on the segment
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const color = data.payload.color;
      
      return (
        <div 
          className="custom-tooltip" 
          style={{ 
            backgroundColor: color === '#4ade80' ? 'rgba(22, 101, 52, 0.9)' : 'rgba(153, 27, 27, 0.9)',
            border: `1px solid ${color}`,
            borderRadius: '8px',
            padding: '10px 14px',
            boxShadow: `0 4px 14px ${color}30`,
            backdropFilter: 'blur(4px)',
            color: '#fff',
            transition: 'all 0.2s ease'
          }}
        >
          <p className="font-bold" style={{ color: color, fontSize: '14px', marginBottom: '4px' }}>
            {data.name}
          </p>
          <p className="text-white text-sm">
            {data.value} Actions
          </p>
          <p className="text-gray-300 text-xs mt-1">
            {`(${((data.value / totalValue) * 100).toFixed(1)}%)`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <defs>
          <filter id="glow" height="300%" width="300%" x="-100%" y="-100%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Add gradient definitions for tooltip backgrounds */}
          <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#166534" stopOpacity={0.9}/>
            <stop offset="100%" stopColor="#166534" stopOpacity={0.7}/>
          </linearGradient>
          <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#991b1b" stopOpacity={0.9}/>
            <stop offset="100%" stopColor="#991b1b" stopOpacity={0.7}/>
          </linearGradient>
        </defs>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={onPieEnter}
          paddingAngle={4}
          animationBegin={200}
          animationDuration={1000}
          filter="url(#glow)"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || COLORS[index % COLORS.length]} 
              stroke="#1a1f2e"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Improved bar chart with better styling and animations
const AttendanceBarChart = ({ present, absent }) => {
  const data = [
    { name: 'Present', value: present ?? 0, color: '#4ade80' },
    { name: 'Absent', value: absent ?? 0, color: '#f87171' }
  ];
  
  // If no data
  if (present === 0 && absent === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px]">
        <p className="text-gray-400">No attendance data available</p>
      </div>
    );
  }

  // Custom tooltip that changes color based on the bar
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const color = data.payload.color;
      
      return (
        <div 
          className="custom-tooltip" 
          style={{ 
            backgroundColor: color === '#4ade80' ? 'rgba(22, 101, 52, 0.9)' : 'rgba(153, 27, 27, 0.9)',
            border: `1px solid ${color}`,
            borderRadius: '8px',
            padding: '10px 14px',
            boxShadow: `0 4px 14px ${color}30`,
            backdropFilter: 'blur(4px)',
            color: '#fff',
            transition: 'all 0.2s ease'
          }}
        >
          <p className="font-bold" style={{ color: color, fontSize: '14px', marginBottom: '4px' }}>
            {data.name}
          </p>
          <p className="text-white text-sm">
            {data.value} Actions
          </p>
          <p className="text-gray-300 text-xs mt-1">
            {`(${((data.value / (present + absent)) * 100).toFixed(1)}%)`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 10,
        }}
      >
        <defs>
          <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ade80" stopOpacity={0.9}/>
            <stop offset="100%" stopColor="#4ade80" stopOpacity={0.6}/>
          </linearGradient>
          <linearGradient id="absentGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f87171" stopOpacity={0.9}/>
            <stop offset="100%" stopColor="#f87171" stopOpacity={0.6}/>
          </linearGradient>
          <filter id="barShadow" height="200%" width="200%" x="-50%" y="-50%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.3"/>
          </filter>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3e" vertical={false} />
        <XAxis 
          dataKey="name" 
          stroke="#9ca3af" 
          axisLine={{ stroke: '#2a2f3e' }}
          tickLine={false}
          tick={{ fill: '#9ca3af', fontSize: 14 }}
        />
        <YAxis 
          stroke="#9ca3af" 
          allowDecimals={false}
          axisLine={{ stroke: '#2a2f3e' }}
          tickLine={false}
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          width={40}
        />
        <Tooltip content={<CustomBarTooltip />} cursor={{fill: 'rgba(255, 255, 255, 0.05)'}} />
        <Bar 
          dataKey="value" 
          radius={[8, 8, 0, 0]}
          maxBarSize={80}
          isAnimationActive={true}
          animationBegin={200}
          animationDuration={1500}
          filter="url(#barShadow)"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={index === 0 ? "url(#presentGradient)" : "url(#absentGradient)"} 
              stroke={entry.color}
              strokeWidth={1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Details;