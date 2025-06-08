import React from "react";
import { motion } from "framer-motion";
import { 
  FaSearch, 
  FaFilter, 
  FaSort, 
  FaCalendarAlt, 
  FaDownload 
} from "react-icons/fa";

const SearchFilters = ({
  searchTerm,
  setSearchTerm,
  filterDepartment,
  setFilterDepartment,
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
  selectedDate,
  handleDateChange,
  handleExportToExcel,
  formattedSessionDates,
  departments,
  studentsCount
}) => {
  return (
    <motion.div
      className="bg-[var(--secondary)] rounded-xl p-4 sm:p-5 shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="flex flex-wrap items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-[var(--foreground-secondary)]">
          {studentsCount} student{studentsCount !== 1 ? 's' : ''} found
        </h3>
        <button
          onClick={handleExportToExcel}
          className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 transition-colors"
          disabled={studentsCount === 0}
        >
          <FaDownload className="text-xs" />
          <span>Export to Excel</span>
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-[var(--foreground-secondary)] text-sm" />
          </div>
          <input
            type="text"
            className="w-full py-2 pl-10 pr-4 text-sm bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Department filter */}
        <div className="md:w-1/4 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaFilter className="text-[var(--foreground-secondary)] text-sm" />
          </div>
          <select
            className="w-full py-2 pl-10 pr-4 text-sm bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent appearance-none"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dept, index) => (
              <option key={dept || `dept-${index}`} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Date filter */}
        {formattedSessionDates.length > 0 && (
          <div className="relative md:w-1/4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaCalendarAlt className="text-[var(--foreground-secondary)] text-sm" />
            </div>
            <select
              value={selectedDate || ""} // Use empty string for "All Dates" option
              onChange={handleDateChange}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-[var(--background-secondary)] text-[var(--foreground)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-sm appearance-none"
            >
              <option value="">All Dates</option>
              {formattedSessionDates.map((session, index) => (
                <option key={session.originalDate || `date-${index}`} value={session.originalDate}>
                  {session.formattedDate}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--foreground-secondary)]">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        )}

        {/* Sort */}
        <div className="md:w-1/4 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSort className="text-[var(--foreground-secondary)] text-sm" />
          </div>
          <select
            className="w-full py-2 pl-10 pr-4 text-sm bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent appearance-none"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split("-");
              setSortBy(newSortBy);
              setSortOrder(newSortOrder);
            }}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="department-asc">Department (A-Z)</option>
            <option value="department-desc">Department (Z-A)</option>
            <option value="attendance-desc">Attendance (Highest First)</option>
            <option value="attendance-asc">Attendance (Lowest First)</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchFilters; 