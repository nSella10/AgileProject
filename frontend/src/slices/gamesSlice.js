// src/slices/gamesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./authSlice";

const initialState = {
  games: [],
  currentGame: null,
  isLoading: false,
  error: null,
  lastFetch: null,
  analytics: null,
};

const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Games management
    setGames: (state, action) => {
      state.games = action.payload;
      state.lastFetch = Date.now();
      state.isLoading = false;
      state.error = null;
    },
    addGame: (state, action) => {
      state.games.unshift(action.payload); // Add to beginning
      state.isLoading = false;
      state.error = null;
    },
    updateGame: (state, action) => {
      const { gameId, updatedData } = action.payload;
      const gameIndex = state.games.findIndex((game) => game._id === gameId);
      if (gameIndex !== -1) {
        state.games[gameIndex] = { ...state.games[gameIndex], ...updatedData };
      }
      // Also update currentGame if it's the same game
      if (state.currentGame && state.currentGame._id === gameId) {
        state.currentGame = { ...state.currentGame, ...updatedData };
      }
      state.isLoading = false;
      state.error = null;
    },
    removeGame: (state, action) => {
      const gameId = action.payload;
      state.games = state.games.filter((game) => game._id !== gameId);
      // Clear currentGame if it was the deleted game
      if (state.currentGame && state.currentGame._id === gameId) {
        state.currentGame = null;
      }
      state.isLoading = false;
      state.error = null;
    },

    // Current game management
    setCurrentGame: (state, action) => {
      state.currentGame = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    clearCurrentGame: (state) => {
      state.currentGame = null;
    },

    // Analytics
    setAnalytics: (state, action) => {
      state.analytics = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Cache management
    invalidateCache: (state) => {
      state.lastFetch = null;
    },
    clearAllData: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Clear games data when user logs out
    builder.addCase(logout, () => {
      return initialState;
    });
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setGames,
  addGame,
  updateGame,
  removeGame,
  setCurrentGame,
  clearCurrentGame,
  setAnalytics,
  invalidateCache,
  clearAllData,
} = gamesSlice.actions;

// Selectors
export const selectGames = (state) => state.games.games;
export const selectCurrentGame = (state) => state.games.currentGame;
export const selectGamesLoading = (state) => state.games.isLoading;
export const selectGamesError = (state) => state.games.error;
export const selectAnalytics = (state) => state.games.analytics;
export const selectLastFetch = (state) => state.games.lastFetch;

// Helper selectors
export const selectGameById = (gameId) => (state) =>
  state.games.games.find((game) => game._id === gameId);

export const selectPublicGames = (state) =>
  state.games.games.filter((game) => game.isPublic);

export const selectPrivateGames = (state) =>
  state.games.games.filter((game) => !game.isPublic);

export const selectGamesBySearchTerm = (searchTerm) => (state) => {
  if (!searchTerm) return state.games.games;
  const term = searchTerm.toLowerCase();
  return state.games.games.filter(
    (game) =>
      game.title.toLowerCase().includes(term) ||
      game.description?.toLowerCase().includes(term)
  );
};

// Cache helper - check if data is fresh (less than 5 minutes old)
export const selectIsDataFresh = (state) => {
  const lastFetch = state.games.lastFetch;
  if (!lastFetch) return false;
  const fiveMinutes = 5 * 60 * 1000;
  return Date.now() - lastFetch < fiveMinutes;
};

export default gamesSlice.reducer;
