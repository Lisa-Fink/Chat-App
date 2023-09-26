import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  byChannelID: {},
  typingByChannelID: {}, // {channelID: [userIDs]}
  status: "idle",
  error: null,
  errorContext: null,
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessageUpdate: (state, action) => {
      const { message } = action.payload;
      const channelID = message.channelID;
      if (!(channelID in state.byChannelID)) {
        // don't add the message if the channel messages were never fetched
        return;
      }
      state.byChannelID[channelID].push(message);
    },
    editMessageUpdate: (state, action) => {
      const { channelID, messageID, text } = action.payload;
      if (!(channelID in state.byChannelID)) {
        // don't edit the message if the channel messages were never fetched
        return;
      }
      editMessageHelper(channelID, messageID, text, state);
    },
    deleteMessageUpdate: (state, action) => {
      deleteMessageHelper(state, action);
    },
    deleteMessageChannelUpdate: (state, action) => {
      const channelID = action.payload.channelID;
      delete state.byChannelID[channelID];
    },
    addTyping: (state, action) => {
      const { channelID, userID } = action.payload;
      // if the channelID isn't initialized, add it with an empty arr
      if (!state.typingByChannelID[channelID]) {
        state.typingByChannelID[channelID] = [];
      }
      if (!state.typingByChannelID[channelID].includes(userID)) {
        state.typingByChannelID[channelID].push(userID);
      }
    },
    rmTyping: (state, action) => {
      const { channelID, userID } = action.payload;
      if (!state.typingByChannelID[channelID]) return;
      state.typingByChannelID[channelID] = state.typingByChannelID[
        channelID
      ].filter((id) => parseInt(id) !== parseInt(userID));
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMessagesForChannel.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMessagesForChannel.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        const { isNew, channelID, messages } = action.payload;
        if (isNew) state.byChannelID[channelID] = messages;
      })
      .addCase(fetchMessagesForChannel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.errorContext = null;
        // add the new message
        const channelID = action.payload.channelID;
        if (!(channelID in state.byChannelID)) {
          state.byChannelID[channelID] = [];
        }
        state.byChannelID[channelID].push(action.payload);
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = "failed to create message";
        state.errorContext = "createMessage";
      })
      .addCase(editMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.errorContext = null;
        // update the message
        const { channelID, messageID, text } = action.payload;
        editMessageHelper(channelID, messageID, text, state);
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.errorContext = "deleteMessage";
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.errorContext = null;
        // remove the message
        deleteMessageHelper(state, action);
      });
  },
});

function deleteMessageHelper(state, action) {
  const deleteID = action.payload.messageID;
  const channelID = action.payload.channelID;
  state.byChannelID[channelID] = state.byChannelID[channelID].filter(
    (mes) => parseInt(mes.messageID) !== parseInt(deleteID)
  );
}

function editMessageHelper(channelID, messageID, text, state) {
  state.byChannelID[channelID] = state.byChannelID[channelID].map((mes) => {
    if (parseInt(mes.messageID) === parseInt(messageID)) {
      mes.text = text;
      mes.edited = true;
    }
    return mes;
  });
}

export const fetchMessagesForChannel = createAsyncThunk(
  "messages/fetchMessagesForChannel",
  async ({ token, serverID, channelID }, { getState }) => {
    const messages = getState().messages.byChannelID;
    if (channelID in messages) {
      return { isNew: false };
    }
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/servers/${serverID}/channels/${channelID}/messages`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to get messages.");
    }
    const data = await res.json();
    return { isNew: true, channelID: channelID, messages: data };
  }
);

export const createMessage = createAsyncThunk(
  "messages/createMessage",
  async ({ token, userID, serverID, channelID, text, time }) => {
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/servers/${serverID}/channels/${channelID}/messages`;
    const message = { userID, channelID, text, time };

    const requestBody = JSON.stringify(message);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: requestBody,
    });
    if (!res.ok) {
      throw new Error("Failed to create message.");
    }
    // get new message id and add to messages
    const id = await res.json();
    message.messageID = id;
    return message;
  }
);

export const editMessage = createAsyncThunk(
  "messages/editMessage",
  async ({ token, text, messageID, serverID, channelID }) => {
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/servers/${serverID}/channels/${channelID}/messages/${messageID}`;
    const message = { text };

    const requestBody = JSON.stringify(message);
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: requestBody,
    });
    if (!res.ok) {
      throw new Error("Failed to update message.");
    }
    return { text, channelID, messageID };
  }
);

export const deleteMessage = createAsyncThunk(
  "messages/deleteMessage",
  async ({ token, messageID, serverID, channelID }) => {
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/servers/${serverID}/channels/${channelID}/messages/${messageID}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to delete message.");
    }
    return { channelID, messageID };
  }
);

export default messagesSlice.reducer;
export const {
  addMessageUpdate,
  editMessageUpdate,
  deleteMessageUpdate,
  deleteMessageChannelUpdate,
  addTyping,
  rmTyping,
} = messagesSlice.actions;
