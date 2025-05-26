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
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const maxTime = 15;
  const progress = timeLeft ? (timeLeft / maxTime) * circumference : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400 opacity-5 rounded-full blur-3xl animate-pulse"></div>

        {/* Floating music notes */}
        <div className="absolute top-1/4 left-1/4 text-4xl text-white opacity-20 animate-bounce">
          🎵
        </div>
        <div
          className="absolute top-3/4 right-1/4 text-3xl text-white opacity-20 animate-bounce"
          style={{ animationDelay: "1s" }}
        >
          🎶
        </div>
        <div
          className="absolute top-1/2 left-1/6 text-2xl text-white opacity-20 animate-bounce"
          style={{ animationDelay: "2s" }}
        >
          🎼
        </div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Main Game Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20 shadow-2xl text-center">
          {/* Song Progress Header */}
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              🎵 SONG {songNumber} OF {totalSongs}
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            🎧 Guess the Song!
          </h1>

          {/* Status Message */}
          {!roundFailedForUser && (
            <div className="bg-blue-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 border border-blue-400 border-opacity-30 mb-6">
              <p className="text-white font-medium text-lg">🕵️ {statusMsg}</p>
            </div>
          )}

          {/* Timer Circle */}
          {timeLeft && !hasGuessed && !isWaiting && !isGameOver && (
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="relative">
                <svg width="120" height="120" className="transform -rotate-90">
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">
                      {timeLeft}
                    </div>
                    <div className="text-sm text-purple-200">seconds</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-purple-200 text-sm animate-pulse">
                ⏰ Time is ticking!
              </div>
            </div>
          )}

          {/* Game States */}
          {isGameOver ? (
            <div className="bg-green-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 border border-green-400 border-opacity-30">
              <div className="text-4xl mb-4">🎉</div>
              <p className="text-2xl text-white font-bold">Game Over!</p>
              <p className="text-green-200 mt-2">Thanks for playing!</p>
            </div>
          ) : isWaiting ? (
            <div className="bg-yellow-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400 border-opacity-30">
              <div className="text-4xl mb-4 animate-spin">⏳</div>
              <p className="text-white font-medium text-lg">
                {roundFailedForUser
                  ? "❌ No one guessed it. Waiting for host..."
                  : "⏳ Waiting for the next song..."}
              </p>
            </div>
          ) : hasGuessed ? (
            <div className="space-y-4">
              <div className="bg-blue-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400 border-opacity-30">
                <div className="text-4xl mb-4">🚀</div>
                <p className="text-white font-medium text-lg">
                  Guess submitted!
                </p>
              </div>

              {guessResult === "correct" && (
                <div className="bg-green-500 bg-opacity-30 backdrop-blur-sm rounded-2xl p-4 border border-green-400 border-opacity-50 animate-pulse">
                  <div className="text-3xl mb-2">✅</div>
                  <p className="text-green-200 font-bold text-xl">Correct!</p>
                </div>
              )}

              {guessResult === "wrong" && (
                <div className="bg-red-500 bg-opacity-30 backdrop-blur-sm rounded-2xl p-4 border border-red-400 border-opacity-50">
                  <div className="text-3xl mb-2">❌</div>
                  <p className="text-red-200 font-bold text-xl">Incorrect</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Input Field */}
              <div className="relative">
                <input
                  className="w-full bg-white bg-opacity-20 backdrop-blur-sm border-2 border-white border-opacity-30 rounded-2xl px-6 py-4 text-white text-lg placeholder-purple-200 focus:outline-none focus:border-purple-400 focus:bg-opacity-30 transition-all duration-300"
                  type="text"
                  value={guess}
                  onChange={(e) => onGuessChange(e.target.value)}
                  placeholder="Type your guess here..."
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300">
                  🎵
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={onSubmitGuess}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-xl">🚀</span>
                Submit Guess
                <span className="text-xl">🎯</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePlayScreen;
