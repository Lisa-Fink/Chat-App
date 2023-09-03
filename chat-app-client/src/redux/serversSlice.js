import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addGeneralChannel } from "./channelsSlice";
import { joinGeneralChannel } from "./usersSlice";

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
      })
      .addCase(createServer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createServer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.data.push(action.payload.server);
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

export const createServer = createAsyncThunk(
  "servers/createServer",
  async (
    { token, serverName, serverDescription, serverImageUrl, user },
    { dispatch }
  ) => {
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/servers`;
    const server = {
      serverName: serverName,
      serverDescription: serverDescription,
      serverImageUrl: serverImageUrl,
    };
    const requestBody = JSON.stringify(server);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: requestBody,
    });
    if (!res.ok) {
      throw new Error("Failed to create server.");
    }
    const data = await res.json();
    server.serverID = data.serverID;
    // Add General Channel to channels and this user to its users
    dispatch(
      addGeneralChannel({
        serverID: server.serverID,
        channelID: data.channelID,
      })
    );
    dispatch(joinGeneralChannel({ channelID: data.channelID, user }));
    return { server: server };
  }
);

export default serversSlice.reducer;
