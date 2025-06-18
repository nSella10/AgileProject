import React from "react";

const RejoinGameModal = ({ 
  isOpen, 
  roomCode, 
  username, 
  gameTitle, 
  onAccept, 
  onDecline 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-600">
              We found your previous game session
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Game:</span>
                <span className="font-semibold text-gray-800">{gameTitle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Room Code:</span>
                <span className="font-mono font-bold text-blue-600 text-lg">{roomCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Username:</span>
                <span className="font-semibold text-gray-800">{username}</span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-6 text-sm">
            The game organizer is waiting for you to return. 
            Would you like to rejoin the game?
          </p>

          <div className="flex space-x-4">
            <button
              onClick={onDecline}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              No, Start Fresh
            </button>
            <button
              onClick={onAccept}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Yes, Rejoin Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejoinGameModal;
