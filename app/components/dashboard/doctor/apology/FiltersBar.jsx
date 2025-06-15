import React from "react";
import { motion } from "framer-motion";
import { FaSearch, FaUserGraduate } from "react-icons/fa";

const FiltersBar = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  courseFilter,
  setCourseFilter,
  statuses,
  coursesForDropdown
}) => {
  return (
    <motion.div
      className="bg-[#1a1f2e] p-6 rounded-xl border border-[#2a2f3e] mb-6 flex flex-col md:flex-row gap-4 items-center justify-between"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {/* Search Input */}
      <div className="relative w-full md:w-1/3">
        <input
          type="text"
          placeholder="Search by student or course..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 pl-10 rounded-lg bg-[#2a2f3e] text-white border border-[#3b4152] focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <FaUserGraduate className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        {statuses.map((status, index) => (
          <button
            key={status || `status-filter-${index}`}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors capitalize
              ${statusFilter === status 
                ? 'bg-purple-600 text-white' 
                : 'bg-[#2a2f3e] text-gray-300 hover:bg-purple-500/20'}`}
          >
            {status === 'all' ? 'All' :
             status === 'accepted' ? 'Accepted' :
             status === 'rejected' ? 'Rejected' :
             status === 'pending' ? 'Pending' : status}
          </button>
        ))}
      </div>

      {/* Course Filter */}
      <div className="relative w-full md:w-auto">
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="w-full md:w-48 p-2 pl-4 pr-10 rounded-lg bg-[#2a2f3e] text-white border border-[#3b4152] focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'currentColor\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z\' clip-rule=\'evenodd\'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1.5em 1.5em",
          }}
        >
          <option value="all">All Courses</option>
          {coursesForDropdown
            .filter(courseName => courseName !== 'all')
            .map((courseName, index) => (
              <option key={courseName || `course-filter-${index}`} value={courseName}>
                {courseName}
              </option>
            ))}
        </select>
      </div>
    </motion.div>
  );
};

export default FiltersBar; 