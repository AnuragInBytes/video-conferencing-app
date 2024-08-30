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

const generateAccessRefreshToken = async(userID) => {
  try {
    const user = await User.findById(userID);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens")
  }
}

const loginUser = asyncHandler( async (req, res) => {
  // req body -> data
  const { email, username, password } = req.body

  // username or email
  if(!username && !email) {  // alternatively !(username || email)
    throw new ApiError(400, "username or email is required")
  }

  // find the user in db
  const user = await User.findOne({
    $or: [{ username }, { password }]
  })
  if(!user){
    throw new ApiError(404, "user does not exist")
  }

  // password check
  const isPassValid = user.isPasswordCorrect(password);
  if(isPassValid){
    throw new ApiError(401, "Invalid Login Credentials")
  }

  // access refersh token
  const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id)

  // send cookie
  const loggesInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggesInUser,
          accessToken,
          refreshToken,
        },
        "User Logged In successfully"
      )
    )
})

const logOutUser = asyncHandler( async(req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )
  const options = {
    httpOnly: true,
    secure: true
  }
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(200, "User Logged Out successfully")
    )
})

export { registerUser, loginUser, logOutUser }

