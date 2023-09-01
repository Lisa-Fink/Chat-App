import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    serverID: 1,
    serverName: "Lisa's Chat",
    serverDescription: "Test 1",
    serverImageUrl: null,
  },
  {
    serverID: 2,
    serverName: "The Hangout",
    serverDescription: "Hangout for friends",
    serverImageUrl: "./images/cat2.jpg",
  },
  {
    serverID: 3,
    serverName: "Magic The Gathering Players",
    serverDescription: "A Server for Magic",
    serverImageUrl: null,
  },
];

const serversSlice = createSlice({
  name: "servers",
  initialState,
  reducers: {},
});

export default serversSlice.reducer;
