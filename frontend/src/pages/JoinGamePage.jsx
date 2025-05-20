import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getSocket, disconnectSocket } from "../socket";
import classroomBg from "../assets/classroom-bg.png"; // ✅ ייבוא תמונת הרקע

const JoinGamePage = () => {
  const [roomCode, setRoomCode] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [guess, setGuess] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [playerEmoji, setPlayerEmoji] = useState("");

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
    if (!guess) return;
    const socket = getSocket();
    socket.emit("submitAnswer", {
      roomId: roomCode,
      username,
      answer: guess,
    });
    setGuess("");
  };

  // 👤 שלב ההצטרפות
  if (!joined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-purple-800 text-white px-4">
        <h1 className="text-4xl font-bold mb-6">Join a Game</h1>
        <input
          className="mb-3 p-2 rounded text-black w-full max-w-sm"
          type="text"
          placeholder="Enter game code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />
        <input
          className="mb-3 p-2 rounded text-black w-full max-w-sm"
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

  // ⏳ מסך המתנה - בסגנון Kahoot עם רקע מ-assets
  if (!gameStarted) {
    return (
      <div
        className="relative flex flex-col items-center justify-center min-h-screen text-white text-center px-4"
        style={{
          backgroundImage: `url(${classroomBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* תוכן */}
        <div className="relative z-10 flex flex-col items-center bg-white/10 backdrop-blur-md px-8 py-10 rounded-xl shadow-xl border border-white/20">
          {/* דמות השחקן */}
          <div className="w-28 h-28 rounded-lg bg-purple-700 text-white text-5xl flex items-center justify-center mb-4">
            {playerEmoji || "🎮"}
          </div>

          {/* שם השחקן */}
          <h2 className="text-3xl font-extrabold mb-2 drop-shadow-lg">
            {username}
          </h2>

          {/* טקסט משני */}
          <p className="text-sm text-white/90">
            You're in! See your nickname on screen?
          </p>
        </div>
      </div>
    );
  }

  // 🎮 מסך המשחק
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100 text-black px-4">
      <h2 className="text-3xl font-bold mb-4">🎧 Guess the Song!</h2>
      <p className="mb-2">{statusMsg}</p>
      <input
        className="mt-4 p-2 border rounded w-full max-w-sm"
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
