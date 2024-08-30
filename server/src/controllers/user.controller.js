import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {

  // get user details from frontend (postman for now)
  const { username, email, password } = req.body
  // console.log("email: ", email)

  // validation - not empty atleast
  if(
    [username, email, password].some((field) =>
      field?.trim() === "")
  ){
    throw new ApiError(400, "All fields are required");
  }
  // check if user already exit from username or email
  const alreadyExist = await User.findOne({
    $or: [{ username }, { email }]
  })
  if(alreadyExist){
    throw new ApiError(409, "User with username or email already exists")
  }
  // check for images or avatar
  // upload to cloudinary
  // avatar uploaded on cloudinary ?? multer worked??
  // create user object - entry in db

  const user = await User.create({
    email,
    password,
    username: username? username.toLowerCase() : "",
  })
  // remove pasword and refresh token field from response
  // check for user creation

  const createdUser = await User.findById(user._id).select(
    "-password -profilePic -refreshToken"
  )
  if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering user")
  }
  // return respons
  return res.status(201).json(
    new ApiResponse(200, createdUser, "user register successfully")
  )
})

export { registerUser }

