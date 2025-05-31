import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getSocket, disconnectSocket } from "../socket";
import { BASE_URL } from "../constants";

import HostWaitingScreen from "../components/HostFlow/HostWaitingScreen";
import HostGameScreen from "../components/HostFlow/HostGameScreen";
import ImprovedHostGameScreen from "../components/HostFlow/ImprovedHostGameScreen";
import InterimLeaderboardScreen from "../components/HostFlow/InterimLeaderboardScreen";
import RoundRevealAnswerScreen from "../components/HostFlow/RoundRevealAnswerScreen";
import PlayerAnswersScreen from "../components/HostFlow/PlayerAnswersScreen";

const LaunchGamePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");
  const [scores, setScores] = useState({});
  const [finalLeaderboard, setFinalLeaderboard] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [waitingForNext, setWaitingForNext] = useState(false);
  const [roundFailed, setRoundFailed] = useState(false);
  const [roundSucceeded, setRoundSucceeded] = useState(false);
  const [awaitingHostDecision, setAwaitingHostDecision] = useState(false);
  const [showInterimLeaderboard, setShowInterimLeaderboard] = useState(false);
  const [showAnswerReveal, setShowAnswerReveal] = useState(false);
  const [showPlayerAnswers, setShowPlayerAnswers] = useState(false);
  const [revealedSongTitle, setRevealedSongTitle] = useState("");
  const [revealedSongPreviewUrl, setRevealedSongPreviewUrl] = useState("");
  const [revealedSongArtist, setRevealedSongArtist] = useState("");
  const [revealedSongArtworkUrl, setRevealedSongArtworkUrl] = useState("");
  const [playerEmojis, setPlayerEmojis] = useState({});
  const [playerAnswers, setPlayerAnswers] = useState({});
  const [countdown, setCountdown] = useState(null);
  const [songNumber, setSongNumber] = useState(1);
  const [totalSongs, setTotalSongs] = useState(1);
  const [playersAnswered, setPlayersAnswered] = useState(0);
  const [guessTimeLimit, setGuessTimeLimit] = useState(15);

  const audioRef = useRef(null);
  const countdownRef = useRef(null);
  const roomCodeRef = useRef("");

  useEffect(() => {
    console.log("🎮 LaunchGamePage useEffect - gameId:", gameId);
    const socket = getSocket({ userId: userInfo._id });
    socket.emit("createRoom", { gameId });

    socket.on("roomCreated", ({ roomCode }) => {
      console.log("🎮 Room created with code:", roomCode);
      setRoomCode(roomCode);
      roomCodeRef.current = roomCode; // שמירה ב-ref גם
    });

    socket.on("roomJoinError", (message) => {
      toast.error(message);
      navigate("/dashboard");
    });

    socket.on("updatePlayerList", ({ players }) => {
      setPlayers(players);
    });

    socket.on("gameStarting", () => {
      console.log("🎬 Game is starting!");
      setGameStarted(true);
      setStatusMsg("🎬 Game is starting!");
    });

    socket.on(
      "nextRound",
      ({
        audioUrl,
        duration,
        startTime,
        roundNumber,
        roundDeadline,
        songNumber,
        totalSongs,
      }) => {
        // שמירת roomCode לשימוש בפונקציות פנימיות
        const currentRoomCode = roomCodeRef.current;
        console.log("🎵 Next round received:", {
          roundNumber,
          songNumber,
          totalSongs,
          duration,
          roomCode: currentRoomCode,
        });
        console.log("🔍 roomCodeRef.current:", roomCodeRef.current);
        console.log("🔍 roomCode state:", roomCode);
        setStatusMsg(
          `🎵 Playing song for ${
            duration / 1000
          } seconds (Round ${roundNumber})`
        );
        setRoundFailed(false);
        setRoundSucceeded(false);
        setWaitingForNext(false);
        setShowAnswerReveal(false);
        setShowInterimLeaderboard(false);
        setShowPlayerAnswers(false);
        setSongNumber(songNumber);
        setTotalSongs(totalSongs);
        setPlayersAnswered(0); // איפוס מעקב תשובות

        // עצירה ונקיון של אודיו קודם
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          if (audioRef.current.stopTimer) {
            clearTimeout(audioRef.current.stopTimer);
          }
          audioRef.current = null;
        }

        // בדיקה אם זה URL מלא או יחסי
        const fullAudioUrl = audioUrl.startsWith("http")
          ? audioUrl
          : `${BASE_URL}${audioUrl}`;

        console.log(`🎵 Loading audio: ${fullAudioUrl}`);
        console.log(`⏱️ Expected duration: ${duration}ms`);

        const newAudio = new Audio(fullAudioUrl);
        newAudio.crossOrigin = "anonymous";
        newAudio.preload = "auto";

        // שמירת הרפרנס מיד
        audioRef.current = newAudio;

        // פונקציה משופרת להשמעה
        const playAudio = () => {
          return new Promise((resolve, reject) => {
            const playPromise = newAudio.play();

            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  const startTime = Date.now();
                  console.log(
                    `✅ Audio started playing successfully at ${startTime}`
                  );
                  console.log(`⏰ Will stop after ${duration}ms`);

                  // התחלת טיימר העצירה רק כשהאודיו באמת מתחיל
                  const stopTimer = setTimeout(() => {
                    const stopTime = Date.now();
                    const actualDuration = stopTime - startTime;

                    if (audioRef.current && audioRef.current === newAudio) {
                      console.log(
                        `🛑 Stopping audio after ${actualDuration}ms actual playback (expected: ${duration}ms)`
                      );
                      audioRef.current.pause();
                      audioRef.current.currentTime = 0;
                      console.log(
                        `✅ Audio stopped successfully at ${stopTime}`
                      );
                    } else {
                      console.log(`⚠️ Audio reference changed, skipping stop`);
                    }
                  }, duration);

                  // שמירת הטיימר
                  newAudio.stopTimer = stopTimer;

                  resolve();
                })
                .catch((error) => {
                  console.error(`❌ Audio play failed:`, error);
                  reject(error);
                });
            } else {
              // דפדפנים ישנים שלא מחזירים Promise
              const startTime = Date.now();
              console.log(
                `✅ Audio started playing (legacy browser) at ${startTime}`
              );
              console.log(`⏰ Will stop after ${duration}ms`);

              // התחלת טיימר העצירה גם לדפדפנים ישנים
              const stopTimer = setTimeout(() => {
                const stopTime = Date.now();
                const actualDuration = stopTime - startTime;

                if (audioRef.current && audioRef.current === newAudio) {
                  console.log(
                    `🛑 Stopping audio after ${actualDuration}ms actual playback (expected: ${duration}ms)`
                  );
                  audioRef.current.pause();
                  audioRef.current.currentTime = 0;
                  console.log(`✅ Audio stopped successfully at ${stopTime}`);
                } else {
                  console.log(`⚠️ Audio reference changed, skipping stop`);
                }
              }, duration);

              newAudio.stopTimer = stopTimer;
              resolve();
            }
          });
        };

        // טיפול באירועי האודיו
        newAudio.addEventListener("loadstart", () => {
          console.log(`📥 Audio loading started`);
        });

        newAudio.addEventListener("canplay", () => {
          console.log(`✅ Audio can start playing`);
        });

        newAudio.addEventListener("loadeddata", () => {
          console.log(`📊 Audio data loaded`);
          newAudio.currentTime = 0; // תמיד מתחילים מההתחלה
        });

        newAudio.addEventListener("error", (e) => {
          console.error(`❌ Audio loading error:`, e);
          console.error(`❌ Failed URL: ${fullAudioUrl}`);

          // אם יש בעיה עם הטעינה, ננסה בלי crossOrigin
          if (newAudio.crossOrigin) {
            console.log(`🔄 Retrying without crossOrigin...`);
            newAudio.crossOrigin = null;
            newAudio.load();
          }
        });

        // המתנה לטעינה מלאה לפני השמעה
        const waitForLoad = () => {
          return new Promise((resolve) => {
            if (newAudio.readyState >= 2) {
              // HAVE_CURRENT_DATA
              resolve();
            } else {
              newAudio.addEventListener("canplay", resolve, { once: true });
              // fallback timeout
              setTimeout(resolve, 2000);
            }
          });
        };

        // הטיימר מתחיל מהשרת דרך האירוע timerStarted

        // עדכון פונקציית השמעה כדי להתחיל טיימר
        const playAudioWithTimer = () => {
          return new Promise((resolve, reject) => {
            const playPromise = newAudio.play();

            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  const startTime = Date.now();
                  console.log(
                    `✅ Audio started playing successfully at ${startTime}`
                  );
                  console.log(`⏰ Will stop after ${duration}ms`);

                  // הטיימר כבר התחיל מהשרת, לא צריך להתחיל שוב
                  console.log(
                    "🎵 Audio started - timer already running from server"
                  );

                  // שליחת אירוע לשרת שהאודיו התחיל
                  const socket = getSocket();
                  console.log(
                    "📤 Sending audioStarted with roomCode:",
                    currentRoomCode
                  );
                  socket.emit("audioStarted", { roomCode: currentRoomCode });

                  // התחלת טיימר העצירה רק כשהאודיו באמת מתחיל
                  const stopTimer = setTimeout(() => {
                    const stopTime = Date.now();
                    const actualDuration = stopTime - startTime;

                    if (audioRef.current && audioRef.current === newAudio) {
                      console.log(
                        `🛑 Stopping audio after ${actualDuration}ms actual playback (expected: ${duration}ms)`
                      );
                      audioRef.current.pause();
                      audioRef.current.currentTime = 0;
                      console.log(
                        `✅ Audio stopped successfully at ${stopTime}`
                      );

                      // שליחת אירוע לשרת שהאודיו נגמר - עכשיו הטיימר יתחיל
                      const socket = getSocket();
                      console.log(
                        "📤 Sending audioEnded with roomCode:",
                        currentRoomCode
                      );
                      socket.emit("audioEnded", { roomCode: currentRoomCode });
                      console.log("📤 Audio ended - timer should start now");
                    } else {
                      console.log(`⚠️ Audio reference changed, skipping stop`);
                    }
                  }, duration);

                  newAudio.stopTimer = stopTimer;
                  resolve();
                })
                .catch(reject);
            } else {
              // דפדפנים ישנים
              const startTime = Date.now();
              console.log(`✅ Audio started playing (legacy) at ${startTime}`);
              console.log(`⏰ Will stop after ${duration}ms`);

              // הטיימר כבר התחיל מהשרת, לא צריך להתחיל שוב
              console.log(
                "🎵 Audio started (legacy) - timer already running from server"
              );

              // שליחת אירוע לשרת שהאודיו התחיל
              const socket = getSocket();
              socket.emit("audioStarted", { roomCode: currentRoomCode });

              // התחלת טיימר העצירה גם לדפדפנים ישנים
              const stopTimer = setTimeout(() => {
                const stopTime = Date.now();
                const actualDuration = stopTime - startTime;

                if (audioRef.current && audioRef.current === newAudio) {
                  console.log(
                    `🛑 Stopping audio after ${actualDuration}ms actual playback (expected: ${duration}ms)`
                  );
                  audioRef.current.pause();
                  audioRef.current.currentTime = 0;
                  console.log(`✅ Audio stopped successfully at ${stopTime}`);

                  // שליחת אירוע לשרת שהאודיו נגמר - עכשיו הטיימר יתחיל
                  const socket = getSocket();
                  socket.emit("audioEnded", { roomCode: currentRoomCode });
                  console.log("📤 Audio ended - timer should start now");
                } else {
                  console.log(`⚠️ Audio reference changed, skipping stop`);
                }
              }, duration);

              newAudio.stopTimer = stopTimer;
              resolve();
            }
          });
        };

        // ניסיון השמעה אחרי טעינה
        waitForLoad().then(() => {
          playAudioWithTimer().catch((error) => {
            console.warn(`⚠️ First play attempt failed: ${error.message}`);

            // ניסיון נוסף אחרי השהיה קצרה
            setTimeout(() => {
              playAudioWithTimer().catch((retryError) => {
                console.error(
                  `❌ Retry play also failed: ${retryError.message}`
                );
                // הטיימר כבר התחיל מהשרת, לא צריך להתחיל שוב
                console.log(
                  "🎵 Audio failed - timer already running from server"
                );
              });
            }, 100);
          });
        });
      }
    );

    socket.on(
      "roundSucceeded",
      ({
        scores,
        songTitle,
        songPreviewUrl,
        songArtist,
        songArtworkUrl,
        playerEmojis,
        playerAnswers,
      }) => {
        console.log("🏆 LaunchGamePage - roundSucceeded scores:", scores);
        console.log("🏆 LaunchGamePage - playerAnswers:", playerAnswers);
        setScores(scores);
        setShowInterimLeaderboard(true);
        setRoundSucceeded(true);
        setWaitingForNext(true);
        setCountdown(null);
        clearInterval(countdownRef.current);

        // שמירת פרטי השיר והתשובות
        if (songTitle) setRevealedSongTitle(songTitle);
        if (songPreviewUrl) setRevealedSongPreviewUrl(songPreviewUrl);
        if (songArtist) setRevealedSongArtist(songArtist);
        if (songArtworkUrl) setRevealedSongArtworkUrl(songArtworkUrl);
        if (playerEmojis) setPlayerEmojis(playerEmojis);
        if (playerAnswers) setPlayerAnswers(playerAnswers);

        // עצירת השמע כשהסיבוב מצליח
        if (audioRef.current) {
          console.log(`🎉 Round succeeded - stopping audio`);
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          if (audioRef.current.stopTimer) {
            clearTimeout(audioRef.current.stopTimer);
          }
        }
      }
    );

    socket.on(
      "roundFailed",
      ({
        allRoundsUsed,
        songTitle,
        songPreviewUrl,
        songArtist,
        songArtworkUrl,
        playerAnswers,
      }) => {
        setWaitingForNext(true);
        setRoundFailed(true);
        setRoundSucceeded(false);
        setCountdown(null);
        clearInterval(countdownRef.current);
        setShowInterimLeaderboard(false);

        // שמירת תשובות השחקנים גם כשהסיבוב נכשל
        if (playerAnswers) setPlayerAnswers(playerAnswers);

        // עצירת השמע כשהסיבוב נכשל
        if (audioRef.current) {
          console.log(`❌ Round failed - stopping audio`);
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          if (audioRef.current.stopTimer) {
            clearTimeout(audioRef.current.stopTimer);
          }
        }

        if (allRoundsUsed) {
          setShowAnswerReveal(true);
          setRevealedSongTitle(songTitle);
          setRevealedSongPreviewUrl(songPreviewUrl);
          setRevealedSongArtist(songArtist);
          setRevealedSongArtworkUrl(songArtworkUrl);
        } else {
          setStatusMsg("❌ No one guessed it. You can replay the song longer.");
        }
      }
    );

    socket.on("roundFailedAwaitingDecision", ({ canReplayLonger }) => {
      console.log("🤔 Round failed, awaiting host decision");
      setAwaitingHostDecision(true);
      setWaitingForNext(false);
      setRoundFailed(false);
      setRoundSucceeded(false);
      setCountdown(null);
      clearInterval(countdownRef.current);
      setShowInterimLeaderboard(false);

      // עצירת השמע כשמחכים להחלטת המארגן
      if (audioRef.current) {
        console.log(`🤔 Awaiting decision - stopping audio`);
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        if (audioRef.current.stopTimer) {
          clearTimeout(audioRef.current.stopTimer);
        }
      }
    });

    socket.on("gameOver", ({ leaderboard }) => {
      setFinalLeaderboard(leaderboard);
      navigate("/final-leaderboard", { state: { leaderboard } });
    });

    // האזנה לאירועי תשובות שחקנים
    socket.on("playerAnswered", ({ totalAnswered }) => {
      setPlayersAnswered(totalAnswered);
    });

    // האזנה לאירוע שכל השחקנים ענו - עצירת הטיימר
    socket.on("allPlayersAnswered", () => {
      console.log("🛑 All players answered - stopping host timer");
      setCountdown(null);
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    });

    // קבלת זמן ניחוש מהגדרות המשחק
    socket.on("timerStarted", ({ guessTimeLimit }) => {
      console.log(
        "🎮 LaunchGamePage received timerStarted with guessTimeLimit:",
        guessTimeLimit
      );
      console.log("🎮 Type of received guessTimeLimit:", typeof guessTimeLimit);
      console.log("🎮 Previous guessTimeLimit state:", guessTimeLimit);
      setGuessTimeLimit(guessTimeLimit);
      console.log("🎮 Updated guessTimeLimit state to:", guessTimeLimit);

      // התחלת הטיימר של המארגן מיד כשמקבל את האירוע
      console.log(
        `🕐 Host starting countdown timer for ${guessTimeLimit} seconds`
      );
      setCountdown(guessTimeLimit);
      if (countdownRef.current) clearInterval(countdownRef.current);

      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownRef.current);
            setCountdown(null);
            setWaitingForNext(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });

    // עדכון ניקוד כשמישהו עונה נכון
    socket.on("correctAnswer", ({ scores, username, score }) => {
      console.log(
        `🏆 ${username} scored ${score} points. Updated scores:`,
        scores
      );
      setScores(scores);
    });

    return () => {
      socket.off("playerAnswered");
      socket.off("allPlayersAnswered");
      socket.off("timerStarted");
      socket.off("correctAnswer");
      socket.off("roundFailedAwaitingDecision");
      socket.disconnect();
    };
  }, [gameId, navigate, userInfo]);

  const handleStartGame = () => {
    console.log("🚀 Starting game with roomCode:", roomCode);
    console.log("🚀 Current guessTimeLimit state:", guessTimeLimit);
    const socket = getSocket();
    socket.emit("startGame", { roomCode });
  };

  const handleNextRound = () => {
    const socket = getSocket();
    socket.emit("nextRound", { roomCode });
    setWaitingForNext(false);
    setRoundFailed(false);
    setRoundSucceeded(false);
    setShowInterimLeaderboard(false);
    setShowAnswerReveal(false);
    setShowPlayerAnswers(false);
    setCountdown(null);
    clearInterval(countdownRef.current);

    // עצירת השמע והטיימר הנוכחיים
    if (audioRef.current) {
      console.log(`⏭️ Next round - stopping current audio`);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (audioRef.current.stopTimer) {
        clearTimeout(audioRef.current.stopTimer);
      }
      audioRef.current = null;
    }
  };

  const handleReplayLonger = () => {
    const socket = getSocket();
    socket.emit("replayLonger", { roomCode });
    setWaitingForNext(false);
    setRoundFailed(false);
    setAwaitingHostDecision(false);
    setCountdown(null);
    clearInterval(countdownRef.current);

    // עצירת השמע והטיימר הנוכחיים
    if (audioRef.current) {
      console.log(`🔄 Replay longer - stopping current audio`);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (audioRef.current.stopTimer) {
        clearTimeout(audioRef.current.stopTimer);
      }
      audioRef.current = null;
    }
  };

  // פונקציה למעבר למסך התשובות
  const handleViewAnswers = () => {
    setShowInterimLeaderboard(false);
    setShowPlayerAnswers(true);
  };

  // פונקציה לחזרה מהמסך תשובות לליידרבורד
  const handleBackToLeaderboard = () => {
    setShowPlayerAnswers(false);
    setShowInterimLeaderboard(true);
  };

  // הסרנו את handleEnableAudio - השמעה תמיד אוטומטית

  return (
    <div>
      {showPlayerAnswers ? (
        <PlayerAnswersScreen
          playerAnswers={playerAnswers}
          playerEmojis={playerEmojis}
          songTitle={revealedSongTitle}
          songArtist={revealedSongArtist}
          songArtworkUrl={revealedSongArtworkUrl}
          songPreviewUrl={revealedSongPreviewUrl}
          onNextSong={handleNextRound}
        />
      ) : showAnswerReveal ? (
        <RoundRevealAnswerScreen
          songTitle={revealedSongTitle}
          songPreviewUrl={revealedSongPreviewUrl}
          songArtist={revealedSongArtist}
          songArtworkUrl={revealedSongArtworkUrl}
          onNext={handleNextRound}
        />
      ) : showInterimLeaderboard ? (
        <InterimLeaderboardScreen
          scores={scores}
          songPreviewUrl={revealedSongPreviewUrl}
          songTitle={revealedSongTitle}
          songArtist={revealedSongArtist}
          songArtworkUrl={revealedSongArtworkUrl}
          playerEmojis={playerEmojis}
          playerAnswers={playerAnswers}
          onNextRound={handleNextRound}
          onViewAnswers={handleViewAnswers}
        />
      ) : finalLeaderboard ? null : gameStarted ? (
        <>
          {console.log(
            "🎮 Rendering ImprovedHostGameScreen with guessTimeLimit:",
            guessTimeLimit
          )}
          <ImprovedHostGameScreen
            statusMsg={statusMsg}
            scores={scores}
            waitingForNext={waitingForNext}
            onNextRound={handleNextRound}
            onReplayLonger={handleReplayLonger}
            roundFailed={roundFailed}
            roundSucceeded={roundSucceeded}
            awaitingHostDecision={awaitingHostDecision}
            countdown={countdown}
            playersAnswered={playersAnswered}
            totalPlayers={players.length}
            guessTimeLimit={guessTimeLimit}
          />
        </>
      ) : (
        <HostWaitingScreen
          roomCode={roomCode}
          players={players}
          onStart={handleStartGame}
        />
      )}
    </div>
  );
};

export default LaunchGamePage;
