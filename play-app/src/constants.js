// src/constants.js - Play App Constants
// Updated: Fixed backend URL for production deployment
// Trigger deployment with fresh build files
export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://guessify-backend-env.eba-gzcxs3kh.us-east-1.elasticbeanstalk.com";

// Play app only needs socket connection and basic game validation
export const SOCKET_URL = BASE_URL;
