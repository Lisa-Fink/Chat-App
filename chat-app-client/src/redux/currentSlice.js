import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  server: null,
  channel: null,
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
    },
  },
});

export const { setServer, setChannel, setMessages, setUserChannels } =
  curSlice.actions;
export default curSlice.reducer;
