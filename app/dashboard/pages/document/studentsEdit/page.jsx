"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilter, FaSave, FaEdit, FaUserGraduate, FaCheckCircle, FaTimesCircle, FaEnvelope, FaBuilding, FaGraduationCap, FaTrash, FaEye } from "react-icons/fa";
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
  const [originalEditData, setOriginalEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [isTableHovered, setIsTableHovered] = useState(false);
  const tableContainerRef = useRef(null);
  const scrollTimerRef = useRef(null);

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

  // Start editing a student
  const handleEdit = (idx) => {
    setEditIndex(idx);
    setEditData(filteredStudents[idx]);
    setOriginalEditData(filteredStudents[idx]);
    setStatus("");
  };

  // Handle input change
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Save changes
  const handleSave = async (studentId) => {
    setSaving(true);
    setStatus("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token")?.replace(/"/g, "") : "";

      // Build updateData object with only changed fields
      const updateData = {};

      if (editData.name !== originalEditData.name && editData.name.trim() !== '') {
        updateData.name = editData.name;
      }

      if (editData.email !== originalEditData.email && editData.email.trim() !== '') {
        updateData.email = editData.email;
      }

      // If no changes, do not send request
      if (Object.keys(updateData).length === 0) {
        setStatus("No changes detected.");
        setSaving(false);
        setEditIndex(null); // Exit edit mode
        return;
      }

      const res = await fetch(
        `https://attendance-eslamrazeen-eslam-razeens-projects.vercel.app/api/attendanceQRCode/studentInfo/${studentId}`,
        {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
          },
          body: JSON.stringify(updateData), // Send only changed data
        }
      );

      if (res.ok) {
        setStatus("Saved successfully!");
        // Update local data with only the changes that were sent
        const updated = filteredStudents.map(student =>
            student._id === studentId ? { ...student, ...updateData } : student
        );
        setFilteredStudents(updated);
        setEditIndex(null); // Exit edit mode
      } else {
        let errorMsg = "Failed to save. Please try again.";
        try {
          const errorData = await res.json();
          // Improved error message display
          if (errorData && errorData.errors && errorData.errors.length > 0) {
              errorMsg = errorData.errors[0].msg || errorMsg;
          } else if (errorData && errorData.message) {
              errorMsg = errorData.message;
          }
        } catch (e) {
            console.error("Failed to parse error response:", e);
        }
        setStatus(`Save error: ${errorMsg}`); // Display specific error
        console.error("PUT error:", errorMsg);
      }
    } catch (error) {
      setStatus(`An unexpected error occurred: ${error.message}`);
      console.error("PUT fetch error:", error);
    }
    setSaving(false);
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
      {/* Student Count */}
      <motion.div
        className="mt-8 mb-4 text-gray-400 text-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Showing {filteredStudents.length} students
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
                  <td colSpan={5} className="text-center text-gray-500 py-8">No students found for selected filter.</td>
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
                              <FaEye className="text-blue-300 text-base"/>
                            </motion.button>
                          )}
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
    </motion.div>
  );
};

export default StudentsEditPage; 