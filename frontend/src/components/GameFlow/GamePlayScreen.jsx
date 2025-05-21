import React from "react";

const GamePlayScreen = ({
  guess,
  statusMsg,
  onGuessChange,
  onSubmitGuess,
  hasGuessed,
  isWaiting,
  isGameOver,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-200 text-black px-4">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-4xl font-extrabold mb-4 text-purple-700 drop-shadow">
          🎧 Guess the Song!
        </h2>

        <p className="text-lg text-gray-800 mb-6 font-medium">{statusMsg}</p>

        {isGameOver ? (
          <>
            <p className="text-2xl text-green-700 font-bold mt-6">
              🎉 Game over! Thanks for playing.
            </p>
            <p className="text-md text-gray-600 mt-2">
              You can now close this tab or return to the home screen.
            </p>
          </>
        ) : isWaiting ? (
          <p className="text-gray-500 italic mt-6 text-lg">
            ⏳ Waiting for the next song...
          </p>
        ) : hasGuessed ? (
          <p className="text-gray-600 italic mt-4 text-lg">
            ✅ You already guessed this round.
          </p>
        ) : (
          <>
            <input
              className="mt-2 mb-4 p-3 border-2 border-purple-300 rounded-lg w-full text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              type="text"
              value={guess}
              onChange={(e) => onGuessChange(e.target.value)}
              placeholder="Type your guess here..."
            />
            <button
              onClick={onSubmitGuess}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition duration-200"
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
