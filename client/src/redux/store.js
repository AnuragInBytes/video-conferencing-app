import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import socketSlice from "./slices/socketSlice";

const store = configureStore({
  reducer:{
    auth: authSlice,
    socket: socketSlice
  }
});

export default store;