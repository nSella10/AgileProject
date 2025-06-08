/**
 * Web Scraping Configuration
 * הגדרות עבור web scraping עם הגנה מפני זיהוי בוטים
 */

export const webScrapingConfig = {
  // הגדרות כלליות
  enableAntiBotProtection: process.env.ENABLE_ANTI_BOT_PROTECTION === 'true' || process.env.NODE_ENV === 'production',
  
  // הגדרות השהיות
  delays: {
    development: {
      min: parseInt(process.env.WEB_SCRAPING_MIN_DELAY) || 500,
      max: parseInt(process.env.WEB_SCRAPING_MAX_DELAY) || 2000,
    },
    production: {
      min: parseInt(process.env.PRODUCTION_MIN_DELAY) || 3000,
      max: parseInt(process.env.PRODUCTION_MAX_DELAY) || 8000,
    }
  },
  
  // הגדרות ניסיונות חוזרים
  retries: {
    development: parseInt(process.env.WEB_SCRAPING_MAX_RETRIES) || 3,
    production: parseInt(process.env.PRODUCTION_MAX_RETRIES) || 5,
  },
  
  // הגדרות timeout
  timeout: {
    development: 15000, // 15 seconds
    production: 30000,  // 30 seconds
  },
  
  // User-Agent strings מגוונים
  userAgents: [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  ],
  
  // הגדרות ספציפיות לאתרים
  sites: {
    shironet: {
      baseUrl: "https://shironet.mako.co.il",
      searchPath: "/search",
      selectors: {
        searchResults: "a[href*='artist?type=lyrics'], a[href*='prfid'], a[href*='wrkid']",
        lyrics: ".artist_lyrics_text, .lyrics_text, .song_lyrics_text"
      },
      extraDelay: {
        development: 500,
        production: 2000
      }
    },
    genius: {
      baseUrl: "https://genius.com",
      searchPath: "/search",
      selectors: {
        searchResults: ".mini_card a, .search_result a",
        lyrics: '[data-lyrics-container="true"], .lyrics, .Lyrics__Container-sc-1ynbvzw-6'
      },
      extraDelay: {
        development: 1000,
        production: 3000
      }
    },
    google: {
      baseUrl: "https://www.google.com",
      searchPath: "/search",
      extraDelay: {
        development: 1500,
        production: 4000
      }
    }
  }
};

/**
 * קבלת הגדרות עבור סביבה נוכחית
 */
export function getCurrentConfig() {
  const env = process.env.NODE_ENV || 'development';
  const isProduction = env === 'production';
  
  return {
    environment: env,
    isProduction,
    enableAntiBotProtection: webScrapingConfig.enableAntiBotProtection,
    delays: webScrapingConfig.delays[isProduction ? 'production' : 'development'],
    retries: webScrapingConfig.retries[isProduction ? 'production' : 'development'],
    timeout: webScrapingConfig.timeout[isProduction ? 'production' : 'development'],
    userAgents: webScrapingConfig.userAgents,
    sites: webScrapingConfig.sites
  };
}

/**
 * קבלת User-Agent אקראי
 */
export function getRandomUserAgent() {
  const config = getCurrentConfig();
  return config.userAgents[Math.floor(Math.random() * config.userAgents.length)];
}

/**
 * קבלת השהיה אקראית
 */
export function getRandomDelay(minMs = null, maxMs = null) {
  const config = getCurrentConfig();
  
  if (!config.enableAntiBotProtection) {
    return 0;
  }
  
  const actualMinMs = minMs || config.delays.min;
  const actualMaxMs = maxMs || config.delays.max;
  
  return Math.floor(Math.random() * (actualMaxMs - actualMinMs + 1)) + actualMinMs;
}

/**
 * לוג הגדרות נוכחיות
 */
export function logCurrentConfig() {
  const config = getCurrentConfig();
  console.log("🔧 Web Scraping Configuration:");
  console.log(`Environment: ${config.environment}`);
  console.log(`Anti-bot protection: ${config.enableAntiBotProtection}`);
  console.log(`Delays: ${config.delays.min}-${config.delays.max}ms`);
  console.log(`Max retries: ${config.retries}`);
  console.log(`Timeout: ${config.timeout}ms`);
  console.log("");
}
