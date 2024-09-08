// require('dotenv').config({path: './env'})
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app} from './app.js';
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
  },
});

io.on("connection", (socket) => {
  console.log('New socket connected : ', socket.id);
  socket.emit('welcome', { message: 'Welcome to the server'});

  socket.on("join-room", ({ roomId, userId }) => {
    socket.join(roomId);

    socket.to(roomId).emit(`${userId} joined room`);

    io.in(roomId).emit("new-participant", { roomId, userId });
  });

  socket.on('leave-room', ({ roomId, userId }) => {
    socket.leave(roomId);

    socket.to(roomId).emit("user-left", { userId });
  });

  socket.on('disconnect', () => {
    console.log("socket disconnected: ", socket.id)
  });

})

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


// import express from 'express'
// const app = express()

// ;( async () => {
//   try {
//     mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     app.on("error", (error) => {
//       console.log("ERROR: ", error);
//       throw error
//     })
//     app.listen(process.env.PORT, () => {
//       console.log(`App is listning on port ${process.env.PORT}`);
//     })
//   } catch (error) {
//     console.log("ERROR: ", error)
//     throw error
//   }
// })()