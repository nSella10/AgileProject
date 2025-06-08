// This file is deprecated - use individual app constants instead
// create-app/src/constants.js
// play-app/src/constants.js
// marketing-website/src/constants.js (if needed)

export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "http://guessify-backend-env.eba-gzcxs3kh.us-east-1.elasticbeanstalk.com";

export const USERS_URL = `${BASE_URL}/api/users`;

export const GAMES_URL = `${BASE_URL}/api/games`;
