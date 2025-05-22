import React from "react";

const GamePlayScreen = ({
  guess,
  statusMsg,
  onGuessChange,
  onSubmitGuess,
  hasGuessed,
  isWaiting,
  isGameOver,
  songNumber,
  totalSongs,
  submitted,
  timeLeft,
  roundFailedForUser,
  guessResult,
}) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const maxTime = 15;
  const progress = timeLeft ? (timeLeft / maxTime) * circumference : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-200 text-black px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center border border-purple-300 relative">
        <div className="text-gray-700 font-semibold text-sm mb-2 tracking-wide uppercase">
          🎵 Song {songNumber} of {totalSongs}
        </div>

        <h2 className="text-4xl font-extrabold mb-4 text-purple-700 drop-shadow">
          🎧 Guess the Song!
        </h2>

        {!roundFailedForUser && (
          <p className="text-base text-gray-700 mb-6 font-medium leading-relaxed">
            {statusMsg}
          </p>
        )}

        {timeLeft && !hasGuessed && !isWaiting && !isGameOver && (
          <div className="flex flex-col items-center justify-center mb-6">
            <svg width="100" height="100" className="mb-2">
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#ddd"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="20"
                fill="#4b5563"
              >
                {timeLeft}s
              </text>
            </svg>
          </div>
        )}

        {isGameOver ? (
          <p className="text-2xl text-green-700 font-bold mt-6">
            🎉 Game over! Thanks for playing.
          </p>
        ) : isWaiting ? (
          <div className="text-lg mt-4 text-gray-600 italic animate-pulse">
            {roundFailedForUser
              ? "❌ No one guessed it. Waiting for host..."
              : "⏳ Waiting for the next song..."}
          </div>
        ) : hasGuessed ? (
          <>
            <p className="text-gray-700 mt-4 font-medium text-lg">
              🚀 Guess submitted!
            </p>
            {guessResult === "correct" && (
              <p className="text-green-600 mt-2 font-bold text-lg">
                ✅ Correct!
              </p>
            )}
            {guessResult === "wrong" && (
              <p className="text-red-600 mt-2 font-bold text-lg">
                ❌ Incorrect
              </p>
            )}
          </>
        ) : (
          <>
            <input
              className="mt-2 mb-4 p-3 border-2 border-purple-400 rounded-xl w-full text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150"
              type="text"
              value={guess}
              onChange={(e) => onGuessChange(e.target.value)}
              placeholder="Type your guess here..."
            />
            <button
              onClick={onSubmitGuess}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition duration-200 text-lg flex items-center justify-center gap-2"
            >
              🚀 Submit Guess
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GamePlayScreen;
