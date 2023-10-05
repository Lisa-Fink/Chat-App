import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addGeneralChannel } from "./channelsSlice";
import { joinGeneralChannel } from "./usersSlice";

const initialState = {
  data: [],
  status: "idle",
  lastID: null,
  error: null,
};

const serversSlice = createSlice({
  name: "servers",
  initialState,
  reducers: {
    removeFromServers: (state, action) => {
      deleteServerHelper(state, action);
    },
    updateStatus: (state, action) => {
      state.status = "succeeded";
      state.lastID = null;
    },
    serverImageUpdate: (state, action) => {
      updateServerImageHelper(
        action.payload.serverID,
        action.payload.serverImageUrl,
        state
      );
    },
    serverDescriptionUpdate: (state, action) => {
      updateServerDescriptionHelper(
        action.payload.serverID,
        action.payload.serverDescription,
        state
      );
    },
    currentUserRoleUpdate: (state, action) => {
      // update server role
      state.data = state.data.map((server) => {
        if (parseInt(server.serverID) === action.payload.serverID) {
          server.roleID = action.payload.roleID;
        }
        return server;
      });
      state.status = "update";
      state.lastID = action.payload.serverID;
    },
    addServers: (state, action) => {
      state.data = action.payload;
      state.status = "succeeded";
    },
  },
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
        state.status = "new";
        state.error = null;
        state.data.push(action.payload.server);
      })
      .addCase(deleteServer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteServer.fulfilled, (state, action) => {
        deleteServerHelper(state, action);
      })
      .addCase(updateServerDescription.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateServerDescription.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        updateServerDescriptionHelper(
          action.payload.serverID,
          action.payload.serverDescription,
          state
        );
      })
      .addCase(updateServerImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateServerImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        updateServerImageHelper(
          action.payload.serverID,
          action.payload.serverImageUrl,
          state
        );
      })
      .addCase(joinServerByInviteCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(joinServerByInviteCode.fulfilled, (state, action) => {
        state.status = "new";
        state.error = null;
        state.data.push(action.payload.server);
      });
  },
});

function updateServerDescriptionHelper(serverID, serverDescription, state) {
  state.data = state.data.map((server) => {
    if (parseInt(server.serverID) === parseInt(serverID)) {
      server.serverDescription = serverDescription;
    }
    return server;
  });
}

function updateServerImageHelper(serverID, serverImageUrl, state) {
  state.data = state.data.map((server) => {
    if (parseInt(server.serverID) === parseInt(serverID)) {
      server.serverImageUrl = serverImageUrl;
    }
    return server;
  });
}

function deleteServerHelper(state, action) {
  state.status = "delete";
  state.lastID = action.payload.serverID;
  state.error = null;
  state.data = state.data.filter(
    (server) => parseInt(server.serverID) !== parseInt(action.payload.serverID)
  );
}

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
    server.roleID = 1;
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

export const deleteServer = createAsyncThunk(
  "servers/deleteServer",
  async ({ token, serverID }) => {
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/servers/${serverID}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to create server.");
    }
    // Leave channel data associated with the server (this shouldn't occur too often within sessions)
    return { serverID };
  }
);

export const updateServerImage = createAsyncThunk(
  "servers/updateServerImage",
  async ({ token, serverID, serverImageUrl }) => {
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/servers/${serverID}/image`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body: serverImageUrl,
    });
    if (!res.ok) {
      throw new Error("Failed to update server image.");
    }
    return { serverID: serverID, serverImageUrl: serverImageUrl };
  }
);

export const updateServerDescription = createAsyncThunk(
  "servers/updateServerDescription",
  async ({ token, serverID, serverDescription }) => {
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/servers/${serverID}/description`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body: serverDescription,
    });
    if (!res.ok) {
      throw new Error("Failed to update server description.");
    }
    return { serverID: serverID, serverDescription: serverDescription };
  }
);

export const joinServerByInviteCode = createAsyncThunk(
  "servers/joinServerByInviteCode",
  async ({ token, inviteCode }) => {
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/invites/${inviteCode}/join`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to join server.");
    }
    const server = await res.json();
    return { server };
  }
);

export const {
  removeFromServers,
  updateStatus,
  serverImageUpdate,
  serverDescriptionUpdate,
  currentUserRoleUpdate,
  addServers,
} = serversSlice.actions;
export default serversSlice.reducer;
