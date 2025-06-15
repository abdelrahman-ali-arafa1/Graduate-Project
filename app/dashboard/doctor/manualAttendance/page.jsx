'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/app/components/layout/Header';
import useManualAttendance from '@/app/hooks/useManualAttendance';
import NoCourse from '@/app/components/dashboard/doctor/manualAttendance/NoCourse';
import CourseInfo from '@/app/components/dashboard/doctor/manualAttendance/CourseInfo';
import SessionStatus from '@/app/components/dashboard/doctor/manualAttendance/SessionStatus';
import SessionDialog from '@/app/components/dashboard/doctor/manualAttendance/SessionDialog';
import AttendanceTable from '@/app/components/ui/AttendanceTable';

const ManualAttendancePage = () => {
  // Get states and functions from custom hook
  const {
    selectedCourse,
    sessionId,
    sessionDialogOpen,
    sessionSettings,
    remainingTime,
    isCreatingSession,
    attendanceData,
    isAttendanceLoading,
    handleCreateSession,
    handleSessionSettingsChange,
    openSessionDialog,
    closeSessionDialog,
    goToQrCodePage,
    handleUpdateAttendance,
    isUpdatingAttendance
  } = useManualAttendance();
  
  // If no course is selected, show the NoCourse component
  if (!selectedCourse) {
    return (
      <div className='min-h-screen bg-background'>
        <Header />
        <div className="pt-24 px-6">
          <NoCourse />
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <div className="pt-24 px-3 sm:px-6">
        {/* Page Title */}
        <motion.div 
          className="mb-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-1 sm:mb-2">Manual Attendance</h1>
          <p className="text-sm sm:text-base text-[var(--foreground-secondary)]">Record attendance manually for your course</p>
        </motion.div>
        
        {/* Course Information */}
        <div className="mb-4 sm:mb-6">
          <CourseInfo 
            selectedCourse={selectedCourse} 
            sessionId={sessionId} 
            remainingTime={remainingTime} 
          />
        </div>
        
        {/* Session Status & Action */}
        <div className="mb-4 sm:mb-6">
          <SessionStatus
            sessionId={sessionId}
            remainingTime={remainingTime}
            openSessionDialog={openSessionDialog}
            goToQrCodePage={goToQrCodePage}
          />
        </div>
        
        {/* Attendance Table */}
        {sessionId ? (
          <AttendanceTable 
            allowMarkAbsent={true} 
            key={sessionId || `attendance-table-${Date.now()}`}
            attendanceData={attendanceData}
            isAttendanceLoading={isAttendanceLoading}
            handleUpdateAttendance={handleUpdateAttendance}
            isUpdatingAttendance={isUpdatingAttendance}
          />
        ) : (
          <div className="text-center p-4 sm:p-8 bg-[var(--secondary)] rounded-lg border border-[var(--border-color)]">
            <h3 className="text-lg sm:text-xl font-medium text-[var(--foreground)] mb-2">No Active Session</h3>
            <p className="text-[var(--foreground-secondary)] text-xs sm:text-sm mb-4">
              Please create a session first to view and manage student attendance.
            </p>
          </div>
        )}
        
        {/* Session Creation Dialog */}
        <SessionDialog
          open={sessionDialogOpen}
          onClose={closeSessionDialog}
          sessionSettings={sessionSettings}
          handleSessionSettingsChange={handleSessionSettingsChange}
          handleCreateSession={handleCreateSession}
          isCreatingSession={isCreatingSession}
        />
      </div>
    </div>
  );
};

export default ManualAttendancePage;
