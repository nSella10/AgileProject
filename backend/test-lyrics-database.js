// Load environment variables
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { 
  findLyricsInDatabase, 
  addLyricsToDatabase, 
  getDatabaseStats,
  searchSongsInDatabase 
} from "./services/lyricsDatabaseService.js";

/**
 * בדיקת מאגר מילות השיר החדש
 */
async function testLyricsDatabase() {
  try {
    console.log("🧪 Testing New Lyrics Database System");
    console.log("====================================");
    
    // התחברות למונגו
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
    
    // בדיקת סטטיסטיקות ראשוניות
    console.log("\n📊 Initial Database Stats:");
    console.log("-------------------------");
    const initialStats = await getDatabaseStats();
    console.log(`Total songs: ${initialStats.totalSongs}`);
    console.log(`Hebrew songs: ${initialStats.hebrewSongs}`);
    console.log(`English songs: ${initialStats.englishSongs}`);
    console.log(`Verified songs: ${initialStats.verifiedSongs}`);
    
    // בדיקת חיפוש שיר שלא קיים
    console.log("\n🔍 Testing search for non-existent song:");
    console.log("----------------------------------------");
    const notFound = await findLyricsInDatabase("584832124", "המגפיים של ברוך", "kaveret");
    if (notFound) {
      console.log(`✅ Found existing song: ${notFound.lyrics.length} characters`);
    } else {
      console.log("❌ Song not found (as expected for new database)");
    }
    
    // הוספת שיר לדוגמה
    console.log("\n📝 Adding sample song to database:");
    console.log("----------------------------------");
    const sampleSong = {
      trackId: "584832124",
      title: "המגפיים של ברוך",
      artist: "kaveret",
      lyrics: `הוא קנה אותן בזול
הן היו מלאות בחול
הוא ניקה אותן בספירט כל שעתיים.
האכיל אותן מרק
כשהקיאו הוא שתק,
הוא לקח אותן לסרט כל יומיים.

אבל יום אחד הוא קם
עדיין מנומנם,
חיפש ת'מגפיים בארון.
ובמקום שהן היו
רק פתק קטן מצא שם:
"הלכנו לחופשה, נחזור מחר בבוקר"`,
      userId: new mongoose.Types.ObjectId(),
      language: "hebrew",
      previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/7d.../preview.m4a",
      artworkUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/6a/d1/7b/6ad17b85.../artwork.jpg"
    };
    
    try {
      const addedSong = await addLyricsToDatabase(sampleSong);
      console.log(`✅ Successfully added song: ${addedSong._id}`);
      console.log(`🔑 Generated ${addedSong.keywords.length} keywords`);
    } catch (error) {
      if (error.code === 11000) {
        console.log("⚠️ Song already exists in database");
      } else {
        console.error("❌ Error adding song:", error.message);
      }
    }
    
    // בדיקת חיפוש אחרי הוספה
    console.log("\n🔍 Testing search after adding song:");
    console.log("------------------------------------");
    const foundSong = await findLyricsInDatabase("584832124", "המגפיים של ברוך", "kaveret");
    if (foundSong) {
      console.log(`✅ Found song: ${foundSong.lyrics.length} characters`);
      console.log(`📈 Usage count: ${foundSong.usageCount}`);
      console.log(`⭐ Quality rating: ${foundSong.qualityRating}`);
      console.log(`🏷️ Keywords: ${foundSong.keywords.slice(0, 5).join(', ')}...`);
    } else {
      console.log("❌ Song not found after adding");
    }
    
    // בדיקת חיפוש כללי
    console.log("\n🔍 Testing general search:");
    console.log("--------------------------");
    const searchResults = await searchSongsInDatabase("מגפיים", 5);
    console.log(`Found ${searchResults.length} songs matching "מגפיים"`);
    searchResults.forEach((song, index) => {
      console.log(`${index + 1}. "${song.title}" by ${song.artist} (${song.language})`);
    });
    
    // בדיקת סטטיסטיקות סופיות
    console.log("\n📊 Final Database Stats:");
    console.log("------------------------");
    const finalStats = await getDatabaseStats();
    console.log(`Total songs: ${finalStats.totalSongs}`);
    console.log(`Hebrew songs: ${finalStats.hebrewSongs}`);
    console.log(`English songs: ${finalStats.englishSongs}`);
    console.log(`Verified songs: ${finalStats.verifiedSongs}`);
    
    if (finalStats.topContributors.length > 0) {
      console.log("\n🏆 Top Contributors:");
      finalStats.topContributors.forEach((contributor, index) => {
        console.log(`${index + 1}. ${contributor.userName}: ${contributor.songsAdded} songs`);
      });
    }
    
    console.log("\n🏁 Test completed successfully!");
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  }
}

// הרצת הבדיקה
testLyricsDatabase().catch(console.error);
