import { rooms } from "./roomEvents.js";

export const handlePlayerEvents = (io, socket) => {
  socket.on("joinRoom", ({ roomCode, username }) => {
    const room = rooms.get(roomCode);

    if (!room) {
      socket.emit("roomJoinError", "Room not found");
      return;
    }

    const alreadyJoined = room.players.some((p) => p.username === username);
    if (alreadyJoined) {
      socket.emit("roomJoinError", "Username already taken");
      return;
    }

    room.players.push({ socketId: socket.id, username });
    socket.join(roomCode);

    socket.emit("roomJoined");

    // 🔥 שולח רק למארגן (ולא לכולם) את השחקנים העדכניים
    io.to(room.hostSocketId).emit("updatePlayerList", {
      players: room.players.map((p) => p.username),
    });
  });
};
