import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express()

//TODO: explore here
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter)

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