import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { getSocket, disconnectSocket } from "../socket";
import JoinForm from "../components/GameFlow/JoinForm";
import WaitingScreen from "../components/GameFlow/WaitingScreen";
import GamePlayScreen from "../components/GameFlow/GamePlayScreen";

const JoinGamePage = () => {
  const [roomCode, setRoomCode] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
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
  const [isAudioPlaying, setIsAudioPlaying] = useState(false); // האם השיר עדיין מתנגן

  const timeoutRef = useRef(null);
  const timerInterval = useRef(null);

  useEffect(() => {
    const socket = getSocket();

    socket.on("roomJoined", () => {
      console.log("Successfully joined room!");
      setJoined(true);
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

    socket.on(
      "nextRound",
      ({ roundNumber, songNumber, totalSongs, duration }) => {
        setStatusMsg(`🎵 Round ${roundNumber} - Song is playing...`);
        setHasGuessedThisRound(false);
        setIsWaitingBetweenRounds(false);
        setRoundFailedForUser(false);
        setSongNumber(songNumber);
        setTotalSongs(totalSongs);
        setSubmitted(false);
        setGuessResult(null);
        setIsAudioPlaying(true); // השיר מתחיל להתנגן

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

    socket.on("answerFeedback", ({ correct }) => {
      setGuessResult(correct ? "correct" : "wrong");

      // עצירת הטיימר כשהמשתתף הגיש תשובה
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // הסתרת הטיימר אחרי הגשת תשובה
      setTimeLeft(null);
    });

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

    return () => {
      socket.off("roomJoined");
      socket.off("roomJoinError");
      socket.off("gameStarting");
      socket.off("nextRound");
      socket.off("timerStarted");
      socket.off("answerFeedback");
      socket.off("roundSucceeded");
      socket.off("roundFailed");
      socket.off("gameOver");
      socket.off("playerAssignedEmoji");
      disconnectSocket();

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, []);

  const handleJoin = () => {
    if (!roomCode || !username) {
      setError("Please enter both a room code and a nickname.");
      return;
    }
    console.log(
      "Attempting to join room:",
      roomCode,
      "with username:",
      username
    );
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

  const handleGuessChange = (value) => {
    setGuess(value);
  };

  if (!joined) {
    return (
      <JoinForm
        roomCode={roomCode}
        username={username}
        error={error}
        setRoomCode={setRoomCode}
        setUsername={setUsername}
        onJoin={handleJoin}
      />
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
      isAudioPlaying={isAudioPlaying}
    />
  );
};

export default JoinGamePage;
