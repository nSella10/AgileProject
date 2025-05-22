import React from "react";
import classroomBg from "../../assets/classroom-bg.png";

const RoundRevealAnswerScreen = ({ songTitle, onNext }) => {
  console.log(songTitle);

  return (
    <div
      style={{
        backgroundImage: `url(${classroomBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        width: "100%",
      }}
      className="flex items-center justify-center"
    >
      <div className="bg-white border border-red-300 text-center text-red-700 rounded-2xl shadow-2xl px-8 py-10 max-w-lg w-full mx-4">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          ❌ No one guessed it.
        </h2>

        <p className="text-lg text-gray-700 mb-2">The correct answer was:</p>
        <p className="text-2xl font-bold text-purple-700 mb-6">{songTitle}</p>

        <button
          onClick={onNext}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          ▶️ Next Song
        </button>
      </div>
    </div>
  );
};

export default RoundRevealAnswerScreen;
