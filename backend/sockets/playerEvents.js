import { rooms } from "./roomEvents.js";

const availableEmojis = [
  "🐶",
  "🦊",
  "🐼",
  "🐵",
  "🐱",
  "🦁",
  "🐸",
  "🐻",
  "🦄",
  "🐯",
];

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

    // 🎲 הגרלת אימוג'י (בהתאם למספר שחקנים)
    const assignedEmoji =
      availableEmojis[room.players.length % availableEmojis.length];

    // הוספת שחקן עם אימוג'י
    const newPlayer = {
      socketId: socket.id,
      username,
      emoji: assignedEmoji,
    };
    room.players.push(newPlayer);

    socket.join(roomCode);
    socket.emit("roomJoined");

    // 🔥 שליחת אימוג'י לשחקן
    socket.emit("playerAssignedEmoji", { emoji: assignedEmoji });

    // 🧠 שליחת רשימת שחקנים כולל אימוג'ים למארגן
    io.to(room.hostSocketId).emit("updatePlayerList", {
      players: room.players.map((p) => ({
        username: p.username,
        emoji: p.emoji,
      })),
    });
  });
};
