import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import roomSlice from "./slices/roomSlice"

const store = configureStore({
  reducer:{
    auth: authSlice,
    room: roomSlice,
  }
});

export default store;