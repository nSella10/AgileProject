// src/constants.js
export const BASE_URL =
  process.env.NODE_ENV === "development" ? "http://10.0.0.8:8000" : "";

export const USERS_URL = `${BASE_URL}/api/users`;

export const GAMES_URL = `${BASE_URL}/api/games`;
