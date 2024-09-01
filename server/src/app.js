import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApiError } from './utils/ApiError.js';

const app = express()

//TODO: explore here
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

// app.use((err, req, res, next) => {
//   if(err instanceof ApiError) {
//     return res.status(err.statusCode).json({
//       status: err.statusCode,
//       message: err.message,
//       success: err.success,
//       error: err.errors.length > 0 ? err.errors : undefined,
//     });
//   }
//   return res.status(500).json({
//     status: 500,
//     message: "Internal server error",
//   });
// });

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter)

// http://localhost800/api/v1/users/<user.routers.js>

export { app }

