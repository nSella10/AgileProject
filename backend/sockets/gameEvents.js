// backend/sockets/gameEvents.js
import { rooms } from "./roomEvents.js";
import Game from "../models/Game.js"; // לוודא שזה הנתיב הנכון לקובץ המודל שלך

const ROUND_DURATIONS = [1000, 3000, 5000]; // משך ההשמעה בכל סבב (מילישניות)

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

      startRound(io, roomId);
    } catch (error) {
      console.error("Error starting game:", error);
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
      io.to(roomId).emit("correctAnswer", {
        username,
        answer,
      });

      setTimeout(() => {
        room.currentSongIndex++;
        room.currentRound = 0;
        room.answeredCorrectly = false;

        if (room.currentSongIndex < room.songs.length) {
          startRound(io, roomId);
        } else {
          io.to(roomId).emit("gameOver");
          rooms.delete(roomId);
        }
      }, 3000); // להראות תוצאה 3 שניות ואז לשיר הבא
    }
  });
}

function startRound(io, roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  const currentSong = room.songs[room.currentSongIndex];
  const round = room.currentRound;

  if (round >= ROUND_DURATIONS.length) {
    // לא ניחשו נכון בכל הסבבים, עוברים לשיר הבא
    io.to(roomId).emit("roundFailed");

    setTimeout(() => {
      room.currentSongIndex++;
      room.currentRound = 0;
      room.answeredCorrectly = false;

      if (room.currentSongIndex < room.songs.length) {
        startRound(io, roomId);
      } else {
        io.to(roomId).emit("gameOver");
        rooms.delete(roomId);
      }
    }, 2000);
    return;
  }

  io.to(roomId).emit("nextRound", {
    audioUrl: currentSong.audioUrl,
    duration: ROUND_DURATIONS[round],
    roundNumber: round + 1,
  });

  room.currentRound++;
}
