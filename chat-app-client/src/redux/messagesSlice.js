import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  byChannelID: {},
  status: "idle",
  error: null,
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchMessagesForChannel.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchMessagesForChannel.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { isNew, channelID, messages } = action.payload;
        if (isNew) state.byChannelID[channelID] = messages;
      })
      .addCase(fetchMessagesForChannel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

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

export default messagesSlice.reducer;
