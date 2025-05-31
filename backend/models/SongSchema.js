import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, default: "Unknown Artist" },
  correctAnswer: { type: String, required: true },
  correctAnswers: [{ type: String }], // מערך של תשובות נכונות אפשריות
  lyrics: { type: String, default: "" }, // מילות השיר המלאות (טקסט חופשי)
  lyricsKeywords: [{ type: String }], // מילים מפתח מהשיר לניחוש (deprecated - נשתמש ב-lyrics)
  fullLyrics: { type: String, default: "" }, // מילות השיר המלאות שהמשתמש הוסיף
  previewUrl: { type: String, default: "" },
  artworkUrl: { type: String, default: "" },
  trackId: { type: String, default: "" },
  options: [{ type: String }], // לא חובה יותר, יכול להיות ריק
});

export default songSchema;
