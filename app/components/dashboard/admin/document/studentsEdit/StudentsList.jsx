import React from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaEye, FaPlus } from 'react-icons/fa';

const StudentsList = ({ 
  filteredStudents, 
  handleEdit, 
  handleViewDetails, 
  isLoading, 
  selectedLevel,
  selectedDepartment,
  router
}) => {
  // Show loading state
  if (isLoading && !filteredStudents.length) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show empty state when no students found
  if (selectedLevel && selectedDepartment && filteredStudents.length === 0) {
    return (
      <div className="bg-[#1a1f2e] rounded-xl border border-[#2a2f3e] p-10 mt-6 text-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-blue-900/20 flex items-center justify-center mb-4">
            <FaPlus className="text-blue-400 text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Students Found</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            No students found for the selected level and department. Try different filters or upload student data.
          </p>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => router.push('/dashboard/admin/document/upload')}
          >
            Upload Students
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {filteredStudents.length > 0 && (
        <div className="bg-[#1a1f2e] rounded-xl overflow-hidden border border-[#2a2f3e] shadow-xl">
          <div className="p-4 bg-[#232738] border-b border-[#2a2f3e] flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">
              Students
              <span className="ml-2 text-sm text-gray-400">({filteredStudents.length})</span>
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#2a2f3e]">
              <thead className="bg-[#1a1f2e]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Level & Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Courses
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#1a1f2e] divide-y divide-[#2a2f3e]">
                {filteredStudents.map((student, index) => (
                  <motion.tr 
                    key={student._id || `student-list-item-${index}`} 
                    className="hover:bg-[#232738] transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-white">{student.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{student.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900/30 text-blue-300 mb-1">
                          Level {student.level}
                        </span>
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-900/30 text-purple-300">
                          {student.department}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {student.courses?.length || 0} courses
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(student)}
                          className="text-blue-400 hover:text-blue-300 bg-[#232738] hover:bg-[#2a2f3e] transition-colors p-2 rounded-lg"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(index)}
                          className="text-yellow-400 hover:text-yellow-300 bg-[#232738] hover:bg-[#2a2f3e] transition-colors p-2 rounded-lg"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsList; 