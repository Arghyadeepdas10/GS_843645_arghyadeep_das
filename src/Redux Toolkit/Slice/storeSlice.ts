import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Store {
  id: number; // Unique identifier for the store
  name: string; // Name of the store
  city: string; // City where the store is located
  state: string; // State where the store is located
}

interface StoreState {
  stores: Store[]; // Array of stores
}

const initialState: StoreState = {
  stores: [],
};

export const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    addStore: (state, action: PayloadAction<Store>) => {
      state.stores.push(action.payload);
    },
    updateStore: (state, action: PayloadAction<{ id: number; newName: string }>) => {
      const store = state.stores.find((store) => store.id === action.payload.id);
      if (store) store.name = action.payload.newName;
    },
    removeStore: (state, action: PayloadAction<number>) => {
      state.stores = state.stores.filter((store) => store.id !== action.payload);
    },
    reorderStores: (state, action: PayloadAction<Store[]>) => {
      state.stores = action.payload;
    },
  },
});

export const { addStore, updateStore, removeStore, reorderStores } = storeSlice.actions;
export default storeSlice.reducer;
