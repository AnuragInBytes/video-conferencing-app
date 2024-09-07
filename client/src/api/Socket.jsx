import React from 'react'
import { useEffect } from 'react'
import { io } from 'socket.io-client'

//backend connection
const socket = io("http://localhost:5000")

function Socket() {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected to server: ', socket.id)
    });

    socket.on('welcome', (data) => {
      console.log(data.message);
    });

    socket.on('connect_error', (error) => {
      console.log('Connection failed: ', error.message);
    })

    console.log(socket)

    return () => {
      socket.off('connect');
      socket.off('welcome');
      socket.off('connect_error')
      socket.disconnect();
    };
  }, [])
  return(
    <h1>Welcome to lobby!</h1>
  )
}

export default Socket;