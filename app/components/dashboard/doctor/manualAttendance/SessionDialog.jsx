import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { FaClock, FaHourglassHalf } from "react-icons/fa";

const SessionDialog = ({
  open,
  onClose,
  sessionSettings,
  handleSessionSettingsChange,
  handleCreateSession,
  isCreatingSession
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "var(--card-bg)",
          color: "var(--foreground)",
          borderRadius: "0.75rem",
          width: "100%",
          maxWidth: { xs: "95%", sm: "500px" },
          mx: { xs: 2, sm: 'auto' }
        }
      }}
    >
      <DialogTitle sx={{ color: "var(--foreground)", fontSize: { xs: '1rem', sm: '1.25rem' }, py: { xs: 1.5, sm: 2 } }}>
        Create New Attendance Session
      </DialogTitle>
      <DialogContent sx={{ pt: { xs: 1, sm: 1.5 } }}>
        <div className="space-y-3 sm:space-y-4 mt-1 sm:mt-2">
          <div>
            <label className="flex items-center text-[var(--foreground-secondary)] mb-1.5 sm:mb-2 text-xs sm:text-sm">
              <FaClock className="mr-2 text-[var(--primary)] text-xs sm:text-sm" />
              QR Code Update Interval (seconds)
            </label>
            <TextField
              type="number"
              name="changeSpeed"
              value={sessionSettings.changeSpeed}
              onChange={handleSessionSettingsChange}
              inputProps={{ min: 5, max: 60 }}
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "var(--border-color)",
                  },
                  "&:hover fieldset": {
                    borderColor: "var(--primary)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--primary)",
                  },
                  "& input": {
                    color: "var(--foreground)",
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    py: { xs: 1, sm: 1.5 }
                  }
                }
              }}
            />
          </div>
          
          <div>
            <label className="flex items-center text-[var(--foreground-secondary)] mb-1.5 sm:mb-2 text-xs sm:text-sm">
              <FaHourglassHalf className="mr-2 text-[var(--primary)] text-xs sm:text-sm" />
              Session Duration (minutes)
            </label>
            <TextField
              type="number"
              name="timeWorking"
              value={sessionSettings.timeWorking}
              onChange={handleSessionSettingsChange}
              inputProps={{ min: 5, max: 120 }}
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "var(--border-color)",
                  },
                  "&:hover fieldset": {
                    borderColor: "var(--primary)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--primary)",
                  },
                  "& input": {
                    color: "var(--foreground)",
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    py: { xs: 1, sm: 1.5 }
                  }
                }
              }}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Button 
          onClick={onClose}
          sx={{ color: "var(--foreground-secondary)", fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleCreateSession}
          disabled={isCreatingSession}
          variant="contained"
          sx={{
            backgroundColor: "var(--primary)",
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            "&:hover": { backgroundColor: "var(--primary-dark)" }
          }}
        >
          {isCreatingSession ? "Creating..." : "Create Session"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionDialog; 