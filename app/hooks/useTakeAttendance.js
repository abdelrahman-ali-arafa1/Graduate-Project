import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useCreateSessionMutation,
  useGetQrCodeMutation,
  useEndSessionMutation,
} from "@/app/store/features/sessionApiSlice";
import { setSessionId, clearSessionId } from "@/app/store/slices/sessionSlice";

export const useTakeAttendance = () => {
  // Redux hooks and state
  const selectedCourse = useSelector((state) => state.selectedCourse.course);
  const sessionId = useSelector((state) => state.session.sessionId);
  const dispatch = useDispatch();
  
  // API mutations
  const [createSession, { isLoading: isCreatingSession }] = useCreateSessionMutation();
  const [getQrCode, { isLoading: isLoadingQrCode }] = useGetQrCodeMutation();
  const [endSession, { isLoading: isEndingSession }] = useEndSessionMutation();
  
  // Local state
  const [qrCode, setQrCode] = useState("");
  const [changeTime, setChangeTime] = useState({
    changeSpeed: 7,
    timeWorking: 30,
  });
  const [sessionActive, setSessionActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sessionTimer, setSessionTimer] = useState(null);

  // Create session
  const handleCreateSession = async () => {
    if (!selectedCourse) {
      alert("Please select a course first");
      return;
    }
    
    try {
      const response = await createSession({
        course: selectedCourse?._id,
        changeSpeed: changeTime.changeSpeed,
        timeWorking: changeTime.timeWorking,
      }).unwrap();
      
      dispatch(setSessionId(response.sessionId));
      setQrCode(response.qrCode);
      setSessionActive(true);
      setCountdown(changeTime.changeSpeed);
      
      // Add timer to automatically end the session after the specified time
      const timer = setTimeout(() => {
        handleEndSession();
      }, changeTime.timeWorking * 60 * 1000); // Convert minutes to milliseconds
      
      setSessionTimer(timer);
    } catch (err) {
      console.error("Failed to create session:", err);
      alert("Failed to create session. Please try again.");
    }
  };
  
  // End session
  const handleEndSession = async () => {
    if (!sessionId) return;
    
    try {
      console.log("Attempting to end session with ID:", sessionId);
      const response = await endSession(sessionId).unwrap();
      
      // Check if the response contains an error
      if (response && response.error) {
        console.log("Response with error:", response);
        // Can handle the error here if needed
      } else {
        console.log("Session ended successfully");
      }
    } catch (err) {
      console.error("Failed to end session:", err);
      // We don't show an alert to the user
    } finally {
      // Regardless of success or failure, update the UI
      setSessionActive(false);
      setQrCode("");
      dispatch(clearSessionId());
      
      // Cancel the timer if it exists
      if (sessionTimer) {
        clearTimeout(sessionTimer);
        setSessionTimer(null);
      }
    }
  };
  
  // Fetch QR code
  const fetchQrCode = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      console.log("Fetching QR code for session:", sessionId);
      const response = await getQrCode(sessionId).unwrap();
      console.log("QR code response:", response);
      
      if (response && response.qrCode) {
        console.log("QR code received, length:", response.qrCode.length);
        setQrCode(response.qrCode);
        setCountdown(changeTime.changeSpeed);
      } else {
        console.error("No QR code in response:", response);
      }
    } catch (err) {
      console.error("Failed to get QR code", err);
    }
  }, [getQrCode, sessionId, changeTime.changeSpeed]);

  // Countdown timer
  useEffect(() => {
    if (!sessionActive || countdown <= 0) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [sessionActive, countdown]);

  // QR code refresh interval
  useEffect(() => {
    if (!sessionId || !sessionActive) return;
    
    // Fetch QR code immediately when session is activated
    fetchQrCode();
    
    const interval = setInterval(fetchQrCode, changeTime.changeSpeed * 1000);
    return () => clearInterval(interval);
  }, [fetchQrCode, changeTime.changeSpeed, sessionId, sessionActive]);
  
  // Clean up resources when component unmounts
  useEffect(() => {
    // Execute when component loads
    if (sessionId) {
      setSessionActive(true);
      fetchQrCode();
    }
    
    // Clean up when component unmounts
    return () => {
      if (sessionActive && sessionId) {
        // Try to end the session when leaving the page
        try {
          endSession(sessionId)
            .then(() => {
              console.log("Session ended successfully on page leave");
            })
            .catch((err) => {
              console.error("Failed to end session on page leave:", err);
            });
        } catch (error) {
          console.error("Error during session cleanup:", error);
        }
      }
      
      // Cancel the timer if it exists
      if (sessionTimer) {
        clearTimeout(sessionTimer);
      }
    };
  }, []);

  // Handle input change
  const handleInputsChange = (e) => {
    const { name, value } = e.target;
    setChangeTime((prev) => ({ ...prev, [name]: Number(value) }));
  };

  return {
    selectedCourse,
    sessionId,
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
    hasActiveSession: !!sessionId,
  };
};

export default useTakeAttendance; 