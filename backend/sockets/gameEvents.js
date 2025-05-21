import { rooms } from "./roomEvents.js";
import Game from "../models/Game.js";

const ROUND_DURATIONS = [1000, 3000, 5000]; // מילישניות – השמעת שיר בסבבים

export function handleGameEvents(io, socket) {
  socket.on("startGame", async ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    console.log(`🚀 Game started in room ${roomId}`);
    io.to(roomId).emit("gameStarting");

    try {
      const game = await Game.findById(room.gameId);
      if (!game || !game.songs || game.songs.length === 0) return;

      room.currentSongIndex = 0;
      room.currentRound = 0;
      room.songs = game.songs;
      room.answeredCorrectly = false;
      room.scores = {}; // username -> score
      room.currentTimeout = null;

      startRound(io, roomId);
    } catch (error) {
      console.error("❌ Error starting game:", error);
    }
  });

  socket.on("submitAnswer", ({ roomId, answer, username }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const currentSong = room.songs[room.currentSongIndex];
    if (room.answeredCorrectly) return; // כבר ענו נכון

    if (
      currentSong.correctAnswer.trim().toLowerCase() ===
      answer.trim().toLowerCase()
    ) {
      room.answeredCorrectly = true;

      // ניקוד: תן 100 נק' נכונה
      if (!room.scores[username]) {
        room.scores[username] = 0;
      }
      room.scores[username] += 100;

      // בטל טיימר אם היה פעיל
      if (room.currentTimeout) {
        clearTimeout(room.currentTimeout);
      }

      // שלח לכולם את התשובה הנכונה
      io.to(roomId).emit("correctAnswer", {
        username,
        answer,
        scores: room.scores,
      });

      // ❌ אין מעבר אוטומטי לסבב הבא כאן
    }
  });

  // ✅ מעבר יוזם לסבב הבא לפי בקשת המארגן בלבד
  socket.on("nextRound", ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    room.currentSongIndex++;
    room.currentRound = 0;
    room.answeredCorrectly = false;

    if (room.currentSongIndex < room.songs.length) {
      startRound(io, roomId);
    } else {
      const topScores = Object.entries(room.scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([username, score], index) => ({
          place: index + 1,
          username,
          score,
        }));

      io.to(roomId).emit("gameOver", {
        leaderboard: topScores,
      });

      rooms.delete(roomId);
    }
  });
}

function startRound(io, roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  const currentSong = room.songs[room.currentSongIndex];
  const round = room.currentRound;

  if (round >= ROUND_DURATIONS.length) {
    // כל הסבבים נכשלו
    io.to(roomId).emit("roundFailed");

    // ❌ לא עוברים אוטומטית – מחכים להוראת nextRound מהמארגן
    return;
  }

  const duration = ROUND_DURATIONS[round];
  const roundDeadline = Date.now() + 15000; // זמן מוגדר אחיד לכולם

  // שדר לכולם את הסיבוב הבא + זמן הסיום למענה
  io.to(roomId).emit("nextRound", {
    audioUrl: currentSong.audioUrl,
    duration,
    roundNumber: round + 1,
    roundDeadline, // ⬅️ תוספת קריטית לסנכרון בצד הלקוח
  });

  room.currentRound++;

  // 🕒 טיימר של 15 שניות למענה – לסיבוב הבא אם לא ניחשו נכון
  if (room.currentTimeout) {
    clearTimeout(room.currentTimeout);
  }

  room.currentTimeout = setTimeout(() => {
    if (!room.answeredCorrectly) {
      startRound(io, roomId); // סיבוב הבא (אותו שיר, זמן ארוך יותר)
    }
  }, 15000);
}
