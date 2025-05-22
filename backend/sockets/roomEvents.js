import { generateRoomCode } from "../utils/generateRoomCode.js";
import Game from "../models/Game.js";
import rooms from "./roomStore.js"; // ✅ שימוש במפה גלובלית משותפת

const handleRoomEvents = (io, socket) => {
  socket.on("createRoom", async ({ gameId }) => {
    try {
      const game = await Game.findById(gameId);
      if (!game) {
        socket.emit("roomJoinError", "Game not found");
        return;
      }

      const userId = socket.handshake.auth.userId;
      console.log(`User ID from socket: ${userId}`);
      console.log(`Game created by: ${game.createdBy}`);

      if (!userId || userId !== game.createdBy.toString()) {
        socket.emit("roomJoinError", "Unauthorized to launch this game");
        return;
      }

      const roomCode = generateRoomCode();

      rooms.set(roomCode, {
        hostSocketId: socket.id,
        gameId,
        players: [],
        currentSongIndex: 0,
        currentAudioDuration: 1000, // 1 שנייה בהתחלה
        scores: {}, // username -> score
      });

      socket.join(roomCode);

      // שולח למארגן את הקוד
      socket.emit("roomCreated", { roomCode });
      console.log(`🎮 Room created: ${roomCode} by ${socket.id}`);
    } catch (err) {
      console.error("❌ Error in createRoom:", err);
      socket.emit("roomJoinError", "Server error");
    }
  });
};

export default handleRoomEvents;
