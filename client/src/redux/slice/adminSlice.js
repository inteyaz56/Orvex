import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    resturant: [],
    rider: [],
    pendingResturant: [],
    pendingRider: [],
  },

  reducers: {
    setResturant(state, action) {
      state.resturant = action.payload;
    },

    setRider(state, action) {
      state.rider = action.payload;
    },
    setPendingResturant(state, action) {
      state.pendingResturant = action.payload;
    },

    setPendingRider(state, action) {
      state.pendingRider = action.payload;
    },
  },
});

export const {
  setResturant,
  setRider,
  setPendingResturant,
  setPendingRider,



































} = adminSlice.actions;
export default adminSlice.reducer;
