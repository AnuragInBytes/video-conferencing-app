import { io } from "socket.io-client";
import { useEffect, useRef } from "react";

const url = import.meta.env.VITE_SOCKET_URL;

function useSocket(){

  const socketRef = useRef(null);

  useEffect(() => {
    if(!socketRef.current){
      socketRef.current = io(url, {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
    }
    // return () => {
    //   if(socketRef.current){
    //     socketRef.current.disconnect();
    //   }
    // };
  }, [])

  return socketRef.current;
}

export default useSocket;