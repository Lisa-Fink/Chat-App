import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setUserChannel } from "./usersSlice";

const initialState = {
  byServerID: {},
  subs: [],
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
    addSub: (state, action) => {
      state.subs.push(action.payload.channelID);
    },
    editRole: (state, action) => {
      const { serverID, channelID, roleID } = action.payload;
      state.byServerID[serverID] = state.byServerID[serverID].map((chan) => {
        if (parseInt(chan.channelID) === parseInt(channelID)) {
          chan.roleID = roleID;
        }
        return chan;
      });
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
      })
      .addCase(updateChannelName.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateChannelName.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { serverID, channelID, channelName } = action.payload;
        state.byServerID[serverID].find(
          (chan) => chan.channelID === parseInt(channelID)
        ).channelName = channelName;
      })
      .addCase(updateChannelRole.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateChannelRole.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { serverID, channelID, roleID } = action.payload;
        state.byServerID[serverID].find(
          (chan) => parseInt(chan.channelID) === parseInt(channelID)
        ).roleID = roleID;
      })
      .addCase(deleteChannel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        const { serverID, channelID } = action.payload;
        state.byServerID[serverID] = state.byServerID[serverID].filter(
          (chan) => parseInt(chan.channelID) !== parseInt(channelID)
        );
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.byServerID[action.payload.serverID].push(action.payload);
      });
  },
});

export const fetchChannelsForServer = createAsyncThunk(
  "channels/fetchChannelsForServer",
  async ({ token, serverID }, { getState, dispatch }) => {
    const channels = getState().channels.byServerID;
    // check if the channels have already been fetched
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

export const updateChannelName = createAsyncThunk(
  "channels/updateChannelName",
  async ({ token, serverID, channelID, channelName }) => {
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/servers/${serverID}/channels/${channelID}/name`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body: channelName,
    });
    if (!res.ok) {
      throw new Error("Failed to update channel name.");
    }
    return { serverID, channelID, channelName };
  }
);

export const updateChannelRole = createAsyncThunk(
  "channels/updateChannelRole",
  async ({ token, serverID, channelID, roleID }, { dispatch }) => {
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/servers/${serverID}/channels/${channelID}/role`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body: roleID,
    });
    if (!res.ok) {
      throw new Error("Failed to update channel role.");
    }
    // new user list should be returned
    const userIDs = await res.json();
    dispatch(setUserChannel({ channelID: channelID, userIDs: userIDs }));

    return { serverID, channelID, roleID };
  }
);

export const createChannel = createAsyncThunk(
  "channels/createChannel",
  async ({ token, serverID, channelName, roleID }) => {
    const channelTypeID = 1;
    const requestBody = JSON.stringify({
      serverID,
      channelName,
      roleID,
      channelTypeID,
    });
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/servers/${serverID}/channels`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: requestBody,
    });
    if (!res.ok) {
      throw new Error("Failed to delete channel.");
    }
    const channelID = await res.json();
    return { serverID, channelID, channelName, roleID, channelTypeID };
  }
);

export const deleteChannel = createAsyncThunk(
  "channels/deleteChannel",
  async ({ token, serverID, channelID }) => {
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/servers/${serverID}/channels/${channelID}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to delete channel.");
    }
    return { serverID, channelID };
  }
);

export const { addGeneralChannel, removeServer, addSub, editRole } =
  channelsSlice.actions;
export default channelsSlice.reducer;
