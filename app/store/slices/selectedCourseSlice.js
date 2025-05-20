import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  course: null,
  sessionId: null,
};

export const selectedCourseSlice = createSlice({
  name: "selectedCourse",
  initialState,
  reducers: {
    hydrate: (state) => {
      if (typeof window !== "undefined") {
        state.course = JSON.parse(localStorage.getItem("selectedCourse") || "null");
        state.sessionId = localStorage.getItem("sessionId") || null;
      }
    },
    setSelectedCourse: (state, action) => {
      state.course = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("selectedCourse", JSON.stringify(action.payload));
      }
    },
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("sessionId", action.payload);
      }
    },
    clearSessionId: (state) => {
      state.sessionId = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("sessionId");
      }
    },
  },
});

export const { setSelectedCourse, setSessionId, hydrate, clearSessionId } = selectedCourseSlice.actions;
export default selectedCourseSlice.reducer;
