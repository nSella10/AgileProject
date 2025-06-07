import fetch from "node-fetch";
import * as cheerio from "cheerio";

/**
 * שירות לחילוץ מילות שיר מאתרים שונים
 */

/**
 * חיפוש מילות שיר בשירונט (לשירים ישראליים)
 * @param {string} title - שם השיר
 * @param {string} artist - שם הזמר
 * @returns {Promise<string|null>} - מילות השיר או null אם לא נמצא
 */
export async function fetchLyricsFromShironet(title, artist) {
  try {
    console.log(`🎵 Searching Shironet for: "${title}" by "${artist}"`);

    // ניקוי שם השיר והזמר לחיפוש
    const cleanTitle = cleanSearchTerm(title);
    const cleanArtist = cleanSearchTerm(artist);

    // חיפוש בשירונט
    const searchUrl = `https://shironet.mako.co.il/search?q=${encodeURIComponent(
      cleanTitle + " " + cleanArtist
    )}`;
    console.log(`📡 Searching Shironet: ${searchUrl}`);

    const searchResponse = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!searchResponse.ok) {
      console.log(`❌ Shironet search failed: ${searchResponse.status}`);
      return null;
    }

    const searchHtml = await searchResponse.text();
    const $ = cheerio.load(searchHtml);

    // חיפוש קישור לשיר הראשון בתוצאות
    const firstResult = $(".search_results_songs .song_name a").first();
    if (!firstResult.length) {
      console.log(
        `❌ No results found in Shironet for: "${title}" by "${artist}"`
      );
      return null;
    }

    const songUrl = firstResult.attr("href");
    if (!songUrl) {
      console.log(`❌ No song URL found in Shironet`);
      return null;
    }

    // בניית URL מלא
    const fullSongUrl = songUrl.startsWith("http")
      ? songUrl
      : `https://shironet.mako.co.il${songUrl}`;
    console.log(`📡 Fetching lyrics from: ${fullSongUrl}`);

    // קבלת דף השיר
    const songResponse = await fetch(fullSongUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!songResponse.ok) {
      console.log(`❌ Failed to fetch song page: ${songResponse.status}`);
      return null;
    }

    const songHtml = await songResponse.text();
    const songPage = cheerio.load(songHtml);

    // חילוץ מילות השיר
    const lyricsElement = songPage(
      ".artist_lyrics_text, .lyrics_text, .song_lyrics_text"
    );
    if (!lyricsElement.length) {
      console.log(`❌ No lyrics found on Shironet page`);
      return null;
    }

    const lyrics = lyricsElement.text().trim();
    if (lyrics.length > 0) {
      console.log(`✅ Found lyrics on Shironet: ${lyrics.length} characters`);
      return lyrics;
    }

    return null;
  } catch (error) {
    console.error(`❌ Error fetching from Shironet:`, error.message);
    return null;
  }
}

/**
 * חיפוש מילות שיר ב-Genius (לשירים באנגלית)
 * @param {string} title - שם השיר
 * @param {string} artist - שם הזמר
 * @returns {Promise<string|null>} - מילות השיר או null אם לא נמצא
 */
export async function fetchLyricsFromGenius(title, artist) {
  try {
    console.log(`🎵 Searching Genius for: "${title}" by "${artist}"`);

    // ניקוי שם השיר והזמר לחיפוש
    const cleanTitle = cleanSearchTerm(title);
    const cleanArtist = cleanSearchTerm(artist);

    // חיפוש ב-Genius
    const searchUrl = `https://genius.com/search?q=${encodeURIComponent(
      cleanArtist + " " + cleanTitle
    )}`;
    console.log(`📡 Searching Genius: ${searchUrl}`);

    const searchResponse = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!searchResponse.ok) {
      console.log(`❌ Genius search failed: ${searchResponse.status}`);
      return null;
    }

    const searchHtml = await searchResponse.text();
    const $ = cheerio.load(searchHtml);

    // חיפוש קישור לשיר הראשון בתוצאות
    const firstResult = $(".mini_card a, .search_result a").first();
    if (!firstResult.length) {
      console.log(
        `❌ No results found in Genius for: "${title}" by "${artist}"`
      );
      return null;
    }

    const songUrl = firstResult.attr("href");
    if (!songUrl) {
      console.log(`❌ No song URL found in Genius`);
      return null;
    }

    // בניית URL מלא
    const fullSongUrl = songUrl.startsWith("http")
      ? songUrl
      : `https://genius.com${songUrl}`;
    console.log(`📡 Fetching lyrics from: ${fullSongUrl}`);

    // קבלת דף השיר
    const songResponse = await fetch(fullSongUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!songResponse.ok) {
      console.log(`❌ Failed to fetch song page: ${songResponse.status}`);
      return null;
    }

    const songHtml = await songResponse.text();
    const songPage = cheerio.load(songHtml);

    // חילוץ מילות השיר מ-Genius
    const lyricsElement = songPage(
      '[data-lyrics-container="true"], .lyrics, .Lyrics__Container-sc-1ynbvzw-6'
    );
    if (!lyricsElement.length) {
      console.log(`❌ No lyrics found on Genius page`);
      return null;
    }

    const lyrics = lyricsElement.text().trim();
    if (lyrics.length > 0) {
      console.log(`✅ Found lyrics on Genius: ${lyrics.length} characters`);
      return lyrics;
    }

    return null;
  } catch (error) {
    console.error(`❌ Error fetching from Genius:`, error.message);
    return null;
  }
}

/**
 * ניקוי מונח חיפוש
 * @param {string} term - המונח לניקוי
 * @returns {string} - המונח המנוקה
 */
function cleanSearchTerm(term) {
  return term
    .replace(/[^\w\s\u0590-\u05FF]/g, " ") // השארת רק אותיות, מספרים ורווחים (כולל עברית)
    .replace(/\s+/g, " ") // החלפת רווחים מרובים ברווח יחיד
    .trim();
}

/**
 * זיהוי שפת השיר (עברית או אנגלית)
 * @param {string} title - שם השיר
 * @param {string} artist - שם הזמר
 * @returns {string} - 'hebrew' או 'english'
 */
export function detectLanguage(title, artist) {
  const text = (title + " " + artist).toLowerCase();

  // בדיקה אם יש תווים עבריים
  const hebrewRegex = /[\u0590-\u05FF]/;
  if (hebrewRegex.test(text)) {
    return "hebrew";
  }

  return "english";
}

/**
 * פונקציה מרכזית לחיפוש מילות שיר עם web scraping
 * @param {string} title - שם השיר
 * @param {string} artist - שם הזמר
 * @returns {Promise<string|null>} - מילות השיר או null אם לא נמצא
 */
export async function fetchLyricsWithWebScraping(title, artist) {
  try {
    console.log(
      `🎵 Starting web scraping search for: "${title}" by "${artist}"`
    );

    // זיהוי שפת השיר
    const language = detectLanguage(title, artist);
    console.log(`🔍 Detected language: ${language}`);

    let lyrics = null;

    if (language === "hebrew") {
      // עבור שירים עבריים - נחפש בשירונט
      console.log(`🇮🇱 Searching Hebrew song in Shironet...`);
      lyrics = await fetchLyricsFromShironet(title, artist);

      // אם לא נמצא בשירונט, ננסה גם ב-Genius (למקרה של שירים עבריים שיש ב-Genius)
      if (!lyrics) {
        console.log(`🌍 Trying Genius as fallback for Hebrew song...`);
        lyrics = await fetchLyricsFromGenius(title, artist);
      }
    } else {
      // עבור שירים באנגלית - נחפש ב-Genius
      console.log(`🇺🇸 Searching English song in Genius...`);
      lyrics = await fetchLyricsFromGenius(title, artist);
    }

    if (lyrics) {
      console.log(`✅ Web scraping successful for: "${title}" by "${artist}"`);
      return lyrics;
    } else {
      console.log(`❌ Web scraping failed for: "${title}" by "${artist}"`);
      return null;
    }
  } catch (error) {
    console.error(
      `❌ Error in web scraping for "${title}" by "${artist}":`,
      error.message
    );
    return null;
  }
}
