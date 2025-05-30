import React, { useState, useEffect, useRef } from "react";
import { getSocket } from "../../socket";

const ImprovedHostGameScreen = ({
  statusMsg,
  waitingForNext,
  onNextRound,
  onReplayLonger,
  roundFailed,
  roundSucceeded,
  countdown,
  playersAnswered = 0,
  totalPlayers = 0,
  guessTimeLimit = 15,
}) => {
  console.log("🎮 ImprovedHostGameScreen props:", {
    countdown,
    guessTimeLimit,
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [tensionMusicEnabled, setTensionMusicEnabled] = useState(true);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const tensionMusicRef = useRef(null);
  const [isTensionMusicPlaying, setIsTensionMusicPlaying] = useState(false);
  const [tensionMusicReady, setTensionMusicReady] = useState(false);

  useEffect(() => {
    // יצירת צלילים עם Web Audio API
    const createSound = (frequency, duration, type = "correct") => {
      try {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        if (type === "correct") {
          // צליל חיובי - מלודיה עולה
          oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
          oscillator.frequency.setValueAtTime(
            659,
            audioContext.currentTime + 0.1
          ); // E5
          oscillator.frequency.setValueAtTime(
            784,
            audioContext.currentTime + 0.2
          ); // G5
        } else {
          // צליל שלילי - טון יורד
          oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(
            300,
            audioContext.currentTime + 0.1
          );
        }

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          0.3,
          audioContext.currentTime + 0.01
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + duration
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);

        return Promise.resolve();
      } catch (error) {
        console.log("Sound creation failed:", error);
        return Promise.reject(error);
      }
    };

    correctSoundRef.current = () => createSound(523, 0.3, "correct");
    wrongSoundRef.current = () => createSound(400, 0.2, "wrong");

    // יצירת מוזיקת מתח פשוטה עם Web Audio API
    const createTensionMusic = () => {
      console.log("🎵 Creating tension music object");

      let isPlaying = false;
      let intervalId = null;

      const playBeep = () => {
        try {
          // יצירת צליל פשוט עם Web Audio API
          const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.frequency.setValueAtTime(150, audioContext.currentTime); // תדר נמוך
          oscillator.type = "sine";

          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(
            0.03,
            audioContext.currentTime + 0.1
          );
          gainNode.gain.linearRampToValueAtTime(
            0,
            audioContext.currentTime + 0.5
          );

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);

          console.log("🎵 Tension beep played");
        } catch (error) {
          console.log("🔇 Audio beep failed:", error.message);
        }
      };

      return {
        play: () => {
          console.log("🎵 Tension music - PLAY called");
          if (!isPlaying) {
            isPlaying = true;
            playBeep(); // ביפ ראשון מיד
            intervalId = setInterval(playBeep, 4000); // ביפ כל 4 שניות
          }
        },
        pause: () => {
          console.log("🛑 Tension music - PAUSE called");
          isPlaying = false;
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
        },
        volume: 0.03,
      };
    };

    tensionMusicRef.current = createTensionMusic();
    setTensionMusicReady(true);
    console.log("🎵 Tension music object created and ready");

    // ניקוי בעת יציאה מהקומפוננטה
    return () => {
      if (tensionMusicRef.current) {
        tensionMusicRef.current.pause();
        tensionMusicRef.current = null;
      }
    };
  }, []);

  // פונקציה להשמעת צליל
  const playSound = (type) => {
    if (!soundEnabled) return;

    if (type === "correct" && correctSoundRef.current) {
      correctSoundRef.current();
    } else if (type === "wrong" && wrongSoundRef.current) {
      wrongSoundRef.current();
    }
  };

  // האזנה לאירועי תשובות שחקנים
  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      const handlePlayerAnswered = ({ correct }) => {
        playSound(correct ? "correct" : "wrong");
      };

      socket.on("playerAnswered", handlePlayerAnswered);
      return () => socket.off("playerAnswered", handlePlayerAnswered);
    }
  }, [soundEnabled]);

  // השמעת מוזיקת מתח כשהשחקנים מנחשים
  useEffect(() => {
    console.log("🎵 Tension music effect triggered:", {
      soundEnabled,
      tensionMusicEnabled,
      tensionMusicReady,
      tensionMusicExists: !!tensionMusicRef.current,
      countdown,
      waitingForNext,
      isTensionMusicPlaying,
      shouldPlay:
        countdown !== null &&
        !waitingForNext &&
        tensionMusicEnabled &&
        soundEnabled,
    });

    if (
      !soundEnabled ||
      !tensionMusicEnabled ||
      !tensionMusicReady ||
      !tensionMusicRef.current
    ) {
      console.log("🔇 Tension music blocked:", {
        soundEnabled,
        tensionMusicEnabled,
        tensionMusicReady,
        tensionMusicRef: !!tensionMusicRef.current,
      });
      return;
    }

    // מוזיקת מתח תתנגן רק כשהטיימר פעיל (countdown !== null)
    // זה אומר שהאודיו כבר נגמר והטיימר התחיל - השחקנים מנחשים
    if (countdown !== null && !waitingForNext) {
      // הטיימר פעיל - השחקנים מנחשים - נשמיע מוזיקת מתח
      console.log(
        "🎵 Timer is active (audio ended) - attempting to play tension music..."
      );
      if (!isTensionMusicPlaying) {
        try {
          console.log("🎵 Calling play() on tension music...");
          tensionMusicRef.current.play();
          setIsTensionMusicPlaying(true);
          console.log(
            "✅ Tension music started successfully (timer active after audio ended)"
          );
        } catch (error) {
          console.log("🔇 Tension music failed:", error.message);
          console.log("🔇 Error details:", error);
        }
      }
    } else {
      // הטיימר לא פעיל או מחכים לסיבוב הבא - עצירת מוזיקת המתח
      console.log(
        "🛑 Timer not active or waiting for next - should stop tension music:",
        { countdown, waitingForNext, isTensionMusicPlaying }
      );
      if (isTensionMusicPlaying && tensionMusicRef.current) {
        tensionMusicRef.current.pause();
        setIsTensionMusicPlaying(false);
        console.log(
          "🛑 Tension music stopped (timer not active or waiting for next)"
        );
      }
    }
  }, [
    countdown,
    waitingForNext,
    soundEnabled,
    tensionMusicEnabled,
    tensionMusicReady,
  ]);

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

      <div className="relative z-10 w-full max-w-4xl">
        {/* Main Host Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20 shadow-2xl text-center">
          {/* Host Badge */}
          <div className="flex items-center justify-between mb-6">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              👑 HOST CONTROL
            </div>

            <div className="flex items-center gap-3">
              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  soundEnabled
                    ? "bg-green-500 text-white"
                    : "bg-gray-500 text-gray-200"
                }`}
              >
                {soundEnabled ? "🔊 Sound ON" : "🔇 Sound OFF"}
              </button>

              {/* Tension Music Toggle */}
              <button
                onClick={() => setTensionMusicEnabled(!tensionMusicEnabled)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  tensionMusicEnabled
                    ? "bg-purple-500 text-white"
                    : "bg-gray-500 text-gray-200"
                }`}
                title={
                  tensionMusicEnabled
                    ? "Disable tension music"
                    : "Enable tension music"
                }
              >
                {tensionMusicEnabled ? "🎵 Music ON" : "🎵 Music OFF"}
              </button>

              {/* Tension music status indicator */}
              {isTensionMusicPlaying && (
                <div className="flex items-center space-x-2 bg-purple-600 bg-opacity-50 px-3 py-2 rounded-full">
                  <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>
                  <span className="text-purple-200 text-xs">Playing</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Message */}
          <div className="bg-blue-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400 border-opacity-30 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {statusMsg}
            </h2>
          </div>

          {/* Player Response Tracking */}
          {!waitingForNext && (
            <div className="bg-purple-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400 border-opacity-30 mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-4xl">👥</div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {playersAnswered} / {totalPlayers}
                  </div>
                  <div className="text-purple-200 text-sm">
                    Players Answered
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-purple-800 bg-opacity-50 rounded-full h-3 mb-2">
                <div
                  className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full transition-all duration-500"
                  style={{
                    width:
                      totalPlayers > 0
                        ? `${(playersAnswered / totalPlayers) * 100}%`
                        : "0%",
                  }}
                ></div>
              </div>

              <div className="text-purple-200 text-sm">
                {totalPlayers - playersAnswered} players still thinking...
              </div>
            </div>
          )}

          {/* Countdown Timer */}
          {countdown !== null && (
            <div className="bg-orange-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 border border-orange-400 border-opacity-30 mb-6">
              <div className="flex items-center justify-center gap-4">
                <div className="text-4xl">⏱️</div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white animate-pulse">
                    {countdown}s
                  </div>
                  <div className="text-orange-200 text-sm">Time Remaining</div>
                </div>
              </div>

              {/* Circular Progress */}
              <div className="flex justify-center mt-4">
                <div className="relative w-20 h-20">
                  <svg
                    className="w-20 h-20 transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 45 * (1 - countdown / guessTimeLimit)
                      }`}
                      className="transition-all duration-1000"
                    />
                    {console.log("🎮 Host timer circle calculation:", {
                      countdown,
                      guessTimeLimit,
                      ratio: countdown / guessTimeLimit,
                    })}
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          )}

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

export default ImprovedHostGameScreen;
