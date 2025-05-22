import rooms from "./roomStore.js"; // נייבא את ה-map של החדרים
import Game from "../models/Game.js";

const ROUND_DURATIONS = [1000, 3000, 5000, 7000, 9000];

export function handleGameEvents(io, socket) {
  socket.on("startGame", async ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    console.log(`🚀 Game started in room ${roomCode}`);
    io.to(roomCode).emit("gameStarting");

    try {
      const game = await Game.findById(room.gameId);
      if (!game || !game.songs || game.songs.length === 0) return;

      room.currentSongIndex = 0;
      room.currentRound = 0;
      room.songs = game.songs;
      room.scores = {};
      room.currentTimeout = null;

      startRound(io, roomCode);
    } catch (error) {
      console.error("❌ Error starting game:", error);
    }
  });

  socket.on("submitAnswer", ({ roomCode, answer, username }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    const currentSong = room.songs[room.currentSongIndex];
    if (room.guessedUsers.has(username)) return;

    room.guessedUsers.add(username);

    const correct =
      currentSong.correctAnswer.trim().toLowerCase() ===
      answer.trim().toLowerCase();

    if (correct) {
      room.correctUsers.add(username);

      if (!room.scores[username]) {
        room.scores[username] = 0;
      }
      room.scores[username] += 100;

      io.to(socket.id).emit("answerFeedback", {
        correct: true,
      });

      io.to(roomCode).emit("correctAnswer", {
        scores: room.scores,
      });
    } else {
      io.to(socket.id).emit("answerFeedback", {
        correct: false,
      });
    }

    if (room.guessedUsers.size === room.players.length) {
      finishRound(io, roomCode);
    }
  });

  socket.on("nextRound", ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    room.currentSongIndex++;
    room.currentRound = 0;

    if (room.currentSongIndex < room.songs.length) {
      startRound(io, roomCode);
    } else {
      const topScores = Object.entries(room.scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([username, score], index) => ({
          place: index + 1,
          username,
          score,
        }));

      io.to(roomCode).emit("gameOver", {
        leaderboard: topScores,
      });

      rooms.delete(roomCode);
    }
  });

  socket.on("replayLonger", ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    startRound(io, roomCode);
  });
}

function startRound(io, roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;

  const currentSong = room.songs[room.currentSongIndex];
  const round = room.currentRound;

  if (round >= ROUND_DURATIONS.length) {
    io.to(roomCode).emit("roundFailed", {
      songNumber: room.currentSongIndex + 1,
      totalSongs: room.songs.length,
      allRoundsUsed: true,
      songTitle: currentSong.correctAnswer, // 🆕 שליחת שם השיר
    });
    return;
  }

  const duration = ROUND_DURATIONS[round];
  const roundDeadline = Date.now() + 15000;

  room.currentRound++;
  room.correctUsers = new Set();
  room.guessedUsers = new Set();
  room.currentTimeout && clearTimeout(room.currentTimeout);

  io.to(roomCode).emit("nextRound", {
    audioUrl: currentSong.audioUrl,
    duration,
    roundNumber: round + 1,
    roundDeadline,
    songNumber: room.currentSongIndex + 1,
    totalSongs: room.songs.length,
  });

  room.currentTimeout = setTimeout(() => {
    finishRound(io, roomCode);
  }, 15000);
}

function finishRound(io, roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;

  const currentSong = room.songs[room.currentSongIndex];

  if (room.correctUsers.size === 0) {
    io.to(roomCode).emit("roundFailed", {
      songNumber: room.currentSongIndex + 1,
      totalSongs: room.songs.length,
      allRoundsUsed: room.currentRound >= ROUND_DURATIONS.length,
      songTitle: currentSong.correctAnswer,
    });
  } else {
    // ✅ לפחות שחקן אחד צדק
    io.to(roomCode).emit("roundSucceeded", {
      scores: room.scores,
    });
  }
}
