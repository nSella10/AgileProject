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

    // 🎮 אם המשחק כבר התחיל, שלח למשתתף החדש את המצב הנוכחי
    if (room.status === "playing") {
      console.log(`🎮 Game already in progress, syncing player ${username}`);

      // שליחת אירוע שהמשחק התחיל
      socket.emit("gameStarting");

      // אם יש סיבוב פעיל, שלח את פרטי הסיבוב הנוכחי
      if (
        room.currentSongIndex !== undefined &&
        room.songs &&
        room.songs[room.currentSongIndex]
      ) {
        const currentSong = room.songs[room.currentSongIndex];
        const ROUND_DURATIONS = [1000, 2000, 3000, 4000, 5000];
        const duration = ROUND_DURATIONS[room.currentRound - 1] || 3000;

        console.log(`🎵 Syncing current round for ${username}:`, {
          songIndex: room.currentSongIndex,
          round: room.currentRound,
          duration,
        });

        // שלח את פרטי הסיבוב הנוכחי
        socket.emit("nextRound", {
          audioUrl: currentSong.previewUrl || currentSong.audioUrl,
          duration,
          startTime: 0,
          roundNumber: room.currentRound,
          songNumber: room.currentSongIndex + 1,
          totalSongs: room.songs.length,
        });

        // אם הטיימר כבר פועל, שלח גם timerStarted
        if (room.roundDeadline && room.roundDeadline > Date.now()) {
          const msLeft = room.roundDeadline - Date.now();
          socket.emit("timerStarted", {
            roundDeadline: room.roundDeadline,
            guessTimeLimit: room.game.guessTimeLimit,
          });
          console.log(
            `⏰ Synced timer for ${username}, ${Math.ceil(msLeft / 1000)}s left`
          );
        }
      }
    }
  });
};
