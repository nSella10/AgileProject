import React from "react";
import { useMyGamesQuery } from "../slices/gamesApiSlice";
import PageLayout from "../components/PageLayout";
import { FaHeadphones, FaTrashAlt, FaEye } from "react-icons/fa";
import "../styles/MyGamesPage.css"; // Assuming you have a CSS file for styles
import { useNavigate } from "react-router-dom";

const MyGames = () => {
  const { data: games, isLoading, error } = useMyGamesQuery();
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 py-10 mygames-container">
        <h2 className="text-4xl font-bold text-blue-700 mb-8 text-center underline">
          🎵 My Games
        </h2>

        {isLoading && <p className="text-gray-500 text-center">Loading...</p>}
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
            <div key={game._id} className="game-card">
              <h3 className="game-title">{game.title}</h3>
              <p className="game-description">
                {game.description || "No description."}
              </p>

              <div className="game-detail">
                <FaHeadphones className="text-blue-500" />
                <span>
                  {game.songs.length} song{game.songs.length !== 1 && "s"}
                </span>
              </div>

              <p className="game-visibility">
                Visibility:{" "}
                <span className={game.isPublic ? "text-green" : "text-orange"}>
                  {game.isPublic ? "Public" : "Private"}
                </span>
              </p>

              <div className="game-actions">
                <button className="btn view-btn">
                  <FaEye /> View
                </button>
                <button className="btn delete-btn">
                  <FaTrashAlt /> Delete
                </button>
                <button
                  className="btn play-btn bg-blue-500 text-white"
                  onClick={() => navigate(`/launch/${game._id}`)}
                >
                  ▶️ Play
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
