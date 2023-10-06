import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setUserChannel } from "./usersSlice";
import { updateServerRead } from "./serversSlice";

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
    editRole: (state, action) => {
      const { serverID, channelID, roleID } = action.payload;
      state.byServerID[serverID] = state.byServerID[serverID].map((chan) => {
        if (parseInt(chan.channelID) === parseInt(channelID)) {
          chan.roleID = roleID;
        }
        return chan;
      });
    },
    editName: (state, action) => {
      const { serverID, channelID, name } = action.payload;
      state.byServerID[serverID] = state.byServerID[serverID].map((chan) => {
        if (parseInt(chan.channelID) === parseInt(channelID)) {
          chan.channelName = name;
        }
        return chan;
      });
    },
    deleteChannelUpdate: (state, action) => {
      deleteChannelHelper(state, action);
    },
    addChannelUpdate: (state, action) => {
      const { channel } = action.payload;
      const { serverID } = channel;
      if (
        serverID in state.byServerID &&
        !state.byServerID[serverID].find(
          (chan) => parseInt(chan.channelID) === parseInt(channel.channelID)
        )
      ) {
        addChannelHelper(state, serverID, channel);
      }
    },
    addChannels: (state, action) => {
      state.status = "initialized";
      state.byServerID = action.payload;
    },
    channelSuccess: (state) => {
      state.status = "succeeded";
    },
    channelHasNewMessage: (state, action) => {
      const { channelID, msgTime } = action.payload;
      // get the serverID first
      const servers = Object.keys(state.byServerID);
      for (const serverID of servers) {
        const channels = state.byServerID[serverID];
        const found = channels.find(
          (chan) => parseInt(chan.channelID) === parseInt(channelID)
        );
        if (found) {
          const channel = state.byServerID[serverID].find(
            (chan) => parseInt(chan.channelID) === parseInt(channelID)
          );
          channel.hasUnread = true;
          channel.channelTime = msgTime;
          state.newIDs = [serverID, channelID];
          state.status = "newMsg";
        }
      }
    },
    channelNewMessageCreate: (state, action) => {
      const { channelID, serverID, msgTime } = action.payload;
      const channel = state.byServerID[serverID].find(
        (chan) => parseInt(chan.channelID) === parseInt(channelID)
      );
      channel.channelTime = msgTime;
      channel.userRead = msgTime;
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
        deleteChannelHelper(state, action);
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        addChannelHelper(state, action.payload.serverID, action.payload);
      })
      .addCase(readChannelMsg.fulfilled, (state, action) => {
        if (action.payload.noUpdate) return;
        const { channelID, serverID, isLast, msgTime } = action.payload;

        const channel = state.byServerID[serverID].find(
          (chan) => parseInt(chan.channelID) === parseInt(channelID)
        );
        channel.userRead = msgTime;
        if (isLast) {
          // if the last read channel is the last message in the channel update has unread
          channel.hasUnread = false;
        }
      });
  },
});

function addChannelHelper(state, serverID, channel) {
  state.status = "new";
  state.newIDs = [serverID, channel.channelID];
  state.byServerID[serverID].push(channel);
}

function deleteChannelHelper(state, action) {
  const { serverID, channelID } = action.payload;
  state.byServerID[serverID] = state.byServerID[serverID].filter(
    (chan) => parseInt(chan.channelID) !== parseInt(channelID)
  );
}

export const fetchChannelsForServer = createAsyncThunk(
  "channels/fetchChannelsForServer",
  async ({ token, serverID }, { getState }) => {
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
  async ({ token, serverID, channelID, roleID, oldRoleID }, { dispatch }) => {
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/servers/${serverID}/channels/${channelID}/role`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roleID: parseInt(roleID),
        oldRoleID: parseInt(oldRoleID),
      }),
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

export const readChannelMsg = createAsyncThunk(
  "channels/readChannelMsg",
  async (
    { token, serverID, channelID, msgTime, isLast },
    { getState, dispatch }
  ) => {
    if (!token || !serverID || !channelID || !msgTime || isLast === null)
      return;
    // check if channel has unread
    // check if readMsg time is valid (>userRead)
    const channel = getState().channels.byServerID[serverID].find(
      (chan) => parseInt(chan.channelID) === parseInt(channelID)
    );
    if (
      !channel ||
      !channel.hasUnread ||
      (channel.userRead && msgTime < channel.userRead)
    )
      return { noUpdate: true };

    // update ChannelRead for userID and channelID with new msgTime
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/servers/${serverID}/channels/${channelID}/channel-read`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body: msgTime,
    });
    if (!res.ok) {
      throw new Error("Failed to update channel read.");
    }
    if (isLast) {
      const channels = getState().channels.byServerID[serverID];
      for (const chan of channels) {
        if (
          parseInt(chan.channelID) !== parseInt(channelID) &&
          chan.hasUnread
        ) {
          return { channelID, serverID, isLast, msgTime };
        }
      }
      dispatch(updateServerRead({ id: serverID }));
    }
    return { channelID, serverID, isLast, msgTime };
  }
);

export const {
  addGeneralChannel,
  removeServer,
  editRole,
  deleteChannelUpdate,
  addChannelUpdate,
  editName,
  addChannels,
  channelSuccess,
  markAsRead,
  channelHasNewMessage,
  channelNewMessageCreate,
} = channelsSlice.actions;
export default channelsSlice.reducer;
