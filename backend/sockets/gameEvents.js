import rooms from "./roomStore.js"; // נייבא את ה-map של החדרים
import Game from "../models/Game.js";

const ROUND_DURATIONS = [1000, 2000, 3000, 4000, 5000]; // 1s, 2s, 3s, 4s, 5s - יותר מאתגר!

export function handleGameEvents(io, socket) {
  socket.on("startGame", async ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    console.log(`🚀 Game started in room ${roomCode}`);
    io.to(roomCode).emit("gameStarting");

    try {
      const game = await Game.findById(room.gameId);
      if (!game || !game.songs || game.songs.length === 0) return;

      console.log(`🎮 Loaded game from DB:`, {
        id: game._id,
        title: game.title,
        guessTimeLimit: game.guessTimeLimit,
        songsCount: game.songs.length,
      });

      room.currentSongIndex = 0;
      room.currentRound = 0;
      room.songs = game.songs;
      room.game = game; // שמירת כל נתוני המשחק כולל guessTimeLimit
      room.status = "playing"; // הגדרת סטטוס המשחק

      // אתחול ניקוד לכל השחקנים עם 0 נקודות
      room.scores = {};
      room.players.forEach((player) => {
        room.scores[player.username] = 0;
      });

      room.currentTimeout = null;

      console.log(`🏆 Initialized scores for players:`, room.scores);
      console.log(`⏱️ Game guess time limit: ${game.guessTimeLimit} seconds`);
      startRound(io, roomCode);
    } catch (error) {
      console.error("❌ Error starting game:", error);
    }
  });

  socket.on("submitAnswer", ({ roomCode, answer, username }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    const currentSong = room.songs[room.currentSongIndex];
    if (room.guessedUsers.has(username)) return;

    // שמירת זמן התשובה
    const answerTime = Date.now();
    room.playerAnswerTimes[username] = answerTime;
    room.guessedUsers.add(username);

    // בדיקת תשובה נגד כל התשובות האפשריות
    const userAnswer = answer.trim().toLowerCase();
    const correctAnswers = currentSong.correctAnswers || [
      currentSong.correctAnswer,
    ];

    const correct = correctAnswers.some(
      (correctAnswer) => correctAnswer.trim().toLowerCase() === userAnswer
    );

    console.log(`🎯 User answer: "${userAnswer}"`);
    console.log(
      `🎯 Possible correct answers:`,
      correctAnswers.map((a) => `"${a.trim().toLowerCase()}"`)
    );
    console.log(`🎯 Answer is correct: ${correct}`);

    // שליחת צליל למארגן על תשובה שהתקבלה
    io.to(room.hostSocketId).emit("playerAnswered", {
      username,
      correct,
      totalAnswered: room.guessedUsers.size,
      totalPlayers: room.players.length,
    });

    if (correct) {
      room.correctUsers.add(username);

      // חישוב ניקוד מבוסס זמן
      const guessTimeLimit = room.game.guessTimeLimit * 1000; // המרה לאלפיות שנייה
      const timeTaken = answerTime - room.roundStartTime;
      const timeLeft = Math.max(0, guessTimeLimit - timeTaken);
      const timeRatio = timeLeft / guessTimeLimit;

      // ניקוד בסיס של 1000 נקודות, מוכפל ביחס הזמן שנותר
      const baseScore = 1000;
      const timeBonus = Math.floor(baseScore * timeRatio);
      const finalScore = Math.max(100, timeBonus); // מינימום 100 נקודות

      if (!room.scores[username]) {
        room.scores[username] = 0;
      }
      room.scores[username] += finalScore;

      console.log(
        `🏆 ${username} scored ${finalScore} points (time ratio: ${timeRatio.toFixed(
          2
        )})`
      );
      console.log(`🏆 Updated scores:`, room.scores);

      io.to(socket.id).emit("answerFeedback", {
        correct: true,
        score: finalScore,
      });

      io.to(roomCode).emit("correctAnswer", {
        scores: room.scores,
        username,
        score: finalScore,
      });
    } else {
      io.to(socket.id).emit("answerFeedback", {
        correct: false,
      });
    }

    if (room.guessedUsers.size === room.players.length) {
      // ביטול הטיימר הנוכחי
      if (room.currentTimeout) {
        clearTimeout(room.currentTimeout);
      }

      // אם אף אחד לא צדק, נמשיך לסניפט הבא
      if (room.correctUsers.size === 0) {
        // בדיקה אם יש עוד סיבובים זמינים
        if (room.currentRound < ROUND_DURATIONS.length) {
          console.log(
            `🎯 All players guessed incorrectly, moving to next round`
          );
          startRound(io, roomCode);
        } else {
          console.log(`🎯 All rounds used, finishing round`);
          finishRound(io, roomCode);
        }
      } else {
        // אם מישהו צדק, נסיים את הסיבוב
        finishRound(io, roomCode);
      }
    }
  });

  socket.on("skipSong", ({ roomCode, username }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    if (room.guessedUsers.has(username)) return;

    // סימון השחקן כמי שוויתר (מתנהג כמו תשובה שגויה)
    room.guessedUsers.add(username);

    console.log(`⏭️ ${username} skipped the song`);

    // שליחת תגובה לשחקן שוויתר (כמו תשובה שגויה)
    io.to(socket.id).emit("answerFeedback", {
      correct: false,
      skipped: true,
    });

    // שליחת עדכון למארגן
    io.to(room.hostSocketId).emit("playerAnswered", {
      username,
      correct: false,
      skipped: true,
      totalAnswered: room.guessedUsers.size,
      totalPlayers: room.players.length,
    });

    // בדיקה אם כל השחקנים ניחשו או וויתרו
    // אם כולם טעו/וויתרו (אף אחד לא צדק), נמשיך לסניפט הבא
    if (room.guessedUsers.size === room.players.length) {
      // ביטול הטיימר הנוכחי
      if (room.currentTimeout) {
        clearTimeout(room.currentTimeout);
      }

      // אם אף אחד לא צדק, נמשיך לסניפט הבא
      if (room.correctUsers.size === 0) {
        // בדיקה אם יש עוד סיבובים זמינים
        if (room.currentRound < ROUND_DURATIONS.length) {
          console.log(
            `⏭️ All players guessed/skipped incorrectly, moving to next round`
          );
          startRound(io, roomCode);
        } else {
          console.log(`⏭️ All rounds used, finishing round`);
          finishRound(io, roomCode);
        }
      } else {
        // אם מישהו צדק, נסיים את הסיבוב
        finishRound(io, roomCode);
      }
    }
  });

  socket.on("nextRound", ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    room.currentSongIndex++;
    room.currentRound = 0;

    if (room.currentSongIndex < room.songs.length) {
      startRound(io, roomCode);
    } else {
      // יצירת מפה של שמות משתמשים לאימוג'ים
      const playerEmojiMap = {};
      room.players.forEach((player) => {
        playerEmojiMap[player.username] = player.emoji;
      });

      const topScores = Object.entries(room.scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([username, score], index) => ({
          place: index + 1,
          username,
          score,
          emoji: playerEmojiMap[username] || "🎮", // הוספת אימוג'י
        }));

      io.to(roomCode).emit("gameOver", {
        leaderboard: topScores,
      });

      rooms.delete(roomCode);
    }
  });

  socket.on("replayLonger", ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    startRound(io, roomCode);
  });

  // אירוע חדש - כשהאודיו מתחיל להתנגן
  socket.on("audioStarted", (data) => {
    console.log(`🎵 Audio started event received:`, data);
    const { roomCode } = data;
    const room = rooms.get(roomCode);
    if (!room) return;

    console.log(`🎵 Audio started playing in room ${roomCode}`);
    console.log(
      `⏰ Audio started - waiting for audio to end before starting timer`
    );

    // הטיימר יתחיל רק כשהאודיו יסתיים
  });

  // אירוע חדש - כשהאודיו מסתיים
  socket.on("audioEnded", (data) => {
    console.log(`🎵 Audio ended event received:`, data);
    const { roomCode } = data;
    console.log(`🎵 Audio ended in room ${roomCode} - starting timer now`);
    const room = rooms.get(roomCode);

    if (!room) {
      console.log(`❌ Room ${roomCode} not found for audioEnded`);
      return;
    }

    console.log(`🔍 Room ${roomCode} status: ${room.status}`);
    if (room.status !== "playing") {
      console.log(
        `❌ Room ${roomCode} is not in playing status for audioEnded`
      );
      return;
    }

    // עכשיו נעדכן את הטיימר לזמן הנכון
    console.log(
      `📤 Updating timer after audio ended with guessTimeLimit: ${room.game.guessTimeLimit}`
    );
    const timerDeadline = Date.now() + room.game.guessTimeLimit * 1000;

    // עדכון זמן התחלת הסיבוב לחישוב ניקוד
    room.roundStartTime = Date.now();
    room.roundDeadline = timerDeadline;

    // ביטול הטיימר הקודם
    if (room.currentTimeout) {
      clearTimeout(room.currentTimeout);
    }

    io.to(roomCode).emit("timerStarted", {
      roundDeadline: timerDeadline,
      guessTimeLimit: room.game.guessTimeLimit,
    });

    // התחלת הטיימר החדש בשרת
    room.currentTimeout = setTimeout(() => {
      finishRound(io, roomCode);
    }, room.game.guessTimeLimit * 1000);
  });
}

function startRound(io, roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;

  const currentSong = room.songs[room.currentSongIndex];
  const round = room.currentRound;

  if (round >= ROUND_DURATIONS.length) {
    io.to(roomCode).emit("roundFailed", {
      songNumber: room.currentSongIndex + 1,
      totalSongs: room.songs.length,
      allRoundsUsed: true,
      songTitle: currentSong.correctAnswer, // 🆕 שליחת שם השיר
      songPreviewUrl: currentSong.previewUrl, // 🆕 שליחת URL לפזמון
      songArtist: currentSong.artist, // 🆕 שליחת שם האמן
      songArtworkUrl: currentSong.artworkUrl, // 🆕 שליחת תמונת השיר
    });
    return;
  }

  const duration = ROUND_DURATIONS[round];
  // לא נקבע deadline מראש - נקבע אותו כשהאודיו מתחיל

  room.currentRound++;
  room.correctUsers = new Set();
  room.guessedUsers = new Set();
  room.playerAnswerTimes = {}; // איפוס זמני התשובות
  room.currentTimeout && clearTimeout(room.currentTimeout);

  // שליחת URL ישיר של השיר
  let audioUrl = currentSong.previewUrl || currentSong.audioUrl;

  // בכל סיבוב נתחיל מההתחלה, אבל נתנגן יותר זמן
  const startTime = 0; // תמיד מתחילים מההתחלה

  console.log(
    `🎵 Starting round ${round + 1} for song ${room.currentSongIndex + 1}`
  );
  console.log(`⏱️ Duration: ${duration}ms`);
  console.log(`🔗 Audio URL: ${audioUrl}`);

  io.to(roomCode).emit("nextRound", {
    audioUrl,
    duration,
    startTime,
    roundNumber: round + 1,
    songNumber: room.currentSongIndex + 1,
    totalSongs: room.songs.length,
    currentSong: {
      title: currentSong.title,
      artist: currentSong.artist,
      correctAnswer: currentSong.correctAnswer,
    },
  });

  // נתחיל טיימר מיד עם השהיה של משך האודיו
  console.log(
    `📤 Starting timer with delay for audio duration: ${duration}ms, then guessTimeLimit: ${room.game.guessTimeLimit}s`
  );

  // נתחיל טיימר שיתחיל לספור רק אחרי שהאודיו נגמר
  const totalTime = duration + room.game.guessTimeLimit * 1000;
  const timerDeadline = Date.now() + totalTime;

  // הגדרת זמן התחלת הסיבוב לחישוב ניקוד - יתחיל אחרי האודיו
  room.roundStartTime = Date.now() + duration;
  room.roundDeadline = timerDeadline;

  // שליחת טיימר שיתחיל לספור אחרי שהאודיו נגמר
  setTimeout(() => {
    io.to(roomCode).emit("timerStarted", {
      roundDeadline: Date.now() + room.game.guessTimeLimit * 1000,
      guessTimeLimit: room.game.guessTimeLimit,
    });
  }, duration);

  // התחלת הטיימר בשרת - יסתיים אחרי האודיו + זמן הניחוש
  room.currentTimeout = setTimeout(() => {
    finishRound(io, roomCode);
  }, totalTime);
}

function finishRound(io, roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;

  const currentSong = room.songs[room.currentSongIndex];

  if (room.correctUsers.size === 0) {
    io.to(roomCode).emit("roundFailed", {
      songNumber: room.currentSongIndex + 1,
      totalSongs: room.songs.length,
      allRoundsUsed: room.currentRound >= ROUND_DURATIONS.length,
      songTitle: currentSong.correctAnswer,
      songPreviewUrl: currentSong.previewUrl, // 🆕 שליחת URL לפזמון
      songArtist: currentSong.artist, // 🆕 שליחת שם האמן
      songArtworkUrl: currentSong.artworkUrl, // 🆕 שליחת תמונת השיר
    });
  } else {
    // ✅ לפחות שחקן אחד צדק
    // יצירת מפה של שמות משתמשים לאימוג'ים
    const playerEmojiMap = {};
    room.players.forEach((player) => {
      playerEmojiMap[player.username] = player.emoji;
    });

    io.to(roomCode).emit("roundSucceeded", {
      scores: room.scores,
      playerEmojis: playerEmojiMap, // הוספת אימוג'ים
      songTitle: currentSong.correctAnswer, // 🆕 שליחת שם השיר גם בהצלחה
      songPreviewUrl: currentSong.previewUrl, // 🆕 שליחת URL לפזמון גם בהצלחה
      songArtist: currentSong.artist, // 🆕 שליחת שם האמן גם בהצלחה
      songArtworkUrl: currentSong.artworkUrl, // 🆕 שליחת תמונת השיר גם בהצלחה
    });
  }
}
