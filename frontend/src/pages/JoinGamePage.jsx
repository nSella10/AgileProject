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
  const [roundFailedForUser, setRoundFailedForUser] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [currentPlayerName, setCurrentPlayerName] = useState("");
  const [guessResult, setGuessResult] = useState(null); // "correct", "wrong", or null

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
      ({ roundNumber, roundDeadline, songNumber, totalSongs }) => {
        setStatusMsg(`🕵️ Round ${roundNumber} - Listen and guess!`);
        setHasGuessedThisRound(false);
        setIsWaitingBetweenRounds(false);
        setRoundFailedForUser(false);
        setSongNumber(songNumber);
        setTotalSongs(totalSongs);
        setSubmitted(false);
        setGuessResult(null);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (timerInterval.current) clearInterval(timerInterval.current);

        const now = Date.now();
        const msLeft = roundDeadline - now;
        const seconds = Math.ceil(msLeft / 1000);
        setTimeLeft(seconds);

        timerInterval.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev === 1) {
              clearInterval(timerInterval.current);
              return null;
            }
            return prev - 1;
          });
        }, 1000);

        timeoutRef.current = setTimeout(() => {
          setIsWaitingBetweenRounds(true);
        }, msLeft);
      }
    );

    socket.on("answerFeedback", ({ correct }) => {
      setGuessResult(correct ? "correct" : "wrong");
    });

    socket.on("roundFailed", () => {
      setStatusMsg("❌ No one guessed it. Waiting for host...");
      setHasGuessedThisRound(true);
      setIsWaitingBetweenRounds(true);
      setRoundFailedForUser(true);
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
      socket.off("answerFeedback");
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
      roundFailedForUser={roundFailedForUser}
      guessResult={guessResult}
    />
  );
};

export default JoinGamePage;
