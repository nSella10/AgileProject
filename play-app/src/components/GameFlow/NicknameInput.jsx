import React from "react";
import { useTranslation } from "react-i18next";

const NicknameInput = ({ roomCode, username, error, setUsername, onJoin }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "he";
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && username.trim()) {
      onJoin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400 opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Form Card */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20 shadow-2xl">
            <div className="space-y-6">
              {/* Username Input */}
              <div>
                <label
                  className={`block text-white font-semibold mb-3 text-lg ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("nickname.title")}
                </label>
                <input
                  className={`w-full p-4 rounded-2xl bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white placeholder-purple-200 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50 transition-all duration-200 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                  type="text"
                  placeholder={t("nickname.placeholder")}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={20}
                  autoFocus
                  dir={isRTL ? "rtl" : "ltr"}
                />
              </div>

              {/* Join Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 rounded-2xl font-bold text-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={!username || !username.trim()}
              >
                {t("nickname.start_playing")}
              </button>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500 bg-opacity-20 backdrop-blur-sm border border-red-400 border-opacity-30 rounded-2xl p-4 text-center">
                  <div className="text-red-200 font-medium">❌ {error}</div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NicknameInput;
