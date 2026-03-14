import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    myProfile: null,
    address: null,
    active: null,
    notifications: [],
    count: 0,
  },

  reducers: {
    setUserData(state, action) {
      state.userData = action.payload;
    },

    setMyProfile(state, action) {
      state.myProfile = action.payload;
    },

    setAddress(state, action) {
      state.address = action.payload;
    },

    setActive(state, action) {
      state.active = action.payload;
    },

    setNotifications(state, action) {
      state.notifications = action.payload;
    },

    setCount(state, action) {
      state.count = action.payload;
    },

    // ✅ ADD THIS FOR REALTIME SOCKET NOTIFICATIONS
    addNotification(state, action) {
      state.notifications.unshift(action.payload);
      state.count += 1;
    },
  },
});

export const {
  setUserData,
  setMyProfile,
  setAddress,
  setActive,
  setCount,
  setNotifications,
  addNotification, // export it
} = userSlice.actions;

export default userSlice.reducer;
