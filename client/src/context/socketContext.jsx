import React, { createContext, useContext, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({children}) => {

  const socket = useMemo(() => io(import.meta.env.VITE_SOCKET_URL, {
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  }), []);

  useEffect(() => {
    return () => {
      if(socket) {
        socket.disconnect();
      }
    };
  }, [socket])

  return(
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}