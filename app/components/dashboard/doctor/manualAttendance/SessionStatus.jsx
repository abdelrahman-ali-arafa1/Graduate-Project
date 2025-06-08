import React from "react";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import { FaQrcode, FaClock, FaUserCheck } from "react-icons/fa";

const SessionStatus = ({ 
  sessionId, 
  remainingTime, 
  openSessionDialog, 
  goToQrCodePage 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {!sessionId ? (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="flex items-center">
            <FaClock className="text-yellow-500 mr-2 sm:mr-3 text-base sm:text-xl flex-shrink-0" />
            <div>
              <h3 className="text-[var(--foreground)] text-sm sm:text-base font-medium">No Active Session</h3>
              <p className="text-[var(--foreground-secondary)] text-xs sm:text-sm">Create a session to record student attendance</p>
            </div>
          </div>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<FaQrcode />}
            onClick={openSessionDialog}
            size="small"
            sx={{
              backgroundColor: "var(--primary)",
              "&:hover": { backgroundColor: "var(--primary-dark)" },
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              py: { xs: 0.75, sm: 1 },
              whiteSpace: 'nowrap'
            }}
          >
            Create New Session
          </Button>
        </div>
      ) : (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="flex items-center">
            <FaUserCheck className="text-green-500 mr-2 sm:mr-3 text-base sm:text-xl flex-shrink-0" />
            <div>
              <h3 className="text-[var(--foreground)] text-sm sm:text-base font-medium">Active Session</h3>
              <p className="text-[var(--foreground-secondary)] text-xs sm:text-sm">
                You can now record student attendance manually
                {remainingTime && ` (${remainingTime.minutes}m ${remainingTime.seconds}s remaining)`}
              </p>
            </div>
          </div>
          <Button 
            variant="outlined"
            onClick={goToQrCodePage}
            size="small"
            sx={{
              borderColor: "var(--primary)",
              color: "var(--primary)",
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              py: { xs: 0.75, sm: 1 },
              whiteSpace: 'nowrap',
              "&:hover": { 
                borderColor: "var(--primary-dark)",
                backgroundColor: "rgba(var(--primary-rgb), 0.1)"
              }
            }}
          >
            Go to QR Page
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default SessionStatus; 