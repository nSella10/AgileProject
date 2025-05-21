import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getSocket, disconnectSocket } from "../socket";
import { BASE_URL } from "../constants";
import classroomBg from "../assets/classroom-bg.png";
import "../styles/LaunchGamePage.css";

import HostWaitingScreen from "../components/HostFlow/HostWaitingScreen";
import HostGameScreen from "../components/HostFlow/HostGameScreen";
import FinalLeaderboardScreen from "../components/HostFlow/FinalLeaderboardScreen";

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
  const [countdown, setCountdown] = useState(null);

  const countdownRef = useRef(null);
  const audioRef = useRef(null); // ✅ חדש – ניהול אודיו

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
      setGameStarted(true);
      setStatusMsg("🎬 Game is starting!");
    });

    socket.on("nextRound", ({ audioUrl, duration, roundNumber }) => {
      setStatusMsg(
        `🎵 Playing snippet for ${duration / 1000}s – Round ${roundNumber}`
      );
      setRoundFailed(false);
      setRoundSucceeded(false);
      setWaitingForNext(false);

      // ✅ עצירת שיר קודם אם היה
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // 🎵 הפעלת שיר חדש
      const newAudio = new Audio(`${BASE_URL}${audioUrl}`);
      audioRef.current = newAudio;

      newAudio.play().catch((err) => {
        console.error("Audio play failed:", err);
      });

      // ⏱️ עצירת השיר בדיוק אחרי כמה שצריך
      setTimeout(() => {
        newAudio.pause();
        newAudio.currentTime = 0;
      }, duration);

      // ⏱️ טיימר מענה של 15 שניות (בלתי תלוי באורך השיר)
      setCountdown(15);
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }

      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownRef.current);
            setCountdown(null);
            setWaitingForNext(true);
          }
          return prev - 1;
        });
      }, 1000);
    });

    socket.on("correctAnswer", ({ username, answer, scores }) => {
      setStatusMsg(`✅ ${username} guessed it right! (${answer})`);
      setScores(scores);
      setWaitingForNext(true);
      setRoundSucceeded(true);

      setCountdown(null);
      clearInterval(countdownRef.current);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    });

    socket.on("roundFailed", () => {
      setStatusMsg("❌ No one guessed it. You can replay longer.");
      setWaitingForNext(true);
      setRoundFailed(true);
      setCountdown(null);
      clearInterval(countdownRef.current);
    });

    socket.on("gameOver", ({ leaderboard }) => {
      setFinalLeaderboard(leaderboard);
      setStatusMsg("🏁 Game over! Final results below:");

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      setCountdown(null);
      clearInterval(countdownRef.current);
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

      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [gameId, navigate, userInfo]);

  const handleStartGame = () => {
    const socket = getSocket();
    socket.emit("startGame", { roomId: roomCode });
  };

  const handleNextRound = () => {
    const socket = getSocket();

    // ✅ עצור שיר קודם לפני מעבר סבב
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    socket.emit("nextRound", { roomId: roomCode });
    setWaitingForNext(false);
    setRoundFailed(false);
    setRoundSucceeded(false);
    setCountdown(null);
    clearInterval(countdownRef.current);
  };

  const backgroundStyle = {
    backgroundImage: `url(${classroomBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    width: "100%",
  };

  return (
    <div style={backgroundStyle}>
      {finalLeaderboard ? (
        <FinalLeaderboardScreen leaderboard={finalLeaderboard} />
      ) : gameStarted ? (
        <HostGameScreen
          statusMsg={statusMsg}
          scores={scores}
          waitingForNext={waitingForNext}
          onNextRound={handleNextRound}
          roundFailed={roundFailed}
          roundSucceeded={roundSucceeded}
          countdown={countdown}
        />
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
