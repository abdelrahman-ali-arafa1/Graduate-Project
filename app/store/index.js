import { configureStore } from "@reduxjs/toolkit";
import dataUploadReducer from "./Slices/dataUploadReducer";
import userRoleSlice from "./Slices/userRole";
import { authApiSlice } from "./features/authApiSlice";
import { coursesApiSlice } from "./features/coursesApiSlice";
import selectedCourseReducer, { hydrate } from "./Slices/selectedCourseSlice.js";
import { sessionApiSlice } from "./features/sessionApiSlice";
import { attendanceApiSlice } from "./features/attendanceApiSlice";
import { usersApiSlice } from "./features/usersApiSlice";

const Store = configureStore({
  reducer: {
    dataUpload: dataUploadReducer,
    userRole: userRoleSlice,
    selectedCourse: selectedCourseReducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [coursesApiSlice.reducerPath]: coursesApiSlice.reducer,
    [sessionApiSlice.reducerPath]: sessionApiSlice.reducer,
    [attendanceApiSlice.reducerPath]: attendanceApiSlice.reducer, 
    [usersApiSlice.reducerPath]: usersApiSlice.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApiSlice.middleware,
      coursesApiSlice.middleware,
      sessionApiSlice.middleware,
      attendanceApiSlice.middleware,
      usersApiSlice.middleware
    ),
});

export const initializeStore = (preloadedState) => {
  if (preloadedState?.selectedCourse) {
    Store.dispatch(hydrate());
  }
};


export default Store;
