import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken';

const registerUser = asyncHandler( async (req, res) => {

  // get user details from frontend (postman for now)
  const { name, username, email, password } = req.body
  // console.log("email: ", email)

  // validation - not empty atleast
  if(
    [name, username, email, password].some((field) =>
      field?.trim() === "")
  ){
    throw new ApiError(400, "All fields are required");
  }
  // check if user already exit from username or email
  const alreadyExist = await User.findOne({
    $or: [{ username }, { email }]
  })
  if(alreadyExist){
    throw new ApiError(409, "User with Credentials already exists")
  }
  // check for images or avatar
  // upload to cloudinary
  // avatar uploaded on cloudinary ?? multer worked??
  // create user object - entry in db

  const user = await User.create({
    name,
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
    $or: [{ username }, { email }]
  })
  if(!user){
    throw new ApiError(404, "No such user exist.")
  }

  // password check
  const isPassValid = await user.isPasswordCorrect(password);
  if(!isPassValid){
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

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if(!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request")
  }
  try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY,
      )

      const user = await User.findById(decodedToken?._id);

      if(!user) {
        throw new ApiError(401, "Invalid refresh Token")
      }

      if(incomingRefreshToken !== user?.refreshToken){
        throw new ApiError(401, "Refresh Token Expired")
      }

      const options = {
        httpOnly: true,
        secure: true
      }

      const { newAccessToken, newRefreshToken } = await generateAccessRefreshToken(user._id)

      return res
        .status(200)
        .cookie("accessToken", newAccessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
          new ApiResponse(
            200,
            { accessToken: newAccessToken, refreshToken: newRefreshToken },
            "Access Token Refreshed"
          )
        )
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "Invalid refresh token"
    )
  }

})


export { registerUser, loginUser, logOutUser, refreshAccessToken }

