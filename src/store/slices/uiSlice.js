import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  language: localStorage.getItem('language') || 'ar',
  sidebarOpen: false,
  miniCartOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleMiniCart: (state) => {
      state.miniCartOpen = !state.miniCartOpen;
    },
    setMiniCartOpen: (state, action) => {
      state.miniCartOpen = action.payload;
    },
  },
});

export const {
  setLanguage,
  toggleSidebar,
  setSidebarOpen,
  toggleMiniCart,
  setMiniCartOpen,
} = uiSlice.actions;
export default uiSlice.reducer;

