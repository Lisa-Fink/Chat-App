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
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUsersForChannel.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchUsersForChannel.fulfilled, (state, action) => {
        const { isNew, channelID, userIDs } = action.payload;
        if (isNew) {
          state.byChannelID[channelID] = [];
          for (const userID of userIDs) {
            state.byChannelID[channelID].push(userID);
          }
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
            user.serverRoles = {};
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
    console.log(data);
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

export const { joinGeneralChannel, removeChannels, removeUserFromChannels } =
  usersSlice.actions;
export default usersSlice.reducer;
