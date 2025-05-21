import React from "react";

const HostGameScreen = ({
  statusMsg,
  scores,
  waitingForNext,
  onNextRound,
  roundFailed,
  roundSucceeded,
  countdown,
}) => {
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="launch-game-container">
      <div className="info-box">
        <div className="status-msg mt-4 text-lg font-semibold text-white">
          {statusMsg}
        </div>

        {countdown !== null && (
          <div className="text-black text-center text-xl font-bold mt-2 animate-pulse">
            ⏱️ Time left: {countdown}s
          </div>
        )}

        <div className="mt-6 bg-black/30 text-white p-4 rounded-lg max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-2 text-center">
            🏆 Live Leaderboard
          </h3>
          {sorted.length === 0 ? (
            <p className="text-center text-sm text-gray-300">No scores yet.</p>
          ) : (
            <ul className="text-left">
              {sorted.map(([username, score], index) => (
                <li key={username}>
                  {index + 1}. {username} – {score} pts
                </li>
              ))}
            </ul>
          )}
        </div>

        {waitingForNext && (
          <div className="text-center mt-6">
            {roundFailed ? (
              <>
                <p className="text-red-200 font-medium mb-2">
                  😕 No one guessed it. Want to play it longer?
                </p>
                <button
                  onClick={onNextRound}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                >
                  🔁 Replay with longer snippet
                </button>
              </>
            ) : roundSucceeded ? (
              <>
                <p className="text-green-200 font-medium mb-2">
                  🎉 Someone got it! Continue to next song?
                </p>
                <button
                  onClick={onNextRound}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                >
                  ▶️ Next Song
                </button>
              </>
            ) : (
              <button
                onClick={onNextRound}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                ▶️ Next Song
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostGameScreen;
