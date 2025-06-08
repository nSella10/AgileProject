import LyricsDatabase from "../models/LyricsDatabase.js";

/**
 * שירות לניהול מאגר מילות השיר
 */

/**
 * חיפוש מילות שיר במאגר לפי נתוני iTunes
 * @param {string} trackId - מזהה iTunes (אופציונלי)
 * @param {string} title - שם השיר
 * @param {string} artist - שם הזמר
 * @returns {Promise<Object|null>} - מילות השיר או null אם לא נמצא
 */
export async function findLyricsInDatabase(trackId, title, artist) {
  try {
    console.log(
      `🔍 Searching in lyrics database for: "${title}" by "${artist}" (trackId: ${trackId})`
    );

    // חיפוש מדויק לפי trackId או שם/אמן
    let song = await LyricsDatabase.findByiTunesData(trackId, title, artist);

    if (song) {
      console.log(
        `✅ Found exact match in database: ${song.lyrics.length} characters`
      );
      // עדכון מונה השימוש
      await song.incrementUsage();
      return {
        lyrics: song.lyrics,
        keywords: song.keywords,
        source: "database",
        usageCount: song.usageCount,
        qualityRating: song.qualityRating,
        language: song.language,
        id: song._id,
        trackId: song.trackId,
      };
    }

    // חיפוש חלקי אם לא נמצא מדויק
    const partialMatches = await LyricsDatabase.searchSongs(
      `${title} ${artist}`,
      3
    );

    if (partialMatches.length > 0) {
      console.log(
        `🔍 Found ${partialMatches.length} partial matches in database`
      );
      // החזרת ההתאמה הטובה ביותר
      const bestMatch = partialMatches[0];
      await bestMatch.incrementUsage();
      return {
        lyrics: bestMatch.lyrics,
        keywords: bestMatch.keywords,
        source: "database_partial",
        usageCount: bestMatch.usageCount,
        qualityRating: bestMatch.qualityRating,
        language: bestMatch.language,
        id: bestMatch._id,
        originalTitle: bestMatch.title,
        originalArtist: bestMatch.artist,
      };
    }

    console.log(
      `❌ No lyrics found in database for: "${title}" by "${artist}"`
    );
    return null;
  } catch (error) {
    console.error(`❌ Error searching lyrics database:`, error.message);
    return null;
  }
}

/**
 * הוספת מילות שיר חדשות למאגר
 * @param {Object} songData - נתוני השיר
 * @returns {Promise<Object>} - השיר שנוסף
 */
export async function addLyricsToDatabase(songData) {
  try {
    const {
      trackId,
      title,
      artist,
      lyrics,
      userId,
      language = "hebrew",
      previewUrl = null,
      artworkUrl = null,
      metadata = {},
    } = songData;

    console.log(
      `📝 Adding new lyrics to database: "${title}" by "${artist}" (trackId: ${trackId})`
    );

    // בדיקה אם השיר כבר קיים לפי trackId
    let existingSong = null;
    if (trackId) {
      existingSong = await LyricsDatabase.findByTrackId(trackId);
    }

    // אם לא נמצא לפי trackId, נחפש לפי שם ואמן
    if (!existingSong) {
      existingSong = await LyricsDatabase.findByTitleAndArtist(title, artist);
    }

    if (existingSong) {
      console.log(`⚠️ Song already exists in database, updating lyrics`);
      existingSong.lyrics = lyrics;
      existingSong.language = language;
      existingSong.metadata = { ...existingSong.metadata, ...metadata };

      // עדכון נתוני iTunes אם חסרים
      if (trackId && !existingSong.trackId) {
        existingSong.trackId = trackId;
      }
      if (previewUrl && !existingSong.previewUrl) {
        existingSong.previewUrl = previewUrl;
      }
      if (artworkUrl && !existingSong.artworkUrl) {
        existingSong.artworkUrl = artworkUrl;
      }

      existingSong.generateKeywords();
      await existingSong.save();
      return existingSong;
    }

    // יצירת שיר חדש
    const newSong = new LyricsDatabase({
      trackId: trackId || `manual_${Date.now()}`, // מזהה ייחודי אם אין trackId
      title: title.trim(),
      artist: artist.trim(),
      lyrics: lyrics.trim(),
      previewUrl,
      artworkUrl,
      addedBy: userId,
      language,
      metadata,
      source: "user_input",
    });

    await newSong.save();

    console.log(`✅ Successfully added new song to database: ${newSong._id}`);

    return newSong;
  } catch (error) {
    console.error(`❌ Error adding lyrics to database:`, error.message);
    throw error;
  }
}

/**
 * עדכון דירוג איכות של שיר
 * @param {string} songId - מזהה השיר
 * @param {number} rating - דירוג (1-5)
 * @returns {Promise<Object>} - השיר המעודכן
 */
export async function rateSongQuality(songId, rating) {
  try {
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const song = await LyricsDatabase.findById(songId);
    if (!song) {
      throw new Error("Song not found");
    }

    await song.addRating(rating);
    console.log(
      `✅ Updated song rating: ${song.qualityRating.toFixed(1)} (${
        song.ratingCount
      } ratings)`
    );

    return song;
  } catch (error) {
    console.error(`❌ Error rating song:`, error.message);
    throw error;
  }
}

/**
 * קבלת שירים פופולריים
 * @param {number} limit - מספר שירים להחזיר
 * @returns {Promise<Array>} - רשימת שירים פופולריים
 */
export async function getPopularSongs(limit = 20) {
  try {
    const popularSongs = await LyricsDatabase.getPopularSongs(limit);
    console.log(`📊 Retrieved ${popularSongs.length} popular songs`);
    return popularSongs;
  } catch (error) {
    console.error(`❌ Error getting popular songs:`, error.message);
    return [];
  }
}

/**
 * חיפוש שירים לפי מונח חיפוש
 * @param {string} searchTerm - מונח חיפוש
 * @param {number} limit - מספר תוצאות
 * @returns {Promise<Array>} - רשימת שירים
 */
export async function searchSongsInDatabase(searchTerm, limit = 10) {
  try {
    const songs = await LyricsDatabase.searchSongs(searchTerm, limit);
    console.log(`🔍 Found ${songs.length} songs matching: "${searchTerm}"`);
    return songs;
  } catch (error) {
    console.error(`❌ Error searching songs:`, error.message);
    return [];
  }
}

/**
 * קבלת סטטיסטיקות מאגר השירים
 * @returns {Promise<Object>} - סטטיסטיקות
 */
export async function getDatabaseStats() {
  try {
    const totalSongs = await LyricsDatabase.countDocuments();
    const hebrewSongs = await LyricsDatabase.countDocuments({
      language: "hebrew",
    });
    const englishSongs = await LyricsDatabase.countDocuments({
      language: "english",
    });
    const verifiedSongs = await LyricsDatabase.countDocuments({
      isVerified: true,
    });

    const topContributors = await LyricsDatabase.aggregate([
      { $group: { _id: "$addedBy", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
    ]);

    const stats = {
      totalSongs,
      hebrewSongs,
      englishSongs,
      verifiedSongs,
      topContributors: topContributors.map((c) => ({
        userId: c._id,
        userName: c.user[0]?.name || "Unknown",
        songsAdded: c.count,
      })),
    };

    console.log(
      `📊 Database stats: ${totalSongs} total songs (${hebrewSongs} Hebrew, ${englishSongs} English)`
    );
    return stats;
  } catch (error) {
    console.error(`❌ Error getting database stats:`, error.message);
    return {
      totalSongs: 0,
      hebrewSongs: 0,
      englishSongs: 0,
      verifiedSongs: 0,
      topContributors: [],
    };
  }
}

/**
 * חילוץ מילות מפתח ממילות השיר
 * @param {string} lyrics - מילות השיר
 * @returns {Array<string>} - מערך של מילות מפתח
 */
export function extractKeywordsFromLyrics(lyrics) {
  if (!lyrics || typeof lyrics !== "string") {
    return [];
  }

  try {
    // ניקוי מילות השיר מתגיות HTML ותווים מיוחדים
    const cleanLyrics = lyrics
      .replace(/\[.*?\]/g, "") // הסרת תגיות כמו [Verse 1], [Chorus]
      .replace(/\(.*?\)/g, "") // הסרת הערות בסוגריים
      .replace(/[^\w\s\u0590-\u05FF]/g, " ") // השארת רק אותיות, מספרים ורווחים (כולל עברית)
      .replace(/\s+/g, " ") // החלפת רווחים מרובים ברווח יחיד
      .trim()
      .toLowerCase();

    // פיצול למילים
    const words = cleanLyrics.split(/\s+/);

    // סינון מילים קצרות ומילות עצירה
    const stopWords = new Set([
      "the",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "את",
      "של",
      "על",
      "אל",
      "מן",
      "עם",
      "כל",
      "זה",
      "זו",
      "הוא",
      "היא",
      "אני",
      "אתה",
      "אתם",
    ]);

    const keywords = words
      .filter((word) => word.length > 2 && !stopWords.has(word))
      .slice(0, 50); // מגביל ל-50 מילות מפתח

    return [...new Set(keywords)]; // הסרת כפילויות
  } catch (error) {
    console.error(`❌ Error extracting keywords:`, error.message);
    return [];
  }
}
