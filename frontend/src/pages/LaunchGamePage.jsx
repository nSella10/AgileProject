import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getSocket, disconnectSocket } from "../socket";
import { BASE_URL } from "../constants";
import classroomBg from "../assets/classroom-bg.png";

import HostWaitingScreen from "../components/HostFlow/HostWaitingScreen";
import HostGameScreen from "../components/HostFlow/HostGameScreen";
import InterimLeaderboardScreen from "../components/HostFlow/InterimLeaderboardScreen";
import RoundRevealAnswerScreen from "../components/HostFlow/RoundRevealAnswerScreen";

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
  const [showInterimLeaderboard, setShowInterimLeaderboard] = useState(false);
  const [showAnswerReveal, setShowAnswerReveal] = useState(false);
  const [revealedSongTitle, setRevealedSongTitle] = useState("");
  const [countdown, setCountdown] = useState(null);
  const [songNumber, setSongNumber] = useState(1);
  const [totalSongs, setTotalSongs] = useState(1);

  const audioRef = useRef(null);
  const countdownRef = useRef(null);

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
        setSongNumber(songNumber);
        setTotalSongs(totalSongs);

        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current = null; // נקה את הרפרנס לאודיו הקודם
        }

        // בדיקה אם זה URL מלא או יחסי
        const fullAudioUrl = audioUrl.startsWith("http")
          ? audioUrl
          : `${BASE_URL}${audioUrl}`;

        const newAudio = new Audio(fullAudioUrl);
        newAudio.crossOrigin = "anonymous";
        newAudio.preload = "auto";

        // הגדרת זמן התחלה אחרי שהאודיו נטען
        newAudio.addEventListener("loadeddata", () => {
          // תמיד מתחילים מההתחלה (0 שניות)
          newAudio.currentTime = 0;
        });

        // פונקציה לניסיון השמעה עם מספר ניסיונות
        const attemptPlay = (attempt = 1) => {
          const playPromise = newAudio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                // השמעה הצליחה
                console.log(
                  `🎵 Audio playing successfully (attempt ${attempt})`
                );
              })
              .catch((error) => {
                console.error(`Audio play attempt ${attempt} failed:`, error);

                // אם זה הניסיון הראשון, ננסה שוב אחרי השהיה קצרה
                if (attempt === 1) {
                  setTimeout(() => attemptPlay(2), 300);
                } else if (attempt === 2) {
                  // ניסיון שלישי עם אינטראקציה של משתמש
                  setTimeout(() => attemptPlay(3), 500);
                } else {
                  // אחרי 3 ניסיונות, נמשיך בלי שמע
                  console.log(
                    "All audio play attempts failed, continuing without audio"
                  );
                }
              });
          }
        };

        // התחלת ניסיונות השמעה
        attemptPlay();
        audioRef.current = newAudio;

        // עצירת השמע אחרי הזמן שנקבע
        setTimeout(() => {
          if (newAudio) {
            newAudio.pause();
            newAudio.currentTime = 0;
          }
        }, duration);

        // התחלת קאונטדאון של 15 שניות (ללא תלות בשמע)
        setCountdown(15);
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
      }
    );

    socket.on("roundSucceeded", ({ scores }) => {
      setScores(scores);
      setShowInterimLeaderboard(true);
      setRoundSucceeded(true);
      setWaitingForNext(true);
      setCountdown(null);
      clearInterval(countdownRef.current);
    });

    socket.on("roundFailed", ({ allRoundsUsed, songTitle }) => {
      setWaitingForNext(true);
      setRoundFailed(true);
      setRoundSucceeded(false);
      setCountdown(null);
      clearInterval(countdownRef.current);
      setShowInterimLeaderboard(false);

      if (allRoundsUsed) {
        setShowAnswerReveal(true);
        setRevealedSongTitle(songTitle);
      } else {
        setStatusMsg("❌ No one guessed it. You can replay the song longer.");
      }
    });

    socket.on("gameOver", ({ leaderboard }) => {
      setFinalLeaderboard(leaderboard);
      navigate("/final-leaderboard", { state: { leaderboard } });
    });

    return () => {
      socket.disconnect();
    };
  }, [gameId, navigate, userInfo]);

  const handleStartGame = () => {
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
    setCountdown(null);
    clearInterval(countdownRef.current);
  };

  const handleReplayLonger = () => {
    const socket = getSocket();
    socket.emit("replayLonger", { roomCode });
    setWaitingForNext(false);
    setRoundFailed(false);
    setCountdown(null);
    clearInterval(countdownRef.current);
  };

  // הסרנו את handleEnableAudio - השמעה תמיד אוטומטית

  return (
    <div
      style={{
        backgroundImage: `url(${classroomBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {showAnswerReveal ? (
        <div
          style={{
            backgroundImage: `url(${classroomBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100vh",
            width: "100%",
          }}
        >
          <RoundRevealAnswerScreen
            songTitle={revealedSongTitle}
            onNext={handleNextRound}
          />
        </div>
      ) : showInterimLeaderboard ? (
        <InterimLeaderboardScreen
          scores={scores}
          onNextRound={handleNextRound}
        />
      ) : finalLeaderboard ? null : gameStarted ? (
        <HostGameScreen
          statusMsg={statusMsg}
          scores={scores}
          waitingForNext={waitingForNext}
          onNextRound={handleNextRound}
          onReplayLonger={handleReplayLonger}
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
