import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  status: "idle",
  error: null,
};

const serversSlice = createSlice({
  name: "servers",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchServers.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchServers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchServers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const fetchServers = createAsyncThunk(
  "servers/fetchServers",
  async (token) => {
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/servers`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to get servers.");
    }
    const data = await res.json();
    return data;
  }
);

export default serversSlice.reducer;
