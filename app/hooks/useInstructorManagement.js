import { useState, useMemo, useEffect, useCallback } from 'react';
import { useGetAllUsersQuery, useDeleteStaffUserMutation } from '@/app/store/features/usersApiSlice';

export const useInstructorManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [roleFilter, setRoleFilter] = useState("");

  // Use RTK Query to fetch users
  const { data: usersData, error: fetchError, isLoading, refetch } = useGetAllUsersQuery();
  const [deleteStaffUser, { isLoading: isDeleting }] = useDeleteStaffUserMutation();
  
  // Extract lecturer users from the data
  const lecturers = useMemo(() => {
    return usersData?.data?.filter(user => user.role === 'lecturer') || [];
  }, [usersData?.data]);

  // Get unique roles for filter dropdown
  const uniqueRoles = useMemo(() => {
    const roles = new Set();
    lecturers.forEach(lecturer => {
      if (lecturer.lecturerRole) {
        roles.add(lecturer.lecturerRole);
      }
    });
    return Array.from(roles);
  }, [lecturers]);

  // Sorting logic
  const requestSort = useCallback((key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  // Filtering and sorting
  const filteredLecturers = useMemo(() => {
    return lecturers.filter(lecturer => {
      const matchesSearch = 
        lecturer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecturer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lecturer.lecturerRole && lecturer.lecturerRole.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lecturer.lecturerDepartment && lecturer.lecturerDepartment.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRole = !roleFilter || lecturer.lecturerRole === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [lecturers, searchTerm, roleFilter]);

  const sortedLecturers = useMemo(() => {
    return [...filteredLecturers].sort((a, b) => {
      if (sortConfig.key === 'name') {
        return sortConfig.direction === 'asc' 
          ? (a.name || '').localeCompare(b.name || '')
          : (b.name || '').localeCompare(a.name || '');
      } else if (sortConfig.key === 'email') {
        return sortConfig.direction === 'asc'
          ? (a.email || '').localeCompare(b.email || '')
          : (b.email || '').localeCompare(a.email || '');
      } else if (sortConfig.key === 'role') {
        const roleA = a.lecturerRole || '';
        const roleB = b.lecturerRole || '';
        return sortConfig.direction === 'asc'
          ? roleA.localeCompare(roleB)
          : roleB.localeCompare(roleA);
      } else if (sortConfig.key === 'department') {
        const deptA = a.lecturerDepartment || '';
        const deptB = b.lecturerDepartment || '';
        return sortConfig.direction === 'asc'
          ? deptA.localeCompare(deptB)
          : deptB.localeCompare(roleA);
      } else if (sortConfig.key === 'courses') {
        return sortConfig.direction === 'asc'
          ? (a.lecturerCourses?.length || 0) - (b.lecturerCourses?.length || 0)
          : (b.lecturerCourses?.length || 0) - (a.lecturerCourses?.length || 0);
      }
      return 0;
    });
  }, [filteredLecturers, sortConfig]);

  // Delete instructor
  const deleteInstructor = async (instructorId) => {
    try {
      await deleteStaffUser(instructorId).unwrap();
      refetch(); // Refresh the data after deletion
      return { success: true };
    } catch (error) {
      console.error('Failed to delete instructor:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to delete instructor' 
      };
    }
  };

  // Find instructor by ID
  const getInstructorById = (instructorId) => {
    return lecturers.find(instructor => instructor._id === instructorId);
  };

  return {
    // Data
    lecturers,
    filteredLecturers,
    sortedLecturers,
    uniqueRoles,
    
    // Status
    isLoading,
    isDeleting,
    fetchError,
    
    // Actions
    setSearchTerm,
    setRoleFilter,
    requestSort,
    deleteInstructor,
    getInstructorById,
    
    // State
    searchTerm,
    sortConfig,
    roleFilter
  };
}; 