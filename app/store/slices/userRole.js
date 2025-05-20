import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAdmin:
    typeof window !== "undefined"
      ? localStorage.getItem("isAdmin") === "true"
      : false,
  isInstructor:
    typeof window !== "undefined"
      ? localStorage.getItem("isInstructor") === "true"
      : false,
  token:
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "",
};

const userRoleSlice = createSlice({
  name: "userRole",
  initialState,
  reducers: {
    hydrateUserRole: (state) => {
      if (typeof window !== "undefined") {
        state.isAdmin = localStorage.getItem("isAdmin") === "true";
        state.isInstructor = localStorage.getItem("isInstructor") === "true";
        state.token = localStorage.getItem("token") || "";
      }
    },
    setAdminRole: (state) => {
      state.isAdmin = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("isAdmin", "true");
      }
    },
    setInstructorRole: (state) => {
      state.isAdmin = false;
      if (typeof window !== "undefined") {
        localStorage.setItem("isAdmin", "false");
      }
    },
    setLecturerRole: (state, action) => {
      state.isInstructor = action.payload === "instructor" ? "instructor" : "assistant";
      if (typeof window !== "undefined") {
        localStorage.setItem("isInstructor", state.isInstructor);
      }
    },
    setToken: (state, action) => {
      state.token = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload);
      }
    },
  },
});

export const {
  setAdminRole,
  setInstructorRole,
  setLecturerRole,
  setToken,
  hydrateUserRole,
} = userRoleSlice.actions;
export default userRoleSlice.reducer;
