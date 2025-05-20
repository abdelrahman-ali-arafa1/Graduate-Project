import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardApiSlice = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://attendance-eslamrazeen-eslam-razeens-projects.vercel.app/api/attendanceQRCode",
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
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    getDoctorDashboardData: builder.mutation({
      query: ({ courseId, range }) => {
        if (!courseId) {
          throw new Error("Course ID is required");
        }
        
        console.log(`Sending dashboard request for course ID: ${courseId} with range: ${range}`);
        
        return {
          url: `/dashboardDoctor/${courseId}`,
          method: "POST",
          body: { range },
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      transformResponse: (response, meta, arg) => {
        console.log("Dashboard API raw response:", response);
        console.log("Request args:", arg);
        
        if (!response) {
          console.error("Empty response from dashboard API");
          return null;
        }
        
        // Process the response data
        if (response.days) {
          // For weekly data
          const processedDays = response.days.map(day => ({
            ...day,
            // Convert attendance rate from string to number
            attendanceRate: parseInt(day.attendanceRate.replace('%', '')) || 0,
            // Parse present and absent as numbers
            present: parseInt(day.present) || 0,
            absent: parseInt(day.absent) || 0,
            // Add day name as label for charts
            name: day.day,
          }));
          
          return {
            ...response,
            days: processedDays,
            type: 'week'
          };
        } else if (response.weeks) {
          // For monthly data
          const processedWeeks = response.weeks.map(week => ({
            ...week,
            // Convert attendance rate from string to number
            attendanceRate: parseInt(week.attendanceRate.replace('%', '')) || 0,
            // Parse present and absent as numbers
            present: parseInt(week.present) || 0,
            absent: parseInt(week.absent) || 0,
            // Add week name as label for charts
            name: week.week,
          }));
          
          return {
            ...response,
            weeks: processedWeeks,
            type: 'month'
          };
        }
        
        return response;
      },
      transformErrorResponse: (response) => {
        console.error("Dashboard API error:", response);
        if (response.status) {
          return {
            status: response.status,
            message: response.data?.message || 'Failed to fetch dashboard data'
          };
        }
        return { status: 'NETWORK_ERROR', message: 'Failed to connect to server' };
      },
    }),
  }),
});

export const { useGetDoctorDashboardDataMutation } = dashboardApiSlice; 