import React from "react";
import classroomBg from "../../assets/classroom-bg.png";

const WaitingScreen = ({ playerEmoji, username }) => {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen text-white text-center px-4"
      style={{
        backgroundImage: `url(${classroomBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* תוכן */}
      <div className="relative z-10 flex flex-col items-center bg-white/10 backdrop-blur-md px-8 py-10 rounded-xl shadow-xl border border-white/20">
        {/* דמות השחקן */}
        <div className="w-28 h-28 rounded-lg bg-purple-700 text-white text-5xl flex items-center justify-center mb-4">
          {playerEmoji || "🎮"}
        </div>

        {/* שם השחקן */}
        <h2 className="text-3xl font-extrabold mb-2 drop-shadow-lg">
          {username}
        </h2>

        {/* טקסט משני */}
        <p className="text-sm text-white/90">
          You're in! See your nickname on screen?
        </p>
      </div>
    </div>
  );
};

export default WaitingScreen;
