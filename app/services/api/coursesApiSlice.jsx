import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl:
    "https://attendance-git-main-eslam-razeens-projects.vercel.app/api/attendanceQRCode",
  prepareHeaders: (headers) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")?.replace(/"/g, "") || "";
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return headers;
  },
  credentials: "include",
});

export const coursesApiSlice = createApi({
  reducerPath: "coursesApi",
  baseQuery,
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: () => "/courses",
    }),
  }),
});

export const { useGetCoursesQuery } = coursesApiSlice;
