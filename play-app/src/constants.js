// src/constants.js - Play App Constants.
export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "http://guessify-backend-env.eba-gzcxs3kh.us-east-1.elasticbeanstalk.com";

// Play app only needs socket connection and basic game validation
export const SOCKET_URL = BASE_URL;
