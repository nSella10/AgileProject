import {
  findLyricsInDatabase,
  addLyricsToDatabase,
  extractKeywordsFromLyrics,
} from "./lyricsDatabaseService.js";

/**
 * קבלת מילות שיר ממאגר הנתונים
 * @param {string} title - שם השיר
 * @param {string} artist - שם הזמר
 * @returns {Promise<Object|null>} - מילות השיר או null אם לא נמצא
 */
export async function fetchLyricsFromGenius(trackId, title, artist) {
  try {
    console.log(
      `🎵 Searching lyrics for: "${title}" by "${artist}" (trackId: ${trackId})`
    );

    // ניסיון ראשון: חיפוש במאגר הנתונים שלנו
    const databaseResult = await findLyricsInDatabase(trackId, title, artist);
    if (databaseResult) {
      console.log(`✅ Found lyrics in database for: "${title}" by "${artist}"`);
      return databaseResult.lyrics;
    }

    // אם לא נמצא במאגר - נחזיר null כדי שהמשתמש יוכל להוסיף ידנית
    console.log(
      `❌ No lyrics found in database for: "${title}" by "${artist}"`
    );
    console.log(`💡 User will be prompted to add lyrics manually`);
    return null;
  } catch (error) {
    console.error(
      `❌ Error fetching lyrics for "${title}" by "${artist}":`,
      error.message
    );
    return tryFallbackSongs(title, artist);
  }
}

/**
 * קבלת מילות שיר מ-Lyrics.ovh API
 */
async function fetchFromLyricsOvh(title, artist) {
  try {
    const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(
      artist
    )}/${encodeURIComponent(title)}`;
    console.log(`📡 Fetching from Lyrics.ovh: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      console.log(`❌ Lyrics.ovh API error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data.lyrics && data.lyrics.trim().length > 0) {
      console.log(`✅ Lyrics.ovh success: ${data.lyrics.length} characters`);
      return data.lyrics;
    }

    return null;
  } catch (error) {
    console.error(`❌ Lyrics.ovh API error:`, error.message);
    return null;
  }
}

/**
 * קבלת מילות שיר מ-Musixmatch API (fallback)
 */
async function fetchFromMusixmatch(title, artist) {
  try {
    // לעת עתה נחזיר null - נוכל להוסיף Musixmatch API key בעתיד
    console.log(
      `🔄 Musixmatch API not implemented yet for: "${title}" by "${artist}"`
    );
    return null;
  } catch (error) {
    console.error(`❌ Musixmatch API error:`, error.message);
    return null;
  }
}

/**
 * Fallback function for known songs when APIs fail
 */
function tryFallbackSongs(title, artist) {
  const knownSongs = {
    "צליל מכוון": {
      artist: "דני סנדרסון",
      lyrics:
        "בואי הנה בואי לכאן צליל מכוון בואי נשמע איך זה נשמע בואי הנה בואי לכאן",
    },
    "נתתי לה חיי": {
      artist: "kaveret",
      lyrics:
        "נתתי לה חיי נתתי לה כל מה שיש לי והיא לקחה הכל ועזבה אותי כאן לבד",
    },
    "ירדתי על ברכיי": {
      artist: "שלמה ארצי",
      lyrics:
        "ירדתי על ברכיי ובכיתי כמו ילד קטן ביקשתי ממך סליחה על כל מה שעשיתי לך",
    },
    "upside down": {
      artist: "jack johnson",
      lyrics:
        "who's to say what's impossible well they forgot this world keeps spinning and with each new day i can feel a change in everything",
    },
    "better together": {
      artist: "jack johnson",
      lyrics:
        "there's no combination of words i could put on the back of a postcard no song that i could sing but i can try for your heart",
    },
    "banana pancakes": {
      artist: "jack johnson",
      lyrics:
        "can't you see that it's just raining ain't no need to go outside but baby you hardly even notice when i try to show you this song is meant to keep you from doing what you're supposed to",
    },
    "sitting waiting wishing": {
      artist: "jack johnson",
      lyrics:
        "now i was sitting waiting wishing that you believed in superstitions then maybe you'd see the signs but lord knows that this world is cruel and i ain't the lord no i'm just a fool",
    },
    "good people": {
      artist: "jack johnson",
      lyrics:
        "well you win it's your show now so what's it gonna be cause people will tune in how many train wrecks do we need to see before we lose touch of we thought this was supposed to be",
    },
  };

  const normalizedTitle = title.toLowerCase().trim();
  const normalizedArtist = artist.toLowerCase().trim();

  for (const [songTitle, songData] of Object.entries(knownSongs)) {
    if (
      normalizedTitle.includes(songTitle.toLowerCase()) ||
      songTitle.toLowerCase().includes(normalizedTitle)
    ) {
      if (
        normalizedArtist.includes(songData.artist.toLowerCase()) ||
        songData.artist.toLowerCase().includes(normalizedArtist)
      ) {
        console.log(
          `✅ Found lyrics in fallback for: "${title}" by "${artist}"`
        );
        return songData.lyrics;
      }
    }
  }

  console.log(`❌ No lyrics found anywhere for: "${title}" by "${artist}"`);
  return null;
}

/**
 * הוספת מילות שיר חדשות למאגר על ידי משתמש
 * @param {string} title - שם השיר
 * @param {string} artist - שם הזמר
 * @param {string} lyrics - מילות השיר
 * @param {string} userId - מזהה המשתמש
 * @param {string} language - שפת השיר (hebrew/english/other)
 * @returns {Promise<Object>} - השיר שנוסף עם מילות מפתח
 */
export async function addUserLyrics(
  trackId,
  title,
  artist,
  lyrics,
  userId,
  language = "hebrew",
  previewUrl = null,
  artworkUrl = null
) {
  try {
    console.log(
      `📝 User adding lyrics for: "${title}" by "${artist}" (trackId: ${trackId})`
    );

    // הוספה למאגר
    const newSong = await addLyricsToDatabase({
      trackId,
      title,
      artist,
      lyrics,
      userId,
      language,
      previewUrl,
      artworkUrl,
    });

    // חילוץ מילות מפתח
    const keywords = extractKeywordsFromLyrics(lyrics);

    console.log(`✅ Successfully added lyrics to database: ${newSong._id}`);
    console.log(`🔑 Extracted ${keywords.length} keywords from lyrics`);

    return {
      lyrics,
      keywords,
      source: "user_added",
      songId: newSong._id,
      message: "Lyrics added successfully to database",
    };
  } catch (error) {
    console.error(`❌ Error adding user lyrics:`, error.message);
    throw error;
  }
}

// הפונקציה extractKeywordsFromLyrics מיובאת מ-lyricsDatabaseService.js
