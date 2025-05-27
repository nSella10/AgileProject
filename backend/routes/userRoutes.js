// routes/userRoutes.js
import express from "express";
import {
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// @desc Register a new user
// @route POST /api/users/register
// @access Public
router.post("/register", registerUser);

// @desc Authenticate a user
// @route POST /api/users/login
// @access Public
router.post("/login", authUser);

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
router.get("/profile", protect, getUserProfile);

// @desc Logout a user
// @route POST /api/users/logout
// @access Private
router.post("/logout", logoutUser);

export default router;
