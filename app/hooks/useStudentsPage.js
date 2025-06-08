import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useGetStudentsByDateQuery } from "@/app/store/features/attendanceApiSlice"; 
import { useGetCourseSessionsQuery } from "@/app/store/features/sessionApiSlice";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Helper function to format date to DD/MM/YYYY
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const useStudentsPage = () => {
  const router = useRouter();
  
  // Redux state
  const selectedCourse = useSelector((state) => state.selectedCourse.course);
  const sessionId = useSelector((state) => state.session.sessionId);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name, department, attendance
  const [sortOrder, setSortOrder] = useState("asc"); // asc, desc
  const [selectedDate, setSelectedDate] = useState(null); // New state for selected date
  const [formattedSessionDates, setFormattedSessionDates] = useState([]);

  // Handle date selection
  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date === "" ? null : date); // Set to null if "All Dates" is selected
  };

  // Fetch sessions for the selected course
  const {
    data: sessionsData,
    isLoading: isLoadingSessions,
    error: sessionsError,
  } = useGetCourseSessionsQuery(selectedCourse?._id || "", {
    skip: !selectedCourse?._id,
  });

  // Fetch student data based on selected date or all students
  const {
    data: studentsData,
    isLoading: isLoadingStudents,
    error: studentsError,
    refetch: refetchStudents,
  } = useGetStudentsByDateQuery(
    { courseId: selectedCourse?._id || "", date: selectedDate ? formatDate(selectedDate) : null },
    {
      skip: !selectedCourse?._id, // Skip if courseId is not available
    }
  );

  // Combine loading and error states and define attendanceData immediately after hooks
  const isLoading = isLoadingSessions || isLoadingStudents;
  const error = sessionsError || studentsError;
  const attendanceData = studentsData; // Use studentsData from the hook

  // Effect to process session data and format unique dates on the client
  useEffect(() => {
    if (sessionsData && Array.isArray(sessionsData)) {
      const uniqueDates = Array.from(new Set(sessionsData.map(session => new Date(session.createdAt).toDateString()))); // Get unique dates as strings
      
      const dates = uniqueDates
        .map(dateString => ({ // Map unique date strings to objects
            date: new Date(dateString), // Create Date object for sorting
            originalDate: new Date(dateString).toISOString(), // Store original date as ISO string for consistent value
            formattedDate: formatDate(dateString) // Format for display
        }))
        .sort((a, b) => b.date.getTime() - a.date.getTime()) // Sort by timestamp descending (latest first)
        .slice(0, 10); // Take latest 10 unique dates
        
      setFormattedSessionDates(dates);
    } else {
      setFormattedSessionDates([]);
    }
  }, [sessionsData]); // Rerun when sessionsData changes

  // Get filtered and sorted students for display
  const filteredStudents = useMemo(() => {
    if (!attendanceData || !Array.isArray(attendanceData)) return [];

    let filtered = [...attendanceData];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) => {
          const student = selectedDate ? item : item.student; // Get the actual student object
          // Ensure student and its properties exist before accessing
          return student && (student.name?.toLowerCase().includes(term) || student.email?.toLowerCase().includes(term));
        }
      );
    }

    // Apply department filter
    if (filterDepartment) {
      filtered = filtered.filter(
        (item) => {
          const student = selectedDate ? item : item.student; // Get the actual student object
          // Ensure student and department exist before accessing
          return student && student.department === filterDepartment;
        }
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let valueA, valueB;

      // Adjust sorting based on whether a date is selected and access properties safely
      const studentA = selectedDate ? a : a?.student;
      const studentB = selectedDate ? b : b?.student;

      // Ensure student objects exist before accessing properties
      if (!studentA || !studentB) return 0;

      switch (sortBy) {
        case "name":
          valueA = studentA.name?.toLowerCase() || '';
          valueB = studentB.name?.toLowerCase() || '';
          break;
        case "department":
          valueA = studentA.department?.toLowerCase() || '';
          valueB = studentB.department?.toLowerCase() || '';
          break;
        case "attendance":
          // Only sort by attendance if no date is selected
          if (selectedDate) return 0;
          // Access studentAttendanc safely
          valueA = a?.studentAttendanc || 0;
          valueB = b?.studentAttendanc || 0;
          break;
        default:
          valueA = studentA.name?.toLowerCase() || '';
          valueB = studentB.name?.toLowerCase() || '';
      }

      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [attendanceData, searchTerm, filterDepartment, sortBy, sortOrder, selectedDate]);

  // Get unique departments for filtering
  const departments = useMemo(() => {
    if (!attendanceData || !Array.isArray(attendanceData)) return [];
    const departmentsSet = new Set();
    attendanceData.forEach((item) => {
      const student = selectedDate ? item : item.student;
      if (student?.department) {
        departmentsSet.add(student.department);
      }
    });
    return Array.from(departmentsSet);
  }, [attendanceData, selectedDate]);

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Change sort criteria
  const changeSortBy = (criteria) => {
    if (sortBy === criteria) {
      toggleSortOrder();
    } else {
      setSortBy(criteria);
      setSortOrder("asc");
    }
  };

  // Export data to Excel
  const handleExportToExcel = () => {
    if (filteredStudents.length === 0) {
      alert("No data to export!");
      return;
    }

    // Format data for export based on whether date is selected or not
    const exportData = filteredStudents.map(item => {
      const student = selectedDate ? item : item.student;
      const attendanceInfo = selectedDate ? "Present" : item.studentAttendanc;
      
      return {
        'Student ID': student?.studentID || (student?._id ? student._id.substring(0, 8) : ''),
        'Name': student?.name || '',
        'Email': student?.email || '',
        'Department': student?.department || '',
        'Level': student?.level || '',
        'Course': selectedCourse?.courseName || '',
        [selectedDate ? 'Status' : 'Attendance']: attendanceInfo
      };
    });

    // Convert JSON to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    // Write the file and trigger download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Save the file with formatted date if date is selected
    const fileName = selectedDate 
      ? `${selectedCourse.courseName}_Students_${formatDate(selectedDate)}.xlsx`
      : `${selectedCourse.courseName}_Students.xlsx`;
    
    saveAs(data, fileName);
  };

  return {
    selectedCourse,
    sessionId,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    filterDepartment,
    setFilterDepartment,
    sortBy,
    sortOrder,
    selectedDate,
    formattedSessionDates,
    filteredStudents,
    departments,
    toggleSortOrder,
    changeSortBy,
    handleDateChange,
    handleExportToExcel,
    refetchStudents,
    formatDate,
    hasActiveSession: !!sessionId
  };
};

export default useStudentsPage; 