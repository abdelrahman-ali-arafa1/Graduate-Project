"use client";
import React, { useMemo, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
  Paper,
  Button,
  useMediaQuery,
  Chip,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { CiSearch } from "react-icons/ci";
import { FaFilter, FaSort, FaUserPlus, FaDownload, FaSortAmountDown, FaSortAmountUp, FaUserTimes } from "react-icons/fa";
import { MdFilterList, MdFilterListOff } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  useAddStudentAttendanceMutation,
  useGetAllAttendancesQuery,
  useGetManualAttendanceQuery,
} from "../Redux/features/attendanceApiSlice";
import { useTheme } from "../components/ThemeProvider";

// Add this helper function at the top of the file, outside the component
const getAttendanceStatus = (student) => {
  // Handle direct attendanceStatus field from new API format
  if (student && student.attendanceStatus) {
    return student.attendanceStatus;
  }
  
  // Handle older formats
  return student.studentAttendanc || 
         (student.student && student.student.attendanceStatus) || 
         "Not recorded";
};



export default function AttendanceTable({ allowMarkAbsent = false }) {
  const [isRendered, setIsRendered] = useState(false);
  const sessionId = useSelector((state) => state.session.sessionId);
  const lecturerRole = useSelector((state) => state.userRole.isInstructor);
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("token")?.replace(/"/g, "")
      : null;
  
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [storedCourse, setStoredCourse] = useState({});
  
  // Initialize client-side state
  useEffect(() => {
    setIsRendered(true);
    
    if (typeof window !== "undefined") {
      const course = JSON.parse(localStorage.getItem("selectedCourse") || "{}");
      setStoredCourse(course);
    }
  }, []);
  
  const courseId = storedCourse._id;
  
  // Fetch attendance data - use different queries based on context
  const { 
    data: allAttendanceData, 
    error: allAttendanceError, 
    isLoading: isLoadingAllAttendance,
    refetch: refetchAllAttendance
  } = useGetAllAttendancesQuery(
    courseId,
    {
      skip: !courseId || (allowMarkAbsent && sessionId), // Skip if in manual mode with active session
    }
  );
  
  // Fetch manual attendance data for current session
  const { 
    data: manualAttendanceData, 
    error: manualAttendanceError, 
    isLoading: isLoadingManualAttendance,
    refetch: refetchManualAttendance
  } = useGetManualAttendanceQuery(
    sessionId,
    {
      skip: !courseId || !allowMarkAbsent, // Only fetch when in manual mode with active course
    }
  );
  
  // Refetch data when sessionId changes
  useEffect(() => {
    if (courseId && allowMarkAbsent && refetchManualAttendance) {
      console.log("Course or session changed, refetching manual attendance data");
      refetchManualAttendance();
    }
  }, [sessionId, courseId, allowMarkAbsent, refetchManualAttendance]);
  
  // Debug logs
  useEffect(() => {
    if (allowMarkAbsent) {
      console.log("Manual attendance mode active with session ID:", sessionId);
      console.log("Manual attendance data:", manualAttendanceData);
    } else {
      console.log("Regular attendance mode active");
      console.log("All attendance data:", allAttendanceData);
    }
  }, [allowMarkAbsent, sessionId, manualAttendanceData, allAttendanceData]);
  
  // Determine which data to use
  const data = allowMarkAbsent ? manualAttendanceData : allAttendanceData;
  const error = allowMarkAbsent ? manualAttendanceError : allAttendanceError;
  const isLoading = allowMarkAbsent ? isLoadingManualAttendance : isLoadingAllAttendance;
  const refetch = allowMarkAbsent ? refetchManualAttendance : refetchAllAttendance;
  
  // Debug the final data being used
  useEffect(() => {
    console.log("Final data being used:", data);
    console.log("Students array:", data?.students);
    console.log("Number of students:", data?.students?.length || 0);
  }, [data]);
  
  const [addStudentAttendance, { isLoading: isLoadingAdding }] =
    useAddStudentAttendanceMutation();

  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Sorting and filtering states
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [availableDepartments, setAvailableDepartments] = useState([]);
  
  const users = data?.students || [];
  const isSmallScreen = useMediaQuery("(max-width:930px)");

  // Extract unique departments for filter dropdown
  useEffect(() => {
    if (Array.isArray(users) && users.length > 0) {
      const departments = [...new Set(users.map(user => 
        user?.student?.department || "Unknown"
      ))];
      setAvailableDepartments(departments);
    }
  }, [users]);

  // Filter users based on search term and filters
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];

    return users.filter((user) => {
      // Text search filter
      const name = user?.student?.name?.toLowerCase() || "";
      const department = user?.student?.department?.toLowerCase() || "";
      const id = user?.student?.studentID ? String(user?.student?.studentID) : 
                (user?.student?._id ? String(user?.student?._id).substring(0, 8) : "");
      const textMatch = 
        name.includes(searchTerm.toLowerCase()) ||
        department.includes(searchTerm.toLowerCase()) ||
        id.includes(searchTerm);
      
      // Get the attendance status using our helper function
      const status = getAttendanceStatus(user);
      
      // Status filter
      const statusMatch = 
        statusFilter === "all" || 
        (statusFilter === "present" && status === "present") ||
        (statusFilter === "absent" && status !== "present");
      
      // Department filter
      const deptMatch = 
        departmentFilter === "all" || 
        user?.student?.department === departmentFilter;
      
      return textMatch && statusMatch && deptMatch;
    });
  }, [searchTerm, users, statusFilter, departmentFilter]);

  // Sort users
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      let fieldA, fieldB;
      
      switch (sortField) {
        case "id":
          fieldA = a?.student?.studentID || a?.student?._id?.substring(0, 8) || "";
          fieldB = b?.student?.studentID || b?.student?._id?.substring(0, 8) || "";
          break;
        case "name":
          fieldA = a?.student?.name || "";
          fieldB = b?.student?.name || "";
          break;
        case "department":
          fieldA = a?.student?.department || "";
          fieldB = b?.student?.department || "";
          break;
        case "status":
          fieldA = getAttendanceStatus(a) || "";
          fieldB = getAttendanceStatus(b) || "";
          break;
        default:
          fieldA = a?.student?.name || "";
          fieldB = b?.student?.name || "";
      }
      
      // Compare the fields based on sort direction
      if (sortDirection === "asc") {
        return fieldA.localeCompare(fieldB);
      } else {
        return fieldB.localeCompare(fieldA);
      }
    });
  }, [filteredUsers, sortField, sortDirection]);

  // Calculate visible rows for current page
  const visibleRows = useMemo(() => {
    return sortedUsers.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [page, rowsPerPage, sortedUsers]);

  // Handle sort click
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter menu handlers
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleResetFilters = () => {
    setStatusFilter("all");
    setDepartmentFilter("all");
    handleFilterClose();
  };

  // Export data to Excel
  const handleExportToExcel = () => {
    if (users.length === 0) {
      alert("No data to export!");
      return;
    }

    // Format data for export
    const exportData = sortedUsers.map(user => ({
      'Student ID': user.student?.studentID || (user.student?._id ? user.student._id.substring(0, 8) : ''),
      'Name': user.student?.name || '',
      'Department': user.student?.department || '',
      'Level': user.student?.level || '',
      'Attendance Status': getAttendanceStatus(user)
    }));

    // Convert JSON to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    // Write the file and trigger download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Save the file
    saveAs(data, `${storedCourse.courseName || 'Course'}_Attendance.xlsx`);
  };

  // Add user attendance
  const handleAddUserAttendance = async (row, status = "present") => {
    console.log("Marking attendance for student:", row);
    
    // Check if student data exists
    if (!row || !row.student || !row.student._id) {
      window.alert("Student data is unavailable or invalid");
      console.error("Invalid student data:", row);
      return;
    }
    
    // Check if session ID exists
    if (!sessionId) {
      window.alert("No active session. Please create a session first.");
      return;
    }
    
    // Get current attendance status
    const currentStatus = getAttendanceStatus(row);
    
    // Check if student is already marked with the same status
    if (currentStatus === status) {
      window.alert(`Student ${row.student?.name || ''} is already marked ${status}`);
      return;
    }

    const statusMessage = status === "present" ? "present" : "absent";
    if (window.confirm(`Mark ${row.student?.name || 'student'} as ${statusMessage}?`)) {
      try {
        const newAttendance = {
          student: row.student?._id,
          sessionID: sessionId,
          attendanceStatus: status,
          sessionType: lecturerRole === "instructor" ? "lecture" : "section",
          timestamp: new Date().toISOString()
        };

        console.log("Sending attendance data:", newAttendance);

        // Validate data before sending
        if (!newAttendance.student || !newAttendance.sessionID) {
          throw new Error("Incomplete attendance data");
        }

        const response = await addStudentAttendance({
          courseId: storedCourse._id || courseId,
          newUser: newAttendance,
        });

        console.log("Attendance response:", response);

        // Show success message with student name
        window.alert(`Successfully marked ${row.student?.name || 'student'} as ${statusMessage}`);
        
        // Refresh data 
        if (refetch) {
          console.log("Refetching attendance data");
          refetch();
        }
      } catch (err) {
        console.error("Failed to add attendance:", err);
        window.alert(`Failed to record attendance: ${err.message || "Unexpected error occurred"}`);
      }
    }
  };
  
  if (!isRendered) return null;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-16 w-16 border-t-2 border-b-2 border-primary animate-spin"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-error text-center p-4 bg-red-50 rounded-lg">
        Error fetching attendance data: {error.message}
      </div>
    );
  }

  // If we're in manual attendance mode with no active session, show a message
  if (allowMarkAbsent && !sessionId) {
    return (
      <div className="text-center p-8 bg-[var(--secondary)] rounded-lg border border-[var(--border-color)]">
        <h3 className="text-xl font-medium text-[var(--foreground)] mb-2">No Active Session</h3>
        <p className="text-[var(--foreground-secondary)] mb-4">
          Please create a session first to view and manage student attendance.
        </p>
      </div>
    );
  }

  // Calculate stats for the summary
  const totalStudents = users.length;
  const presentStudents = users.filter(user => getAttendanceStatus(user) === "present").length;
  const absentStudents = totalStudents - presentStudents;
  const attendanceRate = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-6 bg-[#0a0e17] min-h-screen">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#1a1f2e] p-5 rounded-lg shadow-lg border border-[#2a2f3e] hover:shadow-xl transition-all"
        >
          <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-1">Total Students</p>
          <h3 className="text-3xl font-bold text-white">{totalStudents}</h3>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-[#1a1f2e] p-5 rounded-lg shadow-lg border border-[#2a2f3e] hover:shadow-xl transition-all"
        >
          <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-1">Present</p>
          <h3 className="text-3xl font-bold text-green-400">{presentStudents}</h3>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-[#1a1f2e] p-5 rounded-lg shadow-lg border border-[#2a2f3e] hover:shadow-xl transition-all"
        >
          <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-1">Absent</p>
          <h3 className="text-3xl font-bold text-red-400">{absentStudents}</h3>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-[#1a1f2e] p-5 rounded-lg shadow-lg border border-[#2a2f3e] hover:shadow-xl transition-all"
        >
          <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-1">Attendance Rate</p>
          <div className="flex items-center">
            <h3 className="text-3xl font-bold text-blue-400">{attendanceRate}%</h3>
            <div className="ml-3 w-16 h-16 relative">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(96, 165, 250, 0.2)"
                  strokeWidth="3"
                  strokeDasharray="100, 100"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="3"
                  strokeDasharray={`${attendanceRate}, 100`}
                  className="animate-dashoffset"
                />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Box sx={{ width: "100%" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
        <Paper
            elevation={0}
          sx={{
            width: "100%",
            mb: 2,
              backgroundColor: "#0d111c",
              color: "white",
              borderRadius: "0.5rem",
            overflow: "hidden",
              border: "1px solid #2a2f3e",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}
        >
          {/* Toolbar with search and filters */}
            <div className="p-6 bg-[#1a1f2e] border-b border-[#2a2f3e]">
              <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
                <div className="relative w-full md:w-[350px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                <input
                    type="text"
                    placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-[#0d111c] text-white placeholder-gray-400 w-full py-2.5 pl-10 pr-4 rounded-md border border-[#2a2f3e] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                {/* Department Filter */}
                <div className="relative w-full md:w-[250px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="bg-[#0d111c] text-white w-full py-2.5 pl-10 pr-10 rounded-md border border-[#2a2f3e] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none transition-all"
                  >
                    <option value="all">All Departments</option>
                    {availableDepartments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Sort Filter */}
                <div className="relative w-full md:w-[200px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                    </svg>
                  </div>
                  <select
                    value={`${sortField}-${sortDirection}`}
                    onChange={(e) => {
                      const [field, direction] = e.target.value.split('-');
                      setSortField(field);
                      setSortDirection(direction);
                    }}
                    className="bg-[#0d111c] text-white w-full py-2.5 pl-10 pr-10 rounded-md border border-[#2a2f3e] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none transition-all"
                  >
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="id-asc">ID (Ascending)</option>
                    <option value="id-desc">ID (Descending)</option>
                    <option value="department-asc">Department (A-Z)</option>
                    <option value="status-asc">Status (Present First)</option>
                    <option value="status-desc">Status (Absent First)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Export Button */}
                <div className="w-full md:w-auto md:ml-auto">
                  <button
                    onClick={handleExportToExcel}
                    className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white py-2.5 px-6 rounded-md transition-all flex items-center justify-center gap-2 hover:shadow-lg"
                  >
                    <FaDownload size={16} />
                    <span>Export</span>
                  </button>
                </div>
              </div>
              
              {/* Status Filter Pills */}
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    statusFilter === "all"
                      ? "bg-primary text-white"
                      : "bg-[#2a2f3e] text-gray-300 hover:bg-[#3a3f4e]"
                  }`}
                >
                  All Students
                </button>
                <button
                  onClick={() => setStatusFilter("present")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    statusFilter === "present"
                      ? "bg-success text-white"
                      : "bg-[#2a2f3e] text-gray-300 hover:bg-[#3a3f4e]"
                  }`}
                >
                  Present
                </button>
                <button
                  onClick={() => setStatusFilter("absent")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    statusFilter === "absent"
                      ? "bg-error text-white"
                      : "bg-[#2a2f3e] text-gray-300 hover:bg-[#3a3f4e]"
                  }`}
                >
                  Absent
                </button>
                
                {departmentFilter !== "all" && (
                  <div className="flex items-center bg-[#2a2f3e] text-white px-4 py-1.5 rounded-full text-sm">
                    <span className="mr-2">Department: {departmentFilter}</span>
                    <button
                      onClick={() => setDepartmentFilter("all")}
                      className="text-gray-400 hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

          {/* Table */}
          <TableContainer sx={{ maxHeight: "60vh" }}>
            <Table
              stickyHeader
              aria-labelledby="tableTitle"
              sx={{ minWidth: { xs: 350, sm: 650 } }}
            >
              <TableHead>
                <TableRow>
                  <TableCell 
                      onClick={() => handleSort("id")}
                    sx={{ 
                      fontWeight: "bold", 
                        backgroundColor: "#1a1f2e",
                        color: "white",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        "&:hover": { backgroundColor: "#2a2f3e" },
                        py: 3,
                        borderBottom: "1px solid #2a2f3e"
                    }}
                  >
                      <div className="flex items-center">
                    Student ID
                        {sortField === "id" && (
                          <span className="ml-1 transition-transform duration-300">
                            {sortDirection === "asc" ? <FaSortAmountUp size={14} /> : <FaSortAmountDown size={14} />}
                          </span>
                        )}
                      </div>
                  </TableCell>
                  <TableCell 
                      onClick={() => handleSort("name")}
                    sx={{ 
                      fontWeight: "bold", 
                        backgroundColor: "#1a1f2e",
                        color: "white",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        "&:hover": { backgroundColor: "#2a2f3e" },
                        py: 3,
                        borderBottom: "1px solid #2a2f3e"
                    }}
                  >
                      <div className="flex items-center">
                    Name
                        {sortField === "name" && (
                          <span className="ml-1 transition-transform duration-300">
                            {sortDirection === "asc" ? <FaSortAmountUp size={14} /> : <FaSortAmountDown size={14} />}
                          </span>
                        )}
                      </div>
                  </TableCell>
                  <TableCell 
                    align="center" 
                      onClick={() => handleSort("department")}
                    sx={{ 
                      fontWeight: "bold", 
                        backgroundColor: "#1a1f2e",
                      color: "white",
                        display: { xs: 'none', sm: 'table-cell' },
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        "&:hover": { backgroundColor: "#2a2f3e" },
                        py: 3,
                        borderBottom: "1px solid #2a2f3e"
                    }}
                  >
                      <div className="flex items-center justify-center">
                    Department
                        {sortField === "department" && (
                          <span className="ml-1 transition-transform duration-300">
                            {sortDirection === "asc" ? <FaSortAmountUp size={14} /> : <FaSortAmountDown size={14} />}
                          </span>
                        )}
                      </div>
                  </TableCell>
                  <TableCell 
                    align="center" 
                      onClick={() => handleSort("status")}
                    sx={{ 
                      fontWeight: "bold", 
                        backgroundColor: "#1a1f2e",
                      color: "white",
                        display: { xs: 'none', md: 'table-cell' },
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        "&:hover": { backgroundColor: "#2a2f3e" },
                        py: 3,
                        borderBottom: "1px solid #2a2f3e"
                    }}
                  >
                      <div className="flex items-center justify-center">
                    Status
                        {sortField === "status" && (
                          <span className="ml-1 transition-transform duration-300">
                            {sortDirection === "asc" ? <FaSortAmountUp size={14} /> : <FaSortAmountDown size={14} />}
                          </span>
                        )}
                      </div>
                  </TableCell>
                  <TableCell 
                    align="center" 
                    sx={{ 
                      fontWeight: "bold", 
                        backgroundColor: "#1a1f2e",
                        color: "white",
                        py: 3,
                        borderBottom: "1px solid #2a2f3e"
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.length > 0 ? (
                  visibleRows
                    .filter((row) => row.student)
                      .map((row, index) => {
                        // Get the status using our helper function
                        const status = getAttendanceStatus(row);
                        
                        return (
                        <motion.tr
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          component={TableRow}
                        key={row._id || row.student._id}
                        hover
                        sx={{ 
                          cursor: "pointer",
                            backgroundColor: "#0d111c",
                          "&:nth-of-type(odd)": {
                              backgroundColor: "#0a0e17"
                          },
                          "&:hover": {
                              backgroundColor: "#151b29"
                            },
                            transition: "background-color 0.2s",
                        }}
                      >
                        <TableCell 
                          component="th" 
                          scope="row" 
                            sx={{ color: "white", py: 2.5, borderBottom: "1px solid #2a2f3e" }}
                        >
                            <div className="font-medium">{row.student.studentID || row.student._id?.substring(0, 8)}</div>
                        </TableCell>
                          <TableCell sx={{ color: "white", py: 2.5, borderBottom: "1px solid #2a2f3e" }}>
                            <div className="font-medium">{row.student.name}</div>
                        </TableCell>
                        <TableCell 
                          align="center" 
                          sx={{ 
                              color: "white",
                              display: { xs: 'none', sm: 'table-cell' },
                              py: 2.5,
                              borderBottom: "1px solid #2a2f3e"
                          }}
                        >
                            <span className="bg-[#2a2f3e] text-gray-300 px-3 py-1 rounded-md text-sm">
                          {row.student?.department || "N/A"}
                            </span>
                        </TableCell>
                        <TableCell 
                          align="center" 
                          sx={{ 
                              display: { xs: 'none', md: 'table-cell' },
                              py: 2.5,
                              borderBottom: "1px solid #2a2f3e"
                            }}
                          >
                            <span 
                              className={`px-3 py-1 rounded-md text-sm font-medium ${
                                status === "present" 
                                  ? "bg-green-900/30 text-green-400" 
                                  : status === "absent" 
                                  ? "bg-red-900/30 text-red-400" 
                                  : "bg-gray-800 text-gray-400"
                              }`}
                            >
                              {status === "present" ? "Present" : status === "absent" ? "Absent" : "Not recorded"}
                            </span>
                        </TableCell>
                          <TableCell align="center" sx={{ py: 2, borderBottom: "1px solid #2a2f3e" }}>
                            <div className="flex gap-2 justify-center">
                              <Tooltip title={status === "present" ? "Already present" : "Mark as present"}>
                                <span>
                          <Button
                            variant="contained"
                            size="small"
                                    onClick={() => handleAddUserAttendance(row, "present")}
                                    disabled={isLoadingAdding || status === "present"}
                            sx={{
                              minWidth: 0,
                              backgroundColor: "var(--success)",
                                      borderRadius: "6px",
                                      transition: "all 0.2s ease",
                                      "&:hover": { 
                                        backgroundColor: "var(--success)",
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 4px 8px rgba(0,0,0,0.15)"
                                      },
                              "&.Mui-disabled": { 
                                        backgroundColor: "rgba(255, 255, 255, 0.05)", 
                                        color: "rgba(255, 255, 255, 0.2)" 
                              }
                            }}
                          >
                            <FaUserPlus />
                          </Button>
                                </span>
                              </Tooltip>
                              
                              {allowMarkAbsent && (
                                <Tooltip title={status === "absent" ? "Already marked absent" : "Mark as absent"}>
                                  <span>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      onClick={() => handleAddUserAttendance(row, "absent")}
                                      disabled={isLoadingAdding || status === "absent"}
                                      sx={{
                                        minWidth: 0,
                                        backgroundColor: "var(--error)",
                                        borderRadius: "6px",
                                        transition: "all 0.2s ease",
                                        "&:hover": { 
                                          backgroundColor: "var(--error-dark)",
                                          transform: "translateY(-2px)",
                                          boxShadow: "0 4px 8px rgba(0,0,0,0.15)"
                                        },
                                        "&.Mui-disabled": { 
                                          backgroundColor: "rgba(255, 255, 255, 0.05)", 
                                          color: "rgba(255, 255, 255, 0.2)" 
                                        }
                                      }}
                                    >
                                      <FaUserTimes />
                                    </Button>
                                  </span>
                                </Tooltip>
                              )}
                            </div>
                        </TableCell>
                        </motion.tr>
                        );
                      })
                ) : (
                  <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8, color: "gray", backgroundColor: "#0d111c", borderBottom: "1px solid #2a2f3e" }}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Typography variant="body1" sx={{ fontWeight: "medium", mb: 1, color: "white" }}>
                        No students found
                      </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.7, color: "gray" }}>
                            Try adjusting your search criteria or filters
                      </Typography>
                        </motion.div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#1a1f2e] border-t border-[#2a2f3e]">
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-400">
                    Showing <span className="font-medium text-white">{page * rowsPerPage + 1}</span> to{" "}
                    <span className="font-medium text-white">
                      {Math.min((page + 1) * rowsPerPage, filteredUsers.length)}
                    </span>{" "}
                    of <span className="font-medium text-white">{filteredUsers.length}</span> results
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-gray-400 mr-2">Rows per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
                    className="bg-[#0d111c] text-white px-2 py-1 rounded border border-[#2a2f3e] text-sm"
                  >
                    {[5, 10, 25, 50].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => setPage(Math.max(0, page - 1))}
                      disabled={page === 0}
                      className={`p-1 rounded ${
                        page === 0
                          ? "text-gray-600 cursor-not-allowed"
                          : "text-gray-400 hover:bg-[#2a2f3e] hover:text-white"
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div className="text-white px-2 py-1">
                      {page + 1} of {Math.ceil(filteredUsers.length / rowsPerPage)}
                    </div>
                    <button
                      onClick={() => setPage(Math.min(Math.ceil(filteredUsers.length / rowsPerPage) - 1, page + 1))}
                      disabled={page >= Math.ceil(filteredUsers.length / rowsPerPage) - 1}
                      className={`p-1 rounded ${
                        page >= Math.ceil(filteredUsers.length / rowsPerPage) - 1
                          ? "text-gray-600 cursor-not-allowed"
                          : "text-gray-400 hover:bg-[#2a2f3e] hover:text-white"
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </Paper>
        </motion.div>
      </Box>
    </div>
  );
}
