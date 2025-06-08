import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apologyApiSlice = createApi({
  reducerPath: "apologyApi",
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
  tagTypes: ["Apologies"],
  endpoints: (builder) => ({
    getAllApologies: builder.query({
      query: () => ({
        url: `/apology`,
        method: "GET",
      }),
      providesTags: ["Apologies"],
      transformResponse: (response) => {
        console.log("Admin API Response:", response);
        
        // Handle different response formats
        if (response && response.data && Array.isArray(response.data)) {
          console.log("Admin apologies count:", response.data.length);
          return response.data;
        }
        
        // If the response is already an array, return it
        if (Array.isArray(response)) {
          console.log("Admin apologies count (direct):", response.length);
          return response;
        }
        
        console.log("Unexpected response format for admin apologies:", response);
        return [];
      },
      transformErrorResponse: (response) => {
        console.error("Error fetching apologies:", response);
        return {
          status: response.status || 'ERROR',
          message: response.data?.message || 'Failed to fetch apologies'
        };
      }
    }),

    updateApologyStatus: builder.mutation({
      query: ({ id, status, reason }) => ({
        url: `/apology/${id}`,
        method: "PUT",
        body: { status, reason }
      }),
      invalidatesTags: ["Apologies"],
      transformResponse: (response) => {
        console.log("Update status response:", response);
        if (!response) {
          return { success: false };
        }
        return { success: true, data: response };
      },
      transformErrorResponse: (response) => {
        console.error("Error updating apology status:", response);
        return {
          status: response.status || 'ERROR',
          message: response.data?.message || 'Failed to update apology status'
        };
      }
    }),

    getInstructorApologies: builder.query({
      query: () => ({
        url: `/apology/instructor`,
        method: "GET",
      }),
      providesTags: ["Apologies"],
      transformResponse: (response) => {
        console.log("Instructor API Response:", response);
        
        // Handle different response formats
        if (response && response.data && Array.isArray(response.data)) {
          console.log("Instructor apologies count:", response.data.length);
          return response.data;
        }
        
        // If the response is already an array, return it
        if (Array.isArray(response)) {
          console.log("Instructor apologies count (direct):", response.length);
          return response;
        }
        
        console.log("Unexpected response format for instructor apologies:", response);
        return [];
      },
      transformErrorResponse: (response) => {
        console.error("Error fetching instructor apologies:", response);
        return {
          status: response.status || 'ERROR',
          message: response.data?.message || 'Failed to fetch instructor apologies'
        };
      }
    }),
  }),
});

export const { 
  useGetAllApologiesQuery,
  useUpdateApologyStatusMutation,
  useGetInstructorApologiesQuery,
} = apologyApiSlice; 