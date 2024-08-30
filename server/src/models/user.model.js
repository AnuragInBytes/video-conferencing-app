import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, "Username is required"],
      lowercase: true,
      unique: [true, "Username is already takken"]
    },
    email: {
      type: String,
      require: [true, "Email is Required"],
      unique: [true, "Email already takken"],
      lowercase: true,
    },
    password: {
      type: String,
      require: [true, "Password is required"],
    },
    profilePic: {
      type: String, // optional from clounary aur any other service
    },
    refreshToken: {
      type: String,
    }
  }
  , {timestamps: true}
)

userSchema.pre("save", async function(next){
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
  next();
})

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      password: this.password,
    },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}


userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

export const User = mongoose.model("User", userSchema);