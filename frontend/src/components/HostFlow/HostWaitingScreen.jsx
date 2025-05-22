import React from "react";

const HostWaitingScreen = ({ roomCode, players, onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-gray-800">
      <div className="bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-xl text-center border border-purple-300">
        {/* Game PIN */}
        <h2 className="text-2xl font-semibold tracking-wide text-gray-700 mb-1">
          🎮 Game PIN
        </h2>
        <p className="text-5xl font-extrabold text-purple-800 mb-8 tracking-wider">
          {roomCode || "------"}
        </p>

        {/* Players List */}
        {players.length > 0 && (
          <>
            <div className="flex flex-wrap justify-center gap-6 mb-6">
              {players.map((player, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center bg-purple-100 px-6 py-4 rounded-2xl shadow-lg w-28 h-28"
                >
                  <div className="text-4xl mb-1">{player.emoji}</div>
                  <span className="font-semibold text-lg text-purple-900">
                    {player.username}
                  </span>
                </div>
              ))}
            </div>

            {/* Start Game Button */}
            <button
              className="mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 text-lg rounded-2xl transition duration-200 shadow-md"
              onClick={onStart}
            >
              🚀 Start Game
            </button>
          </>
        )}

        {/* Waiting Message */}
        <div className="text-base mt-8 text-gray-600 italic">
          Waiting for participants...
        </div>
      </div>
    </div>
  );
};

export default HostWaitingScreen;
