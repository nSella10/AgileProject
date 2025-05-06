// src/pages/MyGames.jsx
import React from "react";
import { useMyGamesQuery } from "../slices/gamesApiSlice";
import PageLayout from "../components/PageLayout";
import { FaHeadphones, FaTrashAlt, FaEye, FaPlay } from "react-icons/fa";
import "../styles/MyGamesPage.css";
import { useNavigate } from "react-router-dom";

const MyGames = () => {
  const { data: games, isLoading, error } = useMyGamesQuery();
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="mygames-container">
        <h2 className="text-4xl font-extrabold text-indigo-700 text-center mb-10">
          <span role="img" aria-label="note">
            🎵
          </span>{" "}
          My Music Games
        </h2>

        {isLoading && (
          <p className="text-gray-500 text-center">Loading games...</p>
        )}
        {error && (
          <p className="text-red-500 text-center">
            {error?.data?.message || "Failed to load games."}
          </p>
        )}

        {!isLoading && games?.length === 0 && (
          <p className="text-gray-500 text-center">
            You haven’t created any games yet.
          </p>
        )}

        <div className="games-grid">
          {games?.map((game) => (
            <div key={game._id} className="game-card soft-card">
              <div className="flex justify-between items-start mb-3">
                <h3 className="game-title">{game.title}</h3>
                <span
                  className={`badge ${
                    game.isPublic ? "badge-public" : "badge-private"
                  }`}
                >
                  {game.isPublic ? "Public" : "Private"}
                </span>
              </div>

              <p className="game-description">
                {game.description || "No description."}
              </p>

              <div className="text-sm text-gray-500 flex items-center gap-2 mt-2">
                <FaHeadphones />
                <span>
                  {game.songs.length} song{game.songs.length !== 1 && "s"}
                </span>
              </div>

              <div className="game-actions mt-6">
                <button className="btn view-btn">
                  <FaEye /> View
                </button>
                <button className="btn delete-btn">
                  <FaTrashAlt /> Delete
                </button>
                <button
                  className="btn play-btn"
                  onClick={() => navigate(`/launch/${game._id}`)}
                >
                  <FaPlay /> Play
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default MyGames;
