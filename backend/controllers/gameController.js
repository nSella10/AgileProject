import asyncHandler from "../middlewares/asyncHandler.js";
import Game from "../models/Game.js";

// @desc    Create a new game (with files)
// @route   POST /api/games
// @access  Private
export const createGame = asyncHandler(async (req, res) => {
  console.log("Creating a new game with files...");
  const { title, description, isPublic } = req.body;
  const uploadedFiles = req.files;
  const names = req.body.names;

  if (!title || !uploadedFiles || uploadedFiles.length === 0 || !names) {
    res.status(400).json({
      message:
        "Please provide a title, song names, and at least one song file.",
    });
    return;
  }

  const nameArray = Array.isArray(names) ? names : [names];

  const songs = uploadedFiles.map((file, index) => {
    const name = nameArray[index] || "Untitled";
    return {
      title: name,
      correctAnswer: name,
      artist: "Unknown",
      audioUrl: `/uploads/${file.filename}`,
    };
  });

  const game = new Game({
    title,
    description,
    songs,
    isPublic,
    createdBy: req.user._id,
  });

  const savedGame = await game.save();
  res.status(201).json(savedGame);
});

export const getMyGames = asyncHandler(async (req, res) => {
  const games = await Game.find({ createdBy: req.user._id });
  res.json(games);
});
