import React from "react";

const HostGameScreen = ({
  statusMsg,
  waitingForNext,
  onNextRound,
  onReplayLonger,
  roundFailed,
  roundSucceeded,
  countdown,
}) => {
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

      <div className="relative z-10 w-full max-w-2xl">
        {/* Main Host Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20 shadow-2xl text-center">
          {/* Host Badge */}
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              👑 HOST CONTROL
            </div>
          </div>

          {/* Status Message */}
          <div className="bg-blue-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400 border-opacity-30 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {statusMsg}
            </h2>
          </div>

          {/* Countdown Timer */}
          {countdown !== null && (
            <div className="bg-orange-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 border border-orange-400 border-opacity-30 mb-6">
              <div className="text-4xl mb-2">⏱️</div>
              <p className="text-white font-bold text-2xl animate-pulse">
                Time left: {countdown}s
              </p>
            </div>
          )}

          {/* הסרנו את הכפתור הכתום - השמעה תמיד אוטומטית */}

          {/* Action Buttons */}
          {waitingForNext && (
            <div className="space-y-6">
              {roundFailed ? (
                <div className="bg-red-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 border border-red-400 border-opacity-30">
                  <div className="text-5xl mb-4">❌</div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    No one guessed it!
                  </h3>
                  <p className="text-red-200 font-medium text-lg mb-6">
                    😕 Want to replay it longer?
                  </p>
                  <button
                    onClick={onReplayLonger}
                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto"
                  >
                    <span className="text-2xl">🔁</span>
                    Replay with longer snippet
                    <span className="text-2xl">🎵</span>
                  </button>
                </div>
              ) : roundSucceeded ? (
                <div className="bg-green-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 border border-green-400 border-opacity-30">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Someone got it!
                  </h3>
                  <p className="text-green-200 font-medium text-lg mb-6">
                    Continue to next song?
                  </p>
                  <button
                    onClick={onNextRound}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto"
                  >
                    <span className="text-2xl">▶️</span>
                    Next Song
                    <span className="text-2xl">🎵</span>
                  </button>
                </div>
              ) : (
                <div className="bg-blue-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400 border-opacity-30">
                  <div className="text-5xl mb-4">🎵</div>
                  <button
                    onClick={onNextRound}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto"
                  >
                    <span className="text-2xl">▶️</span>
                    Next Song
                    <span className="text-2xl">🎵</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostGameScreen;
