import express from "express";
import { createGame } from "../controllers/gameController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import { getMyGames } from "../controllers/gameController.js";

const router = express.Router();

// @desc    Create a new game (with files)
// @route   POST /api/games
// @access  Private
router.post("/", protect, upload.array("songs"), createGame);

// @desc    Get all games created by the logged-in user
// @route   GET /api/games/mine
// @access  Private
router.get("/mine", protect, getMyGames);

export default router;
