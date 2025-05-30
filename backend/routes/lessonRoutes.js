import express from "express";
import {
  createLesson,
  getMyLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
  startLiveLesson,
  stopLiveLesson,
  getLessonByRoomCode,
  getTeacherAnalytics,
  nextSong,
  previousSong,
  setSong,
  addStudentRecording,
  getLessonRecordings,
} from "../controllers/lessonController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// @desc    Create a new lesson
// @route   POST /api/lessons
// @access  Private (Teachers only)
router.post("/", protect, createLesson);

// @desc    Get all lessons created by the logged-in teacher
// @route   GET /api/lessons/mine
// @access  Private (Teachers only)
router.get("/mine", protect, getMyLessons);

// @desc    Get teacher analytics
// @route   GET /api/lessons/analytics
// @access  Private (Teachers only)
router.get("/analytics", protect, getTeacherAnalytics);

// @desc    Get lesson by room code (for students joining)
// @route   GET /api/lessons/room/:roomCode
// @access  Public
router.get("/room/:roomCode", getLessonByRoomCode);

// @desc    Get a single lesson by ID
// @route   GET /api/lessons/:id
// @access  Private (Teachers only)
router.get("/:id", protect, getLessonById);

// @desc    Update a lesson
// @route   PUT /api/lessons/:id
// @access  Private (Teachers only)
router.put("/:id", protect, updateLesson);

// @desc    Delete a lesson
// @route   DELETE /api/lessons/:id
// @access  Private (Teachers only)
router.delete("/:id", protect, deleteLesson);

// @desc    Start a live lesson (generate room code)
// @route   POST /api/lessons/:id/start-live
// @access  Private (Teachers only)
router.post("/:id/start-live", protect, startLiveLesson);

// @desc    Stop a live lesson
// @route   POST /api/lessons/:id/stop-live
// @access  Private (Teachers only)
router.post("/:id/stop-live", protect, stopLiveLesson);

// @desc    Switch to next song in lesson
// @route   POST /api/lessons/:id/next-song
// @access  Private (Teachers only)
router.post("/:id/next-song", protect, nextSong);

// @desc    Switch to previous song in lesson
// @route   POST /api/lessons/:id/previous-song
// @access  Private (Teachers only)
router.post("/:id/previous-song", protect, previousSong);

// @desc    Set current song in lesson
// @route   POST /api/lessons/:id/set-song/:songIndex
// @access  Private (Teachers only)
router.post("/:id/set-song/:songIndex", protect, setSong);

// @desc    Add student recording to lesson
// @route   POST /api/lessons/:id/recordings
// @access  Public (for students)
router.post("/:id/recordings", addStudentRecording);

// @desc    Get lesson recordings for analysis
// @route   GET /api/lessons/:id/recordings
// @access  Private (Teachers only)
router.get("/:id/recordings", protect, getLessonRecordings);

export default router;
