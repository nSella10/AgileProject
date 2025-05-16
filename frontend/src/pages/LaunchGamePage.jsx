import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getSocket, disconnectSocket } from "../socket";
import { BASE_URL } from "../constants";
import classroomBg from "../assets/classroom-bg.png"; // ודא שהתמונה קיימת
import "../styles/LaunchGamePage.css"; // ודא שהקובץ קיים

const LaunchGamePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");
  const [round, setRound] = useState(0);

  useEffect(() => {
    const socket = getSocket({ userId: userInfo._id });

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
      const audio = new Audio(`${BASE_URL}${audioUrl}`);
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
      disconnectSocket();
    };
  }, [gameId, navigate, userInfo]);

  const handleStartGame = () => {
    const socket = getSocket();
    socket.emit("startGame", { roomId: roomCode });
  };

  const avatars = ["🐶", "🦊", "🐼", "🐵", "🐱", "🦁", "🐸", "🐻", "🦄", "🐯"];

  return (
    <div
      className="launch-game-container"
      style={{
        backgroundImage: `url(${classroomBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <button className="start-button" onClick={handleStartGame}>
        Start
      </button>

      <div className="info-box">
        <div className="pin-section">
          <h2>Game PIN</h2>
          <p className="pin-number">{roomCode || "------"}</p>
        </div>

        {players.length > 0 && (
          <div className="players-row">
            {players.map((player, idx) => (
              <div className="player-box fade-in" key={idx}>
                <div className="player-icon">
                  {avatars[idx % avatars.length]}
                </div>
                <span className="player-name">{player}</span>
              </div>
            ))}
          </div>
        )}

        <div className="status-msg">
          {statusMsg || "Waiting for participants"}
        </div>
      </div>
    </div>
  );
};

export default LaunchGamePage;
