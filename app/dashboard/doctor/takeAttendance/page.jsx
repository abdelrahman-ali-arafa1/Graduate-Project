"use client";
import React from "react";
import { motion } from "framer-motion";
import useTakeAttendance from "@/app/hooks/useTakeAttendance";

// Componentes
import NoCourse from "@/app/components/dashboard/doctor/takeAttendance/NoCourse";
import CourseInfo from "@/app/components/dashboard/doctor/takeAttendance/CourseInfo";
import SessionControls from "@/app/components/dashboard/doctor/takeAttendance/SessionControls";
import QRCodeDisplay from "@/app/components/dashboard/doctor/takeAttendance/QRCodeDisplay";

const TakeAttendancePage = () => {
  // Obtener lógica y estados desde el hook personalizado
  const {
    selectedCourse,
    qrCode,
    changeTime,
    sessionActive,
    countdown,
    isCreatingSession,
    isEndingSession,
    isLoadingQrCode,
    handleCreateSession,
    handleEndSession,
    fetchQrCode,
    handleInputsChange,
    hasActiveSession
  } = useTakeAttendance();

  // Si no hay curso seleccionado, mostrar mensaje
  if (!selectedCourse) {
    return <NoCourse />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-1 sm:mb-2">Take Attendance</h1>
        <p className="text-sm sm:text-base text-[var(--foreground-secondary)]">Generate QR codes for student attendance</p>
      </motion.div>
      
      {/* Información del curso seleccionado */}
      <CourseInfo 
        selectedCourse={selectedCourse} 
        sessionActive={sessionActive} 
        hasActiveSession={hasActiveSession}
      />
      
      {/* Panel principal con controles y código QR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Controles y configuración */}
        <SessionControls 
          sessionActive={sessionActive}
          handleCreateSession={handleCreateSession}
          handleEndSession={handleEndSession}
          changeTime={changeTime}
          handleInputsChange={handleInputsChange}
          isCreatingSession={isCreatingSession}
          isEndingSession={isEndingSession}
        />
        
        {/* Visualización QR */}
        <QRCodeDisplay 
          qrCode={qrCode}
          sessionActive={sessionActive}
          countdown={countdown}
          fetchQrCode={fetchQrCode}
          isLoadingQrCode={isLoadingQrCode}
        />
      </div>
    </div>
  );
};

export default TakeAttendancePage;
