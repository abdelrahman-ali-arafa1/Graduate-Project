'use client';

import { motion, AnimatePresence } from "framer-motion";
import { FaBook, FaCalendarAlt, FaPlus, FaTrash } from "react-icons/fa";

const courseVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 }
  },
  hover: {
    y: -5,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
    borderColor: "rgba(59, 130, 246, 0.5)",
    transition: { duration: 0.2 }
  }
};

const CoursesList = ({ 
  instructor, 
  courses, 
  onAddCourseClick, 
  onDeleteCourse, 
  onShowCourseDetails 
}) => {
  const lecturerCourses = instructor?.lecturerCourses || [];

  return (
    <motion.div 
      className="bg-[#232738] rounded-xl p-6 shadow-md border border-[#2a2f3e] overflow-hidden relative"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { 
            type: "spring", 
            stiffness: 260, 
            damping: 20, 
            duration: 0.5 
          }
        }
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <FaBook className="mr-3 text-yellow-400" /> Assigned Courses
        </h3>
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md"
          onClick={onAddCourseClick}
        >
          <FaPlus /> Add Course
        </button>
      </div>
      
      {/* Course List */}
      {lecturerCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {lecturerCourses.map((course, index) => {
              // Find course details from the full courses list
              const courseDetails = courses.find(c => c._id === course._id) || course;
              return (
                <motion.div 
                  key={course._id || `course-card-${index}`}
                  className="bg-[#2a2f3e] rounded-xl p-4 flex flex-col gap-2 transition-all duration-300 ease-in-out transform hover:scale-[1.02] border border-transparent hover:border-blue-500/30"
                  variants={courseVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FaBook className="text-yellow-400 text-lg" />
                      <span className="text-sm text-blue-300 font-medium">Course {index + 1}</span>
                    </div>
                  <h4 className="text-gray-200 font-semibold text-base truncate" title={courseDetails.courseName}>{courseDetails.courseName}</h4>
                  
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400 mb-3">
                    {courseDetails.department && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H6a2 2 0 01-2-2V4zm2 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 4a1 1 0 100 2h6a1 1 0 100-2H7zm-1 4a1 1 0 011-1h4a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                        {courseDetails.department}
                      </span>
                    )}
                    {courseDetails.level && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>
                        Level {courseDetails.level}
                      </span>
                    )}
                    {courseDetails.semester && (
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-blue-400" /> Semester {parseInt(courseDetails.semester) % 2 === 0 ? 2 : 1}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto pt-3 border-t border-[#3b4152] flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                    <FaCalendarAlt className="mr-1" /> Added recently
                    </span>
                    <div className="flex gap-2">
                    <button
                        className="text-blue-400 hover:underline hover:text-blue-300 bg-transparent border-none outline-none"
                      onClick={() => onShowCourseDetails(courseDetails)}
                      title="Show Details"
                      type="button"
                    >
                      Show Details
                    </button>
                    <button
                        className="text-red-500 hover:text-red-700 bg-transparent border-none outline-none"
                      title="Delete Course"
                      onClick={() => onDeleteCourse(course._id)}
                    >
                      <FaTrash />
                    </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div 
          className="bg-[#1a1f2e]/50 p-6 rounded-lg text-center text-gray-400"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FaBook className="mx-auto text-3xl text-gray-500 mb-3 opacity-50" />
          <p>No courses assigned to this instructor</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
            onClick={onAddCourseClick}
          >
            Assign Courses
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CoursesList; 