import React from "react";
import { useTranslation } from "react-i18next";

const RejoinGameModal = ({
  isOpen,
  roomCode,
  username,
  gameTitle,
  onAccept,
  onDecline,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "he";
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl ${
          isRTL ? "text-right" : "text-left"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {t("rejoin.title")}
            </h2>
            <p className="text-gray-600">{t("rejoin.message")}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Game:</span>
                <span className="font-semibold text-gray-800">{gameTitle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t("rejoin.game_code")}</span>
                <span className="font-mono font-bold text-blue-600 text-lg">
                  {roomCode}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  {t("rejoin.your_nickname")}
                </span>
                <span className="font-semibold text-gray-800">{username}</span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-6 text-sm">
            The game organizer is waiting for you to return. Would you like to
            rejoin the game?
          </p>

          <div
            className={`flex ${
              isRTL ? "space-x-reverse space-x-4" : "space-x-4"
            }`}
          >
            <button
              onClick={onDecline}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {t("rejoin.start_new")}
            </button>
            <button
              onClick={onAccept}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              {t("rejoin.rejoin")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejoinGameModal;
