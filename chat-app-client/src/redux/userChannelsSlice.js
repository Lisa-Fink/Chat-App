import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  1: [
    [
      {
        userID: 1,
        username: "user1",
        userImageUrl: "./images/cat1.jpg",
        roleID: 1,
      },
    ],
    [],
    [],
    [
      {
        userID: 2,
        username: "user2",
        userImageUrl: "./images/cat-drawing.jpg",
        roleID: 4,
      },
      {
        userID: 3,
        username: "user3",
        userImageUrl: "./images/lisa.jpg",
        roleID: 4,
      },
      {
        userID: 4,
        username: "user4",
        userImageUrl: "./images/cat2.jpg",
        roleID: 4,
      },
      {
        userID: 5,
        username: "user5",
        userImageUrl: "./images/dog1.jpg",
        roleID: 4,
      },
    ],
  ],
};

const userChannelsSlice = createSlice({
  name: "userChannels",
  initialState,
  reducers: {},
});

export default userChannelsSlice.reducer;
