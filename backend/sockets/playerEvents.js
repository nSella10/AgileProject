import rooms from "./roomStore.js"; // נייבא את ה-map של החדרים

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
    console.log(`➡️ joinRoom from ${username}, code: ${roomCode}`);
    console.log("📋 All active rooms:", [...rooms.keys()]);

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

    // אם המשחק כבר התחיל, הוסף את השחקן לניקוד עם 0 נקודות
    if (room.scores) {
      room.scores[username] = 0;
      console.log(`🏆 Added ${username} to scores with 0 points`);
    }

    socket.join(roomCode);
    console.log(`✅ Player ${username} joined room ${roomCode}`);
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
