import { Router } from "express";
import { joinRoom, registerRoom } from "../controllers/room.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//sercure routes with jwt
router.route("/create").post(verifyJWT, registerRoom);
router.route("/join/:roomId").post(verifyJWT, joinRoom)

export default router;