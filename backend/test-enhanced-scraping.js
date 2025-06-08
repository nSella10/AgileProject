// Load environment variables
import dotenv from "dotenv";
dotenv.config();

import { fetchLyricsWithWebScraping } from "./services/webScrapingService.js";

/**
 * בדיקת web scraping משופר
 */
async function testEnhancedScraping() {
  console.log("🧪 Testing Enhanced Web Scraping with Configuration");
  console.log("==================================================");

  // בדיקת שיר עברי - שירונט
  console.log("🇮🇱 Testing Hebrew song - Shironet");
  console.log("----------------------------------");

  try {
    const hebrewLyrics = await fetchLyricsWithWebScraping(
      "המגפיים של ברוך",
      "kaveret"
    );
    if (hebrewLyrics) {
      console.log(`✅ Hebrew lyrics found: ${hebrewLyrics.length} characters`);
      console.log(`🔍 First 100 chars: ${hebrewLyrics.substring(0, 100)}...`);
    } else {
      console.log("❌ No Hebrew lyrics found");
    }
  } catch (error) {
    console.error("❌ Error testing Hebrew song:", error.message);
  }

  console.log("");

  // בדיקת שיר אנגלי
  console.log("🇺🇸 Testing English song");
  console.log("------------------------");

  try {
    const englishLyrics = await fetchLyricsWithWebScraping(
      "Imagine",
      "John Lennon"
    );
    if (englishLyrics) {
      console.log(
        `✅ English lyrics found: ${englishLyrics.length} characters`
      );
      console.log(`🔍 First 100 chars: ${englishLyrics.substring(0, 100)}...`);
    } else {
      console.log("❌ No English lyrics found");
    }
  } catch (error) {
    console.error("❌ Error testing English song:", error.message);
  }

  console.log("");
  console.log("🏁 Test completed");
}

// הרצת הבדיקה
testEnhancedScraping().catch(console.error);
