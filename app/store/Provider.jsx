"use client"; // Important for Next.js App Router

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authReducer';
import dataUploadReducer from './slices/dataUploadReducer';
import userRoleSlice from './slices/userRole';
import selectedCourseReducer from './slices/selectedCourseSlice';
import sessionReducer from './slices/sessionSlice';
import apologiesReducer from './slices/apologySlice';
import { authApiSlice } from './features/authApiSlice';
import { coursesApiSlice } from './features/coursesApiSlice';
import { sessionApiSlice } from './features/sessionApiSlice';
import { attendanceApiSlice } from './features/attendanceApiSlice';
import { usersApiSlice } from './features/usersApiSlice';
import { dashboardApiSlice } from './features/dashboardApiSlice';
import { documentsApiSlice } from './features/documentsApiSlice';
import { studentsApiSlice } from './features/studentsApiSlice';
import { apologyApiSlice } from './features/apologyApiSlice';
import { setupListeners } from '@reduxjs/toolkit/query';

// إنشاء متجر جديد لكل طلب
const makeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      dataUpload: dataUploadReducer,
      userRole: userRoleSlice,
      selectedCourse: selectedCourseReducer,
      session: sessionReducer,
      apologies: apologiesReducer,
      [authApiSlice.reducerPath]: authApiSlice.reducer,
      [coursesApiSlice.reducerPath]: coursesApiSlice.reducer,
      [sessionApiSlice.reducerPath]: sessionApiSlice.reducer,
      [attendanceApiSlice.reducerPath]: attendanceApiSlice.reducer,
      [usersApiSlice.reducerPath]: usersApiSlice.reducer,
      [dashboardApiSlice.reducerPath]: dashboardApiSlice.reducer,
      [documentsApiSlice.reducerPath]: documentsApiSlice.reducer,
      [studentsApiSlice.reducerPath]: studentsApiSlice.reducer,
      [apologyApiSlice.reducerPath]: apologyApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authApiSlice.middleware,
        coursesApiSlice.middleware,
        sessionApiSlice.middleware,
        attendanceApiSlice.middleware,
        usersApiSlice.middleware,
        dashboardApiSlice.middleware,
        documentsApiSlice.middleware,
        studentsApiSlice.middleware,
        apologyApiSlice.middleware
      ),
    devTools: process.env.NODE_ENV !== 'production',
  });

  setupListeners(store.dispatch);
  
  return store;
};

export default function StoreProvider({ children }) {
  // إنشاء مخزن جديد فقط مرة واحدة عند التحميل الأولي
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
} 