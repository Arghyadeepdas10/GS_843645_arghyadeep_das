import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Uses localStorage by default
import { combineReducers } from 'redux';
import storeReducer from '../Slice/storeSlice';
import skuReducer from '../Slice/skuSlice';

// Combine reducers
const rootReducer = combineReducers({
  store: storeReducer,
  sku: skuReducer,
});

// Persist configuration
const persistConfig = {
  key: 'root', // The key used for storage
  storage, // Defaults to localStorage for web
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
