import asyncHandler from "express-async-handler";
import Lesson from "../models/Lesson.js";
import { generateRoomCode } from "../utils/generateRoomCode.js";

// @desc    Create a new lesson
// @route   POST /api/lessons
// @access  Private (Teachers only)
export const createLesson = asyncHandler(async (req, res) => {
  console.log("Creating a new lesson...");
  console.log("📝 Request body:", JSON.stringify(req.body, null, 2));
  console.log("👤 User:", req.user._id);

  const {
    title,
    description,
    songs,
    difficulty,
    duration,
    maxStudents,
    analysisType,
  } = req.body;

  console.log("🔍 Extracted data:");
  console.log("- Title:", title);
  console.log("- Songs:", songs);
  console.log("- Songs is array:", Array.isArray(songs));
  console.log("- Songs length:", songs?.length);

  if (!title || !songs || !Array.isArray(songs) || songs.length === 0) {
    console.log("❌ Validation failed");
    res.status(400).json({
      message: "Please provide a title and select at least one song.",
    });
    return;
  }

  const lesson = new Lesson({
    title,
    description,
    songs,
    difficulty,
    duration,
    maxStudents,
    analysisType,
    createdBy: req.user._id,
  });

  const savedLesson = await lesson.save();
  res.status(201).json(savedLesson);
});

// @desc    Get all lessons created by the logged-in teacher
// @route   GET /api/lessons/mine
// @access  Private (Teachers only)
export const getMyLessons = asyncHandler(async (req, res) => {
  const lessons = await Lesson.find({ createdBy: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(lessons);
});

// @desc    Get a single lesson by ID
// @route   GET /api/lessons/:id
// @access  Private (Teachers only)
export const getLessonById = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    res.status(404);
    throw new Error("Lesson not found");
  }

  // Check if the user is the owner of the lesson
  if (lesson.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to view this lesson");
  }

  res.json(lesson);
});

// @desc    Update a lesson
// @route   PUT /api/lessons/:id
// @access  Private (Teachers only)
export const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    res.status(404);
    throw new Error("Lesson not found");
  }

  // Check if the user is the owner of the lesson
  if (lesson.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this lesson");
  }

  const updatedLesson = await Lesson.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedLesson);
});

// @desc    Delete a lesson
// @route   DELETE /api/lessons/:id
// @access  Private (Teachers only)
export const deleteLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    res.status(404);
    throw new Error("Lesson not found");
  }

  // Check if the user is the owner of the lesson
  if (lesson.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this lesson");
  }

  await Lesson.findByIdAndDelete(req.params.id);
  res.json({ message: "Lesson deleted successfully" });
});

// @desc    Start a live lesson (generate room code)
// @route   POST /api/lessons/:id/start-live
// @access  Private (Teachers only)
export const startLiveLesson = asyncHandler(async (req, res) => {
  console.log("🚀 Starting live lesson with ID:", req.params.id);
  console.log("👤 User ID:", req.user._id);

  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    console.log("❌ Lesson not found");
    res.status(404);
    throw new Error("Lesson not found");
  }

  console.log("📚 Found lesson:", lesson.title);
  console.log("👨‍🏫 Lesson created by:", lesson.createdBy);

  // Check if the user is the owner of the lesson
  if (lesson.createdBy.toString() !== req.user._id.toString()) {
    console.log("❌ User not authorized to start this lesson");
    res.status(403);
    throw new Error("Not authorized to start this lesson");
  }

  // Generate room code and activate lesson
  const roomCode = generateRoomCode();
  console.log("🎯 Generated room code:", roomCode);

  lesson.roomCode = roomCode;
  lesson.isActive = true;
  lesson.students = []; // Reset students for new session

  await lesson.save();
  console.log("✅ Lesson saved successfully");

  res.json({
    message: "Live lesson started successfully",
    roomCode,
    lessonId: lesson._id,
  });
});

// @desc    Switch to next song in lesson
// @route   POST /api/lessons/:id/next-song
// @access  Private (Teachers only)
export const nextSong = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    res.status(404).json({ message: "Lesson not found" });
    return;
  }

  if (lesson.createdBy.toString() !== req.user._id.toString()) {
    res.status(403).json({ message: "Not authorized to control this lesson" });
    return;
  }

  if (lesson.currentSongIndex < lesson.songs.length - 1) {
    lesson.currentSongIndex += 1;
    await lesson.save();
    res.json({
      message: "Switched to next song",
      currentSongIndex: lesson.currentSongIndex,
      currentSong: lesson.songs[lesson.currentSongIndex],
    });
  } else {
    res.status(400).json({ message: "Already at the last song" });
  }
});

// @desc    Switch to previous song in lesson
// @route   POST /api/lessons/:id/previous-song
// @access  Private (Teachers only)
export const previousSong = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    res.status(404).json({ message: "Lesson not found" });
    return;
  }

  if (lesson.createdBy.toString() !== req.user._id.toString()) {
    res.status(403).json({ message: "Not authorized to control this lesson" });
    return;
  }

  if (lesson.currentSongIndex > 0) {
    lesson.currentSongIndex -= 1;
    await lesson.save();
    res.json({
      message: "Switched to previous song",
      currentSongIndex: lesson.currentSongIndex,
      currentSong: lesson.songs[lesson.currentSongIndex],
    });
  } else {
    res.status(400).json({ message: "Already at the first song" });
  }
});

// @desc    Set current song in lesson
// @route   POST /api/lessons/:id/set-song/:songIndex
// @access  Private (Teachers only)
export const setSong = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  const songIndex = parseInt(req.params.songIndex);

  if (!lesson) {
    res.status(404).json({ message: "Lesson not found" });
    return;
  }

  if (lesson.createdBy.toString() !== req.user._id.toString()) {
    res.status(403).json({ message: "Not authorized to control this lesson" });
    return;
  }

  if (songIndex < 0 || songIndex >= lesson.songs.length) {
    res.status(400).json({ message: "Invalid song index" });
    return;
  }

  lesson.currentSongIndex = songIndex;
  await lesson.save();

  res.json({
    message: "Song switched successfully",
    currentSongIndex: lesson.currentSongIndex,
    currentSong: lesson.songs[lesson.currentSongIndex],
  });
});

// @desc    Add student recording to lesson
// @route   POST /api/lessons/:id/recordings
// @access  Public (for students)
export const addStudentRecording = asyncHandler(async (req, res) => {
  const { studentName, songIndex, analysisResult } = req.body;

  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    res.status(404).json({ message: "Lesson not found" });
    return;
  }

  if (!lesson.isActive) {
    res.status(400).json({ message: "Lesson is not active" });
    return;
  }

  if (songIndex < 0 || songIndex >= lesson.songs.length) {
    res.status(400).json({ message: "Invalid song index" });
    return;
  }

  // Find or create student
  let student = lesson.students.find((s) => s.name === studentName);
  if (!student) {
    student = {
      name: studentName,
      joinedAt: new Date(),
      recordings: [],
    };
    lesson.students.push(student);
  }

  // Add recording
  const recording = {
    songIndex,
    analysisResult,
    recordedAt: new Date(),
  };

  student.recordings.push(recording);
  await lesson.save();

  res.status(201).json({
    message: "Recording saved successfully",
    recording,
  });
});

// @desc    Get lesson recordings for analysis
// @route   GET /api/lessons/:id/recordings
// @access  Private (Teachers only)
export const getLessonRecordings = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    res.status(404).json({ message: "Lesson not found" });
    return;
  }

  if (lesson.createdBy.toString() !== req.user._id.toString()) {
    res
      .status(403)
      .json({ message: "Not authorized to view this lesson's recordings" });
    return;
  }

  // Format recordings for analysis
  const recordings = lesson.students.map((student) => ({
    studentName: student.name,
    joinedAt: student.joinedAt,
    recordings: student.recordings.map((recording) => ({
      songIndex: recording.songIndex,
      songTitle: lesson.songs[recording.songIndex]?.title || "Unknown",
      analysisResult: recording.analysisResult,
      recordedAt: recording.recordedAt,
    })),
  }));

  res.json({
    lessonTitle: lesson.title,
    totalStudents: lesson.students.length,
    totalRecordings: lesson.students.reduce(
      (sum, student) => sum + student.recordings.length,
      0
    ),
    recordings,
  });
});

// @desc    Stop a live lesson
// @route   POST /api/lessons/:id/stop-live
// @access  Private (Teachers only)
export const stopLiveLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    res.status(404);
    throw new Error("Lesson not found");
  }

  // Check if the user is the owner of the lesson
  if (lesson.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to stop this lesson");
  }

  lesson.roomCode = null;
  lesson.isActive = false;

  await lesson.save();

  res.json({ message: "Live lesson stopped successfully" });
});

// @desc    Get lesson by room code (for students joining)
// @route   GET /api/lessons/room/:roomCode
// @access  Public
export const getLessonByRoomCode = asyncHandler(async (req, res) => {
  console.log("🔍 Looking for lesson with room code:", req.params.roomCode);

  const lesson = await Lesson.findOne({
    roomCode: req.params.roomCode,
    isActive: true,
  }).populate("createdBy", "firstName lastName");

  console.log("📚 Found lesson:", lesson ? lesson.title : "None");

  if (!lesson) {
    console.log("❌ Lesson not found or not active");
    res.status(404);
    throw new Error("Lesson not found or not active");
  }

  console.log("✅ Returning lesson data for room code:", req.params.roomCode);

  // Return lesson data without sensitive information
  res.json({
    _id: lesson._id,
    title: lesson.title,
    description: lesson.description,
    songs: lesson.songs, // Changed from song to songs
    teacher: lesson.createdBy,
    difficulty: lesson.difficulty,
    duration: lesson.duration,
    maxStudents: lesson.maxStudents,
    currentStudents: lesson.students.length,
    currentSongIndex: lesson.currentSongIndex || 0,
    analysisType: lesson.analysisType,
  });
});

// @desc    Get teacher analytics
// @route   GET /api/lessons/analytics
// @access  Private (Teachers only)
export const getTeacherAnalytics = asyncHandler(async (req, res) => {
  const lessons = await Lesson.find({ createdBy: req.user._id });

  const totalLessons = lessons.length;
  const activeLessons = lessons.filter((lesson) => lesson.isActive).length;
  const totalStudents = lessons.reduce(
    (sum, lesson) => sum + lesson.students.length,
    0
  );

  // Calculate average accuracy from all recordings
  let totalRecordings = 0;
  let totalAccuracy = 0;

  lessons.forEach((lesson) => {
    lesson.students.forEach((student) => {
      student.recordings.forEach((recording) => {
        if (recording.analysisResult && recording.analysisResult.overallScore) {
          totalRecordings++;
          totalAccuracy += recording.analysisResult.overallScore;
        }
      });
    });
  });

  const avgAccuracy = totalRecordings > 0 ? totalAccuracy / totalRecordings : 0;

  res.json({
    totalLessons,
    activeLessons,
    totalStudents,
    avgAccuracy: Math.round(avgAccuracy),
    recentLessons: lessons
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((lesson) => ({
        _id: lesson._id,
        title: lesson.title,
        studentsCount: lesson.students.length,
        isActive: lesson.isActive,
        createdAt: lesson.createdAt,
      })),
  });
});
