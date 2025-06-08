import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import {
  useGetAllApologiesQuery,
  useUpdateApologyStatusMutation,
  useGetInstructorApologiesQuery,
} from "../store/features/apologyApiSlice";

export default function useApologies(props = {}) {
  // Get user role from Redux store - check both possible structures in the auth state
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role || 'admin'; // Default to admin if user role not found
  
  // Allow overriding the role from props (for doctor/instructor pages)
  const role = props.role || userRole;

  console.log("Current role:", role); // For debugging
  
  // State for filters
  const [statusFilter, setStatusFilter] = useState(props.initialStatusFilter || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState(props.initialCourseFilter || "all");

  // State for modal
  const [selectedApology, setSelectedApology] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateReason, setUpdateReason] = useState("");

  // RTK Query hooks
  const {
    data: allApologiesData,
    isLoading: isLoadingAdmin,
    isError: isErrorAdmin,
    error: adminError,
    refetch: refetchAdmin,
  } = useGetAllApologiesQuery(undefined, {
    skip: role !== "admin",
  });
  
  const {
    data: instructorApologiesData,
    isLoading: isLoadingInstructor,
    isError: isErrorInstructor,
    error: instructorError,
    refetch: refetchInstructor,
  } = useGetInstructorApologiesQuery(undefined, {
    skip: role !== "doctor" && role !== "instructor",
  });

  // Log API response data for debugging
  useEffect(() => {
    console.log("Admin apologies data:", allApologiesData);
    console.log("Instructor apologies data:", instructorApologiesData);
  }, [allApologiesData, instructorApologiesData]);

  const [updateApologyStatusMutation, { isLoading: isUpdating }] = useUpdateApologyStatusMutation();

  // Memoize data to prevent re-renders
  const apologiesData = useMemo(() => {
    if (role === 'admin' && allApologiesData) return allApologiesData;
    if ((role === 'doctor' || role === 'instructor') && instructorApologiesData) return instructorApologiesData;
    return [];
  }, [role, allApologiesData, instructorApologiesData]);

  const [filteredApologies, setFilteredApologies] = useState([]);
  
  // Filtering logic
  useEffect(() => {
    if (!apologiesData || !Array.isArray(apologiesData)) {
      setFilteredApologies([]);
      return;
    }

    let apologies = [...apologiesData];

    if (statusFilter !== "all") {
      apologies = apologies.filter((a) => a.status === statusFilter);
    }

    if (role === "admin" && departmentFilter !== "all") {
      apologies = apologies.filter((a) => a.student?.department === departmentFilter);
    }
    
    if ((role === "doctor" || role === "instructor") && courseFilter !== "all") {
       apologies = apologies.filter(a => a.course?.courseName === courseFilter);
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      apologies = apologies.filter(
        (a) =>
          (a.student?.name?.toLowerCase().includes(lowercasedQuery)) ||
          (a.student?.email?.toLowerCase().includes(lowercasedQuery)) ||
          (a.course?.courseName?.toLowerCase().includes(lowercasedQuery))
      );
    }

    console.log("Filtered apologies:", apologies.length);
    setFilteredApologies(apologies);
  }, [apologiesData, statusFilter, searchQuery, departmentFilter, courseFilter, role]);

  // Modal handlers wrapped in useCallback
  const handleViewDetails = useCallback((apology) => {
    setSelectedApology(apology);
    setUpdateReason(apology.reason || "");
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedApology(null);
    setUpdateReason("");
  }, []);

  const refetch = useCallback(() => {
    if (role === 'admin') {
      console.log("Refetching admin apologies");
      return refetchAdmin();
    }
    if (role === 'doctor' || role === 'instructor') {
      console.log("Refetching instructor apologies");
      return refetchInstructor();
    }
    return null;
  }, [role, refetchAdmin, refetchInstructor]);

  // Update handler
  const handleUpdateStatus = useCallback(async (status) => {
    if (!selectedApology || isUpdating) return;

    try {
        console.log("Updating apology status:", status);
        await updateApologyStatusMutation({
            id: selectedApology._id,
            status,
            reason: updateReason,
        }).unwrap();
        
        refetch();
        handleCloseModal();
    } catch(err) {
        console.error("Failed to update status: ", err);
    }
  }, [selectedApology, isUpdating, updateReason, updateApologyStatusMutation, refetch, handleCloseModal]);

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "accepted": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "rejected": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return "FaClock";
      case "accepted": return "FaCheckCircle";
      case "rejected": return "FaTimesCircle";
      default: return null;
    }
  };

  const formatDate = (dateString, formatStr = "PP 'at' p") => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), formatStr);
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getFullImageUrl = (imagePath) => {
    // If no image path was provided
    if (!imagePath) return "/images/no-image.jpg";
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith("http")) return imagePath;
    
    // If it starts with a slash, append to base URL
    if (imagePath.startsWith("/")) {
      return `https://attendance-eslamrazeen-eslam-razeens-projects.vercel.app${imagePath}`;
    }
    
    // Otherwise, assume it's a relative path
    return `https://attendance-eslamrazeen-eslam-razeens-projects.vercel.app/${imagePath.replace(/\\/g, "/")}`;
  };

  // Constants for UI
  const statuses = ["all", "pending", "accepted", "rejected"];
  const departments = ["all", "CS", "IS", "AI", "BIO"];
  
  const coursesForDropdown = useMemo(() => {
    if ((role !== 'doctor' && role !== 'instructor') || !instructorApologiesData) return ['all'];
    const courseNames = instructorApologiesData.map(a => a.course?.courseName).filter(Boolean);
    return ['all', ...new Set(courseNames)];
  }, [role, instructorApologiesData]);

  const isLoading = useMemo(() => {
    if (role === 'admin') return isLoadingAdmin;
    if (role === 'doctor' || role === 'instructor') return isLoadingInstructor;
    return false;
  }, [role, isLoadingAdmin, isLoadingInstructor]);
  
  const error = useMemo(() => {
    if (role === 'admin') return adminError;
    if (role === 'doctor' || role === 'instructor') return instructorError;
    return null;
  }, [role, adminError, instructorError]);

  const totalApologies = useMemo(() => {
    return apologiesData?.length || 0;
  }, [apologiesData]);

  return {
    filteredApologies,
    totalApologies,
    selectedApology,
    showModal,
    updateReason,
    statusFilter,
    searchQuery,
    departmentFilter,
    courseFilter,
    loading: isLoading,
    isUpdating,
    error,
    setUpdateReason,
    setStatusFilter,
    setSearchQuery,
    setDepartmentFilter,
    setCourseFilter,
    handleViewDetails,
    handleCloseModal,
    handleUpdateStatus,
    refetch,
    getStatusColor,
    getStatusIcon,
    formatDate,
    getFullImageUrl,
    statuses,
    departments,
    coursesForDropdown,
  };
} 