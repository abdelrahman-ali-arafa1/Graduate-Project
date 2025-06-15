import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  FaQrcode, 
  FaStopCircle, 
  FaUserEdit, 
  FaUsers, 
  FaClock, 
  FaHourglassHalf
} from "react-icons/fa";

const SessionControls = ({
  sessionActive,
  handleCreateSession,
  handleEndSession,
  changeTime,
  handleInputsChange,
  isCreatingSession,
  isEndingSession
}) => {
  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Action buttons */}
      <div className="bg-[var(--secondary)] rounded-xl p-4 sm:p-5 shadow-md">
        <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-[var(--foreground)]">Actions</h3>
        
        <div className="space-y-3">
          <Link href="/dashboard/doctor/manualAttendance">
            <motion.button 
              className="w-full bg-[var(--background-secondary)] hover:bg-[var(--neutral-light)] text-[var(--foreground)] p-2.5 sm:p-3 rounded-lg flex items-center gap-2 sm:gap-3 transition-colors text-sm sm:text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaUserEdit className="text-[var(--primary)] text-sm sm:text-base flex-shrink-0" />
              <span className="truncate">Manual Attendance</span>
            </motion.button>
          </Link>
          
          <Link href="/dashboard/doctor/students">
            <motion.button 
              className="w-full bg-[var(--background-secondary)] hover:bg-[var(--neutral-light)] text-[var(--foreground)] p-2.5 sm:p-3 rounded-lg flex items-center gap-2 sm:gap-3 transition-colors text-sm sm:text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaUsers className="text-[var(--primary)] text-sm sm:text-base flex-shrink-0" />
              <span className="truncate">Show Students</span>
            </motion.button>
          </Link>
          
          {!sessionActive ? (
            <motion.button
              className="w-full p-2.5 sm:p-3 rounded-lg flex items-center gap-2 sm:gap-3 transition-colors bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-sm sm:text-base"
              onClick={handleCreateSession}
              disabled={isCreatingSession}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaQrcode className="text-sm sm:text-base flex-shrink-0" />
              <span className="truncate">
                {isCreatingSession ? "Generating..." : "Generate QR Code"}
              </span>
            </motion.button>
          ) : (
            <motion.button
              className="w-full p-2.5 sm:p-3 rounded-lg flex items-center gap-2 sm:gap-3 transition-colors bg-red-600/70 hover:bg-red-700 text-white text-sm sm:text-base"
              onClick={handleEndSession}
              disabled={isEndingSession}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaStopCircle className="text-sm sm:text-base flex-shrink-0" />
              <span className="truncate">
                {isEndingSession ? "Ending..." : "End Session"}
              </span>
            </motion.button>
          )}
        </div>
      </div>
      
      {/* QR Code Settings */}
      <div className="bg-[var(--secondary)] rounded-xl p-4 sm:p-5 shadow-md">
        <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-[var(--foreground)]">QR Code Settings</h3>
        
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="flex items-center text-[var(--foreground-secondary)] mb-1.5 sm:mb-2 text-xs sm:text-sm">
              <FaClock className="mr-2 text-[var(--primary)] text-xs sm:text-sm" />
              Update Interval (seconds)
            </label>
            <input
              type="number"
              name="changeSpeed"
              value={changeTime.changeSpeed}
              onChange={handleInputsChange}
              min="5"
              max="60"
              className="w-full bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg p-2 text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent no-spinner"
            />
          </div>
          
          <div>
            <label className="flex items-center text-[var(--foreground-secondary)] mb-1.5 sm:mb-2 text-xs sm:text-sm">
              <FaHourglassHalf className="mr-2 text-[var(--primary)] text-xs sm:text-sm" />
              Session Duration (minutes)
            </label>
            <input
              type="number"
              name="timeWorking"
              value={changeTime.timeWorking}
              onChange={handleInputsChange}
              min="5"
              max="120"
              className="w-full bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg p-2 text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent no-spinner"
            />
          </div>
        </div>
      </div>

      {/* Mobile session status - only visible on small screens */}
      {sessionActive && (
        <div className="lg:hidden bg-[var(--secondary)] rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm text-green-400">Active Session</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SessionControls; 