import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { getSocket, disconnectSocket } from "../socket";
import GameCodeInput from "../components/GameFlow/GameCodeInput";
import NicknameInput from "../components/GameFlow/NicknameInput";
import WaitingScreen from "../components/GameFlow/WaitingScreen";
import GamePlayScreen from "../components/GameFlow/GamePlayScreen";
import RejoinGameModal from "../components/RejoinGameModal";

const JoinGamePage = () => {
  console.log("🎯 JoinGamePage component is being rendered/initialized");

  const [roomCode, setRoomCode] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // מצב השלב בתהליך ההצטרפות
  const [joinStep, setJoinStep] = useState("gameCode"); // "gameCode" או "nickname"

  // מצב הצעת חזרה למשחק קודם
  const [showRejoinModal, setShowRejoinModal] = useState(false);
  const [previousGameData, setPreviousGameData] = useState(null);
  const [checkingPreviousGame, setCheckingPreviousGame] = useState(false); // לא מבצעים בדיקה אוטומטית
  const [guess, setGuess] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [playerEmoji, setPlayerEmoji] = useState("");
  const [hasGuessedThisRound, setHasGuessedThisRound] = useState(false);
  const [isWaitingBetweenRounds, setIsWaitingBetweenRounds] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [songNumber, setSongNumber] = useState(1);
  const [totalSongs, setTotalSongs] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [maxTime, setMaxTime] = useState(15); // זמן ניחוש מקסימלי
  const [roundFailedForUser, setRoundFailedForUser] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [currentPlayerName, setCurrentPlayerName] = useState("");
  const [guessResult, setGuessResult] = useState(null); // "correct", "wrong", or null
  const [answerDetails, setAnswerDetails] = useState(null); // פרטי התשובה (ניקוד, סוג, וכו')
  const [isAudioPlaying, setIsAudioPlaying] = useState(false); // האם השיר עדיין מתנגן
  const [gameData, setGameData] = useState(null); // פרטי המשחק
  const [currentSongTitle, setCurrentSongTitle] = useState(""); // שם השיר הנוכחי
  const [isGamePaused, setIsGamePaused] = useState(false); // האם המשחק מושהה
  const [pauseReason, setPauseReason] = useState(""); // סיבת ההשהיה

  const timeoutRef = useRef(null);
  const timerInterval = useRef(null);
  const isCheckingRef = useRef(false); // עוקב אחרי האם אנחנו בתהליך בדיקה
  const lastCheckTimeRef = useRef(0); // זמן הבדיקה האחרונה

  // פונקציה לבדיקת משחק קודם
  const checkPreviousGame = useCallback((skipDebouncing = false) => {
    console.log(
      "🚀 checkPreviousGame called with skipDebouncing:",
      skipDebouncing
    );
    console.log("🔍 Current state:", {
      isCheckingRef: isCheckingRef.current,
      showRejoinModal,
      checkingPreviousGame,
    });

    // בדיקה אם כבר בתהליך בדיקה
    if (isCheckingRef.current) {
      console.log("🔍 Already checking, skipping...");
      return;
    }

    // סימון שאנחנו בתהליך בדיקה
    isCheckingRef.current = true;
    setCheckingPreviousGame(true);

    // debouncing - מניעת בדיקות מהירות מדי (פחות מ-2 שניות)
    // אבל רק אם לא דילגנו על זה במפורש
    if (!skipDebouncing) {
      const now = Date.now();
      if (now - lastCheckTimeRef.current < 2000) {
        console.log("🔍 Too soon since last check, skipping...");
        isCheckingRef.current = false;
        setCheckingPreviousGame(false);
        return;
      }
      lastCheckTimeRef.current = now;
    }

    // בדיקת localStorage
    const lastGameSession = localStorage.getItem("lastGameSession");
    console.log("🔍 Checking for previous game session:", lastGameSession);

    // אם אין נתונים ב-localStorage, אין צורך לבדוק
    if (!lastGameSession) {
      console.log("📭 No previous game session found");
      isCheckingRef.current = false;
      setCheckingPreviousGame(false);
      return;
    }

    console.log("🔍 Starting previous game check...");
    isCheckingRef.current = true;
    setCheckingPreviousGame(true);

    if (lastGameSession) {
      try {
        const gameData = JSON.parse(lastGameSession);
        console.log("🔍 Found previous game session:", gameData);

        // בדיקה אם המשחק לא ישן מדי (למשל, לא יותר מ-24 שעות)
        const hoursSinceJoined =
          (Date.now() - gameData.joinedAt) / (1000 * 60 * 60);
        console.log("⏰ Hours since joined:", hoursSinceJoined);

        if (hoursSinceJoined > 24) {
          console.log("🗑️ Previous game session too old, removing");
          localStorage.removeItem("lastGameSession");
          isCheckingRef.current = false;
          setCheckingPreviousGame(false);
          return;
        }

        // בדיקה עם השרת אם המשחק עדיין פעיל
        console.log("📡 Checking with server for previous game:", {
          roomCode: gameData.roomCode,
          username: gameData.username,
          timestamp: new Date().toISOString(),
        });

        const socket = getSocket();
        console.log("📡 Socket connected?", socket.connected);
        console.log("📡 Socket ID:", socket.id);

        // בדיקה נוספת שהסוקט קיים ותקין
        if (!socket) {
          console.log("❌ Socket not available, skipping check");
          isCheckingRef.current = false;
          setCheckingPreviousGame(false);
          return;
        }

        const checkWithServer = () => {
          console.log("📤 About to emit checkPreviousGame with data:", {
            roomCode: gameData.roomCode,
            username: gameData.username,
            socketId: socket.id,
            socketConnected: socket.connected,
          });
          socket.emit("checkPreviousGame", {
            roomCode: gameData.roomCode,
            username: gameData.username,
          });
          console.log("✅ checkPreviousGame event emitted to server");
        };

        if (socket.connected) {
          // הסוקט כבר מחובר
          checkWithServer();
        } else {
          // נחכה לחיבור הסוקט
          console.log("⏳ Waiting for socket to connect...");
          socket.once("connect", () => {
            console.log("🔗 Socket connected, now checking previous game");
            checkWithServer();
          });
        }

        // timeout אם השרת לא עונה תוך 5 שניות
        setTimeout(() => {
          if (isCheckingRef.current) {
            console.log(
              "⏰ Timeout waiting for server response, proceeding normally"
            );
            isCheckingRef.current = false;
            setCheckingPreviousGame(false);
          }
        }, 5000);
      } catch (error) {
        console.error("❌ Error parsing previous game session:", error);
        localStorage.removeItem("lastGameSession");
        isCheckingRef.current = false;
        setCheckingPreviousGame(false);
      }
    }
  }, []);

  // בדיקת משחק קודם כשהעמוד נטען - בדיקה מיידית אם יש localStorage
  useEffect(() => {
    console.log("🚀 JoinGamePage mounted");

    // בדיקה אם יש localStorage ישן שצריך לנקות
    const lastGameSession = localStorage.getItem("lastGameSession");
    if (lastGameSession) {
      try {
        const gameData = JSON.parse(lastGameSession);
        const hoursSinceJoined =
          (Date.now() - gameData.joinedAt) / (1000 * 60 * 60);

        if (hoursSinceJoined > 24) {
          console.log("🗑️ Cleaning old localStorage data (>24h)");
          localStorage.removeItem("lastGameSession");
          setCheckingPreviousGame(false);
        } else {
          console.log("🔍 localStorage content:", gameData);
          // יש localStorage תקין - נבצע בדיקה עם השרת אחרי דיליי קטן
          setTimeout(() => {
            if (!joined && !showRejoinModal && !isCheckingRef.current) {
              console.log(
                "🚀 Performing server check for previous game (localStorage exists)"
              );
              checkPreviousGame(true); // skipDebouncing = true
            }
          }, 200);
        }
      } catch (error) {
        console.log("🗑️ Cleaning corrupted localStorage data");
        localStorage.removeItem("lastGameSession");
        setCheckingPreviousGame(false);
      }
    } else {
      console.log("🔍 No localStorage content");
      setCheckingPreviousGame(false);
    }

    return () => {
      console.log("🧹 JoinGamePage unmounting");
    };
  }, [checkPreviousGame, joined, showRejoinModal]);

  // בדיקה נוספת כאשר המשתמש חוזר לדף - רק אם יש localStorage ולא במצב joined
  useEffect(() => {
    // אם השחקן כבר במשחק, לא צריך בדיקות רקע
    if (joined) {
      console.log("🔍 Player already joined, skipping background checks");
      return;
    }

    const handleCheck = () => {
      // בדיקה רק אם יש נתונים ב-localStorage ולא בתהליך בדיקה ולא במשחק
      const lastGameSession = localStorage.getItem("lastGameSession");

      if (!lastGameSession) {
        console.log("🔍 No localStorage data - skipping all checks");
        return;
      }

      if (showRejoinModal || isCheckingRef.current || joined) {
        console.log("🔍 Skipping check - conditions not met:", {
          showRejoinModal,
          isCheckingRef: isCheckingRef.current,
          joined,
        });
        return;
      }

      console.log("🔍 Triggering check for previous game");
      checkPreviousGame();
    };

    const handleWindowFocus = () => {
      const lastGameSession = localStorage.getItem("lastGameSession");
      if (lastGameSession && !joined) {
        console.log("🔍 Window focused - checking with server");
        setTimeout(() => {
          if (!joined && !showRejoinModal && !isCheckingRef.current) {
            handleCheck();
          }
        }, 50);
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const lastGameSession = localStorage.getItem("lastGameSession");
        if (lastGameSession && !joined) {
          console.log("🔍 Page became visible - checking with server");
          setTimeout(() => {
            if (!joined && !showRejoinModal && !isCheckingRef.current) {
              handleCheck();
            }
          }, 50);
        }
      }
    };

    // בדיקה פריודית רק אם יש localStorage - כל 3 שניות
    const intervalCheck = setInterval(() => {
      const lastGameSession = localStorage.getItem("lastGameSession");

      if (!lastGameSession || joined) {
        return; // לא מבצעים בדיקה אם אין localStorage או אם במשחק
      }

      if (!isCheckingRef.current && !showRejoinModal) {
        console.log("🔄 Periodic server check for previous game");
        handleCheck();
      }
    }, 3000); // בדיקה כל 3 שניות

    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalCheck);
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [showRejoinModal, checkPreviousGame, joined]);

  useEffect(() => {
    const socket = getSocket();
    console.log(
      "🔌 Setting up socket listeners, socket connected:",
      socket.connected
    );
    console.log("🔌 Socket ID:", socket.id);
    console.log("🔌 Setting up hostWaitingForYou listener");

    // מאזין לחיבור הסוקט
    socket.on("connect", () => {
      console.log("🔌 Socket connected in JoinGamePage, ID:", socket.id);

      // בדיקה אם יש localStorage כשמתחברים לסוקט
      const lastGameSession = localStorage.getItem("lastGameSession");
      if (lastGameSession && !joined && !showRejoinModal) {
        try {
          const gameData = JSON.parse(lastGameSession);
          console.log(
            "🔍 Socket connected - checking for pending notifications with server"
          );

          // שליחת בקשה לשרת לבדוק אם יש התראות ממתינות
          socket.emit("checkPendingNotifications", {
            roomCode: gameData.roomCode,
            username: gameData.username,
          });
        } catch (error) {
          console.error(
            "❌ Error parsing localStorage on socket connect:",
            error
          );
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected in JoinGamePage");
    });

    // טיפול בתגובת בדיקת משחק קודם
    socket.on(
      "previousGameStatus",
      ({
        canRejoin,
        roomCode: prevRoomCode,
        username: prevUsername,
        gameTitle,
        reason,
      }) => {
        console.log("📨 Previous game status:", {
          canRejoin,
          prevRoomCode,
          prevUsername,
          gameTitle,
          reason,
        });

        if (canRejoin) {
          console.log("✅ Can rejoin previous game:", {
            prevRoomCode,
            prevUsername,
            gameTitle,
          });
          console.log("🔄 Setting modal from previousGameStatus");
          setPreviousGameData({
            roomCode: prevRoomCode,
            username: prevUsername,
            gameTitle: gameTitle,
          });
          setShowRejoinModal(true);
        } else {
          console.log("❌ Cannot rejoin previous game:", reason);
          console.log(
            "🔍 Will wait for hostWaitingForYou notification if host is waiting"
          );
          // נמחק את הנתונים רק אם המארגן החליט לא לחכות לשחקן
          // אם הסיבה היא שהמארגן עדיין לא החליט, נשמור את הנתונים
          if (reason === "Host decided to continue without you") {
            console.log(
              "🗑️ Removing localStorage - host decided to continue without player"
            );
            localStorage.removeItem("lastGameSession");
            setPreviousGameData(null);
          } else if (reason === "Game not found") {
            console.log("🗑️ Removing localStorage - game not found");
            localStorage.removeItem("lastGameSession");
            setPreviousGameData(null);
          } else if (reason === "Player was not in this game") {
            console.log(
              "🗑️ Removing localStorage - player was not in this game"
            );
            localStorage.removeItem("lastGameSession");
            setPreviousGameData(null);
          } else if (reason === "Game is not active") {
            console.log("🗑️ Removing localStorage - game is not active");
            localStorage.removeItem("lastGameSession");
            setPreviousGameData(null);
          } else if (reason === "Player already connected") {
            console.log("🗑️ Removing localStorage - player already connected");
            localStorage.removeItem("lastGameSession");
            setPreviousGameData(null);
          } else {
            console.log(
              "🔄 Keeping localStorage data - host hasn't decided yet, reason:",
              reason
            );
          }
        }
        console.log(
          "🔄 Setting isCheckingRef.current = false from previousGameStatus"
        );
        isCheckingRef.current = false;
        setCheckingPreviousGame(false);
      }
    );

    // טיפול בהתראה ישירה מהשרת שהמארגן מחכה לשחקן
    socket.on(
      "hostWaitingForYou",
      ({ roomCode: prevRoomCode, username: prevUsername, gameTitle }) => {
        console.log("🔔 *** RECEIVED hostWaitingForYou notification ***");
        console.log("🔔 Received hostWaitingForYou notification:", {
          prevRoomCode,
          prevUsername,
          gameTitle,
          timestamp: new Date().toISOString(),
          socketId: socket.id,
        });

        // הצגת popup מיידית ללא דיליי
        console.log("🚀 Processing hostWaitingForYou immediately");
        console.log(
          "🔍 Current localStorage when receiving notification:",
          localStorage.getItem("lastGameSession")
        );
        console.log("🔍 Current modal state:", {
          showRejoinModal,
          checkingPreviousGame,
          isCheckingRef: isCheckingRef.current,
          joined,
          gameStarted,
        });

        console.log("🔍 Processing hostWaitingForYou notification");
        console.log("🔍 Current state before showing modal:", {
          showRejoinModal,
          previousGameData,
          checkingPreviousGame,
          joined,
          gameStarted,
        });

        // בדיקה אם השחקן כבר במשחק
        if (joined) {
          console.log("⚠️ Player already joined game, ignoring notification");
          return;
        }

        // בדיקה אם ה-modal כבר פתוח
        if (showRejoinModal) {
          console.log("⚠️ Modal already open, ignoring notification");
          return;
        }

        // עצירת כל בדיקות רקע
        console.log(
          "🔄 Setting isCheckingRef.current = false from hostWaitingForYou"
        );
        isCheckingRef.current = false;
        setCheckingPreviousGame(false);

        // הצגת המודל מיד כשמקבלים את ההתראה - ללא תלות ב-localStorage
        const newGameData = {
          roomCode: prevRoomCode,
          username: prevUsername,
          gameTitle: gameTitle,
        };
        console.log("🔄 Setting previousGameData to:", newGameData);

        // שמירה ב-localStorage כדי שהמידע יישמר
        const gameSession = {
          roomCode: prevRoomCode,
          username: prevUsername,
          joinedAt: Date.now(),
        };
        localStorage.setItem("lastGameSession", JSON.stringify(gameSession));
        console.log("💾 Saved game session to localStorage:", gameSession);

        // עדכון מיידי של ה-state
        setPreviousGameData(newGameData);
        setShowRejoinModal(true);

        // וידוא שה-modal יופיע - force update
        setTimeout(() => {
          console.log("🔄 Force ensuring modal is visible");
          setPreviousGameData(newGameData);
          setShowRejoinModal(true);
        }, 10);

        console.log("✅ Modal should now be visible");
        console.log("🔍 Final state check:", {
          showRejoinModal: true, // what we just set
          previousGameData: newGameData,
        });

        // בדיקה נוספת אחרי עדכון ה-state
        setTimeout(() => {
          console.log("🔍 State after update:", {
            showRejoinModal,
            previousGameData,
          });
        }, 100);
      }
    );

    // טיפול בהתראה שהמארגן החליט לא לחכות לשחקן
    socket.on(
      "hostDecidedToContinueWithout",
      ({ roomCode: prevRoomCode, username: prevUsername }) => {
        console.log("🚫 Host decided to continue without player:", {
          prevRoomCode,
          prevUsername,
        });

        // בדיקה אם ההתראה רלוונטית לשחקן הנוכחי
        const lastGameSession = localStorage.getItem("lastGameSession");
        if (lastGameSession) {
          try {
            const gameData = JSON.parse(lastGameSession);

            // בדיקה אם זה אותו משחק ואותו שחקן
            if (
              gameData.roomCode === prevRoomCode &&
              gameData.username === prevUsername
            ) {
              console.log(
                "✅ Host decided to continue without me - clearing all data"
              );

              // ניקוי מלא של כל המידע הקשור למשחק הקודם
              localStorage.removeItem("lastGameSession");

              // אם יש modal פתוח, נסגור אותו
              if (showRejoinModal) {
                setShowRejoinModal(false);
                setPreviousGameData(null);
              }

              // איפוס הבדיקה כדי לאפשר בדיקות עתידיות
              isCheckingRef.current = false;
              setCheckingPreviousGame(false);
            }
          } catch (error) {
            console.error(
              "❌ Error parsing localStorage for host decision:",
              error
            );
            // אם יש שגיאה בפרסור, נמחק את הנתונים בכל מקרה
            localStorage.removeItem("lastGameSession");
            setPreviousGameData(null);
            isCheckingRef.current = false;
            setCheckingPreviousGame(false);
          }
        }
      }
    );

    socket.on("roomJoined", () => {
      console.log("Successfully joined room!");
      setJoined(true);

      // שמירת פרטי המשחק ב-localStorage עם הערכים שנשלחו לשרת
      const joinData = window.lastJoinAttempt || { roomCode, username };
      console.log(
        "💾 roomJoined - About to save - roomCode:",
        joinData.roomCode,
        "username:",
        joinData.username
      );
      console.log(
        "💾 roomJoined - Current localStorage before save:",
        localStorage.getItem("lastGameSession")
      );

      const gameSession = {
        roomCode: joinData.roomCode,
        username: joinData.username,
        joinedAt: Date.now(),
      };
      localStorage.setItem("lastGameSession", JSON.stringify(gameSession));
      console.log(
        "💾 roomJoined - Saved game session to localStorage:",
        gameSession
      );
      console.log(
        "💾 roomJoined - localStorage after save:",
        localStorage.getItem("lastGameSession")
      );

      // ניקוי הנתונים הזמניים
      delete window.lastJoinAttempt;
    });

    socket.on("roomJoinError", (message) => {
      console.log("Room join error:", message);
      setError(message);
      toast.error(message);
    });

    socket.on("gameStarting", () => {
      setGameStarted(true);
      setStatusMsg("🎬 Game is starting!");
    });

    // מאזין לקבלת פרטי המשחק
    socket.on("gameData", (data) => {
      console.log("🎮 Received game data:", data);
      setGameData(data);
    });

    socket.on(
      "nextRound",
      ({ roundNumber, songNumber, totalSongs, duration, currentSong }) => {
        setStatusMsg(`🎵 Round ${roundNumber} - Song is playing...`);
        setHasGuessedThisRound(false);
        setIsWaitingBetweenRounds(false);
        setRoundFailedForUser(false);
        setSongNumber(songNumber);
        setTotalSongs(totalSongs);
        setSubmitted(false);
        setGuessResult(null);
        setIsAudioPlaying(true); // השיר מתחיל להתנגן

        // עדכון שם השיר הנוכחי (לשיטת לחיצת אותיות)
        if (currentSong && currentSong.title) {
          setCurrentSongTitle(currentSong.title);
        }

        // ניקוי טיימרים קודמים
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (timerInterval.current) clearInterval(timerInterval.current);

        // עדיין לא מתחילים טיימר - נחכה לאירוע timerStarted
        setTimeLeft(null);

        // מנגנון גיבוי - אם לא מקבלים timerStarted תוך זמן סביר, נתחיל בעצמנו
        const fallbackDuration = duration || 3000; // ברירת מחדל של 3 שניות
        console.log(
          `🔄 Setting fallback timer for ${fallbackDuration + 2000}ms`
        );
        const fallbackTimeout = setTimeout(() => {
          console.log(
            "⚠️ Fallback: timerStarted not received, starting timer manually"
          );
          setStatusMsg(`🕵️ Listen and guess!`);
          setIsAudioPlaying(false);
          setTimeLeft(15); // ברירת מחדל של 15 שניות
          setMaxTime(15);

          // התחלת טיימר גיבוי
          if (timerInterval.current) clearInterval(timerInterval.current);
          timerInterval.current = setInterval(() => {
            setTimeLeft((prev) => {
              if (prev <= 1) {
                clearInterval(timerInterval.current);
                return null;
              }
              return prev - 1;
            });
          }, 1000);

          // עצירה אוטומטית אחרי 15 שניות
          timeoutRef.current = setTimeout(() => {
            setIsWaitingBetweenRounds(true);
          }, 15000);
        }, fallbackDuration + 2000); // נחכה למשך האודיו + 2 שניות נוספות

        // שמירת הטיימר הגיבוי כדי לבטל אותו אם נקבל timerStarted
        timeoutRef.current = fallbackTimeout;
      }
    );

    // אירוע חדש - כשהטיימר מתחיל באמת
    socket.on("timerStarted", ({ roundDeadline, guessTimeLimit }) => {
      console.log("🕐 Timer started for players");
      console.log(`⏱️ Guess time limit: ${guessTimeLimit} seconds`);
      console.log(`⏱️ Setting maxTime to: ${guessTimeLimit}`);

      // ביטול הטיימר הגיבוי אם הוא עדיין פועל
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        console.log("✅ Cancelled fallback timer - received real timerStarted");
      }

      setStatusMsg(`🕵️ Listen and guess!`);
      setIsAudioPlaying(false); // השיר הפסיק להתנגן, עכשיו אפשר לנחש

      const now = Date.now();
      const msLeft = roundDeadline - now;
      const seconds = Math.max(1, Math.ceil(msLeft / 1000)); // מינימום 1 שנייה
      setTimeLeft(seconds);
      setMaxTime(guessTimeLimit); // עדכון זמן מקסימלי

      console.log(
        `⏱️ Timer set - timeLeft: ${seconds}, maxTime: ${guessTimeLimit}`
      );

      // ניקוי טיימר קודם
      if (timerInterval.current) clearInterval(timerInterval.current);

      timerInterval.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval.current);
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      timeoutRef.current = setTimeout(() => {
        setIsWaitingBetweenRounds(true);
      }, msLeft);
    });

    socket.on(
      "answerFeedback",
      ({ correct, skipped, score, answerType, matchedText }) => {
        if (skipped) {
          setGuessResult("skipped");
          setAnswerDetails(null);
          setIsAudioPlaying(false); // וידוא שמצב האודיו מתעדכן
        } else {
          setGuessResult(correct ? "correct" : "wrong");
          if (correct) {
            setAnswerDetails({
              score,
              answerType,
              matchedText,
            });
          } else {
            setAnswerDetails(null);
          }
        }

        // עצירת הטיימר כשהמשתתף הגיש תשובה או וויתר
        if (timerInterval.current) {
          clearInterval(timerInterval.current);
          timerInterval.current = null;
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        // הסתרת הטיימר אחרי הגשת תשובה או וויתור
        setTimeLeft(null);
      }
    );

    socket.on("roundSucceeded", () => {
      setStatusMsg("🎉 Someone got it! Waiting for next song...");
      setHasGuessedThisRound(true);
      setIsWaitingBetweenRounds(true);
      setRoundFailedForUser(false);

      // עצירת הטיימר כשהסיבוב הצליח
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // הסתרת הטיימר אחרי הצלחת הסיבוב
      setTimeLeft(null);
    });

    socket.on("roundFailed", () => {
      setStatusMsg("❌ No one guessed it. Waiting for host...");
      setHasGuessedThisRound(true);
      setIsWaitingBetweenRounds(true);
      setRoundFailedForUser(true);

      // עצירת הטיימר כשהסיבוב נכשל
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // הסתרת הטיימר אחרי כישלון הסיבוב
      setTimeLeft(null);
    });

    socket.on("gameOver", () => {
      setStatusMsg("🏁 Game over! Thanks for playing.");
      setIsGameOver(true);
    });

    socket.on("playerAssignedEmoji", ({ emoji }) => {
      setPlayerEmoji(emoji);
    });

    // טיפול בסנכרון מצב המשחק אחרי חזרה
    socket.on(
      "syncGameState",
      ({
        currentSongIndex,
        currentRound,
        scores,
        playerScore,
        isRoundActive,
        totalSongs,
      }) => {
        console.log("🔄 Syncing game state after reconnection:", {
          currentSongIndex,
          currentRound,
          scores,
          playerScore,
          isRoundActive,
          totalSongs,
        });

        // עדכון מצב המשחק
        setSongNumber(currentSongIndex + 1);
        setTotalSongs(totalSongs || 1);

        if (isRoundActive) {
          // יש סיבוב פעיל - השחקן יכול להצטרף מיד לסיבוב הנוכחי
          setStatusMsg("🔄 Reconnected! You can answer the current song!");
          setIsWaitingBetweenRounds(false);
          setHasGuessedThisRound(false); // אפשר לשחקן לענות על השיר הנוכחי
          setSubmitted(false);
          setIsAudioPlaying(false); // האודיו כבר נגמר
        } else {
          // אין סיבוב פעיל - השחקן יכול להצטרף מיד
          setStatusMsg("🔄 Reconnected! Ready for the next round!");
          setIsWaitingBetweenRounds(true);
          setHasGuessedThisRound(false);
        }

        toast.success("Successfully reconnected to the game!");
      }
    );

    // טיפול בהשהיית המשחק
    socket.on("gamePaused", ({ reason, disconnectedPlayer }) => {
      console.log(`⏸️ Game paused due to ${reason}: ${disconnectedPlayer}`);
      console.log(`⏸️ Current timer state:`, {
        timeLeft,
        timerInterval: !!timerInterval.current,
        timeoutRef: !!timeoutRef.current,
        isGamePaused,
      });

      setIsGamePaused(true);
      setPauseReason(
        `Player ${disconnectedPlayer} disconnected. Waiting for organizer decision...`
      );

      // עצירת הטיימר
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
        console.log(`⏸️ Cleared timer interval`);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
        console.log(`⏸️ Cleared timeout`);
      }

      // עצירת הטיימר הויזואלי
      setTimeLeft(null);
      console.log(`⏸️ Set timeLeft to null`);

      // הצגת הודעה אחת בלבד
      toast.dismiss(); // סגירת כל ההודעות הקיימות
      toast.info(`Game paused - ${disconnectedPlayer} disconnected`);
    });

    // טיפול בחידוש המשחק
    socket.on("gameResumed", ({ roundDeadline, timeLeft }) => {
      console.log(`▶️ Game resumed with ${timeLeft}ms left`);
      setIsGamePaused(false);
      setPauseReason("");

      // חידוש הטיימר עם הזמן שנותר
      const seconds = Math.max(1, Math.ceil(timeLeft / 1000));
      setTimeLeft(seconds);

      // התחלת טיימר חדש
      if (timerInterval.current) clearInterval(timerInterval.current);
      timerInterval.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval.current);
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      timeoutRef.current = setTimeout(() => {
        setIsWaitingBetweenRounds(true);
      }, timeLeft);

      // אפשר למשתתף שחזר להזין תשובה
      setHasGuessedThisRound(false);
      setSubmitted(false);

      toast.success("Game resumed!");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("previousGameStatus");
      socket.off("hostWaitingForYou");
      socket.off("hostDecidedToContinueWithout");
      socket.off("roomJoined");
      socket.off("roomJoinError");
      socket.off("gameStarting");
      socket.off("gameData");
      socket.off("nextRound");
      socket.off("timerStarted");
      socket.off("answerFeedback");
      socket.off("roundSucceeded");
      socket.off("roundFailed");
      socket.off("gameOver");
      socket.off("playerAssignedEmoji");
      socket.off("syncGameState");
      socket.off("gamePaused");
      socket.off("gameResumed");
      disconnectSocket();

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, []);

  // פונקציות לטיפול בהצעת חזרה למשחק
  const handleAcceptRejoin = () => {
    console.log("✅ User accepted rejoin offer");
    setRoomCode(previousGameData.roomCode);
    setUsername(previousGameData.username);
    setShowRejoinModal(false);

    // שמירת הערכים שנשלחים לשרת
    window.lastJoinAttempt = {
      roomCode: previousGameData.roomCode,
      username: previousGameData.username,
    };

    // הצטרפות למשחק
    const socket = getSocket();
    socket.emit("joinRoom", {
      roomCode: previousGameData.roomCode,
      username: previousGameData.username,
    });
  };

  const handleDeclineRejoin = () => {
    console.log("❌ User declined rejoin offer");
    console.log("📤 Sending playerDeclinedRejoin event with data:", {
      roomCode: previousGameData.roomCode,
      username: previousGameData.username,
    });

    // שליחת הודעה לשרת שהשחקן החליט לא לחזור
    const socket = getSocket();
    socket.emit("playerDeclinedRejoin", {
      roomCode: previousGameData.roomCode,
      username: previousGameData.username,
    });

    console.log("✅ playerDeclinedRejoin event sent to server");

    // ניקוי מלא של כל המידע הקשור למשחק הקודם
    setShowRejoinModal(false);
    setPreviousGameData(null);

    // מחיקת הנתונים מ-localStorage
    localStorage.removeItem("lastGameSession");

    // איפוס הבדיקה כדי לאפשר בדיקות עתידיות
    isCheckingRef.current = false;
    setCheckingPreviousGame(false);

    // איפוס לשלב הראשון ונקה נתונים
    setJoinStep("gameCode");
    setRoomCode("");
    setUsername("");
    setError("");

    console.log("🧹 Cleaned up local state after declining rejoin");
  };

  // פונקציה למעבר משלב הכנסת קוד למשחק לשלב הכנסת nickname
  const handleGameCodeNext = () => {
    if (!roomCode || roomCode.length !== 5) {
      setError("Please enter a valid 5-digit game code.");
      return;
    }
    setError(""); // נקה שגיאות קודמות
    setJoinStep("nickname");
  };

  const handleJoin = () => {
    if (!roomCode || !username) {
      setError("Please enter both a room code and a nickname.");
      return;
    }

    // בדיקה אם השחקן מנסה להצטרף עם השם שסירב אליו קודם
    // רק אם יש נתונים ב-localStorage (כלומר המארגן עדיין מחכה)
    const lastGameSession = localStorage.getItem("lastGameSession");
    if (
      lastGameSession &&
      previousGameData &&
      roomCode === previousGameData.roomCode &&
      username === previousGameData.username
    ) {
      try {
        const gameData = JSON.parse(lastGameSession);
        // בדיקה אם זה אותו משחק שהמארגן החליט לא לחכות לו
        if (gameData.roomCode === roomCode && gameData.username === username) {
          setError(
            "The game organizer decided to continue without you. You cannot rejoin this game."
          );
          return;
        }
      } catch (error) {
        console.error("Error parsing localStorage in handleJoin:", error);
        // אם יש שגיאה בפרסור, נמחק את הנתונים ונמשיך
        localStorage.removeItem("lastGameSession");
      }
    }

    console.log(
      "Attempting to join room:",
      roomCode,
      "with username:",
      username
    );

    // שמירת הערכים שנשלחים לשרת
    window.lastJoinAttempt = { roomCode, username };

    const socket = getSocket();
    setCurrentPlayerName(username);
    socket.emit("joinRoom", { roomCode, username });
  };

  const handleSubmitGuess = () => {
    if (!guess || hasGuessedThisRound) return;
    const socket = getSocket();
    socket.emit("submitAnswer", {
      roomCode,
      username,
      answer: guess,
    });
    setGuess("");
    setHasGuessedThisRound(true);
    setSubmitted(true);
  };

  const handleSkipSong = () => {
    if (hasGuessedThisRound) return;
    const socket = getSocket();
    socket.emit("skipSong", {
      roomCode,
      username,
    });
    setHasGuessedThisRound(true);
    setSubmitted(true);
    setGuessResult("skipped");
    setIsAudioPlaying(false); // עצירת מצב השמעת האודיו
  };

  const handleGuessChange = (value) => {
    setGuess(value);
  };

  console.log("🎯 JoinGamePage render - Current state:", {
    joined,
    checkingPreviousGame,
    showRejoinModal,
    previousGameData,
    gameStarted,
  });

  if (!joined) {
    return (
      <>
        {checkingPreviousGame && (
          <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Checking for previous game session...</p>
            </div>
          </div>
        )}

        {!checkingPreviousGame && joinStep === "gameCode" && (
          <GameCodeInput
            roomCode={roomCode}
            error={error}
            setRoomCode={setRoomCode}
            onNext={handleGameCodeNext}
          />
        )}

        {!checkingPreviousGame && joinStep === "nickname" && (
          <NicknameInput
            roomCode={roomCode}
            username={username}
            error={error}
            setUsername={setUsername}
            onJoin={handleJoin}
          />
        )}

        <RejoinGameModal
          isOpen={showRejoinModal}
          roomCode={previousGameData?.roomCode}
          username={previousGameData?.username}
          gameTitle={previousGameData?.gameTitle}
          onAccept={handleAcceptRejoin}
          onDecline={handleDeclineRejoin}
        />

        {/* Debug info */}
        {process.env.NODE_ENV === "development" && (
          <div className="fixed top-4 right-4 bg-black text-white p-2 text-xs z-50">
            <div>showRejoinModal: {showRejoinModal.toString()}</div>
            <div>checkingPreviousGame: {checkingPreviousGame.toString()}</div>
            <div>joined: {joined.toString()}</div>
            <div>previousGameData: {previousGameData ? "exists" : "null"}</div>
            <div>
              localStorage:{" "}
              {localStorage.getItem("lastGameSession") ? "exists" : "null"}
            </div>
            <div>socket connected: {getSocket().connected.toString()}</div>
            <button
              onClick={() => {
                localStorage.removeItem("lastGameSession");
                console.log("🗑️ Manually cleared localStorage");
              }}
              className="bg-red-500 text-white px-2 py-1 mt-2 text-xs rounded"
            >
              Clear localStorage
            </button>
          </div>
        )}
      </>
    );
  }

  if (!gameStarted) {
    return <WaitingScreen playerEmoji={playerEmoji} username={username} />;
  }

  console.log("🎮 JoinGamePage rendering GamePlayScreen with:", {
    timeLeft,
    maxTime,
  });

  return (
    <GamePlayScreen
      guess={guess}
      statusMsg={statusMsg}
      onGuessChange={handleGuessChange}
      onSubmitGuess={handleSubmitGuess}
      onSkipSong={handleSkipSong}
      hasGuessed={hasGuessedThisRound || isGameOver}
      isWaiting={isWaitingBetweenRounds}
      isGameOver={isGameOver}
      songNumber={songNumber}
      totalSongs={totalSongs}
      submitted={submitted}
      timeLeft={timeLeft}
      maxTime={maxTime}
      roundFailedForUser={roundFailedForUser}
      guessResult={guessResult}
      answerDetails={answerDetails}
      isAudioPlaying={isAudioPlaying}
      guessInputMethod={gameData?.guessInputMethod || "freeText"}
      currentSongTitle={currentSongTitle}
      isGamePaused={isGamePaused}
      pauseReason={pauseReason}
    />
  );
};

export default JoinGamePage;
