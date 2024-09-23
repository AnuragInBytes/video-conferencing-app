import { Room } from '../models/room.model.js'
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js'

const registerRoom = asyncHandler( async (req, res) => {

  const { title, startTime } = req.body;
  const createdBy = req.user._id; //TODO: need a fix as required in future

  // if(!title?.trim() || !startTime){
  //   throw new ApiError(400, "All fields are required");
  // }
  // if(
  //   [title, startTime, createdBy].some((field) => field?.trim() === "")
  // ){
  //   throw new ApiError(400, "All fields are required");
  // }
  if(!title || !startTime || !createdBy){
    throw new ApiError(400, "All fields are required")
  }

  const start = new Date(startTime);
  if(isNaN(start.getTime())){
    throw new ApiError(400, "Invalid start time provided")
  }

  const room = await Room.create({
    title,
    createdBy,
    startTime,
  });

  const createdRoom = await Room.findById(room._id)

  if(!createdRoom) throw new ApiError(500, "Something went wrong while creating room");

  return res.status(201).json(
    new ApiResponse(200, createdRoom, "Room successfully created")
  );

})

const joinRoom = asyncHandler( async(req, res) => {
  const { roomId } = req.params;
  const userId = req.user._id;

  const room = await Room.findById(roomId)

  //check if the room exist or not
  if(!room){
    throw new ApiError(400, "Room not found");
  }

  //check the participant is already in some room or not
  const alreadyIn = (participant) => participant.userId.toString() === userId.toString();
  const isPartOf = room.participants.some(alreadyIn);

  if(!isPartOf){
    room.participants.push({ userId });
    await room.save();
  }

  return res.status(200).json(
    new ApiResponse(200, room, "Room Joined successfully")
  );
});

export { registerRoom, joinRoom }