import OpenAI from "openai";

// יצירת instance של OpenAI רק כשצריך
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is missing");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * בדיקה אם תשובת המשתמש תואמת לשם הזמר/להקה באמצעות OpenAI
 * @param {string} userAnswer - התשובה של המשתמש
 * @param {string} artistName - שם הזמר/להקה המקורי
 * @returns {Promise<Object>} - תוצאת הבדיקה
 */
export async function checkArtistMatchWithAI(userAnswer, artistName) {
  try {
    console.log(
      `🤖 Checking artist match with AI: "${userAnswer}" vs "${artistName}"`
    );

    const prompt = `
You are an expert in music artist name matching. Your task is to determine if a user's answer matches an artist name, considering:

1. Hebrew/English transliterations (e.g., "מרגול" = "Margol", "קובי אפללו" = "Kobi Aflalo")
2. Multiple artists (e.g., "Elai Botner & Kobi Aflalo" - user can mention just one of them)
3. Common variations and nicknames
4. Spelling variations and typos
5. Different writing systems (Hebrew vs Latin characters)

Artist Name: "${artistName}"
User Answer: "${userAnswer}"

Please respond with a JSON object containing:
{
  "isMatch": boolean,
  "confidence": number (0-1),
  "explanation": "brief explanation of why it matches or doesn't match",
  "matchedPart": "which part of the artist name was matched (if applicable)"
}

Examples:
- "מרגול" vs "Margol" → isMatch: true (Hebrew transliteration)
- "קובי אפללו" vs "Elai Botner & Kobi Aflalo" → isMatch: true (one of the artists)
- "john" vs "John Lennon" → isMatch: true (partial match)
- "random text" vs "Beatles" → isMatch: false
`;

    const openai = getOpenAIClient();

    // הוספת timeout של 3 שניות
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("OpenAI timeout")), 3000)
    );

    const apiPromise = openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a music expert specializing in artist name matching across languages and variations. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 120, // הקטנתי לביצועים טובים יותר
    });

    const response = await Promise.race([apiPromise, timeoutPromise]);

    const aiResponse = response.choices[0].message.content.trim();
    console.log(`🤖 AI Response:`, aiResponse);

    // ניסיון לפרסר את התגובה כ-JSON
    try {
      const result = JSON.parse(aiResponse);

      // וידוא שהתגובה מכילה את השדות הנדרשים
      if (
        typeof result.isMatch === "boolean" &&
        typeof result.confidence === "number"
      ) {
        console.log(`🤖 AI Match Result:`, result);
        return {
          isMatch: result.isMatch,
          confidence: result.confidence,
          explanation: result.explanation || "",
          matchedPart: result.matchedPart || "",
          similarity: result.confidence, // לתאימות עם המערכת הקיימת
          matchedText: result.matchedPart || artistName,
        };
      } else {
        throw new Error("Invalid AI response format");
      }
    } catch (parseError) {
      console.error("❌ Failed to parse AI response:", parseError);
      // fallback - ננסה לחלץ את התשובה בצורה פשוטה יותר
      const isMatchRegex = /"isMatch":\s*(true|false)/i;
      const confidenceRegex = /"confidence":\s*([\d.]+)/i;

      const matchResult = aiResponse.match(isMatchRegex);
      const confidenceResult = aiResponse.match(confidenceRegex);

      if (matchResult) {
        const isMatch = matchResult[1].toLowerCase() === "true";
        const confidence = confidenceResult
          ? parseFloat(confidenceResult[1])
          : isMatch
          ? 0.8
          : 0.2;

        return {
          isMatch,
          confidence,
          explanation: "AI parsing fallback",
          matchedPart: isMatch ? artistName : "",
          similarity: confidence,
          matchedText: isMatch ? artistName : "",
        };
      }

      throw parseError;
    }
  } catch (error) {
    console.error("❌ OpenAI API error:", error.message);

    // fallback למערכת הקיימת במקרה של שגיאה
    return {
      isMatch: false,
      confidence: 0,
      explanation: `AI service error: ${error.message}`,
      matchedPart: "",
      similarity: 0,
      matchedText: "",
      fallback: true,
    };
  }
}

/**
 * בדיקה אם תשובת המשתמש תואמת לשם השיר באמצעות OpenAI
 * @param {string} userAnswer - התשובה של המשתמש
 * @param {string} songTitle - שם השיר המקורי
 * @param {Array<string>} alternativeTitles - שמות חלופיים לשיר
 * @returns {Promise<Object>} - תוצאת הבדיקה
 */
export async function checkSongTitleMatchWithAI(
  userAnswer,
  songTitle,
  alternativeTitles = []
) {
  try {
    console.log(
      `🤖 Checking song title match with AI: "${userAnswer}" vs "${songTitle}"`
    );

    const allTitles = [songTitle, ...alternativeTitles].filter(Boolean);

    const prompt = `
You are an expert in music song title matching. Your task is to determine if a user's answer matches a song title, considering:

1. Hebrew/English transliterations
2. Common abbreviations and variations
3. Spelling variations and typos
4. Partial matches (if significant enough)
5. Different writing systems (Hebrew vs Latin characters)

Song Titles: ${allTitles.map((title) => `"${title}"`).join(", ")}
User Answer: "${userAnswer}"

Please respond with a JSON object containing:
{
  "isMatch": boolean,
  "confidence": number (0-1),
  "explanation": "brief explanation",
  "matchedTitle": "which title was matched (if applicable)"
}
`;

    const openai = getOpenAIClient();

    // הוספת timeout של 3 שניות
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("OpenAI timeout")), 3000)
    );

    const apiPromise = openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a music expert specializing in song title matching across languages. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 120, // הקטנתי לביצועים טובים יותר
    });

    const response = await Promise.race([apiPromise, timeoutPromise]);

    const aiResponse = response.choices[0].message.content.trim();
    console.log(`🤖 AI Song Response:`, aiResponse);

    try {
      const result = JSON.parse(aiResponse);

      if (
        typeof result.isMatch === "boolean" &&
        typeof result.confidence === "number"
      ) {
        return {
          isMatch: result.isMatch,
          confidence: result.confidence,
          explanation: result.explanation || "",
          matchedTitle: result.matchedTitle || "",
          similarity: result.confidence,
          matchedText: result.matchedTitle || songTitle,
        };
      } else {
        throw new Error("Invalid AI response format");
      }
    } catch (parseError) {
      console.error("❌ Failed to parse AI song response:", parseError);

      // fallback parsing
      const isMatchRegex = /"isMatch":\s*(true|false)/i;
      const matchResult = aiResponse.match(isMatchRegex);

      if (matchResult) {
        const isMatch = matchResult[1].toLowerCase() === "true";
        return {
          isMatch,
          confidence: isMatch ? 0.8 : 0.2,
          explanation: "AI parsing fallback",
          matchedTitle: isMatch ? songTitle : "",
          similarity: isMatch ? 0.8 : 0.2,
          matchedText: isMatch ? songTitle : "",
        };
      }

      throw parseError;
    }
  } catch (error) {
    console.error("❌ OpenAI API error for song title:", error.message);

    return {
      isMatch: false,
      confidence: 0,
      explanation: `AI service error: ${error.message}`,
      matchedTitle: "",
      similarity: 0,
      matchedText: "",
      fallback: true,
    };
  }
}

/**
 * בדיקה אם תשובת המשתמש מכילה מילים מהשיר באמצעות OpenAI
 * @param {string} userAnswer - התשובה של המשתמש
 * @param {string} songTitle - שם השיר
 * @param {string} artistName - שם הזמר/להקה
 * @returns {Promise<Object>} - תוצאת הבדיקה
 */
export async function checkLyricsMatchWithAI(
  userAnswer,
  songTitle,
  artistName
) {
  try {
    console.log(
      `🤖 Checking lyrics match with AI: "${userAnswer}" for song "${songTitle}" by "${artistName}"`
    );

    const prompt = `
You are an expert in music and song lyrics with extensive knowledge of Hebrew and English songs. Your task is to determine if a user's answer contains words or phrases that appear in the lyrics of a specific song.

Song: "${songTitle}" by "${artistName}"
User Answer: "${userAnswer}"

IMPORTANT: Be generous in matching! If the user's words could reasonably be from this song's lyrics, mark it as a match.

Consider:
1. Exact phrases and lines from the song lyrics
2. Hebrew/English variations and transliterations
3. Partial matches of significant lyrical phrases (even 2-3 words)
4. Common words that appear in the song
5. Thematic words related to the song's content
6. Different spellings or variations of the same words

Be MORE LIKELY to say "isMatch": true if:
- The words sound like they could be from this song
- The phrase has any similarity to known lyrics
- The words fit the song's theme or style
- You have any reasonable doubt

Please respond with a JSON object containing:
{
  "isMatch": boolean,
  "confidence": number (0-1),
  "explanation": "brief explanation of why it matches or doesn't match",
  "matchedPhrase": "the specific phrase that was matched (if applicable)"
}

Examples:
- If words appear in or sound like song lyrics → isMatch: true, confidence: 0.8-1.0
- If words are thematically related to the song → isMatch: true, confidence: 0.5-0.7
- If words might be from the song but uncertain → isMatch: true, confidence: 0.4-0.6
- Only if completely unrelated → isMatch: false
`;

    const openai = getOpenAIClient();

    // הוספת timeout של 4 שניות למילות שיר
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("OpenAI timeout")), 4000)
    );

    const apiPromise = openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a music expert with extensive knowledge of song lyrics across languages. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 150, // הקטנתי לביצועים טובים יותר
    });

    const response = await Promise.race([apiPromise, timeoutPromise]);

    const aiResponse = response.choices[0].message.content.trim();
    console.log(`🤖 AI Lyrics Response:`, aiResponse);

    try {
      const result = JSON.parse(aiResponse);

      if (
        typeof result.isMatch === "boolean" &&
        typeof result.confidence === "number"
      ) {
        return {
          isMatch: result.isMatch,
          confidence: result.confidence,
          explanation: result.explanation || "",
          matchedPhrase: result.matchedPhrase || "",
          similarity: result.confidence,
          matchedText: result.matchedPhrase || userAnswer,
        };
      } else {
        throw new Error("Invalid AI response format");
      }
    } catch (parseError) {
      console.error("❌ Failed to parse AI lyrics response:", parseError);

      // fallback parsing
      const isMatchRegex = /"isMatch":\s*(true|false)/i;
      const matchResult = aiResponse.match(isMatchRegex);

      if (matchResult) {
        const isMatch = matchResult[1].toLowerCase() === "true";
        return {
          isMatch,
          confidence: isMatch ? 0.7 : 0.2,
          explanation: "AI parsing fallback",
          matchedPhrase: isMatch ? userAnswer : "",
          similarity: isMatch ? 0.7 : 0.2,
          matchedText: isMatch ? userAnswer : "",
        };
      }

      throw parseError;
    }
  } catch (error) {
    console.error("❌ OpenAI API error for lyrics check:", error.message);

    return {
      isMatch: false,
      confidence: 0,
      explanation: `AI service error: ${error.message}`,
      matchedPhrase: "",
      similarity: 0,
      matchedText: "",
      fallback: true,
    };
  }
}
