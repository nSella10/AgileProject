// src/pages/JoinGamePage.jsx
import React, { useState, useEffect } from "react";
import socket from "../socket";

const JoinGamePage = () => {
  const [roomCode, setRoomCode] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [guess, setGuess] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    socket.on("roomJoined", () => {
      setJoined(true);
    });

    socket.on("roomJoinError", (message) => {
      setError(message);
    });

    socket.on("gameStarting", () => {
      setGameStarted(true);
      setStatusMsg("🎬 Game is starting!");
    });

    socket.on("nextRound", ({ roundNumber }) => {
      setStatusMsg(`🕵️ Round ${roundNumber} - Listen and guess!`);
    });

    socket.on("correctAnswer", ({ username, answer }) => {
      setStatusMsg(`🎉 ${username} guessed it right: ${answer}`);
    });

    socket.on("roundFailed", () => {
      setStatusMsg("❌ No one guessed it. Next round...");
    });

    socket.on("gameOver", () => {
      setStatusMsg("🏁 Game over! Thanks for playing.");
    });

    return () => {
      socket.off("roomJoined");
      socket.off("roomJoinError");
      socket.off("gameStarting");
      socket.off("nextRound");
      socket.off("correctAnswer");
      socket.off("roundFailed");
      socket.off("gameOver");
    };
  }, []);

  const handleJoin = () => {
    if (!roomCode || !username) {
      setError("Please enter both a room code and a nickname.");
      return;
    }

    socket.emit("joinRoom", { roomCode, username });
  };

  const handleSubmitGuess = () => {
    if (!guess) return;

    socket.emit("submitAnswer", {
      roomId: roomCode,
      username,
      answer: guess,
    });
    setGuess("");
  };

  if (!joined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-purple-800 text-white">
        <h1 className="text-4xl font-bold mb-6">Join a Game</h1>
        <input
          className="mb-3 p-2 rounded text-black"
          type="text"
          placeholder="Enter game code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />
        <input
          className="mb-3 p-2 rounded text-black"
          type="text"
          placeholder="Enter your nickname"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          onClick={handleJoin}
          className="bg-green-500 px-4 py-2 rounded font-semibold"
        >
          Join Game
        </button>
        {error && <p className="mt-4 text-red-300">{error}</p>}
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-purple-800 text-white">
        <h2 className="text-3xl font-bold mb-4">
          Waiting for game to start...
        </h2>
        <p>
          You joined as <strong>{username}</strong>
        </p>
        <p>
          Room Code: <strong>{roomCode}</strong>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100 text-black">
      <h2 className="text-3xl font-bold mb-4">🎧 Guess the Song!</h2>
      <p className="mb-2">{statusMsg}</p>
      <input
        className="mt-4 p-2 border rounded"
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Enter your guess"
      />
      <button
        onClick={handleSubmitGuess}
        className="bg-blue-600 text-white px-4 py-2 mt-2 rounded"
      >
        Submit Guess
      </button>
    </div>
  );
};

export default JoinGamePage;
