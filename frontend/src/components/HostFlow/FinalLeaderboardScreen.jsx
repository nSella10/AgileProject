import React from "react";
import { useNavigate } from "react-router-dom";

const FinalLeaderboardScreen = ({ leaderboard }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12 px-4">
      <div className="bg-white/90 backdrop-blur-lg text-purple-800 p-6 rounded-2xl shadow-2xl max-w-md w-full text-center border border-purple-300">
        <h3 className="text-3xl font-bold mb-6 animate-bounce">
          🏁 Game Over!
        </h3>

        {leaderboard.map((entry) => (
          <div
            key={entry.username}
            className="text-lg font-semibold mb-3 border-b border-purple-300 pb-2"
          >
            🥇 Place {entry.place}: {entry.username} – {entry.score} pts
          </div>
        ))}

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-8 bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default FinalLeaderboardScreen;
