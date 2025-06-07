import fetch from "node-fetch";
import * as cheerio from "cheerio";

/**
 * שירות לחילוץ מילות שיר מאתרים שונים
 */

/**
 * פונקציה פשוטה לחילוץ מילות שיר מ-Shironet
 * @param {string} title - שם השיר
 * @param {string} artist - שם הזמר
 * @returns {Promise<string|null>} - מילות השיר או null אם לא נמצא
 */
export async function fetchLyricsFromShironetSimple(title, artist) {
  try {
    console.log(`🎵 Simple Shironet search for: "${title}" by "${artist}"`);

    // ניקוי שם השיר והזמר לחיפוש
    const cleanTitle = cleanSearchTerm(title);
    const cleanArtist = cleanSearchTerm(artist);

    // נסיון ראשון - חיפוש רק עם שם השיר
    let searchUrl = `https://shironet.mako.co.il/search?q=${encodeURIComponent(
      cleanTitle
    )}`;
    console.log(`📡 Searching Shironet (title only): ${searchUrl}`);

    const searchResponse = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    });

    if (!searchResponse.ok) {
      console.log(`❌ Shironet search failed: ${searchResponse.status}`);
      return null;
    }

    const searchHtml = await searchResponse.text();
    const $ = cheerio.load(searchHtml);

    // חיפוש קישור לשיר הראשון בתוצאות - נסיון עם selectors שונים
    let firstResult = $("a[href*='artist?type=lyrics']").first();

    if (!firstResult.length) {
      // נסיון נוסף עם selectors אחרים
      firstResult = $("a[href*='prfid']").first();
    }

    if (!firstResult.length) {
      // נסיון נוסף עם כל הקישורים שמכילים "html"
      firstResult = $("a")
        .filter((i, el) => {
          const href = $(el).attr("href");
          return href && href.includes(".html") && !href.includes("indexes");
        })
        .first();
    }

    if (!firstResult.length) {
      console.log(`❌ No results found with title only, trying with artist...`);

      // נסיון שני - חיפוש עם שם השיר והזמר
      searchUrl = `https://shironet.mako.co.il/search?q=${encodeURIComponent(
        cleanTitle + " " + cleanArtist
      )}`;
      console.log(`📡 Searching Shironet (title + artist): ${searchUrl}`);

      const searchResponse2 = await fetch(searchUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",
        },
      });

      if (!searchResponse2.ok) {
        console.log(
          `❌ Second Shironet search failed: ${searchResponse2.status}`
        );
        return null;
      }

      const searchHtml2 = await searchResponse2.text();
      const $2 = cheerio.load(searchHtml2);

      // חיפוש שוב בתוצאות החדשות
      firstResult = $2("a[href*='artist?type=lyrics']").first();

      if (!firstResult.length) {
        firstResult = $2("a[href*='prfid']").first();
      }

      if (!firstResult.length) {
        firstResult = $2("a")
          .filter((i, el) => {
            const href = $2(el).attr("href");
            return href && href.includes(".html") && !href.includes("indexes");
          })
          .first();
      }

      if (!firstResult.length) {
        console.log(
          `❌ No results found in Shironet for: "${title}" by "${artist}"`
        );
        console.log(
          `🔍 Available links:`,
          $2("a")
            .map((i, el) => $2(el).attr("href"))
            .get()
            .slice(0, 10)
        );
        return null;
      }
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
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",
        Referer: searchUrl,
      },
    });

    if (!songResponse.ok) {
      console.log(`❌ Failed to fetch song page: ${songResponse.status}`);
      return null;
    }

    const songHtml = await songResponse.text();
    const songPage = cheerio.load(songHtml);

    // חילוץ מילות השיר - נחפש בדרכים שונות
    console.log(`🔍 Looking for lyrics in Shironet page...`);

    // נסיון 1: חיפוש לפי selectors ספציפיים של שירונט
    let lyricsElement = songPage(
      ".artist_lyrics_text, .lyrics_text, .song_lyrics_text"
    );

    if (!lyricsElement.length) {
      // נסיון 2: חיפוש div שמכיל טקסט עברי ארוך (מילות השיר)
      lyricsElement = songPage("div")
        .filter((i, el) => {
          const text = songPage(el).text();
          const element = songPage(el);
          const hebrewRegex = /[\u0590-\u05FF]/;

          // בדיקות לזיהוי מילות השיר:
          const lines = text
            .split("\n")
            .filter((line) => line.trim().length > 0);
          const hasNavigation =
            text.includes("ראשי") ||
            text.includes("תרבות") ||
            text.includes("סלבס") ||
            text.includes("מוזיקה") ||
            text.includes("הטסטים") ||
            text.includes("שירונט") ||
            text.includes("Like") ||
            text.includes("Share") ||
            text.includes("מילים לשירים") ||
            text.includes("זכויות יוצרים");

          // בדיקה שזה לא תפריט או ניווט
          const isNavigation =
            element.hasClass("menu") ||
            element.hasClass("nav") ||
            element.hasClass("header") ||
            element.hasClass("footer") ||
            element.parent().hasClass("menu") ||
            element.parent().hasClass("nav");

          return (
            text.length > 200 &&
            text.length < 2000 && // לא יותר מדי ארוך
            hebrewRegex.test(text) &&
            lines.length > 8 && // לפחות 8 שורות
            lines.length < 50 && // לא יותר מ-50 שורות
            !hasNavigation &&
            !isNavigation &&
            // בדיקה שרוב השורות קצרות (אופייני למילות שיר)
            lines.filter(
              (line) => line.trim().length > 0 && line.trim().length < 80
            ).length >
              lines.length * 0.7
          );
        })
        .first();
    }

    if (!lyricsElement.length) {
      // נסיון 3: חיפוש כל הטקסט בעמוד שנראה כמו מילות שיר
      const allText = songPage("body").text();
      const lines = allText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      // נחפש רצף של שורות עבריות
      let lyricsLines = [];
      let foundLyricsStart = false;
      const hebrewRegex = /[\u0590-\u05FF]/;

      for (const line of lines) {
        if (hebrewRegex.test(line) && line.length > 3 && line.length < 100) {
          if (!foundLyricsStart) {
            foundLyricsStart = true;
          }
          lyricsLines.push(line);
        } else if (foundLyricsStart && lyricsLines.length > 0) {
          // אם מצאנו כבר מילות שיר ועכשיו יש שורה לא עברית, נבדוק אם זה סוף המילות
          if (
            line.includes("זכויות") ||
            line.includes("שירונט") ||
            line.includes("מילים")
          ) {
            break;
          }
          // אם זה רק שורה ריקה או קצרה, נמשיך
          if (line.length < 3) {
            lyricsLines.push("");
          }
        }
      }

      if (lyricsLines.length > 5) {
        const lyrics = lyricsLines.join("\n").trim();
        console.log(
          `✅ Found lyrics using text parsing: ${lyrics.length} characters`
        );
        return lyrics;
      }
    }

    if (!lyricsElement.length) {
      console.log(`❌ No lyrics found on Shironet page`);
      // הדפסת דוגמה מהטקסט לדיבוג
      const sampleText = songPage("body").text().substring(0, 500);
      console.log(`🔍 Sample page text:`, sampleText);
      return null;
    }

    let lyrics = lyricsElement.text().trim();

    // ניקוי מילות השיר מטקסט מיותר
    const linesToRemove = [
      "ראשי",
      "תרבות",
      "סלבס",
      "מוזיקה",
      "הטסטים",
      "שירונט",
      "זכויות יוצרים",
      "כל הזכויות שמורות",
      "מילים לשירים",
      "Like",
      "Share",
      "Tweet",
      "Facebook",
      "Instagram",
      "מאת:",
      "ביצוע:",
      "אלבום:",
      "שנה:",
      "מילים:",
      "לחן:",
      "עמוד הבית",
      "חיפוש",
      "התחברות",
      "הרשמה",
    ];

    const cleanedLines = lyrics
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => {
        if (line.length === 0) return true; // שמור שורות ריקות
        if (line.length < 3) return false; // הסר שורות קצרות מדי
        return !linesToRemove.some((removeText) => line.includes(removeText));
      })
      .filter((line, index, array) => {
        // הסר שורות כפולות
        return index === 0 || line !== array[index - 1];
      });

    lyrics = cleanedLines.join("\n").trim();

    if (lyrics.length > 0) {
      console.log(`✅ Found lyrics on Shironet: ${lyrics.length} characters`);
      console.log(`🔍 First 200 chars: ${lyrics.substring(0, 200)}...`);
      return lyrics;
    }

    return null;
  } catch (error) {
    console.error(`❌ Error fetching from Shironet:`, error.message);
    return null;
  }
}

/**
 * חיפוש מילות שיר באתר AZLyrics (לשירים באנגלית ועברית)
 * @param {string} title - שם השיר
 * @param {string} artist - שם הזמר
 * @returns {Promise<string|null>} - מילות השיר או null אם לא נמצא
 */
export async function fetchLyricsFromAZLyrics(title, artist) {
  try {
    console.log(`🎵 Searching AZLyrics for: "${title}" by "${artist}"`);

    const cleanTitle = cleanSearchTerm(title);
    const cleanArtist = cleanSearchTerm(artist);

    // חיפוש ב-Google עם site:azlyrics.com
    const searchQuery = `site:azlyrics.com "${cleanArtist}" "${cleanTitle}"`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      searchQuery
    )}`;
    console.log(`📡 Searching Google for AZLyrics: ${searchUrl}`);

    const searchResponse = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    if (!searchResponse.ok) {
      console.log(
        `❌ Google search for AZLyrics failed: ${searchResponse.status}`
      );
      return null;
    }

    const searchHtml = await searchResponse.text();
    const $ = cheerio.load(searchHtml);

    // חיפוש קישור ל-AZLyrics
    const azlyricsLinks = $("a[href*='azlyrics.com']").filter((i, el) => {
      const href = $(el).attr("href");
      return href && href.includes("/lyrics/");
    });

    if (!azlyricsLinks.length) {
      console.log(`❌ No AZLyrics links found for: "${title}" by "${artist}"`);
      return null;
    }

    let songUrl = azlyricsLinks.first().attr("href");
    if (songUrl.includes("/url?q=")) {
      songUrl = decodeURIComponent(songUrl.split("/url?q=")[1].split("&")[0]);
    }

    // וידוא שה-URL מלא
    if (!songUrl.startsWith("http")) {
      console.log(`❌ Invalid AZLyrics URL found: ${songUrl}`);
      return null;
    }

    console.log(`📡 Found AZLyrics URL: ${songUrl}`);

    // הוספת delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const songResponse = await fetch(songUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!songResponse.ok) {
      console.log(`❌ Failed to fetch AZLyrics page: ${songResponse.status}`);
      return null;
    }

    const songHtml = await songResponse.text();
    const songPage = cheerio.load(songHtml);

    // חילוץ מילות השיר מ-AZLyrics
    const lyricsElement = songPage("div")
      .filter((i, el) => {
        const text = songPage(el).text();
        return (
          text.length > 100 &&
          !songPage(el).find("script").length &&
          !songPage(el).attr("class")
        );
      })
      .first();

    if (!lyricsElement.length) {
      console.log(`❌ No lyrics found on AZLyrics page`);
      return null;
    }

    const lyrics = lyricsElement.text().trim();
    if (lyrics.length > 0) {
      console.log(`✅ Found lyrics on AZLyrics: ${lyrics.length} characters`);
      return lyrics;
    }

    return null;
  } catch (error) {
    console.error(`❌ Error fetching from AZLyrics:`, error.message);
    return null;
  }
}

/**
 * חיפוש מילות שיר באתר LyricsFind
 * @param {string} title - שם השיר
 * @param {string} artist - שם הזמר
 * @returns {Promise<string|null>} - מילות השיר או null אם לא נמצא
 */
export async function fetchLyricsFromLyricsFind(title, artist) {
  try {
    console.log(`🎵 Searching LyricsFind for: "${title}" by "${artist}"`);

    const cleanTitle = cleanSearchTerm(title);
    const cleanArtist = cleanSearchTerm(artist);

    // חיפוש ב-Google עם site:lyricsfind.com
    const searchQuery = `site:lyricsfind.com "${cleanArtist}" "${cleanTitle}"`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      searchQuery
    )}`;
    console.log(`📡 Searching Google for LyricsFind: ${searchUrl}`);

    const searchResponse = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    if (!searchResponse.ok) {
      console.log(
        `❌ Google search for LyricsFind failed: ${searchResponse.status}`
      );
      return null;
    }

    const searchHtml = await searchResponse.text();
    const $ = cheerio.load(searchHtml);

    // חיפוש קישור ל-LyricsFind
    const lyricsfindLinks = $("a[href*='lyricsfind.com']");

    if (!lyricsfindLinks.length) {
      console.log(
        `❌ No LyricsFind links found for: "${title}" by "${artist}"`
      );
      return null;
    }

    let songUrl = lyricsfindLinks.first().attr("href");
    if (songUrl.includes("/url?q=")) {
      songUrl = decodeURIComponent(songUrl.split("/url?q=")[1].split("&")[0]);
    }

    // וידוא שה-URL מלא
    if (!songUrl.startsWith("http")) {
      console.log(`❌ Invalid LyricsFind URL found: ${songUrl}`);
      return null;
    }

    console.log(`📡 Found LyricsFind URL: ${songUrl}`);

    // הוספת delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const songResponse = await fetch(songUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!songResponse.ok) {
      console.log(`❌ Failed to fetch LyricsFind page: ${songResponse.status}`);
      return null;
    }

    const songHtml = await songResponse.text();
    const songPage = cheerio.load(songHtml);

    // חילוץ מילות השיר
    const lyricsElement = songPage(".lyrics-body, .lyric-body, .song-lyrics");

    if (!lyricsElement.length) {
      console.log(`❌ No lyrics found on LyricsFind page`);
      return null;
    }

    const lyrics = lyricsElement.text().trim();
    if (lyrics.length > 0) {
      console.log(`✅ Found lyrics on LyricsFind: ${lyrics.length} characters`);
      return lyrics;
    }

    return null;
  } catch (error) {
    console.error(`❌ Error fetching from LyricsFind:`, error.message);
    return null;
  }
}

/**
 * חיפוש מילות שיר בגוגל באופן כללי
 * @param {string} title - שם השיר
 * @param {string} artist - שם הזמר
 * @returns {Promise<string|null>} - מילות השיר או null אם לא נמצא
 */
export async function fetchLyricsFromGoogleSearch(title, artist) {
  try {
    console.log(`🎵 Searching Google for lyrics: "${title}" by "${artist}"`);

    const cleanTitle = cleanSearchTerm(title);
    const cleanArtist = cleanSearchTerm(artist);

    // חיפוש כללי בגוגל עם מילות מפתח
    const searchQuery = `"${cleanTitle}" "${cleanArtist}" lyrics מילות שיר`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      searchQuery
    )}`;
    console.log(`📡 Searching Google: ${searchUrl}`);

    const searchResponse = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    });

    if (!searchResponse.ok) {
      console.log(`❌ Google search failed: ${searchResponse.status}`);
      return null;
    }

    const searchHtml = await searchResponse.text();
    const $ = cheerio.load(searchHtml);

    // חיפוש תוצאות שעשויות להכיל מילות שיר
    const lyricsLinks = $("a").filter((i, el) => {
      const href = $(el).attr("href");
      const text = $(el).text().toLowerCase();
      return (
        href &&
        (href.includes("lyrics") ||
          href.includes("shironet") ||
          href.includes("azlyrics") ||
          text.includes("lyrics") ||
          text.includes("מילות"))
      );
    });

    if (!lyricsLinks.length) {
      console.log(
        `❌ No lyrics links found in Google search for: "${title}" by "${artist}"`
      );
      return null;
    }

    // ננסה את הקישור הראשון
    let songUrl = lyricsLinks.first().attr("href");
    if (songUrl.includes("/url?q=")) {
      songUrl = decodeURIComponent(songUrl.split("/url?q=")[1].split("&")[0]);
    }

    // וידוא שה-URL מלא
    if (!songUrl.startsWith("http")) {
      console.log(`❌ Invalid URL found: ${songUrl}`);
      return null;
    }

    console.log(`📡 Found potential lyrics URL: ${songUrl}`);

    // הוספת delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const songResponse = await fetch(songUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        Referer: "https://www.google.com/",
      },
    });

    if (!songResponse.ok) {
      console.log(`❌ Failed to fetch lyrics page: ${songResponse.status}`);
      return null;
    }

    const songHtml = await songResponse.text();
    const songPage = cheerio.load(songHtml);

    // חיפוש מילות שיר בדרכים שונות
    let lyricsElement = songPage("div, p")
      .filter((i, el) => {
        const text = songPage(el).text();
        return (
          text.length > 200 &&
          text.includes("\n") &&
          (text.includes(cleanTitle.substring(0, 5)) ||
            text.split("\n").length > 5)
        );
      })
      .first();

    if (!lyricsElement.length) {
      console.log(`❌ No lyrics found on page`);
      return null;
    }

    const lyrics = lyricsElement.text().trim();
    if (lyrics.length > 0) {
      console.log(
        `✅ Found lyrics via Google search: ${lyrics.length} characters`
      );
      return lyrics;
    }

    return null;
  } catch (error) {
    console.error(`❌ Error fetching from Google search:`, error.message);
    return null;
  }
}

/**
 * חיפוש מילות שיר בשירונט (לשירים ישראליים) - הגישה המקורית
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

    // נסיון מספר חיפושים שונים
    const searchTerms = [
      cleanTitle + " " + cleanArtist, // חיפוש מקורי
      cleanTitle, // רק שם השיר
      cleanTitle + " גידי גוב", // עם שם עברי
      "יש אי שם גידי גוב", // הכל בעברית
    ];

    let searchUrl = null;
    let searchResponse = null;
    let searchHtml = null;

    for (const searchTerm of searchTerms) {
      searchUrl = `https://shironet.mako.co.il/search?q=${encodeURIComponent(
        searchTerm
      )}`;
      console.log(`📡 Searching Shironet: ${searchUrl}`);

      // הוספת delay קטן כדי לא להיראות כמו בוט
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 1000)
      );

      searchResponse = await fetch(searchUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "Accept-Language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",
          "Accept-Encoding": "gzip, deflate, br",
          DNT: "1",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "Cache-Control": "max-age=0",
        },
      });

      if (!searchResponse.ok) {
        console.log(
          `❌ Shironet search failed for "${searchTerm}": ${searchResponse.status}`
        );
        continue; // נסה את המונח הבא
      }

      searchHtml = await searchResponse.text();
      const $ = cheerio.load(searchHtml);

      // בדיקה אם יש תוצאות עבור המונח הזה
      const hasResults =
        $("a[href*='artist?type=lyrics']").length > 0 ||
        $("a[href*='prfid']").length > 0;

      if (hasResults) {
        console.log(`✅ Found results with search term: "${searchTerm}"`);
        // נשמור את ה-searchHtml שמצא תוצאות
        break; // יצאנו מהלולאה - מצאנו תוצאות
      } else {
        console.log(`❌ No results for search term: "${searchTerm}"`);
      }
    }

    if (!searchResponse || !searchResponse.ok) {
      console.log(`❌ All Shironet search attempts failed`);
      return null;
    }

    // נשתמש ב-searchHtml האחרון שמצא תוצאות
    const $ = cheerio.load(searchHtml);

    // הדפסת HTML לדיבוג (רק החלק הרלוונטי)
    console.log(
      `🔍 Shironet search HTML preview:`,
      searchHtml.substring(0, 1000)
    );

    // חיפוש קישור לשיר הראשון בתוצאות - נסיון עם selectors שונים
    let firstResult = $("a[href*='artist?type=lyrics']").first();

    if (!firstResult.length) {
      // נסיון נוסף עם selectors אחרים
      firstResult = $("a[href*='prfid']").first();
    }

    if (!firstResult.length) {
      // נסיון נוסף עם selectors כלליים יותר
      firstResult = $("a")
        .filter((i, el) => {
          const href = $(el).attr("href");
          return (
            href &&
            (href.includes("artist?type=lyrics") || href.includes("prfid"))
          );
        })
        .first();
    }

    if (!firstResult.length) {
      console.log(
        `❌ No results found in Shironet for: "${title}" by "${artist}"`
      );
      console.log(
        `🔍 Available links:`,
        $("a")
          .map((i, el) => $(el).attr("href"))
          .get()
          .slice(0, 10)
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

    // הוספת delay נוסף לפני בקשת דף השיר
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1000)
    );

    // קבלת דף השיר
    const songResponse = await fetch(fullSongUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        DNT: "1",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Cache-Control": "max-age=0",
        Referer: searchUrl,
      },
    });

    if (!songResponse.ok) {
      console.log(`❌ Failed to fetch song page: ${songResponse.status}`);
      return null;
    }

    const songHtml = await songResponse.text();
    const songPage = cheerio.load(songHtml);

    // הדפסת HTML לדיבוג (רק החלק הרלוונטי)
    console.log(
      `🔍 Shironet song page HTML preview:`,
      songHtml.substring(0, 1500)
    );

    // חילוץ מילות השיר - נסיון עם selectors שונים
    let lyricsElement = songPage(
      ".artist_lyrics_text, .lyrics_text, .song_lyrics_text"
    );

    if (!lyricsElement.length) {
      // נסיון נוסף עם selectors אחרים
      lyricsElement = songPage("div").filter((i, el) => {
        const text = songPage(el).text();
        return text.length > 100 && text.includes("\n"); // מחפש div עם טקסט ארוך ושורות
      });
    }

    if (!lyricsElement.length) {
      // נסיון נוסף עם selectors כלליים יותר
      lyricsElement = songPage("p, div").filter((i, el) => {
        const className = songPage(el).attr("class") || "";
        return className.includes("lyrics") || className.includes("text");
      });
    }

    if (!lyricsElement.length) {
      console.log(`❌ No lyrics found on Shironet page`);
      console.log(
        `🔍 Available classes:`,
        songPage("div")
          .map((i, el) => songPage(el).attr("class"))
          .get()
          .slice(0, 20)
      );
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
      lyrics = await fetchLyricsFromShironetSimple(title, artist);

      // אם לא נמצא בשירונט, ננסה גם ב-Genius (למקרה של שירים עבריים שיש ב-Genius)
      if (!lyrics) {
        console.log(`🌍 Trying Genius as fallback for Hebrew song...`);
        lyrics = await fetchLyricsFromGenius(title, artist);
      }
    } else {
      // עבור שירים באנגלית - ננסה מספר מקורות
      console.log(`🇺🇸 Searching English song in multiple sources...`);

      // 1. נסיון ראשון - Genius
      console.log(`🎵 Trying Genius first...`);
      lyrics = await fetchLyricsFromGenius(title, artist);

      // 2. אם לא נמצא, ננסה AZLyrics
      if (!lyrics) {
        console.log(`🎵 Trying AZLyrics...`);
        lyrics = await fetchLyricsFromAZLyrics(title, artist);
      }

      // 3. אם לא נמצא, ננסה LyricsFind
      if (!lyrics) {
        console.log(`🎵 Trying LyricsFind...`);
        lyrics = await fetchLyricsFromLyricsFind(title, artist);
      }

      // 4. אם לא נמצא, ננסה חיפוש כללי בגוגל
      if (!lyrics) {
        console.log(`🔍 Trying Google search as fallback...`);
        lyrics = await fetchLyricsFromGoogleSearch(title, artist);
      }
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
