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
  // בדיקת תקינות קוד משחק בלבד (ללא הצטרפות)
  socket.on("validateRoomCode", ({ roomCode }) => {
    console.log(`🔍 Validating room code: ${roomCode}`);

    const room = rooms.get(roomCode);
    if (!room) {
      console.log(`❌ Room ${roomCode} not found`);
      socket.emit("roomValidationResult", {
        isValid: false,
        error: "Game code is incorrect or game does not exist",
      });
      return;
    }

    // בדיקה אם המשחק כבר התחיל
    if (room.status === "playing") {
      console.log(`⚠️ Room ${roomCode} is already playing`);
      socket.emit("roomValidationResult", {
        isValid: false,
        error: "Game has already started",
      });
      return;
    }

    console.log(`✅ Room ${roomCode} is valid and available`);
    socket.emit("roomValidationResult", {
      isValid: true,
    });
  });

  // בדיקת סטטוס משחק קודם
  socket.on("checkPreviousGame", ({ roomCode, username }) => {
    console.log(
      `🔍 Checking previous game for "${username}" in room "${roomCode}"`
    );
    console.log("📦 Received data:", {
      roomCode,
      username,
      roomCodeType: typeof roomCode,
      usernameType: typeof username,
      timestamp: new Date().toISOString(),
    });

    const room = rooms.get(roomCode);
    if (!room) {
      console.log(`❌ Room ${roomCode} not found`);
      socket.emit("previousGameStatus", {
        canRejoin: false,
        reason: "Game not found",
        roomCode: roomCode,
        username: username,
      });
      return;
    }

    console.log(`🔍 Room found. Room state:`, {
      gameStatus: room.status,
      waitingForPlayer: room.waitingForPlayer,
      playersCount: room.players.length,
      hasPendingNotification: !!room.pendingNotification,
      pendingNotificationDetails: room.pendingNotification
        ? {
            username: room.pendingNotification.username,
            roomCode: room.pendingNotification.roomCode,
            timestamp: room.pendingNotification.timestamp,
            gameTitle: room.pendingNotification.gameTitle,
          }
        : null,
      originalPlayers: room.originalPlayers || [],
    });

    // בדיקה אם השחקן היה במשחק המקורי
    const wasInGame =
      room.originalPlayers && room.originalPlayers.includes(username);

    if (!wasInGame) {
      socket.emit("previousGameStatus", {
        canRejoin: false,
        reason: "Player was not in this game",
        roomCode: roomCode,
        username: username,
      });
      return;
    }

    // בדיקה אם המשחק עדיין פעיל
    if (room.status !== "playing") {
      socket.emit("previousGameStatus", {
        canRejoin: false,
        reason: "Game is not active",
        roomCode: roomCode,
        username: username,
      });
      return;
    }

    // בדיקה אם השחקן כבר מחובר
    const existingPlayer = room.players.find((p) => p.username === username);
    if (existingPlayer && existingPlayer.status === "connected") {
      socket.emit("previousGameStatus", {
        canRejoin: false,
        reason: "Player already connected",
        roomCode: roomCode,
        username: username,
      });
      return;
    }

    // בדיקה אם המארגן מחכה לשחקן (אם השחקן מנותק)
    const isDisconnected =
      existingPlayer && existingPlayer.status === "disconnected";
    const isWaitingForPlayer = room.waitingForPlayer === username;

    console.log(`🔍 Player status check:`, {
      isDisconnected,
      isWaitingForPlayer,
      existingPlayerStatus: existingPlayer?.status,
      waitingForPlayer: room.waitingForPlayer,
      username: username,
      roomCode: roomCode,
      existingPlayerExists: !!existingPlayer,
      existingPlayerDetails: existingPlayer
        ? {
            username: existingPlayer.username,
            status: existingPlayer.status,
            socketId: existingPlayer.socketId,
          }
        : null,
    });

    // בדיקה אם יש התראה ממתינה לשחקן הזה
    console.log(`🔍 Checking for pending notification:`, {
      hasPendingNotification: !!room.pendingNotification,
      pendingUsername: room.pendingNotification?.username,
      pendingRoomCode: room.pendingNotification?.roomCode,
      requestedUsername: username,
      requestedRoomCode: roomCode,
      usernameMatch: room.pendingNotification?.username === username,
      roomCodeMatch: room.pendingNotification?.roomCode === roomCode,
    });

    if (
      room.pendingNotification &&
      room.pendingNotification.username === username &&
      room.pendingNotification.roomCode === roomCode
    ) {
      console.log(
        `📬 Found pending notification for ${username}, sending hostWaitingForYou`
      );

      // שליחת ההתראה הממתינה
      const notificationData = {
        roomCode: room.pendingNotification.roomCode,
        username: room.pendingNotification.username,
        gameTitle: room.pendingNotification.gameTitle,
      };

      console.log(`📬 Sending hostWaitingForYou with data:`, notificationData);
      socket.emit("hostWaitingForYou", notificationData);

      // לא מנקים את ההתראה כאן - נשמור אותה עד שהשחקן יחליט מה לעשות
      console.log(
        `📬 Sent pending notification to ${username}, keeping it until decision`
      );
    } else {
      console.log(
        `📭 No pending notification found for ${username} in room ${roomCode}`
      );
    }

    // השחקן יכול לחזור רק אם המארגן החליט לחכות לו או אם השחקן מנותק
    if (isWaitingForPlayer || isDisconnected) {
      console.log(
        `✅ Host is waiting for ${username} or player is disconnected - allowing rejoin`
      );
      socket.emit("previousGameStatus", {
        canRejoin: true,
        roomCode: roomCode,
        username: username,
        gameTitle: room.game.title,
      });
    } else {
      console.log(`❌ Host is not waiting for ${username} - denying rejoin`);
      console.log(
        `🔍 Detailed check - isWaitingForPlayer: ${isWaitingForPlayer}, isDisconnected: ${isDisconnected}`
      );
      console.log(
        `🔍 room.waitingForPlayer: "${room.waitingForPlayer}", username: "${username}"`
      );
      console.log(
        `🔍 existingPlayer:`,
        existingPlayer
          ? {
              username: existingPlayer.username,
              status: existingPlayer.status,
              socketId: existingPlayer.socketId,
            }
          : "null"
      );

      socket.emit("previousGameStatus", {
        canRejoin: false,
        reason: "Host hasn't decided yet",
        roomCode: roomCode,
        username: username,
      });
    }
  });

  socket.on("joinRoom", ({ roomCode, username }) => {
    console.log(`➡️ joinRoom from ${username}, code: ${roomCode}`);
    console.log("📋 All active rooms:", [...rooms.keys()]);

    const room = rooms.get(roomCode);

    if (!room) {
      socket.emit("roomJoinError", "Room not found");
      return;
    }

    console.log(`🔍 Room status for ${username}: ${room.status}`);

    // בדיקה אם המשחק כבר התחיל - אם כן, רק שחקנים שהיו במשחק יכולים לחזור
    if (room.status === "playing") {
      const existingPlayer = room.players.find((p) => p.username === username);

      // בדיקה אם השחקן היה במשחק בעבר (גם אם נמחק)
      const wasInGame =
        room.originalPlayers && room.originalPlayers.includes(username);

      if (!existingPlayer && !wasInGame) {
        // שחקן חדש מנסה להצטרף למשחק שכבר התחיל
        console.log(
          `❌ New player ${username} tried to join active game ${roomCode}`
        );
        socket.emit(
          "roomJoinError",
          "Cannot join game in progress. Game has already started."
        );
        return;
      }

      // אם השחקן היה במשחק אבל נמחק, נוסיף אותו בחזרה
      if (!existingPlayer && wasInGame) {
        console.log(
          `🔄 Player ${username} was removed but is returning to game ${roomCode}`
        );

        // יצירת שחקן חדש עם אימוג'י
        const assignedEmoji =
          availableEmojis[room.players.length % availableEmojis.length];
        const returningPlayer = {
          socketId: socket.id,
          username,
          emoji: assignedEmoji,
          status: "connected",
        };
        room.players.push(returningPlayer);

        // הוספה בחזרה לניקוד עם 0 נקודות
        if (room.scores) {
          room.scores[username] = 0;
          console.log(`🏆 Re-added ${username} to scores with 0 points`);
        }

        socket.join(roomCode);
        socket.emit("roomJoined");
        socket.emit("playerAssignedEmoji", { emoji: assignedEmoji });

        // שליחת פרטי המשחק
        socket.emit("gameData", {
          guessTimeLimit: room.game.guessTimeLimit,
          guessInputMethod: room.game.guessInputMethod,
          title: room.game.title,
          description: room.game.description,
        });

        // עדכון המארגן
        io.to(room.hostSocketId).emit("playerReconnected", {
          username: username,
          emoji: assignedEmoji,
        });

        // עדכון רשימת השחקנים למארגן
        io.to(room.hostSocketId).emit("updatePlayerList", {
          players: room.players
            .filter((p) => p.status !== "disconnected")
            .map((p) => ({
              username: p.username,
              emoji: p.emoji,
            })),
        });

        // סנכרון למצב המשחק הנוכחי
        console.log(
          `🎮 Game in progress, syncing returning player ${username}`
        );
        socket.emit("gameStarting");

        const isRoundActive =
          room.roundDeadline && room.roundDeadline > Date.now();

        socket.emit("syncGameState", {
          currentSongIndex: room.currentSongIndex,
          currentRound: room.currentRound,
          scores: room.scores,
          playerScore: room.scores[username] || 0,
          isRoundActive: isRoundActive,
          totalSongs: room.songs ? room.songs.length : 1,
        });

        return;
      }

      if (existingPlayer.status === "connected") {
        // השחקן כבר מחובר
        console.log(
          `❌ Player ${username} already connected to room ${roomCode}`
        );
        socket.emit("roomJoinError", "Username already taken");
        return;
      }

      // השחקן חוזר למשחק - מנותק
      console.log(`🔄 Player ${username} is reconnecting to room ${roomCode}`);

      // עדכון פרטי החיבור
      existingPlayer.socketId = socket.id;
      existingPlayer.status = "connected";
      delete existingPlayer.disconnectedAt;

      socket.join(roomCode);
      socket.emit("roomJoined");
      socket.emit("playerAssignedEmoji", { emoji: existingPlayer.emoji });

      // שליחת פרטי המשחק
      socket.emit("gameData", {
        guessTimeLimit: room.game.guessTimeLimit,
        guessInputMethod: room.game.guessInputMethod,
        title: room.game.title,
        description: room.game.description,
      });

      // עדכון המארגן שהשחקן חזר
      console.log(
        `🔄 Sending playerReconnected event to host for ${existingPlayer.username}`
      );
      io.to(room.hostSocketId).emit("playerReconnected", {
        username: existingPlayer.username,
        emoji: existingPlayer.emoji,
      });

      // סגירת מודל ההמתנה אם היה פתוח
      console.log(
        `🔄 Sending closeWaitingModal event to host for ${existingPlayer.username}`
      );
      io.to(room.hostSocketId).emit("closeWaitingModal", {
        username: existingPlayer.username,
      });

      // ניקוי המידע שהמארגן מחכה לשחקן
      if (room.waitingForPlayer === existingPlayer.username) {
        delete room.waitingForPlayer;
        console.log(`🧹 Cleared waiting status for ${existingPlayer.username}`);
      }

      // ניקוי ההתראה הממתינה אם קיימת
      if (
        room.pendingNotification &&
        room.pendingNotification.username === existingPlayer.username
      ) {
        delete room.pendingNotification;
        console.log(
          `🧹 Cleared pending notification for ${existingPlayer.username}`
        );
      }

      // אם המשחק היה מושהה בגלל השחקן הזה, נחדש אותו
      if (room.status === "playing" && room.pausedTimeLeft !== undefined) {
        console.log(`▶️ Resuming game after ${username} returned`);
        resumeGame(io, roomCode);
      }

      // עדכון רשימת השחקנים למארגן
      io.to(room.hostSocketId).emit("updatePlayerList", {
        players: room.players
          .filter((p) => p.status !== "disconnected")
          .map((p) => ({
            username: p.username,
            emoji: p.emoji,
          })),
      });

      // אם המשחק כבר התחיל, סנכרן את השחקן למצב הנוכחי
      if (room.status === "playing") {
        console.log(
          `🎮 Game in progress, syncing reconnected player ${username}`
        );
        socket.emit("gameStarting");

        // בדיקה אם יש סיבוב פעיל כרגע
        const isRoundActive =
          room.roundDeadline && room.roundDeadline > Date.now();

        console.log(`🔍 Round status for ${username}:`, {
          roundDeadline: room.roundDeadline,
          currentTime: Date.now(),
          isRoundActive: isRoundActive,
        });

        // שליחת המצב הנוכחי של המשחק
        socket.emit("syncGameState", {
          currentSongIndex: room.currentSongIndex,
          currentRound: room.currentRound,
          scores: room.scores,
          playerScore: room.scores[username] || 0,
          isRoundActive: isRoundActive,
          totalSongs: room.songs ? room.songs.length : 1,
        });
      }

      return;
    }

    // בדיקה אם השחקן כבר קיים במשחק שעדיין לא התחיל
    const existingPlayer = room.players.find((p) => p.username === username);
    if (existingPlayer) {
      // השחקן כבר קיים
      console.log(`❌ Player ${username} already exists in room ${roomCode}`);
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
      status: "connected", // סטטוס ברירת מחדל
    };
    room.players.push(newPlayer);

    // שחקן חדש יכול להצטרף רק למשחק שעדיין לא התחיל
    // (הבדיקה כבר נעשתה למעלה)

    socket.join(roomCode);
    console.log(`✅ Player ${username} joined room ${roomCode}`);
    socket.emit("roomJoined");

    // 🔥 שליחת אימוג'י לשחקן
    socket.emit("playerAssignedEmoji", { emoji: assignedEmoji });

    // 🎮 שליחת פרטי המשחק לשחקן
    socket.emit("gameData", {
      guessTimeLimit: room.game.guessTimeLimit,
      guessInputMethod: room.game.guessInputMethod,
      title: room.game.title,
      description: room.game.description,
    });

    // 🧠 שליחת רשימת שחקנים כולל אימוג'ים למארגן (רק מחוברים)
    io.to(room.hostSocketId).emit("updatePlayerList", {
      players: room.players
        .filter((p) => p.status !== "disconnected")
        .map((p) => ({
          username: p.username,
          emoji: p.emoji,
        })),
    });

    // שחקנים חדשים יכולים להצטרף רק למשחק שעדיין לא התחיל
    // אם המשחק כבר התחיל, הם נחסמו למעלה
  });

  // טיפול(Initialized המארגן לגבי שחקן שהתנתק
  socket.on("handleDisconnectedPlayer", ({ roomCode, username, action }) => {
    console.log(
      `🎯 Host decision for disconnected player ${username}: ${action}`
    );

    const room = rooms.get(roomCode);
    if (!room || room.hostSocketId !== socket.id) return;

    const player = room.players.find((p) => p.username === username);
    if (!player) return;

    if (action === "waitForReturn") {
      console.log(`⏳ Host decided to wait for ${username} to return`);

      // שמירת המידע שהמארגן מחכה לשחקן הזה
      room.waitingForPlayer = username;
      console.log(`✅ Set room.waitingForPlayer to: ${room.waitingForPlayer}`);

      // שליחת קוד המשחק למארגן להצגה
      io.to(room.hostSocketId).emit("showRoomCodeForReconnection", {
        roomCode: roomCode,
        waitingForPlayer: username,
      });

      // שליחת התראה ישירה לכל הקליינטים - הקליינט יבדוק אם זה רלוונטי לו
      console.log(
        `🔔 About to send hostWaitingForYou notification to all clients`
      );
      io.emit("hostWaitingForYou", {
        roomCode: roomCode,
        username: username,
        gameTitle: room.game.title,
      });

      console.log(
        `🔔 Sent hostWaitingForYou notification for ${username} in room ${roomCode} to all clients`
      );

      // שמירת ההתראה במידע החדר כדי שתהיה זמינה כאשר השחקן יחזור
      room.pendingNotification = {
        type: "hostWaitingForYou",
        roomCode: roomCode,
        username: username,
        gameTitle: room.game.title,
        timestamp: Date.now(),
      };
      console.log(
        `💾 Saved pending notification for ${username}:`,
        room.pendingNotification
      );
    } else if (action === "continueWithoutPlayer") {
      console.log(`➡️ Host decided to continue without ${username}`);

      // שליחת התראה לכל הקליינטים שהמארגן החליט לא לחכות לשחקן
      io.emit("hostDecidedToContinueWithout", {
        roomCode: roomCode,
        username: username,
      });

      // ניקוי המידע שהמארגן מחכה לשחקן
      if (room.waitingForPlayer === username) {
        delete room.waitingForPlayer;
        console.log(`🧹 Cleared waiting status for ${username}`);
      }

      // ניקוי ההתראה הממתינה אם קיימת
      if (
        room.pendingNotification &&
        room.pendingNotification.username === username
      ) {
        delete room.pendingNotification;
        console.log(`🧹 Cleared pending notification for ${username}`);
      }

      // הסרת השחקן מהמשחק לחלוטין
      room.players = room.players.filter((p) => p.username !== username);

      // הסרה מהניקוד
      if (room.scores && room.scores[username] !== undefined) {
        delete room.scores[username];
      }

      // הסרה מרשימת השחקנים שענו
      if (room.guessedUsers) {
        room.guessedUsers.delete(username);
      }

      // המשך המשחק - חידוש הטיימר
      resumeGame(io, roomCode);

      // עדכון רשימת השחקנים למארגן
      io.to(room.hostSocketId).emit("updatePlayerList", {
        players: room.players
          .filter((p) => p.status !== "disconnected")
          .map((p) => ({
            username: p.username,
            emoji: p.emoji,
          })),
      });

      // עדכון כמות השחקנים הכוללת
      io.to(room.hostSocketId).emit("playerRemovedFromGame", {
        username: username,
        newTotalPlayers: room.players.length,
      });
    }
  });

  // בדיקה להתראות ממתינות כשהשחקן מתחבר לסוקט
  socket.on("checkPendingNotifications", ({ roomCode, username }) => {
    console.log(
      `🔍 Checking pending notifications for ${username} in room ${roomCode}`
    );

    const room = rooms.get(roomCode);
    if (!room) {
      console.log(`❌ Room ${roomCode} not found`);
      return;
    }

    // בדיקה אם יש התראה ממתינה לשחקן הזה
    if (
      room.pendingNotification &&
      room.pendingNotification.username === username &&
      room.pendingNotification.roomCode === roomCode
    ) {
      console.log(
        `📬 Found pending notification for ${username}, sending hostWaitingForYou`
      );

      // שליחת ההתראה הממתינה
      const notificationData = {
        roomCode: room.pendingNotification.roomCode,
        username: room.pendingNotification.username,
        gameTitle: room.pendingNotification.gameTitle,
      };

      console.log(`📬 Sending hostWaitingForYou with data:`, notificationData);
      socket.emit("hostWaitingForYou", notificationData);

      console.log(
        `📬 Sent pending notification to ${username} via checkPendingNotifications`
      );
    } else {
      console.log(
        `📭 No pending notification found for ${username} in room ${roomCode}`
      );
    }
  });

  // ביטול המתנה לשחקן מנותק
  socket.on("cancelWaitingForPlayer", ({ roomCode, username }) => {
    console.log(`❌ Host cancelled waiting for ${username}`);

    const room = rooms.get(roomCode);
    if (!room || room.hostSocketId !== socket.id) return;

    // ניקוי המידע שהמארגן מחכה לשחקן
    if (room.waitingForPlayer === username) {
      delete room.waitingForPlayer;
      console.log(`🧹 Cleared waiting status for ${username}`);
    }

    // ניקוי ההתראה הממתינה אם קיימת
    if (
      room.pendingNotification &&
      room.pendingNotification.username === username
    ) {
      delete room.pendingNotification;
      console.log(`🧹 Cleared pending notification for ${username}`);
    }

    // הסרת השחקן מהמשחק
    room.players = room.players.filter((p) => p.username !== username);

    if (room.scores && room.scores[username] !== undefined) {
      delete room.scores[username];
    }

    if (room.guessedUsers) {
      room.guessedUsers.delete(username);
    }

    // המשך המשחק - חידוש הטיימר
    resumeGame(io, roomCode);

    // עדכון המארגן
    io.to(room.hostSocketId).emit("updatePlayerList", {
      players: room.players
        .filter((p) => p.status !== "disconnected")
        .map((p) => ({
          username: p.username,
          emoji: p.emoji,
        })),
    });

    io.to(room.hostSocketId).emit("playerRemovedFromGame", {
      username: username,
      newTotalPlayers: room.players.length,
    });
  });

  // טיפול בשחקן שסירב לחזור למשחק
  socket.on("playerDeclinedRejoin", ({ roomCode, username }) => {
    console.log(`❌ Player ${username} declined to rejoin room ${roomCode}`);
    console.log(`📥 Received playerDeclinedRejoin event with data:`, {
      roomCode,
      username,
    });

    const room = rooms.get(roomCode);
    if (!room) {
      console.log(`❌ Room ${roomCode} not found`);
      return;
    }

    console.log(`✅ Room found, processing decline for ${username}`);
    console.log(`🔍 Current room state before processing:`, {
      waitingForPlayer: room.waitingForPlayer,
      playersCount: room.players.length,
      hostSocketId: room.hostSocketId,
      playersList: room.players.map((p) => ({
        username: p.username,
        status: p.status,
      })),
    });

    // לא מנקים את המידע שהמארגן מחכה לשחקן - המארגן עדיין מחכה
    // רק מנקים את ההתראה הממתינה כדי שלא תישלח שוב
    if (
      room.pendingNotification &&
      room.pendingNotification.username === username
    ) {
      delete room.pendingNotification;
      console.log(`🧹 Cleared pending notification for ${username}`);
    }

    console.log(
      `🔍 Keeping waitingForPlayer status - host is still waiting for ${username}`
    );
    console.log(`🔍 Current waitingForPlayer: ${room.waitingForPlayer}`);

    // יצירת התראה ממתינה חדשה אם המארגן עדיין מחכה לשחקן
    if (room.waitingForPlayer === username) {
      room.pendingNotification = {
        type: "hostWaitingForYou",
        roomCode: roomCode,
        username: username,
        gameTitle: room.game.title,
        timestamp: Date.now(),
      };
      console.log(
        `💾 Created new pending notification for ${username} after decline:`,
        room.pendingNotification
      );
    }

    // הסרת השחקן מהמשחק
    room.players = room.players.filter((p) => p.username !== username);

    if (room.scores && room.scores[username] !== undefined) {
      delete room.scores[username];
    }

    if (room.guessedUsers) {
      room.guessedUsers.delete(username);
    }

    console.log(`🔍 Room state after processing decline:`, {
      waitingForPlayer: room.waitingForPlayer,
      playersCount: room.players.length,
      playersList: room.players.map((p) => ({
        username: p.username,
        status: p.status,
      })),
    });

    // הודעה למארגן שהשחקן סירב לחזור
    console.log(`📤 Sending playerDeclinedRejoin to host ${room.hostSocketId}`);
    io.to(room.hostSocketId).emit("playerDeclinedRejoin", {
      username: username,
      newTotalPlayers: room.players.length,
    });
    console.log(`✅ playerDeclinedRejoin event sent to host`);

    // לא צריך לשלוח closeWaitingModal כי playerDeclinedRejoin כבר מטפל בסגירת המודל

    // המשך המשחק - חידוש הטיימר
    console.log(`🔄 Attempting to resume game for room ${roomCode}`);
    resumeGame(io, roomCode);

    // עדכון רשימת השחקנים למארגן
    io.to(room.hostSocketId).emit("updatePlayerList", {
      players: room.players
        .filter((p) => p.status !== "disconnected")
        .map((p) => ({
          username: p.username,
          emoji: p.emoji,
        })),
    });
  });
};

// פונקציה לחידוש המשחק אחרי השהיה
function resumeGame(io, roomCode) {
  const room = rooms.get(roomCode);
  if (!room || room.pausedTimeLeft === undefined) return;

  console.log(
    `▶️ Resuming game in room ${roomCode} with ${room.pausedTimeLeft}ms left`
  );

  // חידוש הטיימר עם הזמן שנותר
  const newDeadline = Date.now() + room.pausedTimeLeft;
  room.roundDeadline = newDeadline;

  // הודעה לכל השחקנים שהמשחק ממשיך
  io.to(roomCode).emit("gameResumed", {
    roundDeadline: newDeadline,
    timeLeft: room.pausedTimeLeft,
  });

  // התחלת טיימר חדש בשרת
  room.currentTimeout = setTimeout(async () => {
    try {
      // ייבוא דינמי של הפונקציה
      const { finishRound } = await import("./gameEvents.js");
      finishRound(io, roomCode);
    } catch (err) {
      console.error("❌ Error importing finishRound:", err);
      // סיום ידני של הסיבוב
      const room = rooms.get(roomCode);
      if (room) {
        io.to(roomCode).emit("roundEnded");
      }
    }
  }, room.pausedTimeLeft);

  // מחיקת הזמן המושהה
  delete room.pausedTimeLeft;
}
