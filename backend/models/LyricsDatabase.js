import mongoose from "mongoose";

/**
 * מאגר מילות שיר - טבלה לאחסון מילות שיר שנוספו על ידי משתמשים
 */
const lyricsDatabaseSchema = new mongoose.Schema(
  {
    // מזהה iTunes ייחודי (מפתח ראשי)
    trackId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // פרטי השיר מ-iTunes
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },

    // URLs מ-iTunes
    previewUrl: {
      type: String,
      required: false,
    },
    artworkUrl: {
      type: String,
      required: false,
    },

    // מילות השיר
    lyrics: {
      type: String,
      required: true,
    },

    // מילות מפתח לחיפוש מהיר
    keywords: [
      {
        type: String,
        lowercase: true,
      },
    ],

    // פרטים נוספים
    language: {
      type: String,
      enum: ["hebrew", "english", "other"],
      default: "hebrew",
    },

    // מי הוסיף את השיר
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // סטטיסטיקות שימוש
    usageCount: {
      type: Number,
      default: 0,
    },

    // אימות איכות
    isVerified: {
      type: Boolean,
      default: false,
    },

    // דירוג איכות (על ידי משתמשים)
    qualityRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },

    // מספר דירוגים
    ratingCount: {
      type: Number,
      default: 0,
    },

    // פרטים טכניים
    source: {
      type: String,
      enum: ["user_input", "admin_import", "api_import"],
      default: "user_input",
    },

    // נתונים נוספים
    metadata: {
      album: String,
      year: Number,
      genre: String,
      duration: Number, // באלפיות שנייה
    },
  },
  {
    timestamps: true,
    // אינדקסים לחיפוש מהיר
    indexes: [
      { trackId: 1 }, // אינדקס ראשי
      { title: "text", artist: "text", keywords: "text" },
      { title: 1, artist: 1 },
      { usageCount: -1 },
      { createdAt: -1 },
      { previewUrl: 1 },
      { artworkUrl: 1 },
    ],
  }
);

// פונקציות עזר
lyricsDatabaseSchema.methods.incrementUsage = function () {
  this.usageCount += 1;
  return this.save();
};

lyricsDatabaseSchema.methods.addRating = function (rating) {
  const totalRating = this.qualityRating * this.ratingCount + rating;
  this.ratingCount += 1;
  this.qualityRating = totalRating / this.ratingCount;
  return this.save();
};

// פונקציות סטטיות לחיפוש
lyricsDatabaseSchema.statics.findByTrackId = function (trackId) {
  return this.findOne({ trackId });
};

lyricsDatabaseSchema.statics.findByTitleAndArtist = function (title, artist) {
  return this.findOne({
    title: new RegExp(title.trim(), "i"),
    artist: new RegExp(artist.trim(), "i"),
  });
};

lyricsDatabaseSchema.statics.findByiTunesData = function (
  trackId,
  title,
  artist
) {
  // חיפוש ראשון לפי trackId (הכי מדויק)
  if (trackId) {
    return this.findOne({ trackId });
  }

  // חיפוש חלופי לפי שם ואמן
  return this.findOne({
    title: new RegExp(title.trim(), "i"),
    artist: new RegExp(artist.trim(), "i"),
  });
};

lyricsDatabaseSchema.statics.searchSongs = function (searchTerm, limit = 10) {
  return this.find({
    $or: [
      { title: new RegExp(searchTerm, "i") },
      { artist: new RegExp(searchTerm, "i") },
      { keywords: { $in: [new RegExp(searchTerm, "i")] } },
    ],
  })
    .sort({ usageCount: -1, qualityRating: -1 })
    .limit(limit);
};

lyricsDatabaseSchema.statics.getPopularSongs = function (limit = 20) {
  return this.find({})
    .sort({ usageCount: -1, qualityRating: -1 })
    .limit(limit)
    .select("title artist usageCount qualityRating language");
};

// פונקציה ליצירת מילות מפתח
lyricsDatabaseSchema.methods.generateKeywords = function () {
  const text = `${this.title} ${this.artist} ${this.lyrics}`;
  const words = text
    .toLowerCase()
    .replace(/[^\w\s\u0590-\u05FF]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .slice(0, 50); // מגביל ל-50 מילות מפתח

  this.keywords = [...new Set(words)]; // הסרת כפילויות
  return this;
};

// Pre-save middleware
lyricsDatabaseSchema.pre("save", function (next) {
  if (
    this.isModified("lyrics") ||
    this.isModified("title") ||
    this.isModified("artist")
  ) {
    this.generateKeywords();
  }
  next();
});

const LyricsDatabase = mongoose.model("LyricsDatabase", lyricsDatabaseSchema);
export default LyricsDatabase;
