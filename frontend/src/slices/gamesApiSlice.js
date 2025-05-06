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
    }),
    myGames: builder.query({
      query: () => ({
        url: `${GAMES_URL}/mine`,
        method: "GET",
      }),
      providesTags: ["Game"],
      invalidatesTags: ["Game"],
    }),
  }),
});

export const { useCreateGameMutation, useMyGamesQuery } = gamesApiSlice;
