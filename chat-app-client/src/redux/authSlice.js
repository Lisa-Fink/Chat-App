import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  userID: null,
  token: null,
  isAuthenticated: false,
  username: null,
  email: null,
  userImageUrl: null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userID = action.payload.userID;
      state.token = action.payload.jwtAuthResponse.token;
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.userImageUrl = action.payload.userImageUrl;
    },
    logout: (state, action) => {
      state.userID = null;
      state.token = null;
      state.isAuthenticated = false;
      state.username = null;
      state.email = null;
      state.userImageUrl = null;
    },
  },
});

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch }) => {
    try {
      const apiUrl = import.meta.env.VITE_CHAT_API;
      const url = `${apiUrl}/users/login`;
      const requestBody = JSON.stringify(credentials);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });
      if (!res.ok) {
        throw new Error("Failed to login.");
      }
      const data = await res.json();
      dispatch(authSlice.actions.setUser(data));
    } catch (error) {
      throw error;
    }
  }
);

export const registerAndLogin = createAsyncThunk(
  "auth/registerAndLogin",
  async (userData, { dispatch }) => {
    try {
      const apiUrl = import.meta.env.VITE_CHAT_API;
      const url = `${apiUrl}/users/signup`;
      const requestBody = JSON.stringify(userData);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });
      if (!res.ok) {
        throw new Error("Failed to create account.");
      }
      const data = await res.json();
      dispatch(authSlice.actions.setUser(data));
    } catch (error) {
      throw error;
    }
  }
);

export const { logout } = authSlice.actions;

export default authSlice.reducer;
