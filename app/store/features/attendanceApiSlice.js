import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const attendanceApiSlice = createApi({
  reducerPath: "attendanceApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      "https://attendance-eslamrazeen-eslam-razeens-projects.vercel.app/api/attendanceQRCode",
    credentials: "include",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token")?.replace(/"/g, "");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ["Attendance"],
  endpoints: (builder) => ({
    getAllAttendances: builder.query({
      query: (courseId) => {
        if (!courseId) {
          throw new Error("Course ID is required");
        }
        return {
          url: `/showStudent/${courseId}`,
          method: 'POST',
        };
      },
      providesTags: ["Attendance"],
      transformResponse: (response) => {
        if (!response || !response.students) {
          return { students: [] };
        }
        return response;
      },
      transformErrorResponse: (response) => {
        console.error("Error response from getAllAttendances:", JSON.stringify(response));
        if (response.status) {
          return {
            status: response.status,
            message: response.data?.message || 'Failed to fetch attendance data'
          };
        }
        return { status: 'NETWORK_ERROR', message: 'Failed to connect to server' };
      },
    }),

    getStudentsByDate: builder.query({
      query: ({ courseId, date }) => {
        if (!courseId) {
          throw new Error("Course ID is required");
        }
        
        if (date) {
          return {
            url: `/showStudent/${courseId}`,
            method: 'POST',
            body: { date }
          };
        }
        return {
          url: `/showStudent/${courseId}`,
          method: 'POST',
        };
      },
      providesTags: ["Attendance"],
      transformResponse: (response, meta, arg) => {
        if (arg.date) {
          return Array.isArray(response.presntsINDate) ? response.presntsINDate : [];
        }
        if (response.students && Array.isArray(response.students)) {
          return response.students;
        }
        return [];
      },
      transformErrorResponse: (response) => {
        console.error("Error response from getStudentsByDate:", JSON.stringify(response));
        if (response.status) {
          return {
            status: response.status,
            message: response.data?.message || 'Failed to fetch students data'
          };
        }
        return { status: 'NETWORK_ERROR', message: 'Failed to connect to server' };
      },
    }),

    getAttendanceByDate: builder.query({
      query: ({ sessionId, date }) => {
        if (!sessionId) {
          throw new Error("Session ID is required");
        }
        return `/attendanceByDate/${sessionId}?date=${date || ''}`;
      },
      providesTags: ["Attendance"],
    }),

    getAttendanceByCourseAndDate: builder.query({
      query: ({ courseId, date }) => {
        if (!courseId) {
          throw new Error("Course ID is required");
        }
        return `/attendanceByCourse/${courseId}?date=${date || ''}`;
      },
      providesTags: ["Attendance"],
    }),
    
    markAttendance: builder.mutation({
      query: (attendanceData) => ({
        url: `/markAttendance`,
        method: "POST",
        body: attendanceData,
      }),
      invalidatesTags: ["Attendance"],
    }),
    
    deleteAttendance: builder.mutation({
      query: (attendanceId) => ({
        url: `/deleteAttendance/${attendanceId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Attendance"],
    }),

    getManualAttendance: builder.query({
      query: (sessionId) => {
        if (!sessionId) {
          throw new Error("Session ID is required for manual attendance");
        }
        return `/manualAttendace/${sessionId}`; // Use the correct API endpoint
      },
      providesTags: ["Attendance"],
      transformResponse: (response) => {
        console.log("Manual attendance API response:", response);
        // Ensure response.data is an array or return empty array
        if (!response || !Array.isArray(response.data)) {
          console.warn("Empty response or data is not an array in manual attendance");
          return [];
        }
        return response.data; // Directly return the array of attendance records
      },
      transformErrorResponse: (response) => {
        console.error("Manual attendance API error:", JSON.stringify(response));
        if (response.status) {
          return {
            status: response.status,
            message: response.data?.message || 'Failed to fetch manual attendance data'
          };
        }
        return { status: 'NETWORK_ERROR', message: 'Failed to connect to server' };
      },
    }),

    updateAttendanceStatus: builder.mutation({
      query: ({ studentId, attendanceStatus }) => ({
        url: `/attendances/${studentId}`,
        method: "PUT",
        body: { attendanceStatus },
      }),
      invalidatesTags: ["Attendance"],
    }),

    addStudentAttendance: builder.mutation({
      query: ({ courseId, newUser }) => {
        if (!courseId) {
          throw new Error("Course ID is required");
        }
        if (!newUser || !newUser.student || !newUser.sessionID) {
          throw new Error("Attendance data is incomplete");
        }
        
        return {
          url: `/attendances`,
          method: "POST",
          body: newUser,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["Attendance"],
      transformErrorResponse: (response) => {
        if (response.status === 409) {
          return { status: 409, message: 'Student attendance already recorded' };
        }
        if (response.status) {
          return {
            status: response.status,
            message: response.data?.message || 'Failed to record attendance'
          };
        }
        return { status: 'NETWORK_ERROR', message: 'Failed to connect to server' };
      },
    }),
    
    addStudentsSheet: builder.mutation({
      query: (data) => {
        console.log("Raw data received for upload:", data);
        
        if (!data || !data.students || !Array.isArray(data.students)) {
          throw new Error("Student data is invalid");
        }
        
        // Ensure each student has the required fields
        const students = data.students.map(student => ({
          name: student.name || '',
          email: student.email || '',
          password: student.password || 'password123',
          passwordConfirm: student.passwordConfirm || 'password123',
          department: student.department || data.department || '',
          level: student.level || data.level || ''
        }));
        
        // Log request for debugging
        console.log("Formatted students data:", students);
        
        return {
          url: `/studentInfo`,
          method: "POST",
          body: students,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      transformResponse: (response) => {
        console.log("API Success Response:", response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error("Add Students API error:", JSON.stringify(response));
        
        if (response.status) {
          return {
            status: response.status,
            message: response.data?.message || 'Failed to load student file'
          };
        }
        return { status: 'NETWORK_ERROR', message: 'Failed to connect to server' };
      },
      invalidatesTags: ["Attendance"],
    }),
  }),
});

export const { 
  useGetAllAttendancesQuery, 
  useGetManualAttendanceQuery,
  useAddStudentAttendanceMutation, 
  useAddStudentsSheetMutation,
  useGetStudentsByDateQuery,
  useLazyGetAttendanceByDateQuery,
  useLazyGetAttendanceByCourseAndDateQuery,
  useMarkAttendanceMutation,
  useDeleteAttendanceMutation,
  useUpdateAttendanceStatusMutation
} = attendanceApiSlice; 