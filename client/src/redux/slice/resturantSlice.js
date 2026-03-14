import { createSlice } from "@reduxjs/toolkit";

const resturantSlice = createSlice({
  name: "resturant",
  initialState: {
    profile: null,
    menu: [],
    menus: [],
    categories: [],
  },

  reducers: {
    setProfile(state, action) {
      state.profile = action.payload;
    },
    setMenu(state, action) {
      state.menu = action.payload;
    },

    setMenus(state, action) {
      state.menus = action.payload;
    },

    setCategories(state, action) {
      state.categories = action.payload;
    },
  },
});

export const {
  setCategories,
  setMenu,
  setProfile,
  setMenus,
} = resturantSlice.actions;

export default resturantSlice.reducer;
