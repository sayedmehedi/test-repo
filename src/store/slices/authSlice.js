import {api} from '../services/api';
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  userData: {},
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
      state.userData = {};
    },
  },
  extraReducers: builder => {
    builder.addMatcher(api.endpoints.login.matchFulfilled, (state, action) => {
      state.isLoggedIn = true;
      const {username} = action.payload;
      state.userData = {
        username,
      };
    });
  },
});
