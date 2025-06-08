import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const FinalLeaderboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const leaderboard = location.state?.leaderboard || [];
  const celebrationMusicRef = useRef(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);

  const topThree = leaderboard.slice(0, 3);

  useEffect(() => {
    // השמעת מוזיקת חגיגה
    const celebrationMusic = new Audio();
    celebrationMusic.src =
      "https://www.bensound.com/bensound-music/bensound-happyrock.mp3";
    celebrationMusic.loop = true;
    celebrationMusic.volume = 0.3;
    celebrationMusicRef.current = celebrationMusic;

    // אירועי מוזיקה
    celebrationMusic.onplay = () => setIsMusicPlaying(true);
    celebrationMusic.onpause = () => setIsMusicPlaying(false);
    celebrationMusic.onended = () => setIsMusicPlaying(false);

    const playCelebrationMusic = async () => {
      try {
        await celebrationMusic.play();
        setIsMusicPlaying(true);
        console.log("🎉 Celebration music started");
      } catch (error) {
        console.log("🔇 Celebration music autoplay blocked:", error);
        setIsMusicPlaying(true); // נציג שהמוזיקה "מוכנה" להשמעה
      }
    };

    playCelebrationMusic();

    // ניקוי בעת יציאה מהקומפוננטה
    return () => {
      if (celebrationMusicRef.current) {
        celebrationMusicRef.current.pause();
        celebrationMusicRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50 text-gray-800 relative overflow-hidden">
      {/* אפקטים ויזואליים ברקע */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* תוכן ראשי */}
      <div className="relative z-10 bg-white/95 backdrop-blur-lg p-12 rounded-3xl shadow-2xl w-full max-w-3xl text-center border-2 border-purple-200">
        {/* כפתור מוזיקה */}
        <div className="absolute top-4 right-4">
          <button
            onClick={async () => {
              if (celebrationMusicRef.current) {
                if (isMusicPlaying) {
                  celebrationMusicRef.current.pause();
                  setIsMusicPlaying(false);
                } else {
                  try {
                    await celebrationMusicRef.current.play();
                    setIsMusicPlaying(true);
                  } catch (error) {
                    console.log("🔇 Music play failed:", error);
                  }
                }
              }
            }}
            className={`p-3 rounded-full transition-all duration-300 ${
              isMusicPlaying
                ? "bg-purple-500 text-white shadow-lg"
                : "bg-white/80 text-purple-600 hover:bg-purple-100"
            }`}
          >
            {isMusicPlaying ? (
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-1 h-3 bg-white rounded animate-pulse"></div>
                  <div
                    className="w-1 h-4 bg-white rounded animate-pulse"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1 h-2 bg-white rounded animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-xs ml-1">🎵</span>
              </div>
            ) : (
              <span className="text-xl">🎵</span>
            )}
          </button>
        </div>

        {/* אייקון וכותרת */}
        <div className="mb-8">
          <div className="text-8xl mb-4 animate-bounce">🏆</div>
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Game Complete!
          </h2>
          <p className="text-xl text-gray-600">
            Congratulations to all participants! 🎉
          </p>
        </div>

        {/* פודיום */}
        {topThree.length > 0 && (
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-gray-700 mb-6">
              🏅 Top Performers
            </h3>
            <div className="flex justify-center items-end gap-4 mb-8">
              {/* מקום שני */}
              {topThree[1] && (
                <div className="bg-gradient-to-t from-gray-300 to-gray-100 rounded-2xl p-6 text-center shadow-lg transform hover:scale-105 transition-transform">
                  <div className="text-4xl mb-2">🥈</div>
                  <div className="text-3xl mb-2">
                    {topThree[1].emoji || "🎮"}
                  </div>
                  <div className="text-lg font-bold text-gray-700">
                    {topThree[1].username}
                  </div>
                  <div className="text-2xl font-bold text-gray-600">
                    {topThree[1].score} pts
                  </div>
                  <div className="text-sm text-gray-500 mt-1">2nd Place</div>
                </div>
              )}

              {/* מקום ראשון */}
              {topThree[0] && (
                <div className="bg-gradient-to-t from-yellow-400 to-yellow-200 rounded-2xl p-8 text-center shadow-xl transform hover:scale-105 transition-transform relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      WINNER
                    </div>
                  </div>
                  <div className="text-6xl mb-3">👑</div>
                  <div className="text-4xl mb-3">
                    {topThree[0].emoji || "🎮"}
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    {topThree[0].username}
                  </div>
                  <div className="text-3xl font-bold text-gray-700">
                    {topThree[0].score} pts
                  </div>
                  <div className="text-sm text-gray-600 mt-2">Champion!</div>
                </div>
              )}

              {/* מקום שלישי */}
              {topThree[2] && (
                <div className="bg-gradient-to-t from-orange-300 to-orange-100 rounded-2xl p-6 text-center shadow-lg transform hover:scale-105 transition-transform">
                  <div className="text-4xl mb-2">🥉</div>
                  <div className="text-3xl mb-2">
                    {topThree[2].emoji || "🎮"}
                  </div>
                  <div className="text-lg font-bold text-gray-700">
                    {topThree[2].username}
                  </div>
                  <div className="text-2xl font-bold text-gray-600">
                    {topThree[2].score} pts
                  </div>
                  <div className="text-sm text-gray-500 mt-1">3rd Place</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* הודעה אם אין תוצאות */}
        {topThree.length === 0 && (
          <div className="bg-gray-50 rounded-2xl p-8 mb-8">
            <div className="text-6xl mb-4">🎮</div>
            <p className="text-xl text-gray-600">No scores to display</p>
            <p className="text-sm text-gray-500 mt-2">Better luck next time!</p>
          </div>
        )}

        {/* כפתורי פעולה */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            🏠 Back to Dashboard
          </button>

          <button
            onClick={() => navigate("/create-game")}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            🎮 Create New Game
          </button>
        </div>

        {/* הודעת תודה */}
        <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
          <p className="text-gray-600 italic">
            "Thanks for playing! Music brings us all together 🎵"
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinalLeaderboardPage;
