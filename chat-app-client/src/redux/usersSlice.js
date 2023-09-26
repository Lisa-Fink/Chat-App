import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { removeFromServers } from "./serversSlice";

const initialState = {
  dataByID: {},
  byChannelID: {},
  byServerID: {},
  status: "idle",
  newID: null, // [serverID, userID]
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
    removeServer: (state, action) => {
      const { serverID } = action.payload;
      delete state.byServerID[serverID];
    },
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
    addUserServerUpdate: (state, action) => {
      const { serverID, userID, username, userImageUrl, serverRoleID } =
        action.payload.data;
      const user = { userID, username, userImageUrl };
      user.serverRoles = {};
      user.serverRoles[serverID] = serverRoleID;
      state.dataByID[userID] = user; // add to all users data
      if (!state.byServerID[serverID].includes(userID)) {
        state.byServerID[serverID].push(userID); // add to server users
      }
      state.status = "new";
      state.newID = [serverID, userID];
    },
    addUserServerChannelUpdate: (state, action) => {
      // add to any channels that have been fetched
      const channels = action.payload.channels;
      const userID = action.payload.newUserID;
      for (const channel of channels) {
        const channelID = channel.channelID;
        if (
          parseInt(channel.roleID) === 4 &&
          channelID in state.byChannelID &&
          !state.byChannelID[channelID].includes(userID)
        ) {
          state.byChannelID[channelID].push(userID);
        }
      }
      state.status = "succeeded";
      state.newID = null;
    },
    removeUserServerUpdate: (state, action) => {
      const { userID, serverID } = action.payload.data;
      removeUserServerHelper(userID, serverID, state);
    },
    removeUserServerChannelUpdate: (state, action) => {
      const { channelIDs, delUserID } = action.payload;
      for (const channelID of channelIDs) {
        state.byChannelID[channelID] = state.byChannelID[channelID].filter(
          (id) => parseInt(id) !== parseInt(delUserID)
        );
      }
      state.status = "succeeded";
      state.newID = null;
    },
    userServerRoleUpdate: (state, action) => {
      updateUserServerRoleHelper(
        action.payload.userID,
        action.payload.serverID,
        action.payload.roleID,
        state
      );
    },
    currentUserServerRoleUpdate: (state, action) => {
      const { userID, serverID, roleID } = action.payload;
      updateOnlyRole(userID, serverID, roleID, state);
    },
    userChannelRoleUpdate: (state, action) => {
      const { channels, userID, serverID } = action.payload;
      const roleID = state.dataByID[userID].serverRoles[serverID];
      for (const chan of channels) {
        if (roleID <= chan.roleID) {
          // if the user should be in the channel, but is not, add the id
          if (!state.byChannelID[chan.channelID].includes(userID)) {
            state.byChannelID[chan.channelID].push(userID);
          }
        } else {
          // the user shouldn't be in the channel, so make sure it is not
          state.byChannelID[chan.channelID] = state.byChannelID[
            chan.channelID
          ].filter((id) => parseInt(id) !== parseInt(userID));
        }
      }
      state.newID = null;
      state.status = "succeeded";
    },
    updateUserImage: (state, action) => {
      const { userID, userImageUrl } = action.payload;
      state.dataByID[userID].userImageUrl = userImageUrl;
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
        updateUserServerRoleHelper(
          action.payload.userID,
          action.payload.serverID,
          action.payload.roleID,
          state
        );
      })
      .addCase(removeUserFromServer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(removeUserFromServer.fulfilled, (state, action) => {
        state.error = null;
        const { userID, serverID } = action.payload;
        removeUserServerHelper(userID, serverID, state);
      })
      .addCase(removeCurrentUserFromServer.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(removeCurrentUserFromServer.fulfilled, (state, action) => {
        const { channelIDs, serverID } = action.payload;
        for (const channelID of channelIDs) {
          delete state.byChannelID[channelID];
        }
        delete state.byServerID[serverID];
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

function updateUserServerRoleHelper(userID, serverID, roleID, state) {
  state.status = "serverRole";
  state.newID = [serverID, userID];
  state.error = null;
  updateOnlyRole(userID, serverID, roleID, state);
}

function updateOnlyRole(userID, serverID, roleID, state) {
  state.dataByID[userID].serverRoles[serverID] = roleID;
}

function removeUserServerHelper(userID, serverID, state) {
  state.byServerID[serverID] = state.byServerID[serverID].filter(
    (id) => parseInt(id) !== parseInt(userID)
  );
  state.status = "delete";
  state.newID = [serverID, userID];
}

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
    return { userID: userID, serverID: serverID };
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
    const channelIDs = getState().channels.byServerID[serverID].map(
      (chan) => chan.channelID
    );
    // remove server from servers
    dispatch(removeFromServers({ serverID }));
    // remove all message from each channel in the server
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
  removeServer,
  removeUserFromChannels,
  clearUserChannel,
  setUserChannel,
  addUserChannelUpdate,
  removeUserChannelUpdate,
  addUserServerUpdate,
  addUserServerChannelUpdate,
  removeUserServerUpdate,
  removeUserServerChannelUpdate,
  userServerRoleUpdate,
  userChannelRoleUpdate,
  currentUserServerRoleUpdate,
  updateUserImage,
} = usersSlice.actions;
export default usersSlice.reducer;
