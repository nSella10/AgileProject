import mongoose from "mongoose";
import songSchema from "./SongSchema.js";

const gameSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    songs: [songSchema],
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Game = mongoose.model("Game", gameSchema);
export default Game;
