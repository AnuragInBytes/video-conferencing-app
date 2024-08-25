// require('dotenv').config({path: './env'})
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import express from 'express'

dotenv.config({
  path: './env'
})

const app = express()

connectDB()
  .then( () => {
    app.on("error", (error) => {
      console.log("ERROR: ", error);
    })
    app.listen(process.env.PORT || 8000, () => {
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