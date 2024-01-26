import {api} from './services/api';
import {authSlice} from './slices/authSlice';
import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './reducers/rootReducer';
import {createTransformCompress} from './transformer';
import {setupListeners} from '@reduxjs/toolkit/query/react';
import FilesystemStorage from 'redux-persist-filesystem-storage';

import {
  FLUSH,
  PAUSE,
  PURGE,
  PERSIST,
  REGISTER,
  REHYDRATE,
  persistStore,
  persistReducer,
} from 'redux-persist';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: FilesystemStorage,
  blacklist: [authSlice.name],
  transformers: [
    createTransformCompress({
      whitelist: [authSlice.name],
    }),
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
export default store;
