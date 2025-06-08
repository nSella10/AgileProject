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
import PlayerDisconnectedModal from "../components/HostFlow/PlayerDisconnectedModal";

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

  // State for shared audio management
  const [sharedAudioRef, setSharedAudioRef] = useState(null);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);

  // State for player disconnection handling
  const [disconnectedPlayer, setDisconnectedPlayer] = useState(null);
  const [showDisconnectionModal, setShowDisconnectionModal] = useState(false);
  const [showRoomCodeForReconnection, setShowRoomCodeForReconnection] =
    useState(false);
  const [waitingForPlayerReturn, setWaitingForPlayerReturn] = useState(null);

  const audioRef = useRef(null);
  const countdownRef = useRef(null);
  const roomCodeRef = useRef("");

  useEffect(() => {
    console.log("🎮 LaunchGamePage useEffect - gameId:", gameId);
    console.log("🎮 LaunchGamePage useEffect - userInfo:", userInfo);
    const socket = getSocket({ userId: userInfo._id });
    console.log("🎮 Socket obtained:", socket ? "exists" : "null");
    console.log("🎮 About to emit createRoom with gameId:", gameId);
    socket.emit("createRoom", { gameId });

    socket.on("roomCreated", ({ roomCode }) => {
      console.log("🎮 Room created with code:", roomCode);
      console.log("🎮 Setting roomCode state to:", roomCode);
      setRoomCode(roomCode);
      roomCodeRef.current = roomCode; // שמירה ב-ref גם
      console.log("🎮 roomCode state updated, current value:", roomCode);
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

        // עצירה ונקיון של השמע המשותף (מהמסכים הקודמים)
        if (sharedAudioRef) {
          console.log(`🛑 Next round - stopping shared audio IMMEDIATELY`);
          sharedAudioRef.onended = null; // הסרת event listener
          sharedAudioRef.pause();
          sharedAudioRef.currentTime = 0;
          setSharedAudioRef(null);
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
        newAudio.volume = 1.0; // וודא שהעוצמה מלאה

        // התחלת טעינה מיידית
        newAudio.load();

        // ניסיון טעינה מוקדמת לשיפור ביצועים
        newAudio.addEventListener("loadstart", () => {
          console.log(`📥 Audio loading started for ${duration}ms clip`);
        });

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
          console.log(
            `🎯 Audio position reset to 0, ready for ${duration}ms playback`
          );
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

        // המתנה לטעינה מלאה לפני השמעה - משופר עבור השמעות קצרות
        const waitForLoad = () => {
          return new Promise((resolve) => {
            if (newAudio.readyState >= 2) {
              // HAVE_CURRENT_DATA
              console.log("✅ Audio already loaded, ready to play");
              resolve();
            } else {
              console.log("⏳ Waiting for audio to load...");

              // מספר event listeners לוודא שנתפוס את הטעינה
              const onCanPlay = () => {
                console.log("✅ Audio canplay event fired");
                cleanup();
                resolve();
              };

              const onLoadedData = () => {
                console.log("✅ Audio loadeddata event fired");
                cleanup();
                resolve();
              };

              const onCanPlayThrough = () => {
                console.log("✅ Audio canplaythrough event fired");
                cleanup();
                resolve();
              };

              const cleanup = () => {
                newAudio.removeEventListener("canplay", onCanPlay);
                newAudio.removeEventListener("loadeddata", onLoadedData);
                newAudio.removeEventListener(
                  "canplaythrough",
                  onCanPlayThrough
                );
              };

              newAudio.addEventListener("canplay", onCanPlay, { once: true });
              newAudio.addEventListener("loadeddata", onLoadedData, {
                once: true,
              });
              newAudio.addEventListener("canplaythrough", onCanPlayThrough, {
                once: true,
              });

              // fallback timeout מקוצר עבור השמעות קצרות
              setTimeout(() => {
                console.log("⏰ Audio load timeout - proceeding anyway");
                cleanup();
                resolve();
              }, 1000); // קוצר מ-2000 ל-1000ms
            }
          });
        };

        // הטיימר מתחיל מהשרת דרך האירוע timerStarted

        // עדכון פונקציית השמעה כדי להתחיל טיימר
        const playAudioWithTimer = () => {
          return new Promise((resolve, reject) => {
            // וודא שמתחילים מההתחלה
            newAudio.currentTime = 0;
            console.log(
              `🎯 Audio position set to 0 before play, duration: ${duration}ms`
            );

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

        // ניסיון השמעה מיידי ואחרי טעינה
        const attemptPlay = () => {
          playAudioWithTimer().catch((error) => {
            console.warn(`⚠️ Play attempt failed: ${error.message}`);

            // ניסיון נוסף אחרי השהיה קצרה
            setTimeout(() => {
              playAudioWithTimer().catch((retryError) => {
                console.error(
                  `❌ Retry play also failed: ${retryError.message}`
                );
                // שליחת אירוע שהאודיו נגמר גם אם נכשל, כדי שהטיימר יתחיל
                const socket = getSocket();
                socket.emit("audioEnded", { roomCode: currentRoomCode });
                console.log(
                  "📤 Audio failed - sending audioEnded to start timer"
                );
              });
            }, 50); // השהיה קצרה יותר
          });
        };

        // ניסיון השמעה מיידי (אם השמע כבר נטען)
        if (newAudio.readyState >= 2) {
          console.log("🚀 Audio ready immediately - playing now");
          attemptPlay();
        } else {
          // אם לא, נחכה לטעינה אבל גם ננסה מיד
          console.log(
            "⏳ Audio not ready - waiting for load but also trying immediately"
          );

          // ניסיון מיידי (לפעמים עובד גם אם readyState לא מעודכן)
          setTimeout(() => {
            console.log("🚀 Immediate attempt after short delay");
            attemptPlay();
          }, 10); // דיליי קצר מאוד

          // גם נחכה לטעינה מלאה
          waitForLoad().then(() => {
            console.log("✅ Audio loaded - attempting play (backup)");
            // רק אם השמע עדיין לא מתנגן
            if (newAudio.paused) {
              attemptPlay();
            } else {
              console.log("🎵 Audio already playing from immediate attempt");
            }
          });
        }
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

        // עצירת השמע המשותף כשהסיבוב מצליח
        if (sharedAudioRef) {
          console.log(`🎉 Round succeeded - stopping shared audio`);
          sharedAudioRef.onended = null; // הסרת event listener
          sharedAudioRef.pause();
          sharedAudioRef.currentTime = 0;
          setSharedAudioRef(null);
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

        // עצירת השמע המשותף כשהסיבוב נכשל
        if (sharedAudioRef) {
          console.log(`❌ Round failed - stopping shared audio`);
          sharedAudioRef.onended = null; // הסרת event listener
          sharedAudioRef.pause();
          sharedAudioRef.currentTime = 0;
          setSharedAudioRef(null);
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

      // עצירת השמע המשותף כשמחכים להחלטת המארגן
      if (sharedAudioRef) {
        console.log(`🤔 Awaiting decision - stopping shared audio`);
        sharedAudioRef.onended = null; // הסרת event listener
        sharedAudioRef.pause();
        sharedAudioRef.currentTime = 0;
        setSharedAudioRef(null);
      }
    });

    socket.on("gameOver", ({ leaderboard }) => {
      // עצירת כל השמע כשהמשחק נגמר
      if (audioRef.current) {
        console.log(`🏁 Game over - stopping audio`);
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        if (audioRef.current.stopTimer) {
          clearTimeout(audioRef.current.stopTimer);
        }
        audioRef.current = null;
      }

      if (sharedAudioRef) {
        console.log(`🏁 Game over - stopping shared audio`);
        sharedAudioRef.onended = null; // הסרת event listener
        sharedAudioRef.pause();
        sharedAudioRef.currentTime = 0;
        setSharedAudioRef(null);
      }

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

    // טיפול בניתוק שחקן
    socket.on(
      "playerDisconnected",
      ({ username, emoji, roomCode, gameInProgress }) => {
        console.log(`🚪 Player ${username} disconnected`);
        setDisconnectedPlayer({ username, emoji, roomCode, gameInProgress });
        setShowDisconnectionModal(true);
        setShowRoomCodeForReconnection(false);
        setWaitingForPlayerReturn(null);
      }
    );

    // טיפול בחזרת שחקן
    socket.on("playerReconnected", ({ username, emoji }) => {
      console.log(`🔄 Player ${username} reconnected`);
      console.log(`🔍 Current state:`, {
        waitingForPlayerReturn,
        showDisconnectionModal,
        showRoomCodeForReconnection,
      });

      // הסרת הודעות קיימות ולאחר מכן הצגת הודעה חדשה
      toast.dismiss();
      toast.success(`${username} ${emoji} rejoined the game!`);

      // סגירת המודל בכל מקרה כשהשחקן חוזר
      console.log(`✅ Closing modal for reconnected player: ${username}`);
      setShowDisconnectionModal(false);
      setShowRoomCodeForReconnection(false);
      setWaitingForPlayerReturn(null);
      setDisconnectedPlayer(null); // איפוס גם את המידע על השחקן המנותק
    });

    // סגירת מודל ההמתנה כשהשחקן חוזר
    socket.on("closeWaitingModal", ({ username }) => {
      console.log(`🔄 Closing waiting modal for ${username}`);
      console.log(`🔍 Current state:`, {
        waitingForPlayerReturn,
        showDisconnectionModal,
        showRoomCodeForReconnection,
      });

      // סגירת המודל בכל מקרה כשהשחקן חוזר
      console.log(`✅ Force closing modal for ${username}`);
      setShowDisconnectionModal(false);
      setShowRoomCodeForReconnection(false);
      setWaitingForPlayerReturn(null);
      setDisconnectedPlayer(null); // איפוס גם את המידע על השחקן המנותק
    });

    // הצגת קוד המשחק לחזרת שחקן
    socket.on(
      "showRoomCodeForReconnection",
      ({ roomCode, waitingForPlayer }) => {
        console.log(`⏳ Showing room code for ${waitingForPlayer} to return`);
        setShowRoomCodeForReconnection(true);
        setWaitingForPlayerReturn(waitingForPlayer);
      }
    );

    // עדכון כשמסירים שחקן מהמשחק
    socket.on("playerRemovedFromGame", ({ username, newTotalPlayers }) => {
      console.log(
        `❌ Player ${username} removed from game. New total: ${newTotalPlayers}`
      );
      toast.info(`${username} was removed from the game`);
      setShowDisconnectionModal(false);
      setShowRoomCodeForReconnection(false);
      setWaitingForPlayerReturn(null);
      setDisconnectedPlayer(null); // איפוס גם את המידע על השחקן המנותק
    });

    // טיפול בשחקן שסירב לחזור למשחק
    socket.on("playerDeclinedRejoin", ({ username, newTotalPlayers }) => {
      console.log(
        `❌ Player ${username} declined to rejoin. New total: ${newTotalPlayers}`
      );
      console.log(`📥 Received playerDeclinedRejoin event in organizer screen`);
      console.log(`🔍 Current modal state before closing:`, {
        showDisconnectionModal,
        showRoomCodeForReconnection,
        waitingForPlayerReturn,
      });

      // סגירת המודל מיידית
      console.log(
        `🔄 Closing modal immediately for declined player: ${username}`
      );
      setShowDisconnectionModal(false);
      setShowRoomCodeForReconnection(false);
      setWaitingForPlayerReturn(null);
      setDisconnectedPlayer(null); // איפוס גם את המידע על השחקן המנותק

      toast.warning(`${username} chose not to return to the game`);
      console.log(
        `✅ Modal state updated after player declined - all states reset`
      );
    });

    // טיפול בהשהיית המשחק
    socket.on("gamePaused", ({ reason, disconnectedPlayer }) => {
      console.log(`⏸️ Game paused due to ${reason}: ${disconnectedPlayer}`);

      // עצירת הטיימר של המארגן
      console.log(`⏸️ Host timer - stopping countdown due to game pause`);
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
        console.log(`⏸️ Host timer - cleared countdown interval`);
      }

      // שמירת הזמן שנותר לחידוש מאוחר יותר
      console.log(`⏸️ Host timer - current countdown value: ${countdown}`);

      // עצירת הטיימר הויזואלי
      setCountdown(null);
    });

    // טיפול בחידוש המשחק
    socket.on("gameResumed", ({ roundDeadline, timeLeft }) => {
      console.log(`▶️ Game resumed with ${timeLeft}ms left`);

      // איפוס מצבי המסך כדי לחזור למסך הטיימר הרגיל
      setWaitingForNext(false);
      setShowAnswerReveal(false);
      setShowInterimLeaderboard(false);
      setShowPlayerAnswers(false);
      setRoundFailed(false);
      setRoundSucceeded(false);
      setAwaitingHostDecision(false);

      // חידוש הטיימר של המארגן עם הזמן שנותר
      const secondsLeft = Math.max(1, Math.ceil(timeLeft / 1000));
      console.log(
        `▶️ Host timer - resuming countdown with ${secondsLeft} seconds`
      );
      setCountdown(secondsLeft);

      // ניקוי טיימר קודם אם קיים
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }

      // התחלת טיימר חדש
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

      console.log("🔄 Reset all screen states to show timer screen");
    });

    return () => {
      socket.off("playerAnswered");
      socket.off("allPlayersAnswered");
      socket.off("timerStarted");
      socket.off("correctAnswer");
      socket.off("roundFailedAwaitingDecision");
      socket.off("playerDisconnected");
      socket.off("playerReconnected");
      socket.off("closeWaitingModal");
      socket.off("showRoomCodeForReconnection");
      socket.off("playerRemovedFromGame");
      socket.off("playerDeclinedRejoin");
      socket.off("gamePaused");
      socket.off("gameResumed");
      socket.disconnect();

      // ניקוי הטיימר של המארגן
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
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

    // עצירת השמע המשותף והטיימר הנוכחיים
    if (sharedAudioRef) {
      console.log(`⏭️ Next round - stopping shared audio`);
      sharedAudioRef.onended = null; // הסרת event listener
      sharedAudioRef.pause();
      sharedAudioRef.currentTime = 0;
      setSharedAudioRef(null);
    }

    if (audioRef.current) {
      console.log(`⏭️ Next round - stopping current audio`);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (audioRef.current.stopTimer) {
        clearTimeout(audioRef.current.stopTimer);
      }
      audioRef.current = null;
    }

    // איפוס מיקום השמע
    setCurrentAudioTime(0);
  };

  const handleReplayLonger = () => {
    const socket = getSocket();
    socket.emit("replayLonger", { roomCode });
    setWaitingForNext(false);
    setRoundFailed(false);
    setAwaitingHostDecision(false);
    setCountdown(null);
    clearInterval(countdownRef.current);

    // עצירת השמע המשותף והטיימר הנוכחיים
    if (sharedAudioRef) {
      console.log(`🔄 Replay longer - stopping shared audio`);
      sharedAudioRef.onended = null; // הסרת event listener
      sharedAudioRef.pause();
      sharedAudioRef.currentTime = 0;
      setSharedAudioRef(null);
    }

    if (audioRef.current) {
      console.log(`🔄 Replay longer - stopping current audio`);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (audioRef.current.stopTimer) {
        clearTimeout(audioRef.current.stopTimer);
      }
      audioRef.current = null;
    }

    // איפוס מיקום השמע
    setCurrentAudioTime(0);
  };

  // פונקציה למעבר למסך התשובות
  const handleViewAnswers = () => {
    // שמירת המיקום הנוכחי של השמע לפני מעבר למסך התשובות
    if (sharedAudioRef && !sharedAudioRef.paused) {
      setCurrentAudioTime(sharedAudioRef.currentTime);
    }
    setShowInterimLeaderboard(false);
    setShowPlayerAnswers(true);
  };

  // פונקציה לחזרה מהמסך תשובות לליידרבורד
  const handleBackToLeaderboard = () => {
    setShowPlayerAnswers(false);
    setShowInterimLeaderboard(true);
  };

  // פונקציות לטיפול בניתוק שחקנים
  const handleWaitForPlayerReturn = () => {
    if (!disconnectedPlayer) return;

    const socket = getSocket();
    socket.emit("handleDisconnectedPlayer", {
      roomCode: disconnectedPlayer.roomCode,
      username: disconnectedPlayer.username,
      action: "waitForReturn",
    });
  };

  const handleContinueWithoutPlayer = () => {
    if (!disconnectedPlayer) return;

    const socket = getSocket();
    socket.emit("handleDisconnectedPlayer", {
      roomCode: disconnectedPlayer.roomCode,
      username: disconnectedPlayer.username,
      action: "continueWithoutPlayer",
    });

    // סגירת המודל מיידית
    setShowDisconnectionModal(false);
    setShowRoomCodeForReconnection(false);
    setWaitingForPlayerReturn(null);
    setDisconnectedPlayer(null);
  };

  const handleCancelWaiting = () => {
    if (!waitingForPlayerReturn) return;

    const socket = getSocket();
    socket.emit("cancelWaitingForPlayer", {
      roomCode: roomCode,
      username: waitingForPlayerReturn,
    });

    // סגירת המודל מיידית
    setShowDisconnectionModal(false);
    setShowRoomCodeForReconnection(false);
    setWaitingForPlayerReturn(null);
    setDisconnectedPlayer(null);
  };

  const handleCloseDisconnectionModal = () => {
    setShowDisconnectionModal(false);
    setShowRoomCodeForReconnection(false);
    setWaitingForPlayerReturn(null);
    setDisconnectedPlayer(null);
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
          sharedAudioRef={sharedAudioRef}
          setSharedAudioRef={setSharedAudioRef}
          currentAudioTime={currentAudioTime}
        />
      ) : showAnswerReveal ? (
        <RoundRevealAnswerScreen
          songTitle={revealedSongTitle}
          songPreviewUrl={revealedSongPreviewUrl}
          songArtist={revealedSongArtist}
          songArtworkUrl={revealedSongArtworkUrl}
          onNext={handleNextRound}
          sharedAudioRef={sharedAudioRef}
          setSharedAudioRef={setSharedAudioRef}
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
          sharedAudioRef={sharedAudioRef}
          setSharedAudioRef={setSharedAudioRef}
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
            sharedAudioRef={sharedAudioRef}
            setSharedAudioRef={setSharedAudioRef}
          />
        </>
      ) : (
        <HostWaitingScreen
          roomCode={roomCode}
          players={players}
          onStart={handleStartGame}
        />
      )}

      {/* מודל לטיפול בניתוק שחקנים */}
      <PlayerDisconnectedModal
        isOpen={
          showDisconnectionModal &&
          (disconnectedPlayer || waitingForPlayerReturn)
        }
        playerName={disconnectedPlayer?.username || waitingForPlayerReturn}
        playerEmoji={disconnectedPlayer?.emoji}
        roomCode={roomCode}
        gameInProgress={disconnectedPlayer?.gameInProgress}
        onWaitForReturn={handleWaitForPlayerReturn}
        onContinueWithout={handleContinueWithoutPlayer}
        onClose={handleCloseDisconnectionModal}
        showRoomCode={showRoomCodeForReconnection}
        waitingForPlayer={waitingForPlayerReturn}
        onCancelWaiting={handleCancelWaiting}
      />
    </div>
  );
};

export default LaunchGamePage;
