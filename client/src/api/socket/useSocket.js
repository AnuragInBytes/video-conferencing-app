import { io } from "socket.io-client";

const url = import.meta.env.VITE_SOCKET_URL;

function useSocket(){

  const socket = io(url, {
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  })

  return socket;
}

export default useSocket;