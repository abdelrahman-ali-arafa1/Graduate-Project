import { useState, useEffect, useCallback } from 'react';
import { useGetDoctorDashboardDataMutation } from '@/app/store/features/dashboardApiSlice';
import { useSelector } from 'react-redux';

// استخدام متغير خارج الـ hook للاحتفاظ بالبيانات بين عمليات التنقل
let cachedDashboardData = null;

export const useDashboardDoctor = (initialTimeRange = "this week") => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(initialTimeRange);
  const [dashboardData, setDashboardData] = useState(cachedDashboardData);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Get instructor courses from Redux
  const instructorCourses = useSelector((state) => state.userRole.instructorCourses);

  // RTK Query mutation for fetching dashboard data
  const [getDoctorDashboardData, { 
    isLoading, 
    isError, 
    error 
  }] = useGetDoctorDashboardDataMutation();

  // تحديد عندما يتم تحميل المكون
  useEffect(() => {
    setMounted(true);
    
    // محاولة استعادة البيانات من ذاكرة التخزين المؤقت
    if (!dashboardData && cachedDashboardData) {
      setDashboardData(cachedDashboardData);
    }
    
    return () => {
      setMounted(false);
    };
  }, []);

  // Get filtered instructor courses
  const getFilteredCourses = useCallback((coursesData) => {
    if (!coursesData || !coursesData.data) {
      console.log("No courses data available");
      return [];
    }
    
    // Get instructor course IDs
    const instructorCourseIds = instructorCourses.map(course => course._id);
    
    // If no instructor courses are set, return all courses
    if (instructorCourseIds.length === 0) {
      console.log("No instructor courses found, using all courses");
      return coursesData.data;
    }
    
    // Filter courses to only include instructor's courses
    const filtered = coursesData.data.filter(course => instructorCourseIds.includes(course._id));
    console.log("Filtered courses for instructor:", filtered);
    return filtered;
  }, [instructorCourses]);

  // Set initial selected course
  const initializeSelectedCourse = useCallback((filteredCourses) => {
    if (filteredCourses.length > 0 && !selectedCourse) {
      console.log("Setting initial course:", filteredCourses[0]);
      setSelectedCourse(filteredCourses[0]);
    }
  }, [selectedCourse]);

  // Fetch data from API
  const fetchDashboardData = useCallback(async () => {
    if (!selectedCourse || !selectedCourse._id) {
      console.log("No course selected or course ID missing");
      return;
    }
    
    console.log("Fetching dashboard data for course:", selectedCourse.courseName, "ID:", selectedCourse._id);
    
    try {
      const response = await getDoctorDashboardData({
        courseId: selectedCourse._id,
        range: selectedTimeRange
      }).unwrap();
      
      console.log("Dashboard data received:", response);

      // Process the data before storing it
      const processedData = processResponseData(response);
      
      // Cache the processed data
      cachedDashboardData = processedData;
      setDashboardData(processedData);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  }, [selectedCourse, selectedTimeRange, getDoctorDashboardData]);

  // Process API response data
  const processResponseData = (response) => {
    if (!response) return null;
    
    try {
      let processedResponse = { ...response };
      
      // Check if it's weekly data (has days array)
      if (response.days && Array.isArray(response.days)) {
        processedResponse.type = 'week';
        processedResponse.days = response.days.map(day => ({
          ...day,
          // Convert string percentage to number if it's a string
          attendanceRate: typeof day.attendanceRate === 'string' 
            ? parseInt(day.attendanceRate.replace('%', '')) || 0 
            : day.attendanceRate || 0,
          // Ensure present and absent are numbers
          present: parseInt(day.present) || 0,
          absent: parseInt(day.absent) || 0
        }));
      } 
      // Check if it's monthly data (has weeks array)
      else if (response.weeks && Array.isArray(response.weeks)) {
        processedResponse.type = 'month';
        processedResponse.weeks = response.weeks.map(week => ({
          ...week,
          // Convert string percentage to number if it's a string
          attendanceRate: typeof week.attendanceRate === 'string' 
            ? parseInt(week.attendanceRate.replace('%', '')) || 0 
            : week.attendanceRate || 0,
          // Ensure present and absent are numbers
          present: parseInt(week.present) || 0,
          absent: parseInt(week.absent) || 0
        }));
      }

      return processedResponse;
    } catch (err) {
      console.error("Error processing dashboard data:", err);
      return response; // Return original response if processing fails
    }
  };

  // Effect to fetch data when course or time range changes
  useEffect(() => {
    if (selectedCourse && mounted) {
      fetchDashboardData();
    }
  }, [selectedCourse, selectedTimeRange, fetchDashboardData, mounted]);

  // Toggle dropdown
  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  // Handle course select
  const handleCourseSelect = useCallback((course) => {
    setSelectedCourse(course);
    setIsDropdownOpen(false);
  }, []);

  // Calculate summary statistics
  const calculateSummary = useCallback(() => {
    if (!dashboardData) return null;
    
    let totalPresent = 0;
    let totalAbsent = 0;
    let items = [];
    
    // Determine if we're using days or weeks based on response structure and selected time range
    if ((selectedTimeRange === "this week" && dashboardData.days) || 
        (dashboardData.type === 'week' && dashboardData.days)) {
      items = dashboardData.days;
    } else if ((selectedTimeRange === "this month" && dashboardData.weeks) || 
               (dashboardData.type === 'month' && dashboardData.weeks)) {
      items = dashboardData.weeks;
    }

    console.log("Items for calculations:", items);
    
    if (!items || items.length === 0) {
      console.warn("No items found for calculations");
      return {
        totalPresent: 0,
        totalAbsent: 0,
        attendanceRate: 0,
        avgAttendanceRate: 0
      };
    }
    
    // Calculate totals
    items.forEach(item => {
      totalPresent += parseInt(item.present) || 0;
      totalAbsent += parseInt(item.absent) || 0;
    });
    
    // Calculate overall attendance rate
    const total = totalPresent + totalAbsent;
    const attendanceRate = total > 0 ? Math.round((totalPresent / total) * 100) : 0;
    
    // Calculate average attendance rate
    const avgAttendanceRate = items.length > 0 
      ? Math.round(items.reduce((sum, item) => {
          // Handle attendance rate that might be a string with '%'
          const rate = typeof item.attendanceRate === 'string' 
            ? parseInt(item.attendanceRate.replace('%', '')) || 0
            : item.attendanceRate || 0;
          return sum + rate;
        }, 0) / items.length)
      : 0;
    
    return {
      totalPresent,
      totalAbsent,
      attendanceRate,
      avgAttendanceRate
    };
  }, [dashboardData, selectedTimeRange]);

  // Prepare pie chart data
  const preparePieChartData = useCallback(() => {
    const summary = calculateSummary();
    if (!summary) return [];
    
    return [
      {
        name: "Present",
        value: summary.totalPresent,
        color: "#4ade80"
      },
      {
        name: "Absent",
        value: summary.totalAbsent,
        color: "#f87171"
      }
    ];
  }, [calculateSummary]);

  // Prepare line chart data
  const prepareLineChartData = useCallback(() => {
    if (!dashboardData) return [];
    
    let chartData = [];
    
    if ((selectedTimeRange === "this week" && dashboardData.days) || 
        (dashboardData.type === 'week' && dashboardData.days)) {
      // For weekly data, format the days data
      chartData = dashboardData.days.map(day => ({
        ...day,
        // Ensure attendance rate is a number
        attendanceRate: typeof day.attendanceRate === 'string' 
          ? parseInt(day.attendanceRate.replace('%', '')) || 0
          : day.attendanceRate || 0,
        // Ensure present and absent are numbers
        present: parseInt(day.present) || 0,
        absent: parseInt(day.absent) || 0
      }));
    } else if ((selectedTimeRange === "this month" && dashboardData.weeks) || 
               (dashboardData.type === 'month' && dashboardData.weeks)) {
      // For monthly data, format the weeks data
      chartData = dashboardData.weeks.map(week => ({
        ...week,
        // Use week identifier as the label
        day: week.week || `${week.from} - ${week.to}`,
        // Ensure attendance rate is a number
        attendanceRate: typeof week.attendanceRate === 'string' 
          ? parseInt(week.attendanceRate.replace('%', '')) || 0
          : week.attendanceRate || 0,
        // Ensure present and absent are numbers
        present: parseInt(week.present) || 0,
        absent: parseInt(week.absent) || 0
      }));
    }
    
    console.log("Prepared line chart data:", chartData);
    return chartData;
  }, [dashboardData, selectedTimeRange]);

  // For refreshing the page manually
  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  return {
    selectedCourse,
    setSelectedCourse,
    selectedTimeRange,
    setSelectedTimeRange,
    isDropdownOpen,
    dashboardData,
    loading: isLoading,
    error: isError ? error?.message || 'Failed to load dashboard data' : null,
    toggleDropdown,
    handleCourseSelect,
    handleRefresh,
    calculateSummary,
    preparePieChartData,
    prepareLineChartData,
    getFilteredCourses,
    initializeSelectedCourse
  };
}; 