import { configureStore } from "@reduxjs/toolkit";
import serversReducer from "./serversSlice";
import channelsReducer from "./channelsSlice";
import messagesReducer from "./messagesSlice";
import usersReducer from "./usersSlice";
import currentReducer from "./currentSlice";
import authReducer from "./authSlice";

export default configureStore({
  reducer: {
    servers: serversReducer,
    channels: channelsReducer,
    messages: messagesReducer,
    users: usersReducer,
    current: currentReducer,
    auth: authReducer,
  },
});
