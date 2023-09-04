import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setChannel } from "./currentSlice";

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
    removeServer: (state, action) => {
      const { serverID } = action.payload;
      delete state.byServerID[serverID];
      state.status = "succeeded";
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
  async ({ token, serverID, curChannels }, { getState, dispatch }) => {
    const channels = getState().channels.byServerID;
    if (serverID in channels) {
      const data = getState().channels.byServerID[serverID];
      curChannels(data);
      if (data.length > 0) {
        dispatch(
          setChannel({ id: data[0].channelID, name: data[0].channelName })
        );
      } else {
        setChannel({});
      }
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
    curChannels(data);
    if (data.length > 0) {
      dispatch(
        setChannel({ id: data[0].channelID, name: data[0].channelName })
      );
    } else {
      setChannel({});
    }
    return { isNew: true, serverID: serverID, channels: data };
  }
);
export const { addGeneralChannel, removeServer } = channelsSlice.actions;
export default channelsSlice.reducer;
