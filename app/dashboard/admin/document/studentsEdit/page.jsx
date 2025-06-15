"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { useStudentManagement } from '@/app/hooks/useStudentManagement';

// Import Components
import PageTitle from '@/app/components/dashboard/admin/document/studentsEdit/PageTitle';
import FiltersCard from '@/app/components/dashboard/admin/document/studentsEdit/FiltersCard';
import SearchBar from '@/app/components/dashboard/admin/document/studentsEdit/SearchBar';
import StudentsList from '@/app/components/dashboard/admin/document/studentsEdit/StudentsList';
import StatusMessage from '@/app/components/dashboard/admin/document/studentsEdit/StatusMessage';

const StudentsEditPage = () => {
  const router = useRouter();
  
  // Use the custom hook for student management
  const {
    selectedLevel,
    selectedDepartment,
    searchQuery,
    filterByCourse,
    showAdvancedFilters,
    editIndex,
    editData,
    status,
    selectedStudent,
    showStudentDetails,
    showAddCourseModal,
    selectedCourseId,
    deleteCourseId,
    isLoading,
    students,
    filteredStudents,
    courses,
    originalStudentData,
    setSelectedLevel,
    setSelectedDepartment,
    setSearchQuery,
    setFilterByCourse,
    setShowAdvancedFilters,
    handleEdit,
    handleViewDetails,
    handleChange,
    handleSave,
    handleDelete,
    handleAddCourse,
    handleRemoveCourse,
    resetFilters,
    setSelectedStudent,
    setShowStudentDetails,
    setShowAddCourseModal,
    setSelectedCourseId,
    setDeleteCourseId,
    setStatus,
    cancelEdit,
    updateLocalStudentCourses,
  } = useStudentManagement();

  const tableContainerRef = useRef(null);

  return (
    <motion.div className="w-full min-h-screen bg-gradient-to-br from-[#181c2a] to-[#232738] py-10 px-2 sm:px-8">
      {/* Status Message */}
      <StatusMessage status={status} />
      
      {/* Header */}
      <PageTitle />
      
      {/* Filters Card */}
      <FiltersCard 
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
      />
      
      {/* Search and Advanced Filter */}
      {(selectedLevel && selectedDepartment) && (
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterByCourse={filterByCourse}
          setFilterByCourse={setFilterByCourse}
          showAdvancedFilters={showAdvancedFilters}
          setShowAdvancedFilters={setShowAdvancedFilters}
          resetFilters={resetFilters}
          courses={courses}
        />
      )}
      
      {/* Students List */}
      <StudentsList 
        filteredStudents={filteredStudents}
        handleEdit={handleEdit}
        handleViewDetails={handleViewDetails}
        isLoading={isLoading}
        selectedLevel={selectedLevel}
        selectedDepartment={selectedDepartment}
        router={router}
      />
      
      {/* Student Edit Modal */}
      {editIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-[#1a1f2e] rounded-xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">Edit Student</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={editData.name || ''}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#232738] border border-[#2a2f3e] rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={editData.email || ''}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#232738] border border-[#2a2f3e] rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Level</label>
                <input 
                  type="text" 
                  name="level"
                  value={editData.level || ''}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#232738] border border-[#2a2f3e] rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Department</label>
                <input 
                  type="text" 
                  name="department"
                  value={editData.department || ''}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#232738] border border-[#2a2f3e] rounded-lg text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">Password (leave empty to keep unchanged)</label>
                <input 
                  type="password" 
                  name="password"
                  value={editData.password || ''}
                  onChange={handleChange}
                  placeholder="New password"
                  className="w-full p-2 bg-[#232738] border border-[#2a2f3e] rounded-lg text-white"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={cancelEdit}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSave(editData._id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Student Details Modal */}
      {showStudentDetails && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-[#1a1f2e] rounded-xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">Student Details</h3>
            
            <div className="bg-[#232738] rounded-xl p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="text-white">{selectedStudent.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{selectedStudent.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Level</p>
                  <p className="text-white">{selectedStudent.level}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Department</p>
                  <p className="text-white">{selectedStudent.department}</p>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-white mb-3">Courses</h4>
            {/* console.log("selectedStudent.courses in modal:", selectedStudent.courses) */}
            {selectedStudent.courses && selectedStudent.courses.length > 0 ? (
              <div className="bg-[#232738] rounded-xl overflow-y-auto custom-scrollbar mb-6" style={{ maxHeight: "300px" }}>
                <table className="min-w-full divide-y divide-[#2a2f3e]">
                  <thead className="bg-[#1a1f2e]">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Course Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Code
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Department
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#232738] divide-y divide-[#2a2f3e]" key={selectedStudent.courses.length}>
                    {selectedStudent.courses.map((course, index) => (
                      <tr key={course._id || `temp-${index}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {course.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {course.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {course.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleRemoveCourse(course._id)}
                            className="text-red-400 hover:text-red-300 bg-[#1a1f2e] hover:bg-red-900/20 p-2 rounded-lg"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-[#232738] rounded-xl p-4 text-center mb-6">
                <p className="text-gray-400">No courses assigned</p>
              </div>
            )}
            
            <div className="flex justify-between">
              <button
                onClick={() => setShowAddCourseModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Course
              </button>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowStudentDetails(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
                <button 
                  onClick={() => handleDelete(selectedStudent._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Add Course Modal */}
      {showAddCourseModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-[#1a1f2e] rounded-xl shadow-xl p-6 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">Add Course</h3>
            
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full p-2 bg-[#232738] border border-[#2a2f3e] rounded-lg text-white mb-6"
            >
              <option value="">Select a course</option>
              {courses
                .filter(course => !selectedStudent.courses?.some(c => c._id === course._id))
                .map((course, index) => (
                  <option key={course._id || `add-course-option-${index}`} value={course._id}>
                    {course.name} ({course.code})
                  </option>
                ))
              }
            </select>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowAddCourseModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddCourse}
                disabled={!selectedCourseId}
                className={`px-4 py-2 rounded-lg ${
                  selectedCourseId 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-blue-900/30 text-blue-300/50 cursor-not-allowed"
                }`}
              >
                Add Course
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default StudentsEditPage; 