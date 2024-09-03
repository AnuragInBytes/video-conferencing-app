// user.router.js
import { Router } from 'express';
import { loginUser, logOutUser, refreshAccessToken, registerUser, getCurrentUser } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logOutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/current-user").get(verifyJWT, getCurrentUser)

export default router;