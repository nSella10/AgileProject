import React, { useEffect, useRef, useState } from "react";

const HostWaitingScreen = ({ roomCode, players, onStart }) => {
  const backgroundMusicRef = useRef(null);
  const playerJoinSoundRef = useRef(null);
  const previousPlayerCountRef = useRef(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showJoinEffect, setShowJoinEffect] = useState(false);

  useEffect(() => {
    // יצירת מוזיקת רקע נחמדה
    const backgroundMusic = new Audio();
    // מוזיקת רקע נעימה ורגועה - Upbeat Waiting Music
    backgroundMusic.src =
      "https://www.bensound.com/bensound-music/bensound-ukulele.mp3";
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.25; // נמוך כדי לא להפריע
    backgroundMusicRef.current = backgroundMusic;

    // צליל הצטרפות שחקן - צליל נעים של הודעה
    const playerJoinSound = new Audio();
    // צליל notification נעים
    playerJoinSound.src =
      "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav";
    playerJoinSound.volume = 0.5;
    playerJoinSoundRef.current = playerJoinSound;

    // התחלת מוזיקת הרקע
    const playBackgroundMusic = async () => {
      try {
        await backgroundMusic.play();
        setIsMusicPlaying(true);
        console.log("🎵 Background music started");
      } catch (error) {
        console.log("🔇 Background music autoplay blocked:", error);
        // גם אם autoplay נחסם, נציג שהמוזיקה "מוכנה" להשמעה
        setIsMusicPlaying(true);
      }
    };

    // אירועי מוזיקה
    backgroundMusic.onplay = () => setIsMusicPlaying(true);
    backgroundMusic.onpause = () => setIsMusicPlaying(false);
    backgroundMusic.onended = () => setIsMusicPlaying(false);

    // נתחיל מיד עם המוזיקה
    playBackgroundMusic();

    // ניקוי בעת יציאה מהקומפוננטה
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
      if (playerJoinSoundRef.current) {
        playerJoinSoundRef.current = null;
      }
    };
  }, []);

  // אתחול ספירת השחקנים בטעינה ראשונה
  useEffect(() => {
    // אתחול הספירה לפי מספר השחקנים הנוכחי
    previousPlayerCountRef.current = players.length;
    console.log(`🔄 Initialized player count to: ${players.length}`);
  }, []); // רק בטעינה ראשונה

  // זיהוי הצטרפות שחקן חדש
  useEffect(() => {
    console.log(
      `👥 Players count changed: ${previousPlayerCountRef.current} → ${players.length}`
    );
    console.log(
      "👥 Current players:",
      players.map((p) => p.username)
    );

    // בדיקה שזה לא הטעינה הראשונה ושיש עלייה במספר השחקנים
    if (
      players.length > previousPlayerCountRef.current &&
      previousPlayerCountRef.current >= 0
    ) {
      // שחקן חדש הצטרף!
      console.log("🎉 New player detected!");

      const playJoinSound = async () => {
        try {
          // יצירת צליל notification באמצעות Web Audio API
          const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          // צליל נעים של notification - שתי תווים
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(
            1000,
            audioContext.currentTime + 0.1
          );

          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(
            0.3,
            audioContext.currentTime + 0.01
          );
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.3
          );

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);

          console.log("🔔 Player join sound played successfully");
        } catch (error) {
          console.log("🔇 Player join sound failed:", error);
        }
      };

      // הצגת אפקט ויזואלי
      setShowJoinEffect(true);
      setTimeout(() => setShowJoinEffect(false), 2000); // 2 שניות

      playJoinSound();
    }

    previousPlayerCountRef.current = players.length;
  }, [players.length]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-gray-800 relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400 opacity-5 rounded-full blur-3xl animate-pulse"></div>
      </div>
      {/* אפקט הצטרפות שחקן */}
      {showJoinEffect && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl animate-bounce text-xl font-bold">
            🎉 New Player Joined! 🎉
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-purple-100/95 via-pink-50/95 to-blue-100/95 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-xl text-center border border-purple-300 relative z-10">
        {/* כפתור מוזיקה */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={async () => {
              if (backgroundMusicRef.current) {
                if (isMusicPlaying) {
                  backgroundMusicRef.current.pause();
                  setIsMusicPlaying(false);
                } else {
                  try {
                    await backgroundMusicRef.current.play();
                    setIsMusicPlaying(true);
                  } catch (error) {
                    console.log("🔇 Music play failed:", error);
                  }
                }
              }
            }}
            className={`p-2 rounded-full transition-all duration-300 ${
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
              <span className="text-lg">🎵</span>
            )}
          </button>
        </div>
        {/* Game PIN */}
        <h2 className="text-2xl font-semibold tracking-wide text-gray-700 mb-1">
          🎮 Game PIN
        </h2>
        <p className="text-5xl font-extrabold text-purple-800 mb-8 tracking-wider">
          {roomCode || "------"}
        </p>

        {/* Players List */}
        {players.length > 0 && (
          <>
            <div className="flex flex-wrap justify-center gap-6 mb-6">
              {players.map((player, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center bg-purple-100 px-6 py-4 rounded-2xl shadow-lg w-28 h-28"
                >
                  <div className="text-4xl mb-1">{player.emoji}</div>
                  <span className="font-semibold text-lg text-purple-900">
                    {player.username}
                  </span>
                </div>
              ))}
            </div>

            {/* Start Game Button */}
            <button
              className="mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 text-lg rounded-2xl transition duration-200 shadow-md"
              onClick={onStart}
            >
              🚀 Start Game
            </button>
          </>
        )}

        {/* Waiting Message */}
        <div className="text-base mt-8 text-gray-600 italic">
          Waiting for participants...
        </div>
      </div>
    </div>
  );
};

export default HostWaitingScreen;
