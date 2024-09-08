import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';

//instance for express app
const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

//express middlewares setup
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js'
import roomRouter from './routes/room.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/rooms", roomRouter);

// http://localhost800/api/v1/users/<user.routers.js>
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: statusCode,
    message: message,
  });
});

export { app }