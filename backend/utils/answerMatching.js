import stringSimilarity from "string-similarity";
import Fuse from "fuse.js";
import {
  checkArtistMatchWithAI,
  checkSongTitleMatchWithAI,
  checkLyricsMatchWithAI,
} from "../services/openaiService.js";

/**
 * מחזיר את סוג התשובה והניקוד בהתאם לתשובה שהמשתמש נתן
 * @param {string} userAnswer - התשובה של המשתמש
 * @param {Object} song - אובייקט השיר עם כל הפרטים
 * @param {number} timeTaken - הזמן שלקח למשתמש לענות (במילישניות)
 * @param {number} maxTime - הזמן המקסימלי לתשובה (במילישניות)
 * @returns {Promise<Object>} - אובייקט עם סוג התשובה, הניקוד והפרטים
 */
export async function analyzeAnswer(userAnswer, song, timeTaken, maxTime) {
  const normalizedUserAnswer = normalizeText(userAnswer);

  // בדיקת שם השיר (ניקוד הגבוה ביותר)
  const songTitleMatch = await checkSongTitle(normalizedUserAnswer, song);
  if (songTitleMatch.isMatch) {
    const score = calculateScore(1000, timeTaken, maxTime); // ניקוד בסיס גבוה
    return {
      type: "songTitle",
      isCorrect: true,
      score,
      matchedText: songTitleMatch.matchedText,
      similarity: songTitleMatch.similarity,
      aiEnhanced: songTitleMatch.aiEnhanced || false,
      explanation: songTitleMatch.explanation || "",
    };
  }

  // בדיקת שם הזמר/להקה (ניקוד בינוני)
  const artistMatch = await checkArtist(normalizedUserAnswer, song);
  if (artistMatch.isMatch) {
    const score = calculateScore(600, timeTaken, maxTime); // ניקוד בסיס בינוני
    return {
      type: "artist",
      isCorrect: true,
      score,
      matchedText: artistMatch.matchedText,
      similarity: artistMatch.similarity,
      aiEnhanced: artistMatch.aiEnhanced || false,
      explanation: artistMatch.explanation || "",
    };
  }

  // בדיקת מילים מהשיר (ניקוד נמוך)
  const lyricsMatch = await checkLyrics(normalizedUserAnswer, song);
  if (lyricsMatch.isMatch) {
    const score = calculateScore(300, timeTaken, maxTime); // ניקוד בסיס נמוך
    return {
      type: "lyrics",
      isCorrect: true,
      score,
      matchedText: lyricsMatch.matchedText,
      similarity: lyricsMatch.similarity,
      aiEnhanced: lyricsMatch.aiEnhanced || false,
      explanation: lyricsMatch.explanation || "",
    };
  }

  // אם לא נמצא התאמה
  return {
    type: "none",
    isCorrect: false,
    score: 0,
    matchedText: "",
    similarity: 0,
  };
}

/**
 * נרמול טקסט - הסרת רווחים מיותרים, המרה לאותיות קטנות, הסרת סימני פיסוק
 */
function normalizeText(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s\u0590-\u05FF]/g, " ") // שמירה על אותיות עבריות ואנגליות בלבד
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * בדיקת התאמה לשם השיר
 */
async function checkSongTitle(userAnswer, song) {
  const songTitles = [
    song.title,
    song.correctAnswer,
    ...(song.correctAnswers || []),
  ].filter(Boolean);

  // ניסיון ראשון: בדיקה עם OpenAI
  try {
    console.log(
      `🤖 Calling OpenAI for song title matching: "${userAnswer}" vs "${song.title}"`
    );
    const aiResult = await checkSongTitleMatchWithAI(
      userAnswer,
      song.title,
      songTitles
    );
    console.log(`🤖 OpenAI song result:`, aiResult);

    // אם ה-AI מצא התאמה עם ביטחון גבוה, נשתמש בתוצאה
    if (aiResult.isMatch && aiResult.confidence >= 0.7) {
      console.log(
        `✅ AI found song title match: "${userAnswer}" → "${song.title}" (confidence: ${aiResult.confidence})`
      );
      return {
        isMatch: true,
        similarity: aiResult.confidence,
        matchedText: aiResult.matchedText || song.title,
        aiEnhanced: true,
        explanation: aiResult.explanation,
      };
    }

    console.log(
      `🔄 AI song confidence too low (${aiResult.confidence}), trying traditional matching...`
    );
  } catch (error) {
    console.log(
      `⚠️ AI song title check failed, falling back to traditional matching:`,
      error.message
    );
  }

  // fallback לשיטה המסורתית
  const normalizedTitles = songTitles.map(normalizeText);
  return findBestMatch(userAnswer, normalizedTitles);
}

/**
 * בדיקת התאמה לשם הזמר/להקה
 */
async function checkArtist(userAnswer, song) {
  if (!song.artist || song.artist === "Unknown Artist") {
    return { isMatch: false, similarity: 0, matchedText: "" };
  }

  // ניסיון ראשון: בדיקה עם OpenAI
  try {
    console.log(
      `🤖 Calling OpenAI for artist matching: "${userAnswer}" vs "${song.artist}"`
    );
    const aiResult = await checkArtistMatchWithAI(userAnswer, song.artist);
    console.log(`🤖 OpenAI result:`, aiResult);

    // אם ה-AI מצא התאמה עם ביטחון גבוה, נשתמש בתוצאה
    if (aiResult.isMatch && aiResult.confidence >= 0.7) {
      console.log(
        `✅ AI found artist match: "${userAnswer}" → "${song.artist}" (confidence: ${aiResult.confidence})`
      );
      return {
        isMatch: true,
        similarity: aiResult.confidence,
        matchedText: aiResult.matchedText || song.artist,
        aiEnhanced: true,
        explanation: aiResult.explanation,
      };
    }

    // אם ה-AI לא מצא התאמה עם ביטחון גבוה, ננסה את השיטה המסורתית
    console.log(
      `🔄 AI confidence too low (${aiResult.confidence}), trying traditional matching...`
    );
  } catch (error) {
    console.log(
      `⚠️ AI artist check failed, falling back to traditional matching:`,
      error.message
    );
  }

  // fallback לשיטה המסורתית
  const artistVariations = generateArtistVariations(song.artist);
  const normalizedVariations = artistVariations.map(normalizeText);

  return findBestMatch(userAnswer, normalizedVariations);
}

/**
 * יצירת וריאציות של שם זמר (עברית/אנגלית, כתיב שונה)
 */
function generateArtistVariations(artistName) {
  const variations = [artistName];

  // מיפוי שמות נפוצים מאנגלית לעברית
  const nameMapping = {
    "danny sanderson": ["דני סנדרסון", "דני סנדרסון", "דנני סנדרסון"],
    "shlomo artzi": ["שלמה ארצי", "שלמה ארצי"],
    rita: ["ריטה"],
    "shalom hanoch": ["שלום חנוך", "שלום חנוך"],
    "arik einstein": ["אריק איינשטיין", "אריק איינשטיין"],
    "matti caspi": ["מתי כספי", "מתי כספי", "מטי כספי"],
    "yehudit ravitz": ["יהודית רביץ", "יהודית רביץ"],
    "david broza": ["דוד ברוזה", "דוד ברוזה"],
    "chava alberstein": ["חוה אלברשטיין", "חוה אלברשטיין"],
    "naomi shemer": ["נעמי שמר"],
    "ehud banai": ["אהוד בנאי"],
    "berry sakharof": ["ברי סחרוף", "ברי סחרוף"],
    mashina: ["משינה", "מאשינה"],
    kaveret: ["כוורת"],
    typex: ["טייפקס"],
    teapacks: ["טיפקס", "טי פקס"],
    subliminal: ["סאבלימינל"],
    "infected mushroom": ["אינפקטד מאשרום"],
    "asaf avidan": ["אסף אבידן"],
    "idan raichel": ["עידן רייכל"],
    "ninet tayeb": ["נינט טייב", "נינט"],
    "static & ben el": ["סטטיק ובן אל", "סטטיק בן אל"],
    "eden ben zaken": ["עדן בן זקן"],
    "noa kirel": ["נועה קירל"],
    "omer adam": ["עומר אדם"],
    "sarit hadad": ["שרית חדד"],
    "eyal golan": ["אייל גולן"],
    mizrahi: ["מזרחי"],
    "the shadow": ["הצל"],
    "hadag nahash": ["הדג נחש"],
    "monica sex": ["מוניקה סקס"],
    "jane bordeaux": ["ג'יין בורדו", "ג'יין בורדו"],
    "red band": ["רד בנד"],
    rockfour: ["רוקפור"],
    monica: ["מוניקה"],
  };

  const normalizedArtist = artistName.toLowerCase().trim();

  // חיפוש במיפוי
  if (nameMapping[normalizedArtist]) {
    variations.push(...nameMapping[normalizedArtist]);
  }

  // חיפוש הפוך - אם השם בעברית, נוסיף את האנגלי
  for (const [english, hebrewVariations] of Object.entries(nameMapping)) {
    if (
      hebrewVariations.some((heb) => heb.toLowerCase() === normalizedArtist)
    ) {
      variations.push(english);
      break;
    }
  }

  // הוספת וריאציות נוספות
  variations.push(
    // הסרת רווחים
    artistName.replace(/\s+/g, ""),
    // החלפת רווחים בקווים תחתונים
    artistName.replace(/\s+/g, "_"),
    // הסרת סימני פיסוק
    artistName.replace(/[^\w\s\u0590-\u05FF]/g, ""),
    // רק השם הפרטי (המילה הראשונה)
    artistName.split(" ")[0],
    // רק שם המשפחה (המילה האחרונה)
    artistName.split(" ").pop()
  );

  return [...new Set(variations)]; // הסרת כפילויות
}

/**
 * בדיקת התאמה למילים מהשיר - משתמש רק ב-OpenAI
 */
async function checkLyrics(userAnswer, song) {
  const songName = song.title || song.trackName || "Unknown Song";
  console.log(`🔍 Checking lyrics for song: ${songName} using OpenAI`);
  console.log(`🔍 User answer: "${userAnswer}"`);

  try {
    const aiResult = await checkLyricsMatchWithAI(
      userAnswer,
      song.title,
      song.artist
    );

    // אם ה-AI מצא התאמה עם ביטחון סביר, נשתמש בתוצאה (הורדתי את הסף ל-0.4)
    if (aiResult.isMatch && aiResult.confidence >= 0.4) {
      console.log(
        `✅ AI found lyrics match: "${userAnswer}" in song "${songName}" (confidence: ${aiResult.confidence})`
      );
      return {
        isMatch: true,
        similarity: aiResult.confidence,
        matchedText: aiResult.matchedText || userAnswer,
        aiEnhanced: true,
        explanation: aiResult.explanation,
      };
    }

    console.log(
      `🔄 AI lyrics confidence too low (${aiResult.confidence}), no match found`
    );
  } catch (error) {
    console.log(`⚠️ AI lyrics check failed:`, error.message);
  }

  return { isMatch: false, similarity: 0, matchedText: "" };
}

/**
 * מציאת ההתאמה הטובה ביותר מתוך רשימת אפשרויות
 */
function findBestMatch(userAnswer, options) {
  let bestMatch = { isMatch: false, similarity: 0, matchedText: "" };

  for (const option of options) {
    // בדיקה מדויקת
    if (userAnswer === option) {
      return {
        isMatch: true,
        similarity: 1.0,
        matchedText: option,
      };
    }

    // בדיקת דמיון עם string-similarity
    const similarity = stringSimilarity.compareTwoStrings(userAnswer, option);
    if (similarity >= 0.8) {
      // סף דמיון גבוה
      if (similarity > bestMatch.similarity) {
        bestMatch = {
          isMatch: true,
          similarity,
          matchedText: option,
        };
      }
    }

    // בדיקה עם Fuse.js לחיפוש מטושטש
    const fuse = new Fuse([option], {
      threshold: 0.3, // סף שגיאה נמוך יותר = דיוק גבוה יותר
      distance: 100,
      includeScore: true,
    });

    const fuseResults = fuse.search(userAnswer);
    if (fuseResults.length > 0 && fuseResults[0].score <= 0.3) {
      const fuseScore = 1 - fuseResults[0].score; // המרה לציון דמיון
      if (fuseScore > bestMatch.similarity) {
        bestMatch = {
          isMatch: true,
          similarity: fuseScore,
          matchedText: option,
        };
      }
    }
  }

  return bestMatch;
}

/**
 * חישוב ניקוד בהתאם לזמן התשובה
 */
function calculateScore(baseScore, timeTaken, maxTime) {
  const timeLeft = Math.max(0, maxTime - timeTaken);
  const timeRatio = timeLeft / maxTime;
  const timeBonus = Math.floor(baseScore * timeRatio);
  return Math.max(Math.floor(baseScore * 0.1), timeBonus); // מינימום 10% מהניקוד הבסיסי
}

/**
 * יצירת הודעה מפורטת על סוג התשובה
 */
export function getAnswerTypeMessage(answerResult, language = "he") {
  const messages = {
    he: {
      songTitle: "זיהה את שם השיר",
      artist: "זיהה את שם הזמר/להקה",
      lyrics: "זיהה מילים מהשיר",
      none: "לא זיהה",
    },
    en: {
      songTitle: "Identified the song title",
      artist: "Identified the artist/band",
      lyrics: "Identified lyrics from the song",
      none: "Did not identify",
    },
  };

  return messages[language][answerResult.type] || messages[language].none;
}
