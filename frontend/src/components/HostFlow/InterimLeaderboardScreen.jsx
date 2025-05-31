import React, { useEffect, useRef, useState } from "react";

const InterimLeaderboardScreen = ({
  scores,
  onNextRound,
  songPreviewUrl,
  songTitle,
  songArtist,
  songArtworkUrl,
  playerEmojis = {},
  playerAnswers = {},
  onViewAnswers,
}) => {
  const audioRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // השמעת הפזמון ברקע כשמישהו מצליח לנחש
    if (songPreviewUrl) {
      console.log("🎉 Playing success celebration music:", songPreviewUrl);

      const audio = new Audio(songPreviewUrl);
      audio.crossOrigin = "anonymous";
      audio.volume = 0.3; // עוצמה נמוכה יותר כדי לא להפריע
      audio.loop = true; // חזרה על הפזמון
      audioRef.current = audio;

      const playAudio = async () => {
        try {
          await audio.play();
          console.log("✅ Success celebration music started playing");
        } catch (error) {
          console.log("🔇 Success celebration music autoplay blocked:", error);
        }
      };

      playAudio();
    }

    // ניקוי כשיוצאים מהקומפוננטה
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        console.log("🛑 Success celebration music stopped");
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
      onNextRound();
    }, 1500); // הפוגה של 1.5 שניות
  };
  // יצירת רשימה מלאה של כל השחקנים כולל אלה עם 0 נקודות
  const allPlayers = Object.entries(scores || {});

  // מיון לפי ניקוד (גבוה לנמוך) ואז לפי שם
  const sorted = allPlayers
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1]; // מיון לפי ניקוד
      return a[0].localeCompare(b[0]); // מיון לפי שם אם הניקוד זהה
    })
    .slice(0, 10); // טופ 10

  console.log("🏆 InterimLeaderboardScreen - scores:", scores);
  console.log("🏆 InterimLeaderboardScreen - allPlayers:", allPlayers);
  console.log("🏆 InterimLeaderboardScreen - sorted:", sorted);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400 opacity-5 rounded-full blur-3xl animate-pulse"></div>

        {/* Floating trophies */}
        <div className="absolute top-1/4 left-1/4 text-6xl text-yellow-300 opacity-30 animate-bounce">
          🏆
        </div>
        <div className="absolute top-3/4 right-1/4 text-4xl text-gold-300 opacity-40 animate-pulse">
          🥇
        </div>
        <div
          className="absolute bottom-1/4 left-1/3 text-5xl text-silver-300 opacity-20 animate-bounce"
          style={{ animationDelay: "1s" }}
        >
          🥈
        </div>
      </div>

      <div className="bg-gradient-to-br from-white/95 via-purple-50/95 to-pink-50/95 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-5xl text-center border-2 border-purple-300 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="text-8xl mb-4 animate-bounce">🏆</div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
            🎉 LEADERBOARD 🎉
          </h1>
          <p className="text-2xl text-gray-600 font-medium">
            See who's leading the music challenge!
          </p>
        </div>

        {/* מסך חשיפת השיר המדהים */}
        {songTitle && (
          <div className="bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50 rounded-3xl p-8 mb-8 border-2 border-purple-200 shadow-xl">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-lg font-bold shadow-lg">
                ✅ Correct Answer
              </div>
            </div>

            {/* תמונת השיר */}
            {songArtworkUrl && (
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img
                    src={songArtworkUrl.replace("100x100", "300x300")} // גודל גדול יותר
                    alt={`${songTitle} artwork`}
                    className="w-40 h-40 rounded-3xl shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  {/* אפקט זוהר */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-purple-400/20 to-pink-400/20 pointer-events-none"></div>
                </div>
              </div>
            )}

            {/* פרטי השיר */}
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {songTitle}
              </h2>
              {songArtist && (
                <p className="text-2xl text-gray-700 font-medium">
                  by{" "}
                  <span className="text-purple-600 font-bold">
                    {songArtist}
                  </span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-gradient-to-br from-purple-100/80 via-pink-100/80 to-blue-100/80 backdrop-blur-sm rounded-3xl p-8 mb-8 border-2 border-purple-300 shadow-xl">
          <h3 className="text-3xl font-bold text-purple-700 mb-6">
            🏅 Current Standings
          </h3>

          {sorted.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-2xl text-gray-600 font-medium">
                No players yet!
              </p>
              <p className="text-lg text-gray-500">
                Waiting for the first brave souls...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sorted.map(([username, score], index) => {
                const isFirst = index === 0;
                const isSecond = index === 1;
                const isThird = index === 2;

                let rankIcon = "🏅";
                let bgColor = "bg-white/60";
                let textColor = "text-gray-700";
                let borderColor = "border-gray-300";

                if (isFirst) {
                  rankIcon = "🥇";
                  bgColor =
                    "bg-gradient-to-r from-yellow-200/80 to-yellow-300/80";
                  textColor = "text-yellow-800";
                  borderColor = "border-yellow-400";
                } else if (isSecond) {
                  rankIcon = "🥈";
                  bgColor = "bg-gradient-to-r from-gray-200/80 to-gray-300/80";
                  textColor = "text-gray-700";
                  borderColor = "border-gray-400";
                } else if (isThird) {
                  rankIcon = "🥉";
                  bgColor =
                    "bg-gradient-to-r from-orange-200/80 to-orange-300/80";
                  textColor = "text-orange-800";
                  borderColor = "border-orange-400";
                }

                return (
                  <div
                    key={username}
                    className={`${bgColor} ${textColor} ${borderColor} border-2 rounded-2xl p-4 flex items-center justify-between transition-all duration-300 hover:scale-105 shadow-lg`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{rankIcon}</span>
                      <span className="text-3xl">
                        {playerEmojis[username] || "🎮"}
                      </span>
                      <div className="text-left">
                        <span className="text-2xl font-bold">{username}</span>
                        <div className="text-sm opacity-75">
                          Rank #{index + 1}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black">{score || 0}</div>
                      <div className="text-sm opacity-75">points</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* View Answers Button */}
          {Object.keys(playerAnswers).length > 0 && onViewAnswers && (
            <button
              onClick={onViewAnswers}
              disabled={isTransitioning}
              className="group px-8 py-4 rounded-3xl font-bold text-xl transition-all duration-300 shadow-2xl transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 hover:shadow-purple-500/25 text-white"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span className="text-2xl">📊</span>
                צפה בתשובות
                <span className="text-2xl">👀</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-purple-400/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          )}

          {/* Next Song Button */}
          <button
            onClick={handleNext}
            disabled={isTransitioning}
            className={`group px-12 py-5 rounded-3xl font-bold text-2xl transition-all duration-300 shadow-2xl transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden ${
              isTransitioning
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 hover:shadow-green-500/25"
            } text-white`}
          >
            <span className="relative z-10 flex items-center gap-3">
              <span className="text-3xl">{isTransitioning ? "⏳" : "🎵"}</span>
              {isTransitioning ? "Preparing Next Song..." : "Next Song"}
              <span className="text-3xl">{isTransitioning ? "⏳" : "🚀"}</span>
            </span>
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-green-400/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterimLeaderboardScreen;
