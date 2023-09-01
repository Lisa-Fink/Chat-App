import { configureStore } from "@reduxjs/toolkit";
import serversReducer from "./serversSlice";
import channelsReducer from "./channelsSlice";
import messagesReducer from "./messagesSlice";
import userChannelsReducer from "./userChannelsSlice";
import currentReducer from "./currentSlice";

export default configureStore({
  reducer: {
    servers: serversReducer,
    channels: channelsReducer,
    messages: messagesReducer,
    userChannels: userChannelsReducer,
    current: currentReducer,
  },
});
