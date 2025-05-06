// routes/userRoutes.js
import express from "express";
import {
  registerUser,
  authUser,
  logoutUser,
} from "../controllers/userController.js";

const router = express.Router();

// @desc Register a new user
// @route POST /api/users/register
// @access Public
router.post("/register", registerUser);

// @desc Authenticate a user
// @route POST /api/users/login
// @access Public
router.post("/login", authUser);

// @desc Logout a user
// @route POST /api/users/logout
// @access Private
router.post("/logout", logoutUser);

export default router;
