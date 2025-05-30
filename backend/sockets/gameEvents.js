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
      finishRound(io, roomCode);
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
  socket.on("audioStarted", ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    console.log(`🎵 Audio started playing in room ${roomCode}`);
    console.log(
      `⏰ Audio started - timer already running since ${room.roundStartTime}`
    );

    // הטיימר כבר רץ מאז שהתחיל הסיבוב, לא צריך להתחיל אותו שוב
    // רק נעדכן שהאודיו התחיל בהצלחה
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
  });

  // שליחת טיימר מיד כשמתחיל הסיבוב (לא רק כשהאודיו מתחיל)
  console.log(
    `📤 Sending immediate timerStarted event with guessTimeLimit: ${room.game.guessTimeLimit}`
  );
  const immediateDeadline = Date.now() + room.game.guessTimeLimit * 1000;

  // הגדרת זמן התחלת הסיבוב לחישוב ניקוד
  room.roundStartTime = Date.now();
  room.roundDeadline = immediateDeadline;

  io.to(roomCode).emit("timerStarted", {
    roundDeadline: immediateDeadline,
    guessTimeLimit: room.game.guessTimeLimit,
  });

  // התחלת הטיימר בשרת מיד
  room.currentTimeout = setTimeout(() => {
    finishRound(io, roomCode);
  }, room.game.guessTimeLimit * 1000);
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
