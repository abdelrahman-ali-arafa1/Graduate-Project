import { useState, useEffect, useCallback } from 'react';
import { useGetGradeLevelDataQuery, useUpdateStudentGradeMutation } from '@/app/store/features/dashboardApiSlice';
import { LEVELS, DEPARTMENTS } from '@/app/hooks/constants';

export const useGradeManagement = () => {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [displayedStudents, setDisplayedStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [status, setStatus] = useState("");
  const [upgrading, setUpgrading] = useState(false);
  const [allStudents, setAllStudents] = useState([]); // Save all students data
  const [alphaFilter, setAlphaFilter] = useState(""); // فلتر أبجدي

  // RTK Query hooks
  const { 
    data: studentsData, 
    isLoading, 
    isFetching,
    isError,
    refetch
  } = useGetGradeLevelDataQuery(
    { level: selectedLevel, department: null }, // Get all students for this level without department filter
    { 
      skip: !selectedLevel,
      refetchOnMountOrArgChange: true
    }
  );
  
  const [updateStudentGrade, { isLoading: isUpdating }] = useUpdateStudentGradeMutation();

  // Effect to refresh data when level or departments change
  useEffect(() => {
    if (selectedLevel) {
      refetch();
    }
  }, [selectedLevel, refetch]);

  // Store all students data
  useEffect(() => {
    if (studentsData && studentsData.data) {
      console.log("Raw student data received:", studentsData.data.length, "students");
      setAllStudents(studentsData.data);
    }
  }, [studentsData]);

  // Filter students based on selected level and departments
  useEffect(() => {
    if (!allStudents.length) {
      setFilteredStudents([]);
      setDisplayedStudents([]);
      setSelectedStudents([]);
      setSelectAll(false);
      return;
    }
    let filtered = allStudents.filter(student => student.level === selectedLevel);
    if (selectedDepartments.length > 0) {
      filtered = filtered.filter(student => selectedDepartments.includes(student.department?.toUpperCase()));
    }
    // فلترة أبجدية
    if (alphaFilter) {
      filtered = filtered.filter(student => (student.name || "").toUpperCase().startsWith(alphaFilter));
    }
    setFilteredStudents(filtered);
    setDisplayedStudents(filtered);
    setSelectedStudents(filtered.map(student => student._id));
    setSelectAll(true);
  }, [allStudents, selectedLevel, selectedDepartments, alphaFilter]);

  // Filter students based on search query
  useEffect(() => {
    if (!filteredStudents.length) return;
    if (!searchQuery.trim()) {
      setDisplayedStudents(filteredStudents);
      // إذا كان selectAll مفعل، حدد كل الطلاب الظاهرين
      if (selectAll) setSelectedStudents(filteredStudents.map(s => s._id));
      return;
    }
    const query = searchQuery.toLowerCase().trim();
    const results = filteredStudents.filter(student => 
      (student.name?.toLowerCase().includes(query)) ||
      (student.email?.toLowerCase().includes(query)) ||
      (student._id?.toLowerCase().includes(query))
    );
    setDisplayedStudents(results);
    // إذا كان selectAll مفعل، حدد كل الطلاب الظاهرين
    if (selectAll) setSelectedStudents(results.map(s => s._id));
  }, [searchQuery, filteredStudents, selectAll]);

  // Handle selecting all students
  useEffect(() => {
    if (selectAll) {
      setSelectedStudents(displayedStudents.map(student => student._id));
    } else {
      setSelectedStudents([]);
    }
  }, [selectAll, displayedStudents]);

  // Toggle student selection
  const toggleStudentSelection = useCallback((studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  }, []);

  // Toggle select all
  const toggleSelectAll = useCallback(() => {
    setSelectAll(prev => !prev);
  }, []);

  // Toggle department selection
  const toggleDepartment = useCallback((dept) => {
    setSelectedDepartments(prev => {
      if (prev.includes(dept)) {
        return prev.filter(d => d !== dept);
      } else {
        return [...prev, dept];
      }
    });
    setSelectedStudents([]);
    setSelectAll(false);
  }, []);

  // Handle select level with cleanup
  const handleSelectLevel = useCallback((level) => {
    setSelectedLevel(level);
    setSelectedStudents([]);
    setSelectAll(false);
  }, []);

  // Calculate next level
  const getNextLevel = useCallback((currentLevel) => {
    const current = parseInt(currentLevel, 10);
    if (isNaN(current) || current >= 4) return "Graduate";
    return (current + 1).toString();
  }, []);

  // Handle upgrade students
  const handleUpgradeStudents = useCallback(async () => {
    if (displayedStudents.length === 0) {
      setStatus("No students available to upgrade.");
      return;
    }

    // Get IDs of students to upgrade (selected ones)
    if (selectedStudents.length === 0) {
      setStatus("Please select at least one student to upgrade.");
      return;
    }

    const nextLevel = getNextLevel(selectedLevel);
    if (nextLevel === "Graduate") {
      const confirmGraduate = window.confirm(
        "These students will be marked as graduates. This is typically a different process. Do you want to continue?"
      );
      if (!confirmGraduate) return;
    }
    
    setUpgrading(true);
    setStatus("");

    try {
      const result = await updateStudentGrade({
        studentIds: selectedStudents,
        level: selectedLevel,
        newLevel: nextLevel
      }).unwrap();
      
      setStatus(`Successfully upgraded ${selectedStudents.length} students to level ${nextLevel}`);
      
      // Remove upgraded students from all lists
      const updatedAllStudents = allStudents.filter(student => 
        !selectedStudents.includes(student._id)
      );
      setAllStudents(updatedAllStudents);
      
      setFilteredStudents(prev => 
        prev.filter(student => !selectedStudents.includes(student._id))
      );
      setDisplayedStudents(prev => 
        prev.filter(student => !selectedStudents.includes(student._id))
      );
      
      // Clear selections
      setSelectedStudents([]);
      setSelectAll(false);
      
      // Refresh data after upgrade
      setTimeout(() => {
        refetch();
      }, 1000);
    } catch (error) {
      console.error("Error upgrading students:", error);
      setStatus(error.message || "Failed to upgrade students. Please try again.");
    } finally {
      setUpgrading(false);
    }
  }, [displayedStudents, selectedStudents, selectedLevel, getNextLevel, updateStudentGrade, refetch, allStudents]);

  // Clear search and filters
  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setDisplayedStudents(filteredStudents);
  }, [filteredStudents]);

  // إعادة ضبط الفلتر الأبجدي عند تغيير الفلاتر أو البحث
  useEffect(() => {
    setAlphaFilter("");
  }, [selectedLevel, selectedDepartments, searchQuery]);

  return {
    // State
    selectedLevel,
    selectedDepartments,
    selectedStudents,
    filteredStudents: displayedStudents, // Return displayed students instead of filtered
    searchQuery,
    selectAll,
    status,
    
    // Loading states
    loading: isLoading || isFetching,
    upgrading: isUpdating || upgrading,
    hasError: isError,
    
    // Actions
    setSelectedLevel: handleSelectLevel,
    setSearchQuery,
    toggleDepartment,
    toggleStudentSelection,
    toggleSelectAll,
    handleUpgradeStudents,
    handleClearFilters,
    
    // Utilities
    getNextLevel,
    
    // Constants
    levels: LEVELS,
    departments: DEPARTMENTS,
    setAlphaFilter, // دالة لتغيير الفلتر الأبجدي
    alphaFilter, // قيمة الفلتر الأبجدي الحالية
  };
}; 