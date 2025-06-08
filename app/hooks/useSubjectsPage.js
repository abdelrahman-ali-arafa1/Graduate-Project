import { useState, useMemo } from "react";
import { useGetCoursesQuery } from "@/app/store/features/coursesApiSlice";
import { setSelectedCourse } from "@/app/store/slices/selectedCourseSlice";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export const useSubjectsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  
  // Fetch courses data
  const { data, error, isLoading } = useGetCoursesQuery();
  const allCourses = data?.data || [];
  
  // Get instructor courses from Redux
  const instructorCourses = useSelector((state) => state.userRole.instructorCourses);
  
  // Filter state
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  
  // Filter options
  const levels = ["1", "2", "3", "4"];
  const departments = ["CS", "IS", "AI", "BIO"];
  const semesters = ["1", "2"];
  
  // Helper function to categorize semesters (1,3,5,7 -> 1, 2,4,6,8 -> 2)
  const getSemesterCategory = (semesterNumber) => {
    const semNum = parseInt(semesterNumber, 10);
    return semNum % 2 === 1 ? "1" : "2";
  };
  
  // Get instructor course IDs
  const instructorCoursesIds = useMemo(() => {
    return instructorCourses.map(course => course._id);
  }, [instructorCourses]);
  
  // Filter courses to only show those assigned to the instructor
  const FetchedCourses = useMemo(() => {
    console.log("Instructor courses from Redux:", instructorCourses);
    console.log("All courses from API:", allCourses);
    
    if (instructorCoursesIds.length === 0) {
      console.log("No instructor courses found in Redux, using all courses");
      // If no instructor courses are stored, use all courses (for compatibility with old system)
      return allCourses;
    }
    
    // Filter courses by instructor course IDs
    const filteredCourses = allCourses.filter(course => instructorCoursesIds.includes(course._id));
    console.log("Filtered courses for instructor:", filteredCourses);
    return filteredCourses;
  }, [allCourses, instructorCoursesIds, instructorCourses]);
  
  // Apply filters (department, level, semester)
  const filteredCourses = useMemo(() => {
    return FetchedCourses.filter(
      (course) =>
        (!selectedDepartment || course.department === selectedDepartment) &&
        (!selectedLevel || course.level === selectedLevel) &&
        (!selectedSemester || getSemesterCategory(course.semester) === selectedSemester)
    );
  }, [FetchedCourses, selectedDepartment, selectedLevel, selectedSemester]);
  
  // Handle course selection
  const handleCourseSelect = (course) => {
    dispatch(setSelectedCourse(course));
    
    // Check if we're coming from a specific page using URL query parameter
    const searchParams = new URLSearchParams(window.location.search);
    const fromPage = searchParams.get('from');
    
    // Redirect to the appropriate page based on where the user came from
    if (fromPage === 'students') {
      router.push("/dashboard/doctor/students");
    } else {
      router.push("/dashboard/doctor/takeAttendance");
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedDepartment("");
    setSelectedLevel("");
    setSelectedSemester("");
  };
  
  return {
    filteredCourses,
    instructorCoursesIds,
    selectedDepartment,
    setSelectedDepartment,
    selectedLevel,
    setSelectedLevel,
    selectedSemester,
    setSelectedSemester,
    levels,
    departments,
    semesters,
    getSemesterCategory,
    handleCourseSelect,
    clearFilters,
    isLoading,
    error
  };
};

export default useSubjectsPage; 