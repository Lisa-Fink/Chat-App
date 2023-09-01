import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    addServerChannels: (state, action) => {
      const { serverID, data } = action.payload;
      state[serverID] = data;
    },
  },
});

export const { addServerChannels } = channelsSlice.actions;

export const fetchChannels =
  (token, serverID) => async (dispatch, getState) => {
    const { channels } = getState();
    if (serverID in channels) {
      return channels[serverID];
    }
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/servers/${serverID}/channels`;
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to get channels.");
      }
      const data = await res.json();
      dispatch(addServerChannels({ serverID, data }));
      return data;
    } catch (error) {
      throw error;
    }
  };

export default channelsSlice.reducer;
