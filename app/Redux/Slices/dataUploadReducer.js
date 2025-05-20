import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const dataUploadSlice = createSlice({
  name: "dataUpload",
  initialState,
  reducers: {
    setData: (state, action) => {
      if (Array.isArray(action.payload)) {
        return action.payload;
      }
      return state;
    },
    add: (state, action) => {
      state.push(action.payload);
    },
    remove: (state, action) => {
      return state.filter((user) => user.ID !== action.payload);
    },
  },
});

export const { add, remove, setData } = dataUploadSlice.actions;
export default dataUploadSlice.reducer;
