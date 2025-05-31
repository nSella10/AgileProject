/**
 * קבלת מילות שיר מ-APIs שונים
 * @param {string} title - שם השיר
 * @param {string} artist - שם הזמר
 * @returns {Promise<string|null>} - מילות השיר או null אם לא נמצא
 */
export async function fetchLyricsFromGenius(title, artist) {
  try {
    console.log(`🎵 Searching lyrics for: "${title}" by "${artist}"`);

    // ניסיון ראשון: Lyrics.ovh API
    const lyricsOvhResult = await fetchFromLyricsOvh(title, artist);
    if (lyricsOvhResult) {
      console.log(
        `✅ Found lyrics via Lyrics.ovh for: "${title}" by "${artist}"`
      );
      return lyricsOvhResult;
    }

    // ניסיון שני: Musixmatch API (fallback)
    const musixmatchResult = await fetchFromMusixmatch(title, artist);
    if (musixmatchResult) {
      console.log(
        `✅ Found lyrics via Musixmatch for: "${title}" by "${artist}"`
      );
      return musixmatchResult;
    }

    // ניסיון שלישי: שירים מוכרים מוכנים מראש
    const fallbackResult = tryFallbackSongs(title, artist);
    if (fallbackResult) {
      console.log(`✅ Found lyrics in fallback for: "${title}" by "${artist}"`);
      return fallbackResult;
    }

    console.log(`❌ No lyrics found anywhere for: "${title}" by "${artist}"`);
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
 * חילוץ מילות מפתח ממילות השיר
 * @param {string} lyrics - מילות השיר המלאות
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

    // סינון מילים
    const filteredWords = words.filter((word) => {
      // מילים באורך 2+ תווים
      if (word.length < 2) return false;

      // הסרת מילות עזר נפוצות באנגלית
      const englishStopWords = [
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
        "is",
        "are",
        "was",
        "were",
        "be",
        "been",
        "have",
        "has",
        "had",
        "do",
        "does",
        "did",
        "will",
        "would",
        "could",
        "should",
        "may",
        "might",
        "can",
        "must",
        "shall",
        "this",
        "that",
        "these",
        "those",
        "i",
        "you",
        "he",
        "she",
        "it",
        "we",
        "they",
        "me",
        "him",
        "her",
        "us",
        "them",
        "my",
        "your",
        "his",
        "her",
        "its",
        "our",
        "their",
        "a",
        "an",
        "as",
        "if",
        "when",
        "where",
        "why",
        "how",
        "what",
        "who",
        "which",
        "than",
        "so",
        "too",
        "very",
        "just",
        "now",
        "then",
        "here",
        "there",
        "up",
        "down",
        "out",
        "off",
        "over",
        "under",
        "again",
        "further",
        "once",
        "more",
        "most",
        "other",
        "some",
        "any",
        "each",
        "every",
        "all",
        "both",
        "few",
        "many",
        "much",
        "several",
        "own",
        "same",
        "such",
        "only",
        "first",
        "last",
        "next",
        "previous",
        "new",
        "old",
        "good",
        "bad",
        "big",
        "small",
        "long",
        "short",
        "high",
        "low",
        "right",
        "left",
        "yes",
        "no",
        "not",
        "never",
        "always",
        "sometimes",
        "often",
        "usually",
        "maybe",
        "perhaps",
      ];

      // הסרת מילות עזר נפוצות בעברית
      const hebrewStopWords = [
        "את",
        "של",
        "על",
        "אל",
        "מן",
        "עם",
        "בין",
        "לפני",
        "אחרי",
        "תחת",
        "מעל",
        "ליד",
        "אצל",
        "כמו",
        "בלי",
        "זה",
        "זו",
        "זאת",
        "הוא",
        "היא",
        "הם",
        "הן",
        "אני",
        "אתה",
        "את",
        "אנחנו",
        "אתם",
        "אתן",
        "שלי",
        "שלך",
        "שלו",
        "שלה",
        "שלנו",
        "שלכם",
        "שלהם",
        "כל",
        "כמה",
        "הרבה",
        "מעט",
        "יותר",
        "פחות",
        "גם",
        "רק",
        "אבל",
        "או",
        "כי",
        "אם",
        "מתי",
        "איך",
        "למה",
        "מה",
        "מי",
        "איפה",
        "כן",
        "לא",
        "אולי",
        "בטח",
        "אמת",
        "שקר",
      ];

      if (englishStopWords.includes(word) || hebrewStopWords.includes(word)) {
        return false;
      }

      return true;
    });

    // הסרת כפילויות והחזרת מילות מפתח ייחודיות
    const uniqueKeywords = [...new Set(filteredWords)];

    // מגבלה של 50 מילות מפתח מקסימום (למניעת עומס)
    const limitedKeywords = uniqueKeywords.slice(0, 50);

    console.log(`🔑 Extracted ${limitedKeywords.length} keywords from lyrics`);
    return limitedKeywords;
  } catch (error) {
    console.error("❌ Error extracting keywords from lyrics:", error.message);
    return [];
  }
}
