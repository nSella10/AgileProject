// src/constants.js - WWW subdomain configuration
export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://api.guessifyapp.com"; // Backend API endpoint

// External app URLs for cross-linking
export const APP_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://app.guessifyapp.com";

export const PLAY_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3002"
    : "https://play.guessifyapp.com";

export const USERS_URL = `${BASE_URL}/api/users`;

export const GAMES_URL = `${BASE_URL}/api/games`;
