import React from "react";

const JoinForm = ({
  roomCode,
  username,
  error,
  setRoomCode,
  setUsername,
  onJoin,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-800 text-white px-4">
      <h1 className="text-4xl font-bold mb-6">Join a Game</h1>
      <input
        className="mb-3 p-2 rounded text-black w-full max-w-sm"
        type="text"
        placeholder="Enter game code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />
      <input
        className="mb-3 p-2 rounded text-black w-full max-w-sm"
        type="text"
        placeholder="Enter your nickname"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button
        onClick={onJoin}
        className="bg-green-500 px-4 py-2 rounded font-semibold"
      >
        Join Game
      </button>
      {error && <p className="mt-4 text-red-300">{error}</p>}
    </div>
  );
};

export default JoinForm;
