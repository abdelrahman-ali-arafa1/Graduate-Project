import React from "react";
import { motion } from "framer-motion";

const StudentsTable = ({ 
  filteredStudents,
  selectedCourse,
  selectedDate,
  sortBy,
  changeSortBy,
  sortOrder,
}) => {
  return (
    <motion.div
      className="bg-[var(--secondary)] rounded-xl shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {filteredStudents.length > 0 ? (
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[var(--primary)] scrollbar-track-transparent">
          <table className="min-w-full divide-y divide-[var(--border-color)]">
            <thead className="bg-[var(--background-secondary)]">
              <tr>
                <th
                  scope="col"
                  className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[var(--foreground-secondary)] uppercase tracking-wider cursor-pointer"
                  onClick={() => changeSortBy("name")}
                >
                  <div className="flex items-center">
                    <span>Name</span>
                    {sortBy === "name" && (
                      <span className="ml-1 sm:ml-2">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                {/* Hide Email column when filtering by date */}
                {!selectedDate && (
                  <th
                    scope="col"
                    className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[var(--foreground-secondary)] uppercase tracking-wider hidden md:table-cell"
                  >
                    Email
                  </th>
                )}
                <th
                  scope="col"
                  className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[var(--foreground-secondary)] uppercase tracking-wider cursor-pointer hidden sm:table-cell"
                  onClick={() => changeSortBy("department")}
                >
                  <div className="flex items-center">
                    <span>Dept</span>
                    {sortBy === "department" && (
                      <span className="ml-1 sm:ml-2">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[var(--foreground-secondary)] uppercase tracking-wider hidden sm:table-cell"
                >
                  Level
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[var(--foreground-secondary)] uppercase tracking-wider"
                >
                  Course
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[var(--foreground-secondary)] uppercase tracking-wider cursor-pointer"
                    onClick={() => !selectedDate && changeSortBy("attendance")} // Only allow sorting by attendance if no date is selected
                >
                  <div className="flex items-center">
                    <span>{selectedDate ? "Status" : "Att."}</span>
                      {sortBy === "attendance" && !selectedDate && (
                      <span className="ml-1 sm:ml-2">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--secondary)] divide-y divide-[var(--border-color)]">
              {filteredStudents.map((item, index) => {
                  // Consistently get the student object
                  const student = selectedDate ? item : item.student;

                  // Determine attendance info based on whether a date is selected
                  // For date filtered, assume presence if in the list
                  const attendanceInfo = selectedDate ? "Present" : item.studentAttendanc;

                  return (
                    <motion.tr
                      key={student?._id || `student-${index}`} // Use student._id for consistent key with fallback
                      className="hover:bg-[var(--background-secondary)] transition-colors"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-[var(--foreground)]">
                        <div className="flex flex-col sm:hidden">
                          <span>{student?.name}</span>
                          <span className="text-xs text-[var(--foreground-secondary)] mt-0.5">{student?.department}</span>
                        </div>
                        <span className="hidden sm:block">{student?.name}</span>
                      </td>
                      {/* Hide Email cell when filtering by date */}
                      {!selectedDate && (
                        <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-[var(--foreground-secondary)] hidden md:table-cell">
                          {student?.email}
                        </td>
                      )}
                      <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-[var(--foreground-secondary)] hidden sm:table-cell">
                        <span className="px-1.5 sm:px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[var(--background-secondary)] text-[var(--foreground)]">
                          {student?.department}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-[var(--foreground-secondary)] hidden sm:table-cell">
                        {student?.level}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-[var(--foreground-secondary)]">
                        {selectedCourse?.courseName}
                      </td>
                      <td className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm ${selectedDate ? (attendanceInfo === 'Present' ? 'text-green-500' : 'text-red-500') : 'text-[var(--foreground)]'}`}>
                        {attendanceInfo}
                      </td>
                    </motion.tr>
                  );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-6 sm:py-10 text-center text-xs sm:text-sm text-[var(--foreground-secondary)]">
          No student data available
        </div>
      )}
    </motion.div>
  );
};

export default StudentsTable; 