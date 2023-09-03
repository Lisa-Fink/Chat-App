import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  dataByID: {},
  byChannelID: {},
  status: "idle",
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUsersForChannel.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchUsersForChannel.fulfilled, (state, action) => {
        const { isNew, channelID, userChannels } = action.payload;
        if (isNew) {
          state.byChannelID[channelID] = [[], [], [], []];
          for (const user of userChannels) {
            const role = user.roleID;
            state.byChannelID[channelID][role - 1].push(user);
            state.dataByID[user.userID] = user;
          }
        }
        state.status = "succeeded";
      })
      .addCase(fetchUsersForChannel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
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
    return { isNew: true, channelID: channelID, userChannels: data };
  }
);

export default usersSlice.reducer;
