import React from "react";

const HostWaitingScreen = ({ roomCode, players, onStart }) => {
  return (
    <div className="launch-game-container">
      <div className="info-box">
        <div className="pin-section">
          <h2>Game PIN</h2>
          <p className="pin-number">{roomCode || "------"}</p>
        </div>

        {players.length > 0 && (
          <>
            <div className="players-row">
              {players.map((player, idx) => (
                <div className="player-box fade-in" key={idx}>
                  <div className="player-icon">{player.emoji}</div>
                  <span className="player-name">{player.username}</span>
                </div>
              ))}
            </div>
            <button className="start-button" onClick={onStart}>
              Start
            </button>
          </>
        )}

        <div className="status-msg mt-4">Waiting for participants</div>
      </div>
    </div>
  );
};

export default HostWaitingScreen;
