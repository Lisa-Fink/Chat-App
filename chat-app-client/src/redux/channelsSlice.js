import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  byServerID: {},
  status: "idle",
  error: null,
};

const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    addGeneralChannel: (state, action) => {
      const { serverID, channelID } = action.payload;

      const channel = {
        channelID: channelID,
        channelName: "General",
        serverID: serverID,
        channelTypeID: 1,
        roleID: 4,
      };
      state.byServerID[serverID] = [channel];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchChannelsForServer.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchChannelsForServer.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { isNew, serverID, channels } = action.payload;
        if (isNew) state.byServerID[serverID] = channels;
      })
      .addCase(fetchChannelsForServer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const fetchChannelsForServer = createAsyncThunk(
  "channels/fetchChannelsForServer",
  async ({ token, serverID }, { getState }) => {
    const channels = getState().channels.byServerID;
    if (serverID in channels) {
      return { isNew: false };
    }
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/servers/${serverID}/channels`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to get channels.");
    }
    const data = await res.json();
    return { isNew: true, serverID: serverID, channels: data };
  }
);
export const { addGeneralChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
