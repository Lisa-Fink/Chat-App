import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  emojis: [],
  status: "idle",
};

const emojiSlice = createSlice({
  name: "emojis",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchEmojis.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.emojis = action.payload.emojis;
      })
      .addCase(fetchEmojis.rejected, (state, action) => {
        state.status = action.error.message;
      });
  },
});

export const fetchEmojis = createAsyncThunk(
  "emojis/fetchEmojis",
  async ({ token }) => {
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/emojis`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to get emojis.");
    }
    const data = await res.json();
    return { emojis: data };
  }
);

export default emojiSlice.reducer;
