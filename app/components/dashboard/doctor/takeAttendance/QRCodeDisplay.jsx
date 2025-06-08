import React from "react";
import { motion } from "framer-motion";
import { FaQrcode } from "react-icons/fa";

const QRCodeDisplay = ({ 
  qrCode, 
  sessionActive, 
  countdown, 
  fetchQrCode, 
  isLoadingQrCode 
}) => {
  return (
    <motion.div 
      className="lg:col-span-2 bg-[var(--secondary)] rounded-xl p-4 sm:p-5 shadow-md flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4 text-[var(--foreground)]">QR Code</h3>
      <p className="text-xs sm:text-sm text-[var(--foreground-secondary)] mb-4 sm:mb-6 text-center max-w-xs">Students can scan this code to mark their attendance</p>
      
      {sessionActive ? (
        qrCode ? (
          <div className="flex flex-col items-center">
            <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-lg mb-3 sm:mb-4">
              <img 
                src={qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`}
                alt="QR Code" 
                width={250}
                height={250}
                className="rounded-md w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px]"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <p className="text-[var(--foreground-secondary)] text-xs sm:text-sm">Code refreshes in <span className="font-medium text-[var(--primary)]">{countdown}s</span></p>
              <button 
                onClick={fetchQrCode} 
                disabled={isLoadingQrCode}
                className="text-[var(--primary)] hover:bg-[var(--primary-light)]/10 text-xs sm:text-sm py-1 px-2 sm:px-3 rounded-md transition-colors flex items-center gap-1.5"
              >
                {isLoadingQrCode ? "Loading..." : "Refresh QR Code"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-80 md:h-80 bg-white p-4 sm:p-6 rounded-lg shadow-xl flex items-center justify-center border-2 border-gray-100">
              <div className="animate-pulse flex flex-col items-center">
                <div className="rounded-full bg-slate-200 h-20 w-20 sm:h-28 sm:w-28 md:h-40 md:w-40 mb-3 sm:mb-4"></div>
                <div className="h-2 sm:h-2.5 md:h-3 bg-slate-200 rounded w-16 sm:w-24 md:w-32 mb-2"></div>
                <div className="h-2 sm:h-2.5 md:h-3 bg-slate-200 rounded w-24 sm:w-32 md:w-40"></div>
              </div>
            </div>
            <p className="text-[var(--foreground-secondary)] text-xs sm:text-sm mt-3 sm:mt-4">Loading QR code...</p>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-80 md:h-80 bg-white/90 rounded-lg flex items-center justify-center mb-3 sm:mb-4 border-2 border-dashed border-gray-200">
            <FaQrcode className="text-gray-300 text-3xl sm:text-5xl md:text-7xl" />
          </div>
          <p className="text-[var(--foreground-secondary)] text-sm">No Active Session</p>
          <p className="text-[var(--foreground-secondary)] text-xs sm:text-sm mt-1 sm:mt-2 px-4">Generate a QR code to start a new attendance session<br className="hidden sm:inline" /> for your students</p>
        </div>
      )}
    </motion.div>
  );
};

export default QRCodeDisplay; 