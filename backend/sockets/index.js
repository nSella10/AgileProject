import handleRoomEvents from "./roomEvents.js";
import { handlePlayerEvents } from "./playerEvents.js";
import { handleGameEvents } from "./gameEvents.js";
import rooms from "../sockets/roomStore.js";

const socketManager = (io) => {
  io.on("connection", (socket) => {
    console.log(`📡 New client connected: ${socket.id}`);

    handleRoomEvents(io, socket);
    handlePlayerEvents(io, socket);
    handleGameEvents(io, socket);

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);

      // מחק כל חדר שמנוהל ע"י הסוקט שהתנתק
      for (const [code, room] of rooms.entries()) {
        if (room.hostSocketId === socket.id) {
          console.log(`🧹 Cleaning up room ${code} (host disconnected)`);
          rooms.delete(code);
        }
      }
    });
  });
};

export default socketManager;
