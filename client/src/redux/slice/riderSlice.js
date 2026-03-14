import { createSlice } from "@reduxjs/toolkit";

const riderSlice = createSlice({
  name: "rider",
  initialState: {
    profile: null,
    orders: [],
    riderOrder: [],
  },

  reducers: {
    setProfile(state, action) {
      state.profile = action.payload;
    },

    setOrders(state, action) {
      state.orders = action.payload;
    },

    setRiderOrder(state, action) {
      state.riderOrder = action.payload;
    },
  },
});

export const { setProfile, setOrders, setRiderOrder } = riderSlice.actions;
export default riderSlice.reducer;
