import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  language: localStorage.getItem('language') || 'ar',
  sidebarOpen: false,
  miniCartOpen: false,
  viewMode: localStorage.getItem('viewMode') || 'grid', // 'grid' | 'list'
  filters: {
    availability: 'all', // 'all' | 'in_stock' | 'out_of_stock'
    priceRange: { min: 0, max: 10000 },
    selectedBrands: [],
  },
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
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
      localStorage.setItem('viewMode', action.payload);
    },
    setAvailabilityFilter: (state, action) => {
      state.filters.availability = action.payload;
    },
    setPriceRangeFilter: (state, action) => {
      state.filters.priceRange = action.payload;
    },
    setSelectedBrands: (state, action) => {
      state.filters.selectedBrands = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        availability: 'all',
        priceRange: { min: 0, max: 10000 },
        selectedBrands: [],
      };
    },
  },
});

export const {
  setLanguage,
  toggleSidebar,
  setSidebarOpen,
  toggleMiniCart,
  setMiniCartOpen,
  setViewMode,
  setAvailabilityFilter,
  setPriceRangeFilter,
  setSelectedBrands,
  clearFilters,
} = uiSlice.actions;
export default uiSlice.reducer;

