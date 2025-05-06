import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import socket from "../socket";

const PlayerGameScreen = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomCode = queryParams.get("roomCode");
  const username = queryParams.get("username");

  const [score, setScore] = useState(0);
  const [isGuessing, setIsGuessing] = useState(false);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    // כשהשרת שולח אות להתחלת הסיבוב
    socket.on("startRound", () => {
      setIsGuessing(true);
      setGuess("");
      setFeedback("");
    });

    // כשהשרת מחזיר תגובה לניחוש
    socket.on("guessResult", ({ correct, message, newScore }) => {
      setFeedback(message);
      setIsGuessing(false);
      if (correct) setScore(newScore);
    });

    return () => {
      socket.off("startRound");
      socket.off("guessResult");
    };
  }, []);

  const handleSubmitGuess = () => {
    if (!guess) return;
    socket.emit("submitGuess", { roomCode, username, guess });
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-3xl font-bold mb-2">🎧 Guess the Song!</h2>
      <p className="text-lg mb-1">
        Player: <strong>{username}</strong>
      </p>
      <p className="text-lg mb-4">
        Score: <strong>{score}</strong>
      </p>

      {isGuessing ? (
        <>
          <p className="mb-3">The music is playing... Make your guess!</p>
          <input
            type="text"
            placeholder="Enter your guess here"
            className="p-2 rounded shadow"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
          />
          <button
            onClick={handleSubmitGuess}
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </>
      ) : (
        <p className="text-gray-600">Waiting for the next round to start...</p>
      )}

      {feedback && <p className="mt-4 font-semibold">{feedback}</p>}
    </div>
  );
};

export default PlayerGameScreen;
