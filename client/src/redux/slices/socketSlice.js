import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const url = import.meta.env.VITE_SOCKET_URL;

const initialState = {
  socket: null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    connectSocket: (state) => {
      if(!state.socket){
        state.socket = io(url, {
          withCredentials: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });
      }
    },
    disconnectSocket: (state) => {
      if(state.socket) {
        state.socket.disconnect();
        state.socket = null;
      }
    },
  },
});

export const { connectSocket, disconnectSocket } = socketSlice.actions
export default socketSlice.reducer;