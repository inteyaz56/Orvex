import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import resturantSlice from "./slice/resturantSlice";
import cartSlice from "./slice/cartSlice";
import riderSlice from "./slice/riderSlice";
import adminSlice from "./slice/adminSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    resturant: resturantSlice,
    cart: cartSlice,
    rider: riderSlice,
    admin: adminSlice,
  },
});

store.subscribe(() => {
  const { items } = store.getState().cart;
  localStorage.setItem("cartItems", JSON.stringify(items));
});
