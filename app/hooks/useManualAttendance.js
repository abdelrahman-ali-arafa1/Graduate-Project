import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  useCreateSessionMutation,
  useGetQrCodeMutation,
  useEndSessionMutation
} from '@/app/store/features/sessionApiSlice';
import {
  useGetManualAttendanceQuery,
  useUpdateAttendanceStatusMutation
} from '@/app/store/features/attendanceApiSlice';
import { setSessionId } from '@/app/store/slices/sessionSlice';
import { hydrate as hydrateSelectedCourse } from '@/app/store/slices/selectedCourseSlice';

export const useManualAttendance = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  
  // Redux state
  const selectedCourse = useSelector((state) => state.selectedCourse?.course);
  const sessionId = useSelector((state) => state.session.sessionId);
  
  // API hooks for manual attendance data
  const { data: attendanceData, isLoading: isAttendanceLoading, refetch: refetchAttendance } = useGetManualAttendanceQuery(sessionId, { skip: !sessionId });
  const [updateAttendance, { isLoading: isUpdatingAttendance }] = useUpdateAttendanceStatusMutation();
  
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
  
  // Handle session creation
  const handleCreateSession = async () => {
    // console.log("Attempting to create session. Selected Course:", selectedCourse);

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
      
      // console.log("Session creation successful! Response:", response);
      dispatch(setSessionId(response.sessionId));
      
      // Store session start time and duration in localStorage
      const sessionData = {
        startTime: new Date().toISOString(),
        timeWorking: sessionSettings.timeWorking
      };
      localStorage.setItem('sessionData', JSON.stringify(sessionData));
      setSessionStartTime(new Date());
      
      setSessionDialogOpen(false);
      
      // Refetch attendance data after creating a new session
      refetchAttendance();
      
      // Fetch QR code once (optional)
      try {
        await getQrCode(response.sessionId);
      } catch (err) {
        console.error('Failed to get QR code:', err);
      }
    } catch (err) {
      console.error('Failed to create session:', err);
      // More descriptive error message
      alert(`Failed to create session: ${err?.data?.message || err?.message || "Unknown error"}. Please try again.`);
    }
  };
  
  // Handle updating student attendance status
  const handleUpdateAttendance = async (studentId, status) => {
    try {
      await updateAttendance({ studentId, attendanceStatus: status }).unwrap();
      refetchAttendance(); // Refetch data to update the table
    } catch (error) {
      console.error("Failed to update attendance status:", error);
      alert("Failed to update attendance status. Please try again.");
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
  
  // Open and close session dialog
  const openSessionDialog = () => setSessionDialogOpen(true);
  const closeSessionDialog = () => setSessionDialogOpen(false);
  
  // Navigate to QR code page
  const goToQrCodePage = () => {
    router.push('/dashboard/doctor/takeAttendance');
  };

  return {
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
    isUpdatingAttendance,
  };
};

export default useManualAttendance; 