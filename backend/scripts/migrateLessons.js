import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

// Migration script to convert old lesson format to new format
const migrateLessons = async () => {
  try {
    await connectDB();

    // Get the lessons collection directly
    const db = mongoose.connection.db;
    const lessonsCollection = db.collection("lessons");

    // Find all lessons with the old format (has 'song' field instead of 'songs')
    const oldLessons = await lessonsCollection.find({
      song: { $exists: true },
      songs: { $exists: false }
    }).toArray();

    console.log(`Found ${oldLessons.length} lessons to migrate`);

    if (oldLessons.length === 0) {
      console.log("No lessons need migration");
      process.exit(0);
    }

    // Migrate each lesson
    for (const lesson of oldLessons) {
      console.log(`Migrating lesson: ${lesson.title}`);

      // Convert single song to songs array
      const songs = [{
        title: lesson.song.title,
        artist: lesson.song.artist,
        previewUrl: lesson.song.previewUrl || "",
        artworkUrl: lesson.song.artworkUrl || "",
        trackId: lesson.song.trackId || "",
        playbackStart: lesson.playbackStart || 0,
        playbackDuration: lesson.playbackDuration || 10,
      }];

      // Update the lesson
      await lessonsCollection.updateOne(
        { _id: lesson._id },
        {
          $set: {
            songs: songs,
            currentSongIndex: 0
          },
          $unset: {
            song: "",
            playbackStart: "",
            playbackDuration: ""
          }
        }
      );

      console.log(`✅ Migrated lesson: ${lesson.title}`);
    }

    console.log(`🎉 Successfully migrated ${oldLessons.length} lessons`);
    process.exit(0);

  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

// Run migration
migrateLessons();
