import React from "react";
import { useTranslation } from "react-i18next";
import LetterClickInput from "./LetterClickInput";

const GamePlayScreen = ({
  guess,
  statusMsg,
  onGuessChange,
  onSubmitGuess,
  onSkipSong,
  hasGuessed,
  isWaiting,
  isGameOver,
  songNumber,
  totalSongs,
  submitted,
  timeLeft,
  roundFailedForUser,
  guessResult,
  answerDetails,
  maxTime = 15, // זמן ניחוש דינמי
  isAudioPlaying = false, // האם השיר עדיין מתנגן
  guessInputMethod = "freeText", // שיטת ניחוש
  currentSongTitle = "", // שם השיר הנוכחי (לשיטת לחיצת אותיות)
  isGamePaused = false, // האם המשחק מושהה
  pauseReason = "", // סיבת ההשהיה
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "he";

  console.log("🎮 GamePlayScreen props:", {
    timeLeft,
    maxTime,
    hasGuessed,
    isWaiting,
    isGameOver,
    isAudioPlaying,
    answerDetails,
  });

  // פונקציה להצגת סוג התשובה
  const getAnswerTypeDisplay = (answerType) => {
    switch (answerType) {
      case "songTitle":
        return {
          emoji: "🎵",
          text: t("game_play.song_name"),
          color: "text-yellow-300",
        };
      case "artist":
        return {
          emoji: "🎤",
          text: t("game_play.artist_name"),
          color: "text-orange-300",
        };
      case "lyrics":
        return {
          emoji: "📝",
          text: t("game_play.song_lyrics"),
          color: "text-red-300",
        };
      default:
        return {
          emoji: "🎯",
          text: t("game_play.correct_answer"),
          color: "text-green-300",
        };
    }
  };

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft ? (timeLeft / maxTime) * circumference : 0;

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-48 h-48 bg-purple-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-pink-400 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-400 opacity-5 rounded-full blur-3xl animate-pulse"></div>

        {/* Floating music notes */}
        <div className="absolute top-1/4 left-1/4 text-3xl text-white opacity-20 animate-bounce">
          🎵
        </div>
        <div
          className="absolute top-3/4 right-1/4 text-2xl text-white opacity-20 animate-bounce"
          style={{ animationDelay: "1s" }}
        >
          🎶
        </div>
        <div
          className="absolute top-1/2 left-1/6 text-xl text-white opacity-20 animate-bounce"
          style={{ animationDelay: "2s" }}
        >
          🎼
        </div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Main Game Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-6 border border-white border-opacity-20 shadow-2xl text-center">
          {/* Song Progress Header */}
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
              🎵{" "}
              {t("game_play.song_number", {
                current: songNumber,
                total: totalSongs,
              })}
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
            🎧 {t("game_play.guess_the_song")}
          </h1>

          {/* Scoring Info */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-3 border border-yellow-400 border-opacity-30 mb-4">
            <div
              className={`text-white text-sm space-y-1 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              <div className="flex justify-between items-center">
                <span>🎵 {t("game_play.song_name_points")}</span>
                <span className="font-bold text-yellow-200">1000 pts</span>
              </div>
              <div className="flex justify-between items-center">
                <span>🎤 {t("game_play.artist_name_points")}</span>
                <span className="font-bold text-orange-200">600 pts</span>
              </div>
              <div className="flex justify-between items-center">
                <span>📝 {t("game_play.song_lyrics_points")}</span>
                <span className="font-bold text-red-200">300 pts</span>
              </div>
            </div>
          </div>

          {/* Answer Details - הצגת פרטי התשובה הנכונה */}
          {guessResult === "correct" && answerDetails && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 border border-green-400 border-opacity-30 mb-4">
              <div className="text-center space-y-2">
                <div className="text-green-200 text-lg font-bold">
                  {t("game_play.correct_answer_title")}
                </div>
                <div
                  className={`flex items-center justify-center ${
                    isRTL ? "space-x-reverse space-x-2" : "space-x-2"
                  }`}
                >
                  <span
                    className={`text-2xl ${
                      getAnswerTypeDisplay(answerDetails.answerType).emoji
                    }`}
                  >
                    {getAnswerTypeDisplay(answerDetails.answerType).emoji}
                  </span>
                  <span
                    className={`font-semibold ${
                      getAnswerTypeDisplay(answerDetails.answerType).color
                    }`}
                  >
                    {getAnswerTypeDisplay(answerDetails.answerType).text}
                  </span>
                </div>
                <div className="text-white text-sm">
                  {t("game_play.you_guessed")}{" "}
                  <span className="font-bold text-green-200">
                    "{answerDetails.matchedText}"
                  </span>
                </div>
                <div className="text-yellow-300 text-xl font-bold">
                  {t("game_play.points_earned", {
                    points: answerDetails.score,
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Status Message */}
          {!roundFailedForUser && guessResult !== "correct" && (
            <div className="bg-blue-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-3 border border-blue-400 border-opacity-30 mb-4">
              <p className="text-white font-medium text-base">🕵️ {statusMsg}</p>
            </div>
          )}

          {/* Timer Circle - מוצג רק כשיש זמן נותר והמשתתף עדיין לא ניחש ולא במצב השהיה */}
          {timeLeft && !isGameOver && !hasGuessed && !isGamePaused && (
            <div className="flex flex-col items-center justify-center mb-6">
              {console.log("🎮 Rendering timer circle with:", {
                timeLeft,
                maxTime,
                progress,
              })}
              <div className="relative">
                <svg width="100" height="100" className="transform -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={
                      2 * Math.PI * 40 - (timeLeft / maxTime) * 2 * Math.PI * 40
                    }
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {timeLeft}
                    </div>
                    <div className="text-xs text-purple-200">
                      {t("game_play.seconds")}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-purple-200 text-xs animate-pulse">
                {t("game_play.time_is_ticking")}
              </div>
            </div>
          )}

          {/* Game States */}
          {isGameOver ? (
            <div className="bg-green-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 border border-green-400 border-opacity-30">
              <div className="text-4xl mb-4">🎉</div>
              <p className="text-2xl text-white font-bold">
                {t("game_play.game_over")}
              </p>
              <p className="text-green-200 mt-2">
                {t("game_play.thanks_for_playing")}
              </p>
            </div>
          ) : hasGuessed ? (
            <div className="space-y-4">
              <div className="bg-blue-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400 border-opacity-30">
                <div className="text-4xl mb-4">🚀</div>
                <p className="text-white font-medium text-lg">
                  {t("game_play.guess_submitted")}
                </p>
              </div>

              {guessResult === "correct" && (
                <div className="bg-green-500 bg-opacity-30 backdrop-blur-sm rounded-2xl p-4 border border-green-400 border-opacity-50 animate-pulse">
                  <div className="text-3xl mb-2">✅</div>
                  <p className="text-green-200 font-bold text-xl">
                    {t("game_play.correct")}
                  </p>
                </div>
              )}

              {guessResult === "wrong" && (
                <div className="bg-red-500 bg-opacity-30 backdrop-blur-sm rounded-2xl p-4 border border-red-400 border-opacity-50">
                  <div className="text-3xl mb-2">❌</div>
                  <p className="text-red-200 font-bold text-xl">
                    {t("game_play.incorrect")}
                  </p>
                </div>
              )}

              {guessResult === "skipped" && (
                <div className="bg-gray-500 bg-opacity-30 backdrop-blur-sm rounded-2xl p-4 border border-gray-400 border-opacity-50">
                  <div className="text-3xl mb-2">⏭️</div>
                  <p className="text-gray-200 font-bold text-xl">
                    {t("game_play.song_skipped")}
                  </p>
                </div>
              )}
            </div>
          ) : isGamePaused ? (
            // מצב השהיה - עדיפות עליונה
            <div className="bg-orange-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 border border-orange-400 border-opacity-30">
              <div className="text-4xl mb-4 animate-pulse">⏸️</div>
              <p className="text-white font-bold text-xl mb-2">
                {t("game_play.game_paused")}
              </p>
              <p className="text-orange-200 text-base">{pauseReason}</p>
              <div className="mt-4 flex justify-center space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          ) : isWaiting ? (
            <div className="bg-yellow-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400 border-opacity-30">
              <div className="text-4xl mb-4 animate-spin">⏳</div>
              <p className="text-white font-medium text-lg">
                {roundFailedForUser
                  ? t("game_play.no_one_guessed")
                  : statusMsg.includes("next song - you'll join")
                  ? t("game_play.rejoined_during_round")
                  : t("game_play.waiting_next_song")}
              </p>
            </div>
          ) : isAudioPlaying && !hasGuessed && !isGamePaused ? (
            // כשהשיר מתנגן - הצגת הודעה מתאימה במקום טופס הניחוש
            // אבל רק אם השחקן עדיין לא ניחש/וויתר
            <div className="bg-blue-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-8 border border-blue-400 border-opacity-30">
              <div className="text-6xl mb-6 animate-pulse">🎵</div>
              <p className="text-white font-bold text-2xl mb-4">
                {t("game_play.listen_carefully")}
              </p>
              <p className="text-blue-200 text-lg">
                {t("game_play.song_is_playing")}
              </p>
              <div className="mt-6 flex justify-center space-x-4">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                <div
                  className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          ) : !isGamePaused ? (
            <div className="space-y-6">
              {/* Guess Input - תלוי בשיטת הניחוש */}
              {guessInputMethod === "letterClick" ? (
                <LetterClickInput
                  songTitle={currentSongTitle}
                  onGuessChange={onGuessChange}
                  onSubmitGuess={onSubmitGuess}
                  onSkipSong={timeLeft && onSkipSong ? onSkipSong : null}
                  hasGuessed={hasGuessed}
                  isWaiting={isWaiting}
                  isGameOver={isGameOver}
                />
              ) : (
                <>
                  {/* Free Text Input */}
                  <div className="relative">
                    <input
                      className={`w-full bg-white bg-opacity-20 backdrop-blur-sm border-2 border-white border-opacity-30 rounded-2xl px-6 py-3 text-white text-lg placeholder-purple-200 focus:outline-none focus:border-purple-400 focus:bg-opacity-30 transition-all duration-300 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                      type="text"
                      value={guess}
                      onChange={(e) => onGuessChange(e.target.value)}
                      placeholder={t("game_play.placeholder")}
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                    <div
                      className={`absolute ${
                        isRTL ? "left-4" : "right-4"
                      } top-1/2 transform -translate-y-1/2 text-purple-300`}
                    >
                      🎵
                    </div>
                  </div>

                  {/* Hint Text */}
                  <div
                    className={`text-center text-purple-200 text-sm ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("game_play.hint_text")}
                  </div>

                  {/* Action Buttons */}
                  <div
                    className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    {/* Submit Button */}
                    <button
                      onClick={onSubmitGuess}
                      disabled={!guess.trim()}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-2xl transition-all duration-300 text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <span className="text-lg">🚀</span>
                      {t("game_play.submit")}
                      <span className="text-lg">🎯</span>
                    </button>

                    {/* Skip Button */}
                    {timeLeft && onSkipSong && (
                      <button
                        onClick={onSkipSong}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-4 py-3 rounded-2xl transition-all duration-300 text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <span className="text-lg">⏭️</span>
                        {t("game_play.skip")}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GamePlayScreen;
