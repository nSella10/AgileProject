import React, { useEffect, useRef, useState } from "react";

const RoundRevealAnswerScreen = ({
  songTitle,
  songPreviewUrl,
  songArtist,
  songArtworkUrl,
  onNext,
}) => {
  console.log(songTitle);
  const audioRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // השמעת הפזמון ברקע כשמגלים את התשובה
    if (songPreviewUrl) {
      console.log("🎵 Playing song preview for answer reveal:", songPreviewUrl);

      const audio = new Audio(songPreviewUrl);
      audio.crossOrigin = "anonymous";
      audio.volume = 0.4; // עוצמה בינונית
      audio.loop = false; // לא חוזרים על הפזמון - נותנים לו להתנגן עד הסוף
      audioRef.current = audio;

      // כשהשיר נגמר, נתחיל אותו שוב מההתחלה
      audio.onended = () => {
        if (audioRef.current === audio) {
          audio.currentTime = 0;
          audio.play().catch((error) => {
            console.log("🔇 Audio replay failed:", error);
          });
        }
      };

      const playAudio = async () => {
        try {
          await audio.play();
          console.log("✅ Answer reveal music started playing");
        } catch (error) {
          console.log("🔇 Answer reveal music autoplay blocked:", error);
        }
      };

      playAudio();
    }

    // ניקוי כשיוצאים מהקומפוננטה
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        console.log("🛑 Answer reveal music stopped");
      }
    };
  }, [songPreviewUrl]);

  const handleNext = () => {
    setIsTransitioning(true);
    // עצירת המוזיקה לפני מעבר לשיר הבא
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    // הפוגה קצרה לפני מעבר לשיר הבא
    setTimeout(() => {
      setIsTransitioning(false);
      onNext();
    }, 1500); // הפוגה של 1.5 שניות
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400 opacity-5 rounded-full blur-3xl animate-pulse"></div>

        {/* Floating musical notes */}
        <div className="absolute top-1/4 left-1/4 text-6xl text-purple-300 opacity-30 animate-bounce">
          🎵
        </div>
        <div className="absolute top-3/4 right-1/4 text-4xl text-pink-300 opacity-40 animate-pulse">
          🎶
        </div>
        <div
          className="absolute bottom-1/4 left-1/3 text-5xl text-blue-300 opacity-20 animate-bounce"
          style={{ animationDelay: "1s" }}
        >
          🎼
        </div>
      </div>

      <div className="bg-gradient-to-br from-white/95 via-purple-50/95 to-pink-50/95 backdrop-blur-lg border-2 border-purple-300 text-center rounded-3xl shadow-2xl px-12 py-16 max-w-5xl w-full mx-4 relative z-10">
        {/* Header with animated icon */}
        <div className="mb-8">
          <div className="text-8xl mb-4 animate-pulse">🎭</div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            🎵 Song Reveal! 🎵
          </h1>
          <p className="text-2xl text-gray-600 font-medium">
            Here's what was playing...
          </p>
        </div>

        {/* Song showcase card */}
        <div className="bg-gradient-to-br from-purple-100/80 via-pink-100/80 to-blue-100/80 backdrop-blur-sm rounded-3xl p-10 mb-10 border-2 border-purple-300 shadow-xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 text-3xl opacity-30">🎵</div>
          <div className="absolute top-4 right-4 text-3xl opacity-30">🎶</div>
          <div className="absolute bottom-4 left-4 text-3xl opacity-30">🎼</div>
          <div className="absolute bottom-4 right-4 text-3xl opacity-30">
            🎤
          </div>

          {/* Song artwork */}
          {songArtworkUrl && (
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img
                  src={songArtworkUrl.replace("100x100", "400x400")}
                  alt={`${songTitle} artwork`}
                  className="w-64 h-64 rounded-3xl shadow-2xl border-4 border-white transform hover:scale-105 transition-all duration-500 hover:rotate-1"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                {/* Glowing effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-pulse"></div>
              </div>
            </div>
          )}

          {/* Song details */}
          <div className="space-y-4 mb-6">
            <h2 className="text-5xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 bg-clip-text text-transparent leading-tight">
              {songTitle}
            </h2>
            {songArtist && (
              <p className="text-3xl font-bold text-purple-600">
                by {songArtist}
              </p>
            )}
          </div>

          {/* Music playing indicator */}
          <div className="flex items-center justify-center gap-3 bg-white/60 rounded-2xl py-4 px-6 backdrop-blur-sm">
            <div className="flex gap-1">
              <div className="w-2 h-6 bg-purple-500 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-8 bg-purple-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-4 bg-purple-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-7 bg-purple-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.3s" }}
              ></div>
              <div
                className="w-2 h-5 bg-purple-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <span className="text-lg font-bold text-purple-700">
              🎵 Now Playing Full Song 🎵
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={handleNext}
            disabled={isTransitioning}
            className={`group px-12 py-5 rounded-3xl font-bold text-2xl transition-all duration-300 shadow-2xl transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden ${
              isTransitioning
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 hover:shadow-purple-500/25"
            } text-white`}
          >
            <span className="relative z-10 flex items-center gap-3">
              <span className="text-3xl">{isTransitioning ? "⏳" : "🚀"}</span>
              {isTransitioning
                ? "Preparing Next Song..."
                : "Continue to Next Song"}
              <span className="text-3xl">{isTransitioning ? "⏳" : "🎵"}</span>
            </span>
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>

          {/* Encouraging message */}
          <div className="text-center">
            <p className="text-xl text-gray-600 font-medium mb-2">
              🎯 Keep the music flowing!
            </p>
            <p className="text-lg text-purple-600 italic">
              Every song is a new chance to shine ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundRevealAnswerScreen;
