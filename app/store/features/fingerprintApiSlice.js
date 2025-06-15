import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const fingerprintApiSlice = createApi({
  reducerPath: 'fingerprintApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://attendance-eslamrazeen-eslam-razeens-projects.vercel.app/api/attendanceQRCode/fingerprint',
    credentials: 'include',
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
  endpoints: (builder) => ({
    getAllEnrollFingerprints: builder.query({
      query: () => '/enroll/getAllEnrollFingerprints',
      transformResponse: (response) => response.data || [],
    }),
    fingerprintFirstRegister: builder.mutation({
      query: ({ studentId, fingerprintId }) => ({
        url: '/enroll/fingerprintFirstRegister',
        method: 'POST',
        body: { studentId, fingerprintId },
      }),
    }),
    fingerprintFirstVerify: builder.mutation({
      query: ({ sessionID }) => ({
        url: '/verify/fingerprintFirstVerify',
        method: 'POST',
        body: { sessionID },
      }),
    }),
  }),
});

export const {
  useGetAllEnrollFingerprintsQuery,
  useFingerprintFirstRegisterMutation,
  useFingerprintFirstVerifyMutation,
} = fingerprintApiSlice; 