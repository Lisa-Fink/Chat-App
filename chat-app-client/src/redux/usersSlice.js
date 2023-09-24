import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { removeServer } from "./channelsSlice";
import { removeFromServers } from "./serversSlice";
import { setServer } from "./currentSlice";

const initialState = {
  dataByID: {},
  byChannelID: {},
  byServerID: {},
  status: "idle",
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    joinGeneralChannel: (state, action) => {
      const { channelID, user } = action.payload;
      // make sure the user is in dataByID
      if (!(user.userID in state.dataByID))
        state.dataByID[user.userID] = {
          userID: user.userID,
          username: user.username,
          userImageUrl: user.userImageUrl,
        };
      if (!(channelID in state.byChannelID)) {
        state.byChannelID[channelID] = [];
      }
      state.byChannelID[channelID].push(user.userID);
    },
    removeChannels: (state, action) => {
      const { channelIDs } = action.payload;
      for (const channelID of channelIDs) {
        delete state.byChannelID[channelID];
      }
    },
    removeServer: (state, action) => {},
    removeUserFromChannels: (state, action) => {
      const { channelIDs, removeID } = action.payload;
      for (const channelID of channelIDs) {
        if (state.byChannelID && channelID in state.byChannelID) {
          state.byChannelID[channelID] = state.byChannelID[channelID].filter(
            (userID) => userID !== removeID
          );
        }
      }
    },
    clearUserChannel: (state, action) => {
      const { channelID } = action.payload;
      delete state.byChannelID[channelID];
    },
    setUserChannel: (state, action) => {
      const { channelID, userIDs } = action.payload;
      state.byChannelID[channelID] = [];
      for (const userID of userIDs) {
        state.byChannelID[channelID].push(userID);
      }
    },
    addUserChannelUpdate: (state, action) => {
      const { channelID, userID } = action.payload;
      if (!state.byChannelID[channelID].includes(userID)) {
        state.byChannelID[channelID].push(userID);
      }
    },
    removeUserChannelUpdate: (state, action) => {
      const { channelID, userID } = action.payload;
      state.byChannelID[channelID] = state.byChannelID[channelID].filter(
        (id) => parseInt(id) !== parseInt(userID)
      );
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUsersForChannel.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchUsersForChannel.fulfilled, (state, action) => {
        const { isNew, channelID, userIDs } = action.payload;
        if (isNew) {
          usersSlice.caseReducers.setUserChannel(state, {
            payload: { channelID, userIDs },
          });
        }
        state.status = "succeeded";
      })
      .addCase(fetchUsersForChannel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUsersForServer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUsersForServer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        const { isNew, serverID, userServers } = action.payload;
        if (isNew) {
          state.byServerID[serverID] = [];
          for (const user of userServers) {
            if (user.userID in state.dataByID) {
              user.serverRoles = state.dataByID[user.userID].serverRoles;
            } else {
              user.serverRoles = {};
            }
            user.serverRoles[serverID] = user.roleID;
            state.dataByID[user.userID] = user;
            state.byServerID[serverID].push(user.userID);
          }
        }
      })
      .addCase(updateUserServerRole.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateUserServerRole.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.dataByID[action.payload.userID].serverRoles[
          action.payload.serverID
        ] = action.payload.roleID;
      })
      .addCase(removeUserFromServer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(removeUserFromServer.fulfilled, (state, action) => {
        state.error = null;
        const { userID, serverID, channelIDs } = action.payload;
        // remove from channels
        for (const channelID of channelIDs) {
          if (state.byChannelID && channelID in state.byChannelID) {
            state.byChannelID[channelID] = state.byChannelID[channelID].filter(
              (id) => id !== userID
            );
          }
        }
        state.status = "succeeded";
      })
      .addCase(removeCurrentUserFromServer.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(removeCurrentUserFromServer.fulfilled, (state, action) => {
        removeChannels(action.payload);
        removeServer(action.payload);
      })
      .addCase(removeUserChannel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(removeUserChannel.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { channelID, userID } = action.payload;
        state.byChannelID[channelID] = state.byChannelID[channelID].filter(
          (id) => id !== userID
        );
      })
      .addCase(addUserChannel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addUserChannel.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { channelID, userID } = action.payload;
        state.byChannelID[channelID].push(userID);
      });
  },
});

export const fetchUsersForChannel = createAsyncThunk(
  "users/fetchUsersForChannel",
  async ({ token, serverID, channelID }, { getState }) => {
    const userChannels = getState().users.byChannelID;
    if (channelID in userChannels) {
      return { isNew: false };
    }
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/users/${serverID}/${channelID}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to get users in channel.");
    }
    const data = await res.json();
    return { isNew: true, channelID: channelID, userIDs: data };
  }
);

export const fetchUsersForServer = createAsyncThunk(
  "users/fetchUsersForServer",
  async ({ token, serverID }, { getState }) => {
    if (serverID in getState().users.byServerID) {
      return { isNew: false };
    }
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/users/${serverID}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to get users in channel.");
    }
    const data = await res.json();
    return { isNew: true, serverID: serverID, userServers: data };
  }
);

export const updateUserServerRole = createAsyncThunk(
  "users/updateUserServerRole",
  async ({ token, serverID, userID, roleID }) => {
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/servers/${serverID}/users/${userID}/role`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body: roleID,
    });
    if (!res.ok) {
      throw new Error("Failed to update role.");
    }
    return { serverID: serverID, roleID: roleID, userID: userID };
  }
);

export const removeUserFromServer = createAsyncThunk(
  "users/removeUserFromServer",
  async ({ token, serverID, userID }, { getState }) => {
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/servers/${serverID}/users/${userID}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to create server.");
    }
    // delete the user in each userChannel for the server
    const channels = getState().channels.byServerID[serverID].map(
      (channel) => channel.channelID
    );
    return { userID: userID, channelIDs: channels, serverID: serverID };
  }
);

export const removeCurrentUserFromServer = createAsyncThunk(
  "users/removeCurrentUserFromServer",
  async ({ token, serverID, userID }, { dispatch, getState }) => {
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/servers/${serverID}/users/${userID}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to create server.");
    }
    // remove all channels belonging to the server from channels
    const channelIDs = getState().channels.byServerID[serverID];
    dispatch(removeServer({ serverID }));
    // remove server from servers
    dispatch(removeFromServers({ serverID }));
    // remove all message from each channel in the server

    // change to next server
    const servers = getState().servers.data;
    const next_server = servers.length > 0 ? servers[0] : {};
    dispatch(
      setServer({
        name: next_server.serverName,
        id: next_server.serverID,
        serverDescription: next_server.serverDescription,
        serverImageUrl: next_server.serverImageUrl,
      })
    );
    return { channelIDs: channelIDs, serverID: serverID };
  }
);

export const removeUserChannel = createAsyncThunk(
  "users/removeUserChannel",
  async ({ token, serverID, channelID, userID }) => {
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/servers/${serverID}/channels/${channelID}/users/${userID}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to remove user from channel.");
    }
    return { channelID, userID };
  }
);

export const addUserChannel = createAsyncThunk(
  "users/addUserChannel",
  async ({ token, serverID, channelID, userID }) => {
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/servers/${serverID}/channels/${channelID}/users/${userID}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to add user to channel.");
    }
    return { channelID, userID };
  }
);

export const {
  joinGeneralChannel,
  removeChannels,
  removeUserFromChannels,
  clearUserChannel,
  setUserChannel,
  addUserChannelUpdate,
  removeUserChannelUpdate,
} = usersSlice.actions;
export default usersSlice.reducer;
