// src/constants.js - Create App Constants
export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "http://guessify-backend-env.eba-gzcxs3kh.us-east-1.elasticbeanstalk.com";

export const USERS_URL = `${BASE_URL}/api/users`;
export const GAMES_URL = `${BASE_URL}/api/games`;
export const LESSONS_URL = `${BASE_URL}/api/lessons`;
export const LYRICS_URL = `${BASE_URL}/api/lyrics`;
