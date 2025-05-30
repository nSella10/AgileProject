import { apiSlice } from "./apiSlice";

const LESSONS_URL = "/api/lessons";

export const lessonsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createLesson: builder.mutation({
      query: (data) => ({
        url: `${LESSONS_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Lesson"],
    }),
    getMyLessons: builder.query({
      query: () => ({
        url: `${LESSONS_URL}/mine`,
        method: "GET",
      }),
      providesTags: ["Lesson"],
    }),
    getLessonById: builder.query({
      query: (lessonId) => ({
        url: `${LESSONS_URL}/${lessonId}`,
        method: "GET",
      }),
      providesTags: (result, error, lessonId) => [
        { type: "Lesson", id: lessonId },
      ],
    }),
    updateLesson: builder.mutation({
      query: ({ lessonId, ...data }) => ({
        url: `${LESSONS_URL}/${lessonId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { lessonId }) => [
        "Lesson",
        { type: "Lesson", id: lessonId },
      ],
    }),
    deleteLesson: builder.mutation({
      query: (lessonId) => ({
        url: `${LESSONS_URL}/${lessonId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lesson"],
    }),
    startLiveLesson: builder.mutation({
      query: (lessonId) => ({
        url: `${LESSONS_URL}/${lessonId}/start-live`,
        method: "POST",
      }),
      invalidatesTags: (result, error, lessonId) => [
        "Lesson",
        { type: "Lesson", id: lessonId },
      ],
    }),
    stopLiveLesson: builder.mutation({
      query: (lessonId) => ({
        url: `${LESSONS_URL}/${lessonId}/stop-live`,
        method: "POST",
      }),
      invalidatesTags: (result, error, lessonId) => [
        "Lesson",
        { type: "Lesson", id: lessonId },
      ],
    }),
    getLessonByRoomCode: builder.query({
      query: (roomCode) => ({
        url: `${LESSONS_URL}/room/${roomCode}`,
        method: "GET",
      }),
    }),
    getTeacherAnalytics: builder.query({
      query: () => ({
        url: `${LESSONS_URL}/analytics`,
        method: "GET",
      }),
      providesTags: ["Lesson"],
    }),
    nextSong: builder.mutation({
      query: (lessonId) => ({
        url: `${LESSONS_URL}/${lessonId}/next-song`,
        method: "POST",
      }),
      invalidatesTags: (result, error, lessonId) => [
        "Lesson",
        { type: "Lesson", id: lessonId },
      ],
    }),
    previousSong: builder.mutation({
      query: (lessonId) => ({
        url: `${LESSONS_URL}/${lessonId}/previous-song`,
        method: "POST",
      }),
      invalidatesTags: (result, error, lessonId) => [
        "Lesson",
        { type: "Lesson", id: lessonId },
      ],
    }),
    setSong: builder.mutation({
      query: ({ lessonId, songIndex }) => ({
        url: `${LESSONS_URL}/${lessonId}/set-song/${songIndex}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { lessonId }) => [
        "Lesson",
        { type: "Lesson", id: lessonId },
      ],
    }),
    addStudentRecording: builder.mutation({
      query: ({ lessonId, studentName, songIndex, analysisResult }) => ({
        url: `${LESSONS_URL}/${lessonId}/recordings`,
        method: "POST",
        body: { studentName, songIndex, analysisResult },
      }),
      invalidatesTags: (result, error, { lessonId }) => [
        "Lesson",
        { type: "Lesson", id: lessonId },
      ],
    }),
    getLessonRecordings: builder.query({
      query: (lessonId) => ({
        url: `${LESSONS_URL}/${lessonId}/recordings`,
        method: "GET",
      }),
      providesTags: (result, error, lessonId) => [
        { type: "Lesson", id: lessonId },
      ],
    }),
  }),
});

export const {
  useCreateLessonMutation,
  useGetMyLessonsQuery,
  useGetLessonByIdQuery,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useStartLiveLessonMutation,
  useStopLiveLessonMutation,
  useGetLessonByRoomCodeQuery,
  useLazyGetLessonByRoomCodeQuery,
  useGetTeacherAnalyticsQuery,
  useNextSongMutation,
  usePreviousSongMutation,
  useSetSongMutation,
  useAddStudentRecordingMutation,
  useGetLessonRecordingsQuery,
} = lessonsApiSlice;
