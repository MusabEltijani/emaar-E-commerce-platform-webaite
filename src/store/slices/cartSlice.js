import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartId: null,
  sessionId: null,
  items: [],   // API shape: { id(uuid), product_id, name, name_ar, thumbnail_url, price, subtotal, qty }
  total: 0,
  loading: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Full cart replace from API response { cart_id, session_id, items, total }
    setCart: (state, action) => {
      const cart = action.payload;
      if (!cart) return;
      state.cartId = cart.cart_id ?? state.cartId;
      state.sessionId = cart.session_id ?? state.sessionId;
      state.items = Array.isArray(cart.items) ? cart.items : [];
      state.total = cart.total ?? 0;
    },
    // Optimistic local add when API doesn't return full cart
    addItem: (state, action) => {
      const incoming = action.payload;
      const existing = state.items.find((i) => i.product_id === incoming.product_id);
      if (existing) {
        existing.qty = (existing.qty || 0) + (incoming.qty || 1);
        existing.subtotal = existing.price * existing.qty;
      } else {
        state.items.push({ ...incoming, qty: incoming.qty || 1, subtotal: incoming.price * (incoming.qty || 1) });
      }
      state.total = state.items.reduce((sum, i) => sum + (i.subtotal || 0), 0);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      state.total = state.items.reduce((sum, i) => sum + (i.subtotal || 0), 0);
    },
    updateItemQty: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.qty = qty;
        item.subtotal = item.price * qty;
        state.total = state.items.reduce((sum, i) => sum + (i.subtotal || 0), 0);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.cartId = null;
      state.sessionId = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setCart, addItem, removeItem, updateItemQty, clearCart, setLoading } = cartSlice.actions;
export default cartSlice.reducer;
