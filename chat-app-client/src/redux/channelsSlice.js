import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  1: [
    {
      channelID: 1,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "General",
    },
    {
      channelID: 2,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Cat Pics",
    },
    {
      channelID: 3,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Leetcode",
    },
    {
      channelID: 4,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Random",
    },
    {
      channelID: 5,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Tech Talk",
    },
    {
      channelID: 6,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Funny Memes",
    },
    {
      channelID: 7,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Music",
    },
    {
      channelID: 8,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Movies",
    },
    {
      channelID: 9,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Books",
    },
    {
      channelID: 10,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Food",
    },
    {
      channelID: 11,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Gaming",
    },
    {
      channelID: 12,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Travel",
    },
    {
      channelID: 13,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Fitness",
    },
    {
      channelID: 14,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Art",
    },
    {
      channelID: 15,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Science",
    },
  ],
  3: [
    {
      channelID: 16,
      serverID: 3,
      roleID: 4,
      channelTypeID: 1,
      channelName: "General",
    },
    {
      channelID: 17,
      serverID: 3,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Strategy",
    },
  ],
};

const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {},
});

export default channelsSlice.reducer;
