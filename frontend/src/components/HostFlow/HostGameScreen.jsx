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
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-xl border border-purple-300 text-center">
        <h2 className="text-3xl font-extrabold text-purple-800 mb-6">
          {statusMsg}
        </h2>

        {countdown !== null && (
          <p className="text-purple-700 font-semibold text-xl animate-pulse mb-4">
            ⏱️ Time left: {countdown}s
          </p>
        )}

        {waitingForNext && (
          <div className="mt-6">
            {roundFailed ? (
              <>
                <p className="text-red-600 font-medium text-lg mb-4">
                  😕 No one guessed it. Want to replay it longer?
                </p>
                <button
                  onClick={onReplayLonger}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl text-lg"
                >
                  🔁 Replay with longer snippet
                </button>
              </>
            ) : roundSucceeded ? (
              <>
                <p className="text-green-700 font-medium text-lg mb-4">
                  🎉 Someone got it! Continue to next song?
                </p>
                <button
                  onClick={onNextRound}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl text-lg"
                >
                  ▶️ Next Song
                </button>
              </>
            ) : (
              <button
                onClick={onNextRound}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-lg"
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
