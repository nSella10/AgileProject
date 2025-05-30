import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    songs: [
      {
        title: { type: String, required: true },
        artist: { type: String, default: "Unknown Artist" },
        previewUrl: { type: String, default: "" },
        artworkUrl: { type: String, default: "" },
        trackId: { type: String, default: "" },
        playbackStart: { type: Number, default: 0 }, // in seconds - specific for this song
        playbackDuration: { type: Number, default: 10 }, // in seconds - specific for this song
      },
    ],
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    duration: { type: Number, default: 30 }, // in minutes
    maxStudents: { type: Number, default: 20 },
    currentSongIndex: { type: Number, default: 0 }, // which song is currently being played
    analysisType: {
      type: String,
      enum: ["pitch", "rhythm", "tone", "comprehensive"],
      default: "pitch",
    },
    isActive: { type: Boolean, default: false },
    roomCode: { type: String, default: null }, // for live sessions
    students: [
      {
        name: { type: String, required: true },
        joinedAt: { type: Date, default: Date.now },
        recordings: [
          {
            songIndex: { type: Number, required: true }, // which song this recording is for
            audioUrl: String,
            analysisResult: {
              pitchAccuracy: Number,
              rhythmAccuracy: Number,
              overallScore: Number,
              feedback: String,
            },
            recordedAt: { type: Date, default: Date.now },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Lesson = mongoose.model("Lesson", lessonSchema);
export default Lesson;
