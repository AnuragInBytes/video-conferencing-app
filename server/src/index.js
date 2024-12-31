// require('dotenv').config({path: './env'})
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';
import { createServer } from 'http';
import { Server } from 'socket.io'

dotenv.config({
  path: './env'
})

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const rooms = new Map();

io.on("connection", (socket) => {
  console.log("New Socket connected: ", socket.id);

  socket.on('join-room', (roomId) => {
    if(!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
      console.log("rooms: ", rooms);
    }

    rooms.get(roomId).add(socket.id);
    socket.join(roomId);

    socket.to(roomId).emit('user-joined', socket.id);

    const participants = Array.from(rooms.get(roomId)).filter(id => id !== socket.id);
    socket.emit('existing-participants', participants);
  });

  socket.on('offer', ({offer, to}) => {
    socket.to(to).emit('offer', { offer, from: socket.id});
  });

  socket.on('answer', ({ answer, to }) => {
    socket.to(to).emit('answer', { answer, from: socket.id });
  });

  socket.on('ice-candidate', ({ candidate, to }) => {
    socket.to(to).emit('ice-candidate', { candidate, from: socket.id });
  });

  socket.on('user-left', (roomId) => {
    rooms.forEach((participants, roomId) => {
      if(participants.has(socket.id)) {
        participants.delete(socket.id);
        socket.to(roomId).emit('user-left', socket.id);
      }
    });
  });

  socket.on('disconnect', () => {
    rooms.forEach((participants, roomId) => {
      if(participants.delete(socket.id)){
        socket.to(roomId).emit('user-left', socket.id);
        if(participants.size === 0){
          rooms.delete(roomId);
        }
      }
    });
  });
});


connectDB()
  .then( () => {
    server.on("error", (error) => {
      console.log("ERROR: ", error);
    })
    server.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    })
  })
  .catch((error) => {
    console.log("MongoDB connection failed!!! (from src/index.js) : ", error)
  })
