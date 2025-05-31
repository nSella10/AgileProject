import React, { useEffect, useRef, useState } from "react";

const PlayerAnswersScreen = ({
  playerAnswers,
  playerEmojis,
  songTitle,
  songArtist,
  songArtworkUrl,
  songPreviewUrl,
  onNextSong,
}) => {
  const audioRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // השמעת הפזמון ברקע כשמציגים את התשובות
    if (songPreviewUrl) {
      console.log("🎵 Playing song preview for answers review:", songPreviewUrl);

      const audio = new Audio(songPreviewUrl);
      audio.crossOrigin = "anonymous";
      audio.volume = 0.3; // עוצמה נמוכה יותר
      audio.loop = true; // חזרה על הפזמון
      audioRef.current = audio;

      const playAudio = async () => {
        try {
          await audio.play();
          console.log("✅ Answers review music started playing");
        } catch (error) {
          console.log("🔇 Answers review music autoplay blocked:", error);
        }
      };

      playAudio();
    }

    // ניקוי כשיוצאים מהקומפוננטה
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        console.log("🛑 Answers review music stopped");
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
      onNextSong();
    }, 1500); // הפוגה של 1.5 שניות
  };

  // יצירת רשימת התשובות
  const answersArray = Object.entries(playerAnswers || {});

  // קיבוץ לפי סוג התשובה
  const groupedAnswers = {
    songTitle: answersArray.filter(([_, data]) => data.answerType === 'songTitle'),
    artist: answersArray.filter(([_, data]) => data.answerType === 'artist'),
    lyrics: answersArray.filter(([_, data]) => data.answerType === 'lyrics'),
    none: answersArray.filter(([_, data]) => data.answerType === 'none')
  };

  const getAnswerTypeIcon = (type) => {
    switch (type) {
      case 'songTitle': return '🎵';
      case 'artist': return '🎤';
      case 'lyrics': return '📝';
      default: return '❌';
    }
  };

  const getAnswerTypeColor = (type) => {
    switch (type) {
      case 'songTitle': return 'from-green-500 to-emerald-600';
      case 'artist': return 'from-blue-500 to-indigo-600';
      case 'lyrics': return 'from-purple-500 to-violet-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  if (isTransitioning) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4 animate-spin">🎵</div>
          <h2 className="text-4xl font-bold text-white mb-2">Moving to next song...</h2>
          <p className="text-xl text-purple-200">Get ready for the next challenge!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400 opacity-5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="bg-gradient-to-br from-white/95 via-purple-50/95 to-pink-50/95 backdrop-blur-lg border-2 border-purple-300 text-center rounded-3xl shadow-2xl px-8 py-12 max-w-6xl w-full mx-4 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="text-6xl mb-4 animate-bounce">📊</div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            תשובות השחקנים
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            בואו נראה מה כל אחד זיהה...
          </p>
        </div>

        {/* Song Info */}
        <div className="mb-8 flex items-center justify-center gap-6 bg-white/60 rounded-2xl p-6 border border-purple-200">
          {songArtworkUrl && (
            <img
              src={songArtworkUrl}
              alt={songTitle}
              className="w-20 h-20 rounded-xl shadow-lg"
            />
          )}
          <div className="text-right">
            <h2 className="text-2xl font-bold text-purple-800 mb-1">{songTitle}</h2>
            <p className="text-lg text-gray-600">by {songArtist}</p>
          </div>
        </div>

        {/* Answers by Category */}
        <div className="space-y-6 mb-8">
          {/* Song Title Answers */}
          {groupedAnswers.songTitle.length > 0 && (
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 border border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center justify-center gap-2">
                🎵 זיהו את שם השיר
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedAnswers.songTitle.map(([username, data]) => (
                  <div key={username} className="bg-white/80 rounded-xl p-4 border border-green-300">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{playerEmojis[username] || "🎮"}</span>
                      <span className="font-bold text-green-800">{username}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">"{data.answer}"</p>
                    <p className="text-xs text-green-600 font-semibold">+{data.score} נקודות</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Artist Answers */}
          {groupedAnswers.artist.length > 0 && (
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center justify-center gap-2">
                🎤 זיהו את הזמר/להקה
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedAnswers.artist.map(([username, data]) => (
                  <div key={username} className="bg-white/80 rounded-xl p-4 border border-blue-300">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{playerEmojis[username] || "🎮"}</span>
                      <span className="font-bold text-blue-800">{username}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">"{data.answer}"</p>
                    <p className="text-xs text-blue-600 font-semibold">+{data.score} נקודות</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lyrics Answers */}
          {groupedAnswers.lyrics.length > 0 && (
            <div className="bg-gradient-to-r from-purple-100 to-violet-100 rounded-2xl p-6 border border-purple-200">
              <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center justify-center gap-2">
                📝 זיהו מילים מהשיר
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedAnswers.lyrics.map(([username, data]) => (
                  <div key={username} className="bg-white/80 rounded-xl p-4 border border-purple-300">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{playerEmojis[username] || "🎮"}</span>
                      <span className="font-bold text-purple-800">{username}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">"{data.answer}"</p>
                    <p className="text-xs text-purple-600 font-semibold">+{data.score} נקודות</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wrong Answers */}
          {groupedAnswers.none.length > 0 && (
            <div className="bg-gradient-to-r from-gray-100 to-slate-100 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                ❌ לא זיהו
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedAnswers.none.map(([username, data]) => (
                  <div key={username} className="bg-white/80 rounded-xl p-4 border border-gray-300">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{playerEmojis[username] || "🎮"}</span>
                      <span className="font-bold text-gray-800">{username}</span>
                    </div>
                    <p className="text-sm text-gray-600">"{data.answer}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Next Song Button */}
        <button
          onClick={handleNext}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto"
        >
          <span className="text-2xl">🎵</span>
          השיר הבא
          <span className="text-2xl">▶️</span>
        </button>
      </div>
    </div>
  );
};

export default PlayerAnswersScreen;
