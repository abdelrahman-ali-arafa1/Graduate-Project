import { configureStore } from "@reduxjs/toolkit";
import dataUploadReducer from "./Slices/dataUploadReducer";
import userRoleSlice from "./Slices/userRole";
import { authApiSlice } from "./features/authApiSlice";
import { coursesApiSlice } from "./features/coursesApiSlice";
import selectedCourseReducer, { hydrate as hydrateSelectedCourse } from "./Slices/selectedCourseSlice.js";
import { sessionApiSlice } from "./features/sessionApiSlice";
import { attendanceApiSlice } from "./features/attendanceApiSlice";
import { usersApiSlice } from "./features/usersApiSlice";
import { dashboardApiSlice } from "./features/dashboardApiSlice";
import sessionReducer, { hydrate as hydrateSession } from "./Slices/sessionSlice";

const Store = configureStore({
  reducer: {
    dataUpload: dataUploadReducer,
    userRole: userRoleSlice,
    selectedCourse: selectedCourseReducer,
    session: sessionReducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [coursesApiSlice.reducerPath]: coursesApiSlice.reducer,
    [sessionApiSlice.reducerPath]: sessionApiSlice.reducer,
    [attendanceApiSlice.reducerPath]: attendanceApiSlice.reducer, 
    [usersApiSlice.reducerPath]: usersApiSlice.reducer, 
    [dashboardApiSlice.reducerPath]: dashboardApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApiSlice.middleware,
      coursesApiSlice.middleware,
      sessionApiSlice.middleware,
      attendanceApiSlice.middleware,
      usersApiSlice.middleware,
      dashboardApiSlice.middleware
    ),
});

export const initializeStore = (preloadedState) => {
  if (preloadedState?.selectedCourse) {
    Store.dispatch(hydrateSelectedCourse());
  }
  Store.dispatch(hydrateSession());
};


export default Store;
