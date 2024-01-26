import {api} from '../services/api';
import {authSlice} from '../slices/authSlice';
import {combineReducers} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';
import createSensitiveStorage from 'redux-persist-sensitive-storage';

const sensitiveStorage = createSensitiveStorage({
  keychainService: 'myKeychain',
  sharedPreferencesName: 'mySharedPrefs',
});

const tokenPersistConfig = {
  key: 'token',
  storage: sensitiveStorage,
};

export default combineReducers({
  [authSlice.name]: persistReducer(tokenPersistConfig, authSlice.reducer),
  [api.reducerPath]: api.reducer,
});
