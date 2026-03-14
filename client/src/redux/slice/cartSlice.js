import { createSlice } from "@reduxjs/toolkit";

// 🔥 Load saved cart items
const savedItems = JSON.parse(localStorage.getItem("cartItems")) || [];

// 🔥 Recalculate totals from saved items
const calculateTotals = (items) => {
  const totalAmount = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  return { totalAmount, totalQuantity };
};

const { totalAmount, totalQuantity } = calculateTotals(savedItems);

const initialState = {
  items: savedItems,
  totalAmount,
  totalQuantity,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addToCart(state, action) {
      const item = action.payload;

      const existingItem = state.items.find((i) => i._id === item._id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...item,
          quantity: 1,
        });
      }

      const totals = calculateTotals(state.items);
      state.totalAmount = totals.totalAmount;
      state.totalQuantity = totals.totalQuantity;
    },

    removeFromCart(state, action) {
      const id = action.payload;

      const existingItem = state.items.find((i) => i._id === id);

      if (!existingItem) return;

      if (existingItem.quantity === 1) {
        state.items = state.items.filter((i) => i._id !== id);
      } else {
        existingItem.quantity -= 1;
      }

      const totals = calculateTotals(state.items);
      state.totalAmount = totals.totalAmount;
      state.totalQuantity = totals.totalQuantity;
    },

    clearCart(state) {
      state.items = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
