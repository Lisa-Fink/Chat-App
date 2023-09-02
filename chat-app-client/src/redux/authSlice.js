import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  userID: null,
  token: null,
  isAuthenticated: false,
  username: null,
  email: null,
  userImageUrl: null,
  status: "idle",
  error: null,
  errorContext: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state, action) => {
      state.userID = null;
      state.token = null;
      state.isAuthenticated = false;
      state.username = null;
      state.email = null;
      state.userImageUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        // login the user
        state.userID = action.payload.userID;
        state.token = action.payload.jwtAuthResponse.token;
        state.isAuthenticated = true;
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.userImageUrl = action.payload.userImageUrl;
        state.error = null;
        state.errorContext = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error.message;
        state.errorContext = "login";
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.error = action.error.message;
        state.errorContext = "updatePassword";
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.error = null;
        state.errorContext = null;
      })
      .addCase(registerAndLogin.fulfilled, (state, action) => {
        // login the user
        state.userID = action.payload.userID;
        state.token = action.payload.jwtAuthResponse.token;
        state.isAuthenticated = true;
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.userImageUrl = action.payload.userImageUrl;
        state.error = null;
        state.errorContext = null;
      })
      .addCase(registerAndLogin.rejected, (state, action) => {
        state.error = action.error.message;
        state.errorContext = "registerAndLogin";
      })
      .addCase(updateImage.rejected, (state, action) => {
        state.error = action.error.message;
        state.errorContext = "updateImage";
      })
      .addCase(updateImage.fulfilled, (state, action) => {
        state.error = null;
        state.errorContext = null;
        state.userImageUrl = action.payload;
      });
  },
});

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch }) => {
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
    return data;
  }
);

export const registerAndLogin = createAsyncThunk(
  "auth/registerAndLogin",
  async (userData, { dispatch }) => {
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
    return data;
  }
);

export const updatePassword = createAsyncThunk(
  "users/updatePassword",
  async (password, { getState }) => {
    const token = getState().auth.token;
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/users/password`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "text/plain",
        Authorization: `Bearer ${token}`,
      },
      body: password,
    });
    if (!res.ok) {
      throw new Error("Failed to change password");
    }
  }
);

export const updateImage = createAsyncThunk(
  "user/updateImage",
  async (image, { getState }) => {
    const token = getState().auth.token;
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/users/image`;
    const requestBody = { userImageUrl: image };
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });
    if (!res.ok) {
      throw new Error("Failed to change image");
    }
    return image;
  }
);

export const { logout } = authSlice.actions;

export default authSlice.reducer;
