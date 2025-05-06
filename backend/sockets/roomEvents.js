import { generateRoomCode } from "../utils/generateRoomCode.js";
import Game from "../models/Game.js"; // ודא שקיים הקובץ הזה
const rooms = new Map(); // key: roomCode, value: { hostSocketId, gameId, players: [] }

const handleRoomEvents = (io, socket) => {
  socket.on("createRoom", async ({ gameId }) => {
    try {
      const game = await Game.findById(gameId);
      if (!game) {
        socket.emit("roomJoinError", "Game not found");
        return;
      }

      const userId = socket.handshake.auth.userId;
      if (!userId || userId !== game.createdBy.toString()) {
        socket.emit("roomJoinError", "Unauthorized to launch this game");
        return;
      }

      const roomCode = generateRoomCode();

      rooms.set(roomCode, {
        hostSocketId: socket.id,
        gameId,
        players: [],
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
export { rooms }; // נייצא כדי שנוכל לגשת לרשימת החדרים בעתיד
