import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const FinalLeaderboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const leaderboard = location.state?.leaderboard || [];

  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-purple-100 to-yellow-50 text-gray-800">
      <div className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-xl text-center border border-purple-300">
        <h2 className="text-4xl font-bold text-purple-800 mb-8 animate-bounce">
          🏁 Final Leaderboard
        </h2>

        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200 mb-8">
          {topThree.length === 0 ? (
            <p className="text-gray-500 text-base">No scores to display.</p>
          ) : (
            <ul className="space-y-4 text-purple-900 font-semibold text-xl text-left">
              {topThree.map((entry, index) => (
                <li key={entry.username}>
                  🥇 Place {index + 1}:{" "}
                  <span className="font-bold">{entry.username}</span> —{" "}
                  {entry.score} pts
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-2xl text-lg shadow-md transition duration-200"
        >
          🔙 Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default FinalLeaderboardPage;
