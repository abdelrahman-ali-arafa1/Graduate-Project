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
  tagTypes: ["DashboardData"],
  endpoints: (builder) => ({
    getAdminDashboardData: builder.query({
      query: () => "/dashboardAdmin",
      providesTags: ["DashboardData"],
      keepUnusedDataFor: 300,
      transformResponse: (response) => {
        if (!response || !response.days || !Array.isArray(response.days)) {
          console.log("Invalid data format from API, returning empty array");
          return { days: [] };
        }
        console.log("Successfully retrieved dashboard data from API");
        return response;
      },
      transformErrorResponse: (response) => {
        console.error("Error response from getAdminDashboardData:", response);
        return {
          status: response.status || "ERROR",
          message: response.data?.message || "Failed to fetch dashboard data"
        };
      },
      onError: (error, { dispatch, getState, extra, queryFulfilled, endpoint, type, originalArgs, meta }) => {
        console.error('Dashboard API error occurred:', error);
      },
    }),
    
    getDoctorDashboardData: builder.mutation({
      query: (params) => {
        if (!params || !params.courseId) {
          throw new Error("Course ID is required");
        }
        
        return {
          url: `/dashboardDoctor/${params.courseId}`,
          method: 'POST',
          body: { range: params.range || "this week" }
        };
      },
      invalidatesTags: ["DashboardData"],
      transformResponse: (response) => {
        if (!response) {
          console.log("Invalid data format from API, returning empty data");
          return {
            type: 'week',
            days: []
          };
        }

        console.log("Raw doctor dashboard data received:", response);

        // Process the response based on range type
        try {
          let processedResponse = { ...response };
          
          // Check if it's weekly data (has days array)
          if (response.days && Array.isArray(response.days)) {
            processedResponse.type = 'week';
            processedResponse.days = response.days.map(day => ({
              ...day,
              // Convert string percentage to number if it's a string
              attendanceRate: typeof day.attendanceRate === 'string' 
                ? parseInt(day.attendanceRate.replace('%', '')) || 0 
                : day.attendanceRate || 0,
              // Ensure present and absent are numbers
              present: parseInt(day.present) || 0,
              absent: parseInt(day.absent) || 0
            }));
          } 
          // Check if it's monthly data (has weeks array)
          else if (response.weeks && Array.isArray(response.weeks)) {
            processedResponse.type = 'month';
            processedResponse.weeks = response.weeks.map(week => ({
              ...week,
              // Convert string percentage to number if it's a string
              attendanceRate: typeof week.attendanceRate === 'string' 
                ? parseInt(week.attendanceRate.replace('%', '')) || 0 
                : week.attendanceRate || 0,
              // Ensure present and absent are numbers
              present: parseInt(week.present) || 0,
              absent: parseInt(week.absent) || 0
            }));
          } else {
            console.warn("Response does not contain expected data structure");
          }

          console.log("Processed doctor dashboard data:", processedResponse);
          return processedResponse;
        } catch (err) {
          console.error("Error processing doctor dashboard data:", err);
          return response; // Return the original response if processing fails
        }
      },
      transformErrorResponse: (response) => {
        console.error("Error response from getDoctorDashboardData:", response);
        return {
          status: response.status || "ERROR",
          message: response.data?.message || "Failed to fetch dashboard data"
        };
      },
      onError: (error) => {
        console.error('Doctor Dashboard API error occurred:', error);
      },
    }),
    
    getGradeLevelData: builder.query({
      query: ({ level, department }) => {
        if (!level) {
          throw new Error("Level is required");
        }
        
        let queryParams = `/studentInfo?level=${level}`;
        if (department) {
          queryParams += `&department=${department}`;
        }
        
        return queryParams;
      },
      providesTags: ["DashboardData"],
      keepUnusedDataFor: 300,
      transformResponse: (response) => {
        if (!response || !response.data) {
          return { data: [] };
        }
        return response;
      },
      transformErrorResponse: (response) => {
        console.error("Error response from getGradeLevelData:", response);
        return {
          status: response.status || "ERROR",
          message: response.data?.message || "Failed to fetch grade level data"
        };
      },
    }),
    
    updateStudentGrade: builder.mutation({
      query: (data) => ({
        url: "/updateMyGrade",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["DashboardData"],
      transformErrorResponse: (response) => {
        console.error("Error response from updateStudentGrade:", response);
        return {
          status: response.status || "ERROR",
          message: response.data?.message || "Failed to update student grade"
        };
      },
    }),
  }),
});

export const {
  useGetAdminDashboardDataQuery,
  useGetDoctorDashboardDataMutation,
  useGetGradeLevelDataQuery,
  useUpdateStudentGradeMutation,
} = dashboardApiSlice; 