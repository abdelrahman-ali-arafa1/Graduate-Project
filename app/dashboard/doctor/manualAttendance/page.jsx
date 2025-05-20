'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/app/components/Header';
import AttendanceTable from '@/app/items/AttendanceTable';
import { 
  FaBookOpen, 
  FaClock, 
  FaQrcode, 
  FaHourglassHalf, 
  FaUserCheck, 
  FaUserTimes 
} from 'react-icons/fa';
import { 
  useCreateSessionMutation,
  useGetQrCodeMutation 
} from '@/app/Redux/features/sessionApiSlice';
import { setSessionId } from '@/app/Redux/Slices/sessionSlice';
import { hydrate as hydrateSelectedCourse } from '@/app/Redux/Slices/selectedCourseSlice';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Chip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField 
} from '@mui/material';
import { useTheme } from '@/app/components/ThemeProvider';

const ManualAttendancePage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    
    // Redux state
    const selectedCourse = useSelector((state) => state.selectedCourse?.course);
    const sessionId = useSelector((state) => state.session.sessionId);
    const lecturerRole = useSelector((state) => state.userRole.isInstructor);
    
    // Local state
    const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
    const [sessionSettings, setSessionSettings] = useState({
        changeSpeed: 7,
        timeWorking: 30,
    });
    const [sessionStartTime, setSessionStartTime] = useState(null);
    const [remainingTime, setRemainingTime] = useState(null);
    
    // API mutations
    const [createSession, { isLoading: isCreatingSession }] = useCreateSessionMutation();
    const [getQrCode] = useGetQrCodeMutation();
    
    // Hydrate selected course from localStorage
    useEffect(() => {
        dispatch(hydrateSelectedCourse());
    }, [dispatch]);
    
    // Calculate remaining session time
    useEffect(() => {
        if (sessionStartTime && sessionSettings.timeWorking) {
            const interval = setInterval(() => {
                const now = new Date();
                const endTime = new Date(sessionStartTime.getTime() + sessionSettings.timeWorking * 60 * 1000);
                const diff = Math.max(0, endTime - now);
                
                if (diff <= 0) {
                    setRemainingTime(null);
                    clearInterval(interval);
                } else {
                    const minutes = Math.floor(diff / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                    setRemainingTime({ minutes, seconds });
                }
            }, 1000);
            
            return () => clearInterval(interval);
        }
    }, [sessionStartTime, sessionSettings.timeWorking]);
    
    // Check for session ID in localStorage on component mount
    useEffect(() => {
        if (sessionId) {
            // If we have a session ID, try to get its start time from localStorage
            const storedSessionData = localStorage.getItem('sessionData');
            if (storedSessionData) {
                try {
                    const { startTime, timeWorking } = JSON.parse(storedSessionData);
                    setSessionStartTime(new Date(startTime));
                    setSessionSettings(prev => ({
                        ...prev,
                        timeWorking
                    }));
                } catch (err) {
                    console.error('Failed to parse session data:', err);
                }
            }
        }
    }, [sessionId]);
    
    // Log session status for debugging
    useEffect(() => {
        console.log("Current session ID:", sessionId);
        console.log("Selected course:", selectedCourse);
    }, [sessionId, selectedCourse]);
    
    // Force refresh when session ID changes
    useEffect(() => {
        // This will trigger a re-render when the session ID changes
        if (sessionId) {
            console.log("Session ID changed, refreshing page data");
            // You could add additional logic here if needed
        }
    }, [sessionId]);
    
    // Handle session creation
    const handleCreateSession = async () => {
        if (!selectedCourse) {
            alert("Please select a course first");
            router.push('/dashboard/doctor/subjects');
            return;
        }
        
        try {
            const response = await createSession({
                course: selectedCourse._id,
                changeSpeed: sessionSettings.changeSpeed,
                timeWorking: sessionSettings.timeWorking,
            }).unwrap();
            
            dispatch(setSessionId(response.sessionId));
            
            // Store session start time and duration in localStorage
            const sessionData = {
                startTime: new Date().toISOString(),
                timeWorking: sessionSettings.timeWorking
            };
            localStorage.setItem('sessionData', JSON.stringify(sessionData));
            setSessionStartTime(new Date());
            
            setSessionDialogOpen(false);
            
            // Fetch QR code once (optional)
            try {
                await getQrCode(response.sessionId);
            } catch (err) {
                console.error('Failed to get QR code:', err);
            }
        } catch (err) {
            console.error('Failed to create session:', err);
            alert("Failed to create session. Please try again.");
        }
    };
    
    // Handle session dialog input changes
    const handleSessionSettingsChange = (e) => {
        const { name, value } = e.target;
        setSessionSettings(prev => ({
            ...prev,
            [name]: Number(value)
        }));
    };
    
    // If no course is selected, show a message
    if (!selectedCourse) {
        return (
            <div className='min-h-screen bg-background'>
                <Header />
                <div className="pt-24 px-6">
                    <motion.div 
                        className="flex flex-col items-center justify-center min-h-[400px]"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="bg-[var(--secondary)] rounded-xl p-8 shadow-md max-w-md w-full text-center">
                            <div className="w-16 h-16 bg-[var(--primary-light)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaBookOpen className="text-[var(--primary)] text-2xl" />
                            </div>
                            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">No Course Selected</h2>
                            <p className="text-[var(--foreground-secondary)] mb-6">Please select a course before recording manual attendance</p>
                            <motion.button
                                onClick={() => router.push('/dashboard/doctor/subjects')}
                                className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white py-3 px-6 rounded-lg w-full flex items-center justify-center gap-2"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FaBookOpen className="text-lg" />
                                <span>Select Course</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-background'>
            <Header />
            <div className="pt-24 px-6">
                {/* Course Information */}
                <motion.div 
                    className="bg-[var(--secondary)] rounded-xl p-6 shadow-md border-l-4 border-[var(--primary)] mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">{selectedCourse.courseName}</h2>
                            <div className="flex items-center gap-3">
                                <span className="bg-[var(--background-secondary)] text-[var(--foreground-secondary)] text-sm px-2 py-1 rounded-full">
                                    {selectedCourse.department}
                                </span>
                                <span className="text-[var(--foreground-secondary)] text-sm">
                                    Level {selectedCourse.level}
                                </span>
                                <span className="text-[var(--foreground-secondary)] text-sm">
                                    Semester {selectedCourse.semester || "1"}
                                </span>
                            </div>
                        </div>
                        
                        {sessionId && (
                            <div className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm flex items-center">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                                {remainingTime ? (
                                    <span>Session Active: {remainingTime.minutes}m {remainingTime.seconds}s</span>
                                ) : (
                                    <span>Session Active</span>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
                
                {/* Session Status and Action */}
                <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    {!sessionId ? (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <FaClock className="text-yellow-500 mr-3 text-xl" />
                                <div>
                                    <h3 className="text-[var(--foreground)] font-medium">No Active Session</h3>
                                    <p className="text-[var(--foreground-secondary)] text-sm">Create a session to record student attendance</p>
                                </div>
                            </div>
                            <Button 
                                variant="contained" 
                                color="primary"
                                startIcon={<FaQrcode />}
                                onClick={() => setSessionDialogOpen(true)}
                                sx={{
                                    backgroundColor: "var(--primary)",
                                    "&:hover": { backgroundColor: "var(--primary-dark)" }
                                }}
                            >
                                Create New Session
                            </Button>
                        </div>
                    ) : (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <FaUserCheck className="text-green-500 mr-3 text-xl" />
                                <div>
                                    <h3 className="text-[var(--foreground)] font-medium">Active Session</h3>
                                    <p className="text-[var(--foreground-secondary)] text-sm">
                                        You can now record student attendance manually
                                        {remainingTime && ` (${remainingTime.minutes}m ${remainingTime.seconds}s remaining)`}
                                    </p>
                                </div>
                            </div>
                            <Button 
                                variant="outlined"
                                onClick={() => router.push('/dashboard/doctor/takeAttendance')}
                                sx={{
                                    borderColor: "var(--primary)",
                                    color: "var(--primary)",
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
                
                {/* Attendance Table */}
                {sessionId ? (
                    <AttendanceTable allowMarkAbsent={true} key={sessionId} />
                ) : (
                    <div className="text-center p-8 bg-[var(--secondary)] rounded-lg border border-[var(--border-color)]">
                        <h3 className="text-xl font-medium text-[var(--foreground)] mb-2">No Active Session</h3>
                        <p className="text-[var(--foreground-secondary)] mb-4">
                            Please create a session first to view and manage student attendance.
                        </p>
                    </div>
                )}
                
                {/* Create Session Dialog */}
                <Dialog 
                    open={sessionDialogOpen} 
                    onClose={() => setSessionDialogOpen(false)}
                    PaperProps={{
                        sx: {
                            backgroundColor: "var(--card-bg)",
                            color: "var(--foreground)",
                            borderRadius: "0.75rem",
                            width: "100%",
                            maxWidth: "500px"
                        }
                    }}
                >
                    <DialogTitle sx={{ color: "var(--foreground)" }}>
                        Create New Attendance Session
                    </DialogTitle>
                    <DialogContent>
                        <div className="space-y-4 mt-2">
                            <div>
                                <label className="flex items-center text-[var(--foreground-secondary)] mb-2 text-sm">
                                    <FaClock className="mr-2 text-[var(--primary)]" />
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
                                                color: "var(--foreground)"
                                            }
                                        }
                                    }}
                                />
                            </div>
                            
                            <div>
                                <label className="flex items-center text-[var(--foreground-secondary)] mb-2 text-sm">
                                    <FaHourglassHalf className="mr-2 text-[var(--primary)]" />
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
                                                color: "var(--foreground)"
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button 
                            onClick={() => setSessionDialogOpen(false)}
                            sx={{ color: "var(--foreground-secondary)" }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleCreateSession}
                            disabled={isCreatingSession}
                            variant="contained"
                            sx={{
                                backgroundColor: "var(--primary)",
                                "&:hover": { backgroundColor: "var(--primary-dark)" }
                            }}
                        >
                            {isCreatingSession ? "Creating..." : "Create Session"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default ManualAttendancePage;
