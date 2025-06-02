import rooms from "./roomStore.js"; // נייבא את ה-map של החדרים
import Game from "../models/Game.js";
import {
  analyzeAnswer,
  getAnswerTypeMessage,
} from "../utils/answerMatching.js";

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

  socket.on("submitAnswer", async ({ roomCode, answer, username }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    const currentSong = room.songs[room.currentSongIndex];
    if (room.guessedUsers.has(username)) return;

    // שמירת זמן התשובה
    const answerTime = Date.now();
    room.playerAnswerTimes[username] = answerTime;
    room.guessedUsers.add(username);

    // ניתוח התשובה עם המערכת החדשה (כולל AI)
    const timeTaken = answerTime - room.roundStartTime;
    const maxTime = room.game.guessTimeLimit * 1000; // המרה לאלפיות שנייה

    try {
      const answerResult = await analyzeAnswer(
        answer,
        currentSong,
        timeTaken,
        maxTime
      );

      console.log(`🎯 User answer: "${answer}"`);
      console.log(`🎯 Answer analysis:`, answerResult);
      console.log(`🔍 Match explanation: ${answerResult.explanation}`);

      // שמירת פרטי התשובה לשחקן
      if (!room.playerAnswers) {
        room.playerAnswers = {};
      }
      room.playerAnswers[username] = {
        answer: answer.trim(),
        result: answerResult,
        answerTime: answerTime,
      };

      // שליחת עדכון למארגן על תשובה שהתקבלה
      io.to(room.hostSocketId).emit("playerAnswered", {
        username,
        correct: answerResult.isCorrect,
        answerType: answerResult.type,
        totalAnswered: room.guessedUsers.size,
        totalPlayers: room.players.length,
      });

      if (answerResult.isCorrect) {
        room.correctUsers.add(username);

        // הוספת הניקוד
        if (!room.scores[username]) {
          room.scores[username] = 0;
        }
        room.scores[username] += answerResult.score;

        console.log(
          `🏆 ${username} scored ${answerResult.score} points for ${
            answerResult.type
          } (similarity: ${answerResult.similarity.toFixed(2)})`
        );
        console.log(`🏆 Updated scores:`, room.scores);

        io.to(socket.id).emit("answerFeedback", {
          correct: true,
          score: answerResult.score,
          answerType: answerResult.type,
          matchedText: answerResult.matchedText,
        });

        io.to(roomCode).emit("correctAnswer", {
          scores: room.scores,
          username,
          score: answerResult.score,
          answerType: answerResult.type,
        });
      } else {
        io.to(socket.id).emit("answerFeedback", {
          correct: false,
          answerType: "none",
        });
      }

      if (room.guessedUsers.size === room.players.length) {
        // ביטול הטיימר הנוכחי
        if (room.currentTimeout) {
          clearTimeout(room.currentTimeout);
        }

        // שליחת אירוע למארגן לעצור את הטיימר שלו
        io.to(room.hostSocketId).emit("allPlayersAnswered");

        // אם אף אחד לא צדק, נשלח למארגן אפשרות לבחור
        if (room.correctUsers.size === 0) {
          // בדיקה אם יש עוד סיבובים זמינים
          if (room.currentRound < ROUND_DURATIONS.length) {
            console.log(
              `🎯 All players guessed incorrectly, asking host for decision`
            );
            // שליחת אירוע למארגן לבחור אם להמשיך לסניפט ארוך יותר
            io.to(room.hostSocketId).emit("roundFailedAwaitingDecision", {
              songNumber: room.currentSongIndex + 1,
              totalSongs: room.songs.length,
              canReplayLonger: true,
            });
          } else {
            console.log(`🎯 All rounds used, finishing round`);
            finishRound(io, roomCode);
          }
        } else {
          // אם מישהו צדק, נסיים את הסיבוב
          finishRound(io, roomCode);
        }
      }
    } catch (error) {
      console.error("❌ Error analyzing answer:", error);

      // fallback - טיפול בשגיאה
      const fallbackResult = {
        type: "none",
        isCorrect: false,
        score: 0,
        matchedText: "",
        similarity: 0,
      };

      // שמירת פרטי התשובה לשחקן
      if (!room.playerAnswers) {
        room.playerAnswers = {};
      }
      room.playerAnswers[username] = {
        answer: answer.trim(),
        result: fallbackResult,
        answerTime: answerTime,
      };

      // שליחת עדכון למארגן על תשובה שהתקבלה
      io.to(room.hostSocketId).emit("playerAnswered", {
        username,
        correct: false,
        answerType: "none",
        totalAnswered: room.guessedUsers.size,
        totalPlayers: room.players.length,
      });

      // שליחת תגובה לשחקן
      io.to(socket.id).emit("answerFeedback", {
        correct: false,
        answerType: "none",
      });

      // בדיקה אם כל השחקנים ענו
      if (room.guessedUsers.size === room.players.length) {
        // ביטול הטיימר הנוכחי
        if (room.currentTimeout) {
          clearTimeout(room.currentTimeout);
        }

        // שליחת אירוע למארגן לעצור את הטיימר שלו
        io.to(room.hostSocketId).emit("allPlayersAnswered");

        // אם אף אחד לא צדק, נשלח למארגן אפשרות לבחור
        if (room.correctUsers.size === 0) {
          // בדיקה אם יש עוד סיבובים זמינים
          if (room.currentRound < ROUND_DURATIONS.length) {
            console.log(
              `🎯 All players guessed incorrectly (with error), asking host for decision`
            );
            // שליחת אירוע למארגן לבחור אם להמשיך לסניפט ארוך יותר
            io.to(room.hostSocketId).emit("roundFailedAwaitingDecision", {
              songNumber: room.currentSongIndex + 1,
              totalSongs: room.songs.length,
              canReplayLonger: true,
            });
          } else {
            console.log(`🎯 All rounds used (with error), finishing round`);
            finishRound(io, roomCode);
          }
        } else {
          // אם מישהו צדק, נסיים את הסיבוב
          finishRound(io, roomCode);
        }
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

      // שליחת אירוע למארגן לעצור את הטיימר שלו
      io.to(room.hostSocketId).emit("allPlayersAnswered");

      // אם אף אחד לא צדק, נשלח למארגן אפשרות לבחור
      if (room.correctUsers.size === 0) {
        // בדיקה אם יש עוד סיבובים זמינים
        if (room.currentRound < ROUND_DURATIONS.length) {
          console.log(
            `⏭️ All players guessed/skipped incorrectly, asking host for decision`
          );
          // שליחת אירוע למארגן לבחור אם להמשיך לסניפט ארוך יותר
          io.to(room.hostSocketId).emit("roundFailedAwaitingDecision", {
            songNumber: room.currentSongIndex + 1,
            totalSongs: room.songs.length,
            canReplayLonger: true,
          });
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

  socket.on("skipToNextSong", ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    console.log(`⏭️ Host chose to skip to next song`);
    finishRound(io, roomCode);
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
  room.playerAnswers = {}; // איפוס תשובות השחקנים מהסבב הקודם
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

  // יצירת מפה של שמות משתמשים לאימוג'ים
  const playerEmojiMap = {};
  room.players.forEach((player) => {
    playerEmojiMap[player.username] = player.emoji;
  });

  // יצירת סיכום תשובות השחקנים
  const playerAnswersSummary = {};
  if (room.playerAnswers) {
    Object.entries(room.playerAnswers).forEach(([username, answerData]) => {
      playerAnswersSummary[username] = {
        answer: answerData.answer,
        answerType: answerData.result.type,
        answerTypeMessage: getAnswerTypeMessage(answerData.result, "he"),
        score: answerData.result.score,
        isCorrect: answerData.result.isCorrect,
        matchedText: answerData.result.matchedText,
      };
    });
  }

  if (room.correctUsers.size === 0) {
    io.to(roomCode).emit("roundFailed", {
      songNumber: room.currentSongIndex + 1,
      totalSongs: room.songs.length,
      allRoundsUsed: room.currentRound >= ROUND_DURATIONS.length,
      songTitle: currentSong.correctAnswer,
      songPreviewUrl: currentSong.previewUrl,
      songArtist: currentSong.artist,
      songArtworkUrl: currentSong.artworkUrl,
      playerAnswers: playerAnswersSummary,
    });
  } else {
    // ✅ לפחות שחקן אחד צדק
    io.to(roomCode).emit("roundSucceeded", {
      scores: room.scores,
      playerEmojis: playerEmojiMap,
      songTitle: currentSong.correctAnswer,
      songPreviewUrl: currentSong.previewUrl,
      songArtist: currentSong.artist,
      songArtworkUrl: currentSong.artworkUrl,
      playerAnswers: playerAnswersSummary,
    });
  }
}
