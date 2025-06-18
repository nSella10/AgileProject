import React, { useState } from "react";
import { getSocket } from "../../socket";

const GameCodeInput = ({ roomCode, error, setRoomCode, onNext }) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomCode && roomCode.length === 5) {
      validateGameCode();
    }
  };

  const validateGameCode = () => {
    setIsValidating(true);
    setValidationError("");

    const socket = getSocket();

    // בדיקה אם הסוקט מחובר
    if (!socket.connected) {
      socket.once("connect", () => {
        performValidation(socket);
      });
    } else {
      performValidation(socket);
    }
  };

  const performValidation = (socket) => {
    // שליחת בקשה לבדיקת קוד המשחק בלבד (ללא הצטרפות)
    socket.emit("validateRoomCode", {
      roomCode: roomCode,
    });

    // מאזין לתגובה
    const handleValidationResult = (result) => {
      setIsValidating(false);

      if (result.isValid) {
        // הקוד תקין - עוברים לשלב הבא
        onNext();
      } else {
        // הקוד לא תקין - מציגים שגיאה
        setValidationError(result.error);
      }

      // הסרת המאזין אחרי השימוש
      socket.off("roomValidationResult", handleValidationResult);
    };

    socket.on("roomValidationResult", handleValidationResult);

    // timeout אם השרת לא עונה תוך 5 שניות
    setTimeout(() => {
      if (isValidating) {
        setIsValidating(false);
        setValidationError("Connection timeout. Please try again.");
        socket.off("roomValidationResult", handleValidationResult);
      }
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400 opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Join a Game
          </h1>
          <p className="text-xl text-purple-200 leading-relaxed">
            Enter the 5-digit game code to continue
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20 shadow-2xl">
            <div className="space-y-6">
              {/* Game Code Input */}
              <div>
                <label className="block text-white font-semibold mb-3 text-lg">
                  🎮 Game Code
                </label>
                <input
                  className="w-full p-4 rounded-2xl bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white placeholder-purple-200 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50 transition-all duration-200 text-center tracking-widest"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="00000"
                  value={roomCode}
                  onChange={(e) => {
                    // מאפשר רק מספרים
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setRoomCode(value);
                  }}
                  maxLength={5}
                  autoFocus
                />
              </div>

              {/* Next Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 rounded-2xl font-bold text-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={!roomCode || roomCode.length !== 5 || isValidating}
              >
                {isValidating ? (
                  <>
                    <span className="animate-spin inline-block mr-2">⏳</span>
                    Checking...
                  </>
                ) : (
                  "🚀 Join Game"
                )}
              </button>

              {/* Error Messages */}
              {(error || validationError) && (
                <div className="bg-red-500 bg-opacity-20 backdrop-blur-sm border border-red-400 border-opacity-30 rounded-2xl p-4 text-center">
                  <div className="text-red-200 font-medium">
                    ❌ {validationError || error}
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-purple-200 text-sm">
            💡 Don't have a game code? Ask the host to share it with you!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameCodeInput;
