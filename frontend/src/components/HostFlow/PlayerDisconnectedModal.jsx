import React, { useEffect } from "react";

const PlayerDisconnectedModal = ({
  isOpen,
  playerName,
  playerEmoji,
  roomCode,
  gameInProgress,
  onWaitForReturn,
  onContinueWithout,
  onClose,
  showRoomCode = false,
  waitingForPlayer = null,
  onCancelWaiting,
}) => {
  console.log(`🔍 PlayerDisconnectedModal render:`, {
    isOpen,
    playerName,
    showRoomCode,
    waitingForPlayer,
  });

  useEffect(() => {
    console.log(`🔄 PlayerDisconnectedModal state changed:`, {
      isOpen,
      showRoomCode,
      waitingForPlayer,
    });
  }, [isOpen, showRoomCode, waitingForPlayer]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        {showRoomCode ? (
          // מצב המתנה לחזרת השחקן
          <div className="text-center">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Waiting for Player Return
            </h2>
            <p className="text-gray-600 mb-6">
              Waiting for <span className="font-bold">{waitingForPlayer}</span>{" "}
              to rejoin the game
            </p>

            {/* הצגת קוד המשחק */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 mb-6">
              <p className="text-white text-sm mb-2">Game Code:</p>
              <div className="text-4xl font-bold text-white tracking-wider">
                {roomCode}
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Share this code with the player so they can rejoin
            </p>

            <div className="flex gap-3">
              <button
                onClick={onCancelWaiting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Stop Waiting
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Hide
              </button>
            </div>
          </div>
        ) : (
          // מצב החלטה ראשונית
          <div className="text-center">
            <div className="text-6xl mb-4">🚪</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Player Disconnected
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">{playerEmoji}</span>
              <span className="text-xl font-semibold text-gray-700">
                {playerName}
              </span>
            </div>

            {gameInProgress ? (
              <p className="text-gray-600 mb-6">
                The game is in progress. What would you like to do?
              </p>
            ) : (
              <p className="text-gray-600 mb-6">
                The player left before the game started. What would you like to
                do?
              </p>
            )}

            <div className="space-y-3">
              <button
                onClick={onWaitForReturn}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <span>⏳</span>
                Wait for them to return
              </button>

              <button
                onClick={onContinueWithout}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <span>➡️</span>
                Continue without them
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerDisconnectedModal;
