// src/slices/gamesApiSlice.js
import { apiSlice } from "./apiSlice";
import { GAMES_URL } from "../constants";

export const gamesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createGame: builder.mutation({
      query: (data) => ({
        url: `${GAMES_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Game"], // ✅ רק כאן נכון להשתמש בזה
    }),
    myGames: builder.query({
      query: () => ({
        url: `${GAMES_URL}/mine`,
        method: "GET",
      }),
      providesTags: ["Game"], // ✅ מאפשר לזה להתעדכן כשנוצרים משחקים חדשים
    }),
  }),
});

export const { useCreateGameMutation, useMyGamesQuery } = gamesApiSlice;
