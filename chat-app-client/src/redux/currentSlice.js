import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  server: { id: 1, name: "Lisa" }, // {id, name}
  channel: { id: 1, name: "General" }, // {id, name}
};

const curSlice = createSlice({
  name: "current",
  initialState,
  reducers: {
    setServer: (state, action) => {
      state.server = action.payload;
    },
    setChannel: (state, action) => {
      state.channel = action.payload;
      // needs to trigger setCurMessages to be messages[curChannel.id]
      // needs to trigger setCurUserChannels to be userChannels[curChannel.id]
    },
  },
});

export const { setServer, setChannel, setMessages, setUserChannels } =
  curSlice.actions;
export default curSlice.reducer;
