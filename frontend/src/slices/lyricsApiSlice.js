import { apiSlice } from "./apiSlice";

/**
 * API slice לניהול מאגר מילות השיר
 */
export const lyricsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // חיפוש מילות שיר במאגר
    searchLyrics: builder.query({
      query: ({ trackId, title, artist }) => ({
        url: `/lyrics/search/${encodeURIComponent(title)}/${encodeURIComponent(
          artist
        )}${trackId ? `?trackId=${trackId}` : ""}`,
        method: "GET",
      }),
      providesTags: ["Lyrics"],
    }),

    // הוספת מילות שיר חדשות למאגר
    addLyrics: builder.mutation({
      query: ({
        trackId,
        title,
        artist,
        lyrics,
        language = "hebrew",
        previewUrl,
        artworkUrl,
      }) => ({
        url: "/lyrics/add",
        method: "POST",
        body: {
          trackId,
          title,
          artist,
          lyrics,
          language,
          previewUrl,
          artworkUrl,
        },
      }),
      invalidatesTags: ["Lyrics", "LyricsStats"],
    }),

    // חיפוש שירים לפי מונח חיפוש
    searchSongs: builder.query({
      query: ({ searchTerm, limit = 10 }) => ({
        url: `/lyrics/search-songs/${encodeURIComponent(
          searchTerm
        )}?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Lyrics"],
    }),

    // קבלת שירים פופולריים
    getPopularSongs: builder.query({
      query: (limit = 20) => ({
        url: `/lyrics/popular?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Lyrics"],
    }),

    // קבלת סטטיסטיקות מאגר השירים
    getLyricsStats: builder.query({
      query: () => ({
        url: "/lyrics/stats",
        method: "GET",
      }),
      providesTags: ["LyricsStats"],
    }),

    // דירוג איכות שיר
    rateSong: builder.mutation({
      query: ({ songId, rating }) => ({
        url: `/lyrics/rate/${songId}`,
        method: "POST",
        body: { rating },
      }),
      invalidatesTags: ["Lyrics"],
    }),

    // קבלת פרטי שיר לפי ID
    getSongById: builder.query({
      query: (songId) => ({
        url: `/lyrics/song/${songId}`,
        method: "GET",
      }),
      providesTags: (result, error, songId) => [{ type: "Lyrics", id: songId }],
    }),
  }),
});

export const {
  useSearchLyricsQuery,
  useLazySearchLyricsQuery,
  useAddLyricsMutation,
  useSearchSongsQuery,
  useLazySearchSongsQuery,
  useGetPopularSongsQuery,
  useGetLyricsStatsQuery,
  useRateSongMutation,
  useGetSongByIdQuery,
} = lyricsApiSlice;
