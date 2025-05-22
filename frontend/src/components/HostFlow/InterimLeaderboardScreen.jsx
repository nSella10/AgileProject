import React from "react";

const InterimLeaderboardScreen = ({ scores, onNextRound }) => {
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6); // טופ 6

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-gray-800">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-xl text-center border border-purple-300">
        <h2 className="text-3xl font-bold text-purple-800 mb-6 animate-pulse">
          🏆 Live Leaderboard
        </h2>

        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200 mb-8">
          {sorted.length === 0 ? (
            <p className="text-gray-500 text-base">No correct answers yet.</p>
          ) : (
            <ul className="space-y-3 text-purple-900 font-semibold text-xl text-left">
              {sorted.map(([username, score], index) => (
                <li key={username}>
                  {index + 1}. <span className="font-bold">{username}</span> —{" "}
                  {score} pts
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={onNextRound}
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-2xl text-lg shadow-md transition duration-200"
        >
          ▶️ Next Song
        </button>
      </div>
    </div>
  );
};

export default InterimLeaderboardScreen;
