import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  server: {
    serverID: null,
    serverName: null,
    serverDescription: null,
    serverImageUrl: null,
    roleID: null,
    hasUnread: null,
  },
  channel: {
    channelID: null,
    serverID: null,
    roleID: null,
    channelTypeID: null,
    channelName: null,
    channelTime: null,
    userRead: null,
    hasUnread: null,
  },
};

const curSlice = createSlice({
  name: "current",
  initialState,
  reducers: {
    setServer: (state, action) => {
      if (action.payload === null) {
        state.server = {
          serverID: null,
          serverName: null,
          serverDescription: null,
          serverImageUrl: null,
          roleID: null,
          hasUnread: null,
        };
      }
      state.server = action.payload;
    },
    setChannel: (state, action) => {
      if (action.payload === null) {
        state.channel = {
          channelID: null,
          serverID: null,
          roleID: null,
          channelTypeID: null,
          channelName: null,
          channelTime: null,
          userRead: null,
          hasUnread: null,
        };
      }
      state.channel = action.payload;
      // needs to trigger setCurMessages to be messages[curChannel.id]
      // needs to trigger setCurUserChannels to be userChannels[curChannel.id]
    },
  },
});

export const { setServer, setChannel, setMessages, setUserChannels } =
  curSlice.actions;
export default curSlice.reducer;
