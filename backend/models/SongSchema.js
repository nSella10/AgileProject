import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  audioUrl: { type: String, required: true },
  correctAnswer: { type: String, required: true },
  options: [{ type: String, required: true }],
});

export default songSchema;
