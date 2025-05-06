import handleRoomEvents from "./roomEvents.js";
import { handlePlayerEvents } from "./playerEvents.js";
import { handleGameEvents } from "./gameEvents.js";

const socketManager = (io) => {
  io.on("connection", (socket) => {
    console.log(`📡 New client connected: ${socket.id}`);

    handleRoomEvents(io, socket);
    handlePlayerEvents(io, socket);
    handleGameEvents(io, socket);

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};

export default socketManager;
