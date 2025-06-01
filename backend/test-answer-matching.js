import { analyzeAnswer } from "./utils/answerMatching.js";

// בדיקות לזיהוי תשובות ללא AI
async function testAnswerMatching() {
  console.log("🧪 Testing answer matching without AI...\n");

  // דוגמת שיר לבדיקה
  const testSong = {
    title: "שיר המכולת",
    artist: "דני סנדרסון",
    correctAnswer: "שיר המכולת",
    correctAnswers: ["שיר המכולת", "שיר הכולת"],
    fullLyrics: "אני הולך למכולת לקנות חלב ולחם בבוקר מוקדם כשהשמש זורחת",
  };

  const testCases = [
    // בדיקות שם השיר
    {
      input: "שיר המכולת",
      expected: "songTitle",
      description: "שם השיר מדויק",
    },
    {
      input: "שיר המקולת",
      expected: "songTitle",
      description: "שם השיר עם שגיאת כתיב",
    },
    {
      input: "שיר המקולתת",
      expected: "songTitle",
      description: "שם השיר עם תו נוסף",
    },
    {
      input: "שיר הכולת",
      expected: "songTitle",
      description: "שם השיר - וריאציה",
    },

    // בדיקות שם האמן
    { input: "דני סנדרסון", expected: "artist", description: "שם האמן מדויק" },
    {
      input: "דנני סנדרסון",
      expected: "artist",
      description: "שם האמן עם שגיאת כתיב",
    },
    { input: "דני", expected: "artist", description: "שם פרטי בלבד" },
    { input: "danny sanderson", expected: "artist", description: "שם באנגלית" },

    // בדיקות מילות השיר
    {
      input: "אני הולך למכולת",
      expected: "lyrics",
      description: "מילים מהשיר",
    },
    {
      input: "חלב ולחם",
      expected: "lyrics",
      description: "מילים חלקיות מהשיר",
    },
    { input: "השמש זורחת", expected: "lyrics", description: "מילים מסוף השיר" },

    // בדיקות שליליות
    { input: "שיר אחר לגמרי", expected: "none", description: "תשובה לא נכונה" },
    { input: "זמר אחר", expected: "none", description: "זמר לא נכון" },
  ];

  for (const testCase of testCases) {
    try {
      console.log(`🔍 Testing: "${testCase.input}" (${testCase.description})`);

      const result = await analyzeAnswer(testCase.input, testSong, 5000, 15000);

      const success = result.type === testCase.expected;
      const emoji = success ? "✅" : "❌";

      console.log(
        `${emoji} Expected: ${testCase.expected}, Got: ${result.type}`
      );
      if (result.isCorrect) {
        console.log(
          `   📊 Score: ${
            result.score
          }, Similarity: ${result.similarity.toFixed(2)}`
        );
        console.log(`   🎯 Matched: "${result.matchedText}"`);
        console.log(`   💡 Explanation: ${result.explanation}`);
      }
      console.log("");
    } catch (error) {
      console.log(`❌ Error testing "${testCase.input}": ${error.message}\n`);
    }
  }
}

// בדיקות נוספות לזמרים ספציפיים
async function testSpecificArtists() {
  console.log("\n🎤 Testing specific Hebrew-English artist mappings...\n");

  const artistTests = [
    {
      song: {
        title: "Im Nin'alu",
        artist: "ofra haza",
        lyrics: "Im nin'alu daltei nedivim",
      },
      input: "עפרה חזה",
      expected: "artist",
    },
    {
      song: {
        title: "Im Nin'alu",
        artist: "ofra haza",
        lyrics: "Im nin'alu daltei nedivim",
      },
      input: "עפרה חזרה",
      expected: "artist",
    },
    {
      song: {
        title: "Shir Lashalom",
        artist: "riki gal",
        lyrics: "Shir lashalom lo yitachen",
      },
      input: "ריקי גל",
      expected: "artist",
    },
  ];

  for (const test of artistTests) {
    try {
      console.log(
        `🔍 Testing: "${test.input}" for artist "${test.song.artist}"`
      );
      const result = await analyzeAnswer(test.input, test.song, 5000, 15000);

      if (result.isCorrect && result.type === test.expected) {
        console.log(`✅ Expected: ${test.expected}, Got: ${result.type}`);
        console.log(
          `   📊 Score: ${
            result.score
          }, Similarity: ${result.similarity.toFixed(2)}`
        );
        console.log(`   🎯 Matched: "${result.matchedText}"`);
      } else {
        console.log(
          `❌ Expected: ${test.expected}, Got: ${result.type || "none"}`
        );
        console.log(`   📊 Score: ${result.score || 0}`);
      }
      console.log("");
    } catch (error) {
      console.error(`❌ Error testing "${test.input}":`, error.message);
    }
  }
}

// הרצת הבדיקות
testAnswerMatching()
  .then(() => {
    testSpecificArtists();
  })
  .catch(console.error);
