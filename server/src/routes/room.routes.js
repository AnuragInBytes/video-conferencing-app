import { Router } from "express";
import { joinRoom, registerRoom } from "../controllers/room.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

//sercure routes with jwt
router.route("/create").post(verifyJWT, registerRoom);
router.route("/join/:id").post(verifyJWT, joinRoom)

export default router;