import { combineReducers, configureStore } from "@reduxjs/toolkit";
import serversReducer from "./serversSlice";
import channelsReducer from "./channelsSlice";
import messagesReducer from "./messagesSlice";
import usersReducer from "./usersSlice";
import currentReducer from "./currentSlice";
import authReducer from "./authSlice";

const combinedReducer = combineReducers({
  servers: serversReducer,
  channels: channelsReducer,
  messages: messagesReducer,
  users: usersReducer,
  current: currentReducer,
  auth: authReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    state = undefined;
  }
  return combinedReducer(state, action);
};

export default configureStore({
  reducer: rootReducer,
});
