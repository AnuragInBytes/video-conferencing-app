import { io } from "socket.io-client";

function useSocket(url){
  const socket = io(url.toString(), {
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  })

  return socket;
}

export default useSocket;