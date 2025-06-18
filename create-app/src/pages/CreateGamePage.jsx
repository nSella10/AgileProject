// src/pages/CreateGamePage.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PageLayout from "../components/PageLayout";
import { useNavigate } from "react-router-dom";
import { useCreateGameWithState } from "../hooks/useGames";
import SongSearchInput from "../components/SongSearchInput";
import {
  FaMusic,
  FaUsers,
  FaLock,
  FaGlobe,
  FaArrowLeft,
  FaArrowRight,
  FaRocket,
  FaStar,
  FaHeadphones,
} from "react-icons/fa";
import { toast } from "react-toastify";

const CreateGamePage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [guessTimeLimit, setGuessTimeLimit] = useState(15);
  const [guessInputMethod, setGuessInputMethod] = useState("freeText");
  const [error, setError] = useState("");
  const [songsWithoutLyrics, setSongsWithoutLyrics] = useState([]);
  const [showLyricsPopup, setShowLyricsPopup] = useState(false);

  const navigate = useNavigate();
  const { createGame, isLoading } = useCreateGameWithState();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "he";

  // טיפול בבחירת שירים
  const handleSongSelect = (songData, isRemoval = false) => {
    if (isRemoval) {
      // אם זה מחיקה, songData הוא המערך החדש
      setSelectedSongs(songData);
    } else {
      // אם זה הוספה, songData הוא השיר החדש
      setSelectedSongs((prev) => [...prev, songData]);
    }
  };

  // פונקציה לבדיקת שירים ללא מילות שיר
  const checkSongsWithoutLyrics = () => {
    const songsWithoutLyricsArray = selectedSongs.filter(
      (song) => !song.lyrics || song.lyrics.trim().length === 0
    );
    setSongsWithoutLyrics(songsWithoutLyricsArray);
    return songsWithoutLyricsArray;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || selectedSongs.length === 0) {
      setError(t("create_game.validation_title_songs"));
      return;
    }

    // בדיקת שירים ללא מילות שיר
    const songsWithoutLyricsArray = checkSongsWithoutLyrics();
    if (songsWithoutLyricsArray.length > 0) {
      setShowLyricsPopup(true);
      // הסתרת הפופ-אפ אוטומטית אחרי 5 שניות
      setTimeout(() => {
        setShowLyricsPopup(false);
      }, 5000);
      return;
    }

    const gameData = {
      title,
      description,
      isPublic,
      guessTimeLimit,
      guessInputMethod,
      songs: selectedSongs.map((song) => ({
        title: song.title,
        artist: song.artist,
        correctAnswer: song.correctAnswer || song.title,
        correctAnswers: song.correctAnswers || [song.title],
        previewUrl: song.previewUrl,
        artworkUrl: song.artworkUrl,
        trackId: song.trackId,
        lyrics: song.lyrics || "",
        lyricsKeywords: song.lyricsKeywords || [],
      })),
    };

    try {
      await createGame(gameData);
      toast.success(t("create_game.game_created_success"));
      navigate("/mygames");
    } catch (err) {
      setError(err?.message || t("create_game.game_creation_failed"));
      toast.error(t("create_game.game_creation_failed"));
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 py-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4">
            <button
              onClick={() => navigate("/dashboard")}
              className={`flex items-center gap-2 text-purple-100 hover:text-white mb-6 transition-colors ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              {isRTL ? <FaArrowRight /> : <FaArrowLeft />}
              <span>{t("create_game.back_to_dashboard")}</span>
            </button>
            <div className="text-center">
              <div className="mb-4">
                <span className="text-5xl">🎵</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                {t("create_game.title")}
              </h1>
              <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                {t("create_game.subtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center">
                <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  1
                </div>
                <span
                  className={`${
                    isRTL ? "mr-3" : "ml-3"
                  } text-purple-600 font-semibold`}
                >
                  {t("create_game.step_game_details")}
                </span>
              </div>
              <div className="w-16 h-1 bg-purple-200 rounded"></div>
              <div className="flex items-center">
                <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  2
                </div>
                <span
                  className={`${
                    isRTL ? "mr-3" : "ml-3"
                  } text-purple-600 font-semibold`}
                >
                  {t("create_game.step_add_songs")}
                </span>
              </div>
              <div className="w-16 h-1 bg-purple-200 rounded"></div>
              <div className="flex items-center">
                <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  3
                </div>
                <span
                  className={`${
                    isRTL ? "mr-3" : "ml-3"
                  } text-purple-600 font-semibold`}
                >
                  {t("create_game.step_launch")}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 text-center">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-8">
            {/* Game Details Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 p-3 rounded-2xl">
                  <FaMusic className="text-purple-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {t("create_game.step_game_details")}
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">
                    {t("create_game.game_title_required")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("create_game.game_title_placeholder")}
                    className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-lg"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {t("create_game.game_title_help")}
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-3">
                    {t("create_game.description")}
                  </label>
                  <textarea
                    placeholder={t("create_game.description_placeholder")}
                    className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none text-lg"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-2">
                    {t("create_game.description_help")}
                  </p>
                </div>
              </div>

              {/* Game Settings */}
              <div className="mt-8 space-y-6">
                {/* Visibility Settings */}
                <div
                  className={`p-6 bg-gray-50 rounded-2xl ${
                    isRTL ? "text-right" : ""
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 ${
                      isRTL ? "flex-row-reverse justify-end" : ""
                    }`}
                  >
                    <FaUsers className="text-purple-600" />
                    {t("create_game.game_visibility")}
                  </h3>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        checked={isPublic}
                        onChange={() => setIsPublic(true)}
                        className="w-5 h-5 text-purple-600"
                      />
                      <div className="flex items-center gap-2">
                        <FaGlobe className="text-green-600" />
                        <span className="font-medium text-gray-700">
                          {t("create_game.public")}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {t("create_game.anyone_can_join")}
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        checked={!isPublic}
                        onChange={() => setIsPublic(false)}
                        className="w-5 h-5 text-purple-600"
                      />
                      <div className="flex items-center gap-2">
                        <FaLock className="text-orange-600" />
                        <span className="font-medium text-gray-700">
                          {t("create_game.private")}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {t("create_game.invite_only")}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Guess Time Limit */}
                <div
                  className={`p-6 bg-blue-50 rounded-2xl ${
                    isRTL ? "text-right" : ""
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 ${
                      isRTL ? "flex-row-reverse justify-end" : ""
                    }`}
                  >
                    ⏱️ {t("create_game.guess_time_limit")}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="guessTime"
                        checked={guessTimeLimit === 15}
                        onChange={() => setGuessTimeLimit(15)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="font-medium text-gray-700">
                        {t("create_game.15_seconds")}
                      </span>
                      <span className="text-sm text-gray-500">
                        {t("create_game.quick_exciting")}
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="guessTime"
                        checked={guessTimeLimit === 30}
                        onChange={() => setGuessTimeLimit(30)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="font-medium text-gray-700">
                        {t("create_game.30_seconds")}
                      </span>
                      <span className="text-sm text-gray-500">
                        {t("create_game.balanced")}
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="guessTime"
                        checked={guessTimeLimit === 45}
                        onChange={() => setGuessTimeLimit(45)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="font-medium text-gray-700">
                        {t("create_game.45_seconds")}
                      </span>
                      <span className="text-sm text-gray-500">
                        {t("create_game.extended")}
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="guessTime"
                        checked={guessTimeLimit === 60}
                        onChange={() => setGuessTimeLimit(60)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="font-medium text-gray-700">
                        {t("create_game.60_seconds")}
                      </span>
                      <span className="text-sm text-gray-500">
                        {t("create_game.relaxed")}
                      </span>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    {t("create_game.time_limit_help")}
                  </p>
                </div>

                {/* Guess Input Method */}
                <div
                  className={`p-6 bg-green-50 rounded-2xl ${
                    isRTL ? "text-right" : ""
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 ${
                      isRTL ? "flex-row-reverse justify-end" : ""
                    }`}
                  >
                    ✏️ {t("create_game.guess_input_method")}
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="guessInputMethod"
                        checked={guessInputMethod === "freeText"}
                        onChange={() => setGuessInputMethod("freeText")}
                        className="w-5 h-5 text-green-600 mt-1"
                      />
                      <div>
                        <span className="font-medium text-gray-700 block">
                          {t("create_game.free_text_input")}
                        </span>
                        <span className="text-sm text-gray-500">
                          {t("create_game.free_text_description")}
                        </span>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="guessInputMethod"
                        checked={guessInputMethod === "letterClick"}
                        onChange={() => setGuessInputMethod("letterClick")}
                        className="w-5 h-5 text-green-600 mt-1"
                      />
                      <div>
                        <span className="font-medium text-gray-700 block">
                          {t("create_game.letter_clicking")}
                        </span>
                        <span className="text-sm text-gray-500">
                          {t("create_game.letter_click_description")}
                        </span>
                      </div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    {t("create_game.input_method_help")}
                  </p>
                </div>
              </div>
            </div>

            {/* Songs Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-3 rounded-2xl">
                  <FaHeadphones className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {t("create_game.add_songs")}
                </h2>
                {selectedSongs.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {t("create_game.songs_selected", {
                      count: selectedSongs.length,
                    })}
                  </span>
                )}
              </div>

              <SongSearchInput
                onSongSelect={handleSongSelect}
                selectedSongs={selectedSongs}
              />

              {selectedSongs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FaMusic className="text-4xl mx-auto mb-4 opacity-50" />
                  <p className="text-lg">
                    {t("create_game.no_songs_selected")}
                  </p>
                  <p className="text-sm">{t("create_game.search_add_songs")}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-8 rounded-2xl transition-all duration-300 text-lg"
              >
                {t("create_game.cancel")}
              </button>
              <button
                type="submit"
                disabled={isLoading || !title || selectedSongs.length === 0}
                className={`flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 text-lg flex items-center justify-center gap-3 disabled:cursor-not-allowed ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <div
                      className={`animate-spin rounded-full h-5 w-5 border-b-2 border-white ${
                        isRTL ? "ml-2" : "mr-2"
                      }`}
                    ></div>
                    {t("create_game.creating_game")}
                  </>
                ) : (
                  <>
                    <FaRocket />
                    {t("create_game.create_game")}
                  </>
                )}
              </button>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-start gap-3">
                <FaStar className="text-purple-600 text-xl mt-1" />
                <div>
                  <h3 className="font-semibold text-purple-800 mb-2">
                    {t("create_game.pro_tips")}
                  </h3>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>{t("create_game.tip_mix_songs")}</li>
                    <li>{t("create_game.tip_different_genres")}</li>
                    <li>{t("create_game.tip_drag_reorder")}</li>
                    <li>{t("create_game.tip_optimal_length")}</li>
                    <li>{t("create_game.tip_auto_lyrics")}</li>
                    <li>{t("create_game.tip_test_game")}</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Pop-up for missing lyrics */}
      {showLyricsPopup && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-purple-900/30 to-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-purple-200/50 transform animate-slideUp">
            {/* Header with animated icon */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="text-6xl mb-4 animate-bounce">🎵</div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                Missing Lyrics Alert!
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Some songs need lyrics before you can create your amazing game
              </p>
            </div>

            {/* Songs list with beautiful cards */}
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {songsWithoutLyrics.map((song, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-4 transform hover:scale-105 transition-all duration-300 shadow-md"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      🎶
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-800 text-lg">
                        "{song.title}"
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        by {song.artist}
                      </div>
                    </div>
                    <div className="text-yellow-600 text-2xl animate-pulse">
                      ⚠️
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions with beautiful styling */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="text-2xl">💡</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Click the{" "}
                    <span className="inline-flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md transform hover:scale-105 transition-transform">
                      📝 Green Button
                    </span>{" "}
                    next to each song to add lyrics manually
                  </p>
                </div>
              </div>
            </div>

            {/* Action button with amazing styling */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowLyricsPopup(false)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <span>👍</span>
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default CreateGamePage;
