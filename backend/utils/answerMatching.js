import stringSimilarity from "string-similarity";
import Fuse from "fuse.js";

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
      explanation:
        songTitleMatch.explanation || "Traditional matching algorithm",
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
      explanation: artistMatch.explanation || "Traditional matching algorithm",
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
      explanation: lyricsMatch.explanation || "Traditional matching algorithm",
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
 * חישוב Levenshtein Distance בין שני מחרוזות
 * @param {string} str1
 * @param {string} str2
 * @returns {number} המרחק בין המחרוזות
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];

  // יצירת מטריצה ריקה
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  // מילוי המטריצה
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // החלפה
          matrix[i][j - 1] + 1, // הוספה
          matrix[i - 1][j] + 1 // מחיקה
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * חישוב דמיון בין שני מחרוזות על בסיס Levenshtein Distance
 * @param {string} str1
 * @param {string} str2
 * @returns {number} ציון דמיון בין 0 ל-1
 */
function calculateSimilarity(str1, str2) {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1.0;

  const distance = levenshteinDistance(str1, str2);
  return 1 - distance / maxLength;
}

/**
 * בדיקה אם שני מחרוזות דומים מספיק (טיפול בשגיאות כתיב)
 * @param {string} userInput
 * @param {string} target
 * @param {number} threshold - סף דמיון (ברירת מחדל 0.8)
 * @returns {boolean}
 */
function isSimilarEnough(userInput, target, threshold = 0.8) {
  // בדיקה מדויקת קודם
  if (userInput === target) return true;

  // בדיקה עם Levenshtein
  const similarity = calculateSimilarity(userInput, target);
  if (similarity >= threshold) return true;

  // בדיקה עם string-similarity
  const stringSim = stringSimilarity.compareTwoStrings(userInput, target);
  if (stringSim >= threshold) return true;

  return false;
}

/**
 * בדיקת התאמה לשם השיר - ללא AI, רק שיטות מסורתיות משופרות
 */
async function checkSongTitle(userAnswer, song) {
  const songTitles = [
    song.title,
    song.correctAnswer,
    ...(song.correctAnswers || []),
  ].filter(Boolean);

  console.log(
    `🎵 Checking song title match: "${userAnswer}" vs possible titles:`,
    songTitles
  );

  // נרמול התשובה של המשתמש
  const normalizedUserAnswer = normalizeText(userAnswer);

  // בדיקה מול כל האפשרויות
  const normalizedTitles = songTitles.map(normalizeText);
  const result = findBestMatch(normalizedUserAnswer, normalizedTitles);

  if (result.isMatch) {
    console.log(
      `✅ Found song title match: "${userAnswer}" → "${result.matchedText}" (similarity: ${result.similarity})`
    );
  } else {
    console.log(`❌ No song title match found for: "${userAnswer}"`);
  }

  return result;
}

/**
 * בדיקת התאמה לשם הזמר/להקה - ללא AI, רק שיטות מסורתיות משופרות
 */
async function checkArtist(userAnswer, song) {
  if (!song.artist || song.artist === "Unknown Artist") {
    return { isMatch: false, similarity: 0, matchedText: "" };
  }

  console.log(`🎤 Checking artist match: "${userAnswer}" vs "${song.artist}"`);

  // יצירת וריאציות של שם האמן
  const artistVariations = generateArtistVariations(song.artist);
  console.log(`🎤 Artist variations:`, artistVariations);

  // נרמול התשובה של המשתמש
  const normalizedUserAnswer = normalizeText(userAnswer);

  // נרמול כל הוריאציות
  const normalizedVariations = artistVariations.map(normalizeText);

  // חיפוש ההתאמה הטובה ביותר
  const result = findBestMatch(normalizedUserAnswer, normalizedVariations);

  if (result.isMatch) {
    console.log(
      `✅ Found artist match: "${userAnswer}" → "${result.matchedText}" (similarity: ${result.similarity})`
    );
  } else {
    console.log(`❌ No artist match found for: "${userAnswer}"`);
  }

  return result;
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
    "ofra haza": ["עפרה חזה", "עפרה חזרה", "עופרה חזה", "עופרה חזרה"],
    "riki gal": ["ריקי גל", "ריקי גל"],
    "zohar argov": ["זוהר ארגוב", "זוהר ארגב"],
    "yossi banai": ["יוסי בנאי"],
    "gidi gov": ["גידי גוב", "גידי גב"],
    "boaz sharabi": ["בועז שרעבי"],
    "yehuda poliker": ["יהודה פוליקר"],
    "rami kleinstein": ["רמי קליינשטיין"],
    "corinne allal": ["קורין אלאל"],
    "margalit tzan'ani": ["מרגלית צנעני"],
    "yardena arazi": ["ירדנה ארזי"],
    ilanit: ["אילנית"],
    daklon: ["דקלון"],
    "svika pick": ["צביקה פיק"],
    "mike brant": ["מייק בראנט"],
    "tzvika hadar": ["צביקה הדר"],
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

  // חיפוש מטושטש במיפוי - לטיפול בשגיאות כתיב
  for (const [english, hebrewVariations] of Object.entries(nameMapping)) {
    // בדיקה אם השם דומה לאנגלי
    if (
      stringSimilarity.compareTwoStrings(
        normalizedArtist,
        english.toLowerCase()
      ) > 0.8
    ) {
      variations.push(english);
      variations.push(...hebrewVariations);
    }

    // בדיקה אם השם דומה לאחת מהוריאציות העבריות
    for (const hebrewVar of hebrewVariations) {
      if (
        stringSimilarity.compareTwoStrings(
          normalizedArtist,
          hebrewVar.toLowerCase()
        ) > 0.8
      ) {
        variations.push(english);
        variations.push(...hebrewVariations);
        break;
      }
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

  // הוספת תרגומים פונטיים אוטומטיים
  const phoneticVariations = generatePhoneticVariations(artistName);
  variations.push(...phoneticVariations);

  return [...new Set(variations)]; // הסרת כפילויות
}

/**
 * יצירת וריאציות פונטיות לשמות (עברית <-> אנגלית)
 */
function generatePhoneticVariations(name) {
  const variations = [];
  const normalizedName = name.toLowerCase().trim();

  // מיפוי אותיות עבריות לאנגליות (פונטי)
  const hebrewToEnglish = {
    א: ["a", "e"],
    ב: ["b", "v"],
    ג: ["g"],
    ד: ["d"],
    ה: ["h", ""],
    ו: ["v", "u", "o"],
    ז: ["z"],
    ח: ["ch", "h"],
    ט: ["t"],
    י: ["y", "i"],
    כ: ["k", "ch"],
    ך: ["k", "ch"],
    ל: ["l"],
    מ: ["m"],
    ם: ["m"],
    ן: ["n"],
    נ: ["n"],
    ס: ["s"],
    ע: ["", "a", "e"],
    פ: ["p", "f"],
    ף: ["p", "f"],
    צ: ["tz", "ts"],
    ץ: ["tz", "ts"],
    ק: ["k", "q"],
    ר: ["r"],
    ש: ["sh", "s"],
    ת: ["t", "th"],
  };

  // מיפוי אנגלית לעברית (פונטי)
  const englishToHebrew = {
    a: ["א", "ע"],
    b: ["ב"],
    c: ["ק", "כ"],
    d: ["ד"],
    e: ["א", "ע", "י"],
    f: ["פ"],
    g: ["ג"],
    h: ["ה", "ח"],
    i: ["י", "א"],
    j: ["ג'", "ז'"],
    k: ["ק", "כ"],
    l: ["ל"],
    m: ["מ"],
    n: ["נ"],
    o: ["ו", "א"],
    p: ["פ"],
    q: ["ק"],
    r: ["ר"],
    s: ["ס", "ש"],
    t: ["ת", "ט"],
    u: ["ו", "א"],
    v: ["ב", "ו"],
    w: ["ו"],
    x: ["קס"],
    y: ["י"],
    z: ["ז"],
  };

  // אם השם מכיל עברית, ננסה לתרגם לאנגלית
  if (/[\u0590-\u05FF]/.test(normalizedName)) {
    let englishVersion = "";
    for (let char of normalizedName) {
      if (hebrewToEnglish[char]) {
        englishVersion += hebrewToEnglish[char][0]; // נקח את האפשרות הראשונה
      } else if (char === " ") {
        englishVersion += " ";
      } else {
        englishVersion += char;
      }
    }
    if (englishVersion.trim()) {
      variations.push(englishVersion.trim());
    }
  }

  // אם השם באנגלית, ננסה לתרגם לעברית
  if (/^[a-zA-Z\s]+$/.test(normalizedName)) {
    let hebrewVersion = "";
    for (let char of normalizedName) {
      if (englishToHebrew[char.toLowerCase()]) {
        hebrewVersion += englishToHebrew[char.toLowerCase()][0]; // נקח את האפשרות הראשונה
      } else if (char === " ") {
        hebrewVersion += " ";
      }
    }
    if (hebrewVersion.trim()) {
      variations.push(hebrewVersion.trim());
    }
  }

  return variations;
}

/**
 * בדיקת התאמה למילים מהשיר - בדיקה ישירה מול מילות השיר שהמשתמש הוסיף (ללא AI)
 */
async function checkLyrics(userAnswer, song) {
  const songName = song.title || song.trackName || "Unknown Song";
  console.log(`🎼 Checking lyrics for song: ${songName}`);
  console.log(`🎼 User answer: "${userAnswer}"`);

  // בדיקה אם יש מילות שיר שהמשתמש הוסיף
  const fullLyrics = song.fullLyrics || song.lyrics || "";

  if (!fullLyrics || fullLyrics.trim() === "") {
    console.log(
      `⚠️ No lyrics provided for song "${songName}" - cannot check lyrics match`
    );
    return {
      isMatch: false,
      similarity: 0,
      matchedText: "",
      explanation: "No lyrics provided for this song",
    };
  }

  // נרמול הטקסט
  const normalizedUserAnswer = normalizeText(userAnswer);
  const normalizedLyrics = normalizeText(fullLyrics);

  console.log(
    `🔍 Checking if "${normalizedUserAnswer}" appears in song lyrics`
  );

  // בדיקה ישירה אם המילים מופיעות במילות השיר
  if (normalizedLyrics.includes(normalizedUserAnswer)) {
    console.log(
      `✅ Found exact lyrics match: "${userAnswer}" in song "${songName}"`
    );
    return {
      isMatch: true,
      similarity: 1.0,
      matchedText: userAnswer,
      explanation: "Found exact match in song lyrics",
    };
  }

  // בדיקה של מילים בודדות (לפחות 3 תווים)
  const userWords = normalizedUserAnswer
    .split(/\s+/)
    .filter((word) => word.length >= 3);
  const matchedWords = [];

  for (const word of userWords) {
    if (normalizedLyrics.includes(word)) {
      matchedWords.push(word);
    }
  }

  // אם נמצאו מילים תואמות
  if (matchedWords.length > 0) {
    const matchRatio = matchedWords.length / userWords.length;

    // דרישה לפחות 60% מהמילים תואמות
    if (matchRatio >= 0.6) {
      console.log(
        `✅ Found partial lyrics match: ${matchedWords.length}/${userWords.length} words matched in song "${songName}"`
      );
      return {
        isMatch: true,
        similarity: matchRatio,
        matchedText: matchedWords.join(" "),
        explanation: `Found ${matchedWords.length} matching words in song lyrics`,
      };
    }
  }

  console.log(
    `❌ No lyrics match found for "${userAnswer}" in song "${songName}"`
  );
  return {
    isMatch: false,
    similarity: 0,
    matchedText: "",
    explanation: "No matching words found in song lyrics",
  };
}

/**
 * מציאת ההתאמה הטובה ביותר מתוך רשימת אפשרויות - משופר עם אלגוריתמים נוספים
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

    // בדיקה עם Levenshtein Distance (הוספנו)
    const levenshteinSim = calculateSimilarity(userAnswer, option);
    if (levenshteinSim >= 0.75) {
      // סף נמוך יותר ל-Levenshtein
      if (levenshteinSim > bestMatch.similarity) {
        bestMatch = {
          isMatch: true,
          similarity: levenshteinSim,
          matchedText: option,
        };
      }
    }

    // בדיקת דמיון עם string-similarity
    const similarity = stringSimilarity.compareTwoStrings(userAnswer, option);
    if (similarity >= 0.8) {
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

    // בדיקה אם המילים מכילות אחת את השנייה (לטיפול בשמות חלקיים)
    if (userAnswer.includes(option) || option.includes(userAnswer)) {
      const containsSim =
        Math.min(userAnswer.length, option.length) /
        Math.max(userAnswer.length, option.length);
      if (containsSim >= 0.7 && containsSim > bestMatch.similarity) {
        bestMatch = {
          isMatch: true,
          similarity: containsSim,
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
