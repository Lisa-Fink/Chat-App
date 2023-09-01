import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const serversSlice = createSlice({
  name: "servers",
  initialState,
  reducers: {
    setServers: (state, action) => {
      state.splice(0, state.length, ...action.payload);
    },
  },
});

export const { setServers } = serversSlice.actions;

export const fetchServers = (token) => async (dispatch) => {
  const apiUrl = import.meta.env.VITE_CHAT_API;
  const url = `${apiUrl}/servers`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to get servers.");
    }
    const data = await res.json();
    dispatch(setServers(data));
  } catch (error) {
    throw error;
  }
};

export default serversSlice.reducer;
