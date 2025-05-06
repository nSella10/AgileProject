import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import { toast } from "react-toastify";

const LaunchGamePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");
  const [round, setRound] = useState(0);

  useEffect(() => {
    socket.emit("createRoom", { gameId });

    socket.on("roomCreated", ({ roomCode }) => {
      setRoomCode(roomCode);
    });

    socket.on("roomJoinError", (message) => {
      toast.error(message);
      navigate("/dashboard");
    });

    socket.on("updatePlayerList", ({ players }) => {
      setPlayers(players);
    });

    socket.on("gameStarting", () => {
      setStatusMsg("🎬 Game is starting!");
    });

    socket.on("nextRound", ({ audioUrl, duration, roundNumber }) => {
      setRound(roundNumber);
      setStatusMsg(
        `🎵 Playing song for ${duration / 1000} seconds (Round ${roundNumber})`
      );
      const audio = new Audio(`http://localhost:8000${audioUrl}`);
      audio.play().catch((err) => {
        console.error("Audio play failed:", err);
      });
    });

    socket.on("correctAnswer", ({ username, answer }) => {
      setStatusMsg(`✅ ${username} guessed it right! (${answer})`);
    });

    socket.on("roundFailed", () => {
      setStatusMsg("❌ No one guessed it. Moving to next round...");
    });

    socket.on("gameOver", () => {
      setStatusMsg("🏁 Game over! Thanks for playing.");
    });

    return () => {
      socket.off("roomCreated");
      socket.off("roomJoinError");
      socket.off("updatePlayerList");
      socket.off("gameStarting");
      socket.off("nextRound");
      socket.off("correctAnswer");
      socket.off("roundFailed");
      socket.off("gameOver");
    };
  }, [gameId, navigate]);

  const handleStartGame = () => {
    socket.emit("startGame", { roomId: roomCode });
  };

  return (
    <div className="text-center py-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        Waiting for players to join...
      </h1>
      <p className="text-lg mb-4">
        <strong>Game Code:</strong> {roomCode}
      </p>

      {players.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-2">Players Joined:</h2>
          <ul className="mb-4">
            {players.map((player, idx) => (
              <li key={idx}>{player}</li>
            ))}
          </ul>
          <button
            onClick={handleStartGame}
            className="bg-green-600 text-white px-4 py-2 rounded font-bold"
          >
            Start Game
          </button>
        </>
      )}

      {statusMsg && (
        <div className="mt-6 text-xl font-semibold text-purple-700">
          {statusMsg}
        </div>
      )}
    </div>
  );
};

export default LaunchGamePage;
