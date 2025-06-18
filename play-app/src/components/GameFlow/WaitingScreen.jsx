import React from "react";
import { useTranslation } from "react-i18next";

const WaitingScreen = ({ playerEmoji, username }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "he";
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400 opacity-5 rounded-full blur-3xl animate-pulse"></div>

        {/* Floating music notes */}
        <div className="absolute top-1/4 left-1/4 text-4xl text-white opacity-20 animate-bounce">
          🎵
        </div>
        <div
          className="absolute top-3/4 right-1/4 text-3xl text-white opacity-20 animate-bounce"
          style={{ animationDelay: "1s" }}
        >
          🎶
        </div>
        <div
          className="absolute top-1/2 left-1/6 text-2xl text-white opacity-20 animate-bounce"
          style={{ animationDelay: "2s" }}
        >
          🎼
        </div>
      </div>

      <div className="relative z-10 text-center">
        {/* Main Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-12 border border-white border-opacity-20 shadow-2xl max-w-md mx-auto">
          {/* Player Avatar */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-6xl flex items-center justify-center shadow-2xl border-4 border-white border-opacity-30 animate-pulse">
              {playerEmoji || "🎮"}
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white animate-ping"></div>
          </div>

          {/* Welcome Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {t("waiting.welcome")}
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text mb-6">
            {username}!
          </h2>

          {/* Status */}
          <div className="bg-blue-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400 border-opacity-30 mb-6">
            <div className="text-2xl mb-2">✅</div>
            <p className="text-white font-semibold text-lg">
              {t("waiting.connected")}
            </p>
            <p className="text-blue-200 text-sm mt-2">
              {t("waiting.waiting_for_game")}
            </p>
          </div>

          {/* Loading Animation */}
          <div className="space-y-4">
            <div className="text-purple-200 font-medium">
              {t("waiting.get_ready")}
            </div>
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
              <div
                className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-10">
            <h3
              className={`text-white font-semibold mb-3 flex items-center justify-center ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <span className={isRTL ? "ml-2" : "mr-2"}>💡</span>
              Game Tips
            </h3>
            <div
              className={`space-y-2 text-purple-200 text-sm ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              <p>🎧 Make sure your volume is up</p>
              <p>⚡ Be ready to guess quickly</p>
              <p>🏆 Have fun and good luck!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingScreen;
