import React, { useState, useEffect } from "react";
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
  const timeoutRef = React.useRef(null);

  useEffect(() => {
    const socket = getSocket();

    socket.on("roomJoined", () => {
      setJoined(true);
    });

    socket.on("roomJoinError", (message) => {
      setError(message);
      toast.error(message);
    });

    socket.on("gameStarting", () => {
      setGameStarted(true);
      setStatusMsg("🎬 Game is starting!");
    });

    socket.on("nextRound", ({ roundNumber, roundDeadline }) => {
      setStatusMsg(`🕵️ Round ${roundNumber} - Listen and guess!`);
      setHasGuessedThisRound(false);
      setIsWaitingBetweenRounds(false);

      // ננקה טיימר קודם אם קיים
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const now = Date.now();
      const msLeft = roundDeadline - now;

      if (msLeft > 0) {
        timeoutRef.current = setTimeout(() => {
          setIsWaitingBetweenRounds(true);
        }, msLeft);
      } else {
        setIsWaitingBetweenRounds(true);
      }
    });

    socket.on("correctAnswer", ({ username, answer }) => {
      setStatusMsg(`🎉 ${username} guessed it right: ${answer}`);
    });

    socket.on("roundFailed", () => {
      setStatusMsg("❌ No one guessed it. Next round...");
      setHasGuessedThisRound(true); // כדי למנוע שליחת ניחוש נוסף
      setIsWaitingBetweenRounds(true);
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
      socket.off("correctAnswer");
      socket.off("roundFailed");
      socket.off("gameOver");
      socket.off("playerAssignedEmoji");
      disconnectSocket();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleJoin = () => {
    if (!roomCode || !username) {
      setError("Please enter both a room code and a nickname.");
      return;
    }
    const socket = getSocket();
    socket.emit("joinRoom", { roomCode, username });
  };

  const handleSubmitGuess = () => {
    if (!guess || hasGuessedThisRound) return;
    const socket = getSocket();
    socket.emit("submitAnswer", {
      roomId: roomCode,
      username,
      answer: guess,
    });
    setGuess("");
    setHasGuessedThisRound(true);
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

  return (
    <GamePlayScreen
      guess={guess}
      statusMsg={statusMsg}
      onGuessChange={handleGuessChange}
      onSubmitGuess={handleSubmitGuess}
      hasGuessed={hasGuessedThisRound || isGameOver} // ✅ הסתרת טופס אם המשחק נגמר
      isWaiting={isWaitingBetweenRounds}
      isGameOver={isGameOver}
    />
  );
};

export default JoinGamePage;
