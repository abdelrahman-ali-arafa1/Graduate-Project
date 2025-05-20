import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApiSlice = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      "https://attendance-git-main-eslam-razeens-projects.vercel.app/api/attendanceQRCode",
    credentials: "include", //
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
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => `/users`,
      providesTags: ["Users"],
    }),

    deleteStaffUser: builder.mutation({
      query: (staffId) => ({
        url: `/users/${staffId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    addStaffUser: builder.mutation({
      query: (user) => ({
        url: `/users`,
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useDeleteStaffUserMutation,
  useAddStaffUserMutation,
} = usersApiSlice;
