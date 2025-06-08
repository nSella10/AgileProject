import express from "express";
import asyncHandler from "express-async-handler";
import { protect } from "../middlewares/authMiddleware.js";
import {
  findLyricsInDatabase,
  addLyricsToDatabase,
  searchSongsInDatabase,
  getPopularSongs,
  getDatabaseStats,
  rateSongQuality,
} from "../services/lyricsDatabaseService.js";
import { addUserLyrics } from "../services/lyricsService.js";
import LyricsDatabase from "../models/LyricsDatabase.js";

const router = express.Router();

/**
 * @route   GET /api/lyrics/search/:title/:artist
 * @desc    חיפוש מילות שיר במאגר
 * @access  Public
 */
router.get(
  "/search/:title/:artist",
  asyncHandler(async (req, res) => {
    const { title, artist } = req.params;
    const { trackId } = req.query; // trackId אופציונלי מ-query params

    try {
      const result = await findLyricsInDatabase(trackId, title, artist);

      if (result) {
        res.json({
          success: true,
          found: true,
          data: {
            lyrics: result.lyrics,
            keywords: result.keywords,
            source: result.source,
            usageCount: result.usageCount,
            qualityRating: result.qualityRating,
            language: result.language,
            songId: result.id,
          },
        });
      } else {
        res.json({
          success: true,
          found: false,
          message: "Lyrics not found in database",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error searching for lyrics",
        error: error.message,
      });
    }
  })
);

/**
 * @route   POST /api/lyrics/add
 * @desc    הוספת מילות שיר חדשות למאגר
 * @access  Private
 */
router.post(
  "/add",
  protect,
  asyncHandler(async (req, res) => {
    const {
      trackId,
      title,
      artist,
      lyrics,
      language = "hebrew",
      previewUrl,
      artworkUrl,
    } = req.body;
    const userId = req.user._id;

    if (!title || !artist || !lyrics) {
      return res.status(400).json({
        success: false,
        message: "Title, artist, and lyrics are required",
      });
    }

    try {
      const result = await addUserLyrics(
        trackId,
        title,
        artist,
        lyrics,
        userId,
        language,
        previewUrl,
        artworkUrl
      );

      res.status(201).json({
        success: true,
        message: "Lyrics added successfully",
        data: result,
      });
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        res.status(409).json({
          success: false,
          message: "Song already exists in database",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Error adding lyrics",
          error: error.message,
        });
      }
    }
  })
);

/**
 * @route   GET /api/lyrics/search-songs/:searchTerm
 * @desc    חיפוש שירים לפי מונח חיפוש
 * @access  Public
 */
router.get(
  "/search-songs/:searchTerm",
  asyncHandler(async (req, res) => {
    const { searchTerm } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    try {
      const songs = await searchSongsInDatabase(searchTerm, limit);

      res.json({
        success: true,
        count: songs.length,
        data: songs.map((song) => ({
          id: song._id,
          title: song.title,
          artist: song.artist,
          language: song.language,
          usageCount: song.usageCount,
          qualityRating: song.qualityRating,
          addedAt: song.createdAt,
        })),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error searching songs",
        error: error.message,
      });
    }
  })
);

/**
 * @route   GET /api/lyrics/popular
 * @desc    קבלת שירים פופולריים
 * @access  Public
 */
router.get(
  "/popular",
  asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 20;

    try {
      const popularSongs = await getPopularSongs(limit);

      res.json({
        success: true,
        count: popularSongs.length,
        data: popularSongs,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error getting popular songs",
        error: error.message,
      });
    }
  })
);

/**
 * @route   GET /api/lyrics/stats
 * @desc    קבלת סטטיסטיקות מאגר השירים
 * @access  Public
 */
router.get(
  "/stats",
  asyncHandler(async (req, res) => {
    try {
      const stats = await getDatabaseStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error getting database stats",
        error: error.message,
      });
    }
  })
);

/**
 * @route   POST /api/lyrics/rate/:songId
 * @desc    דירוג איכות שיר
 * @access  Private
 */
router.post(
  "/rate/:songId",
  protect,
  asyncHandler(async (req, res) => {
    const { songId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    try {
      const updatedSong = await rateSongQuality(songId, rating);

      res.json({
        success: true,
        message: "Rating added successfully",
        data: {
          songId: updatedSong._id,
          newRating: updatedSong.qualityRating,
          ratingCount: updatedSong.ratingCount,
        },
      });
    } catch (error) {
      if (error.message === "Song not found") {
        res.status(404).json({
          success: false,
          message: "Song not found",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Error rating song",
          error: error.message,
        });
      }
    }
  })
);

/**
 * @route   GET /api/lyrics/song/:songId
 * @desc    קבלת פרטי שיר לפי ID
 * @access  Public
 */
router.get(
  "/song/:songId",
  asyncHandler(async (req, res) => {
    const { songId } = req.params;

    try {
      const song = await LyricsDatabase.findById(songId)
        .populate("addedBy", "name email")
        .select("-__v");

      if (!song) {
        return res.status(404).json({
          success: false,
          message: "Song not found",
        });
      }

      res.json({
        success: true,
        data: song,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error getting song details",
        error: error.message,
      });
    }
  })
);

export default router;
