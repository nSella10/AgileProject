// src/pages/MyGames.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGamesWithState, useDeleteGameWithState } from "../hooks/useGames";
import PageLayout from "../components/PageLayout";
import {
  FaHeadphones,
  FaTrashAlt,
  FaEdit,
  FaPlay,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MyGames = () => {
  const { games, isLoading, error } = useGamesWithState();
  const { deleteGame } = useDeleteGameWithState();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "he";

  const handleDeleteClick = (game) => {
    setGameToDelete(game);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteGame(gameToDelete._id);
      toast.success(t("my_games.game_deleted"));
      setShowDeleteModal(false);
      setGameToDelete(null);
    } catch (error) {
      toast.error(t("my_games.delete_failed"));
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setGameToDelete(null);
  };

  const handleEditClick = (gameId) => {
    navigate(`/edit-game/${gameId}`);
  };

  return (
    <PageLayout>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-red-200">
            <div className="text-center">
              <div className="text-6xl mb-4">🗑️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {t("my_games.confirm_delete")}
              </h3>
              <p className="text-gray-600 mb-2">
                {t("my_games.confirm_delete")}
              </p>
              <p className="text-lg font-semibold text-red-600 mb-6">
                "{gameToDelete?.title}"?
              </p>
              <p className="text-sm text-gray-500 mb-8">
                {t("my_games.delete_warning")}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteCancel}
                  className={`flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <FaTimes />
                  {t("my_games.cancel")}
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className={`flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <FaCheck />
                  {t("my_games.delete_game")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              🎵 {t("my_games.title")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("my_games.subtitle")}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mb-4"></div>
              <p className="text-gray-600 text-lg">{t("common.loading")}</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">❌</div>
              <p className="text-red-600 text-lg font-semibold">
                {error?.data?.message || "Failed to load games."}
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && games?.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-gray-100">
              <div className="text-8xl mb-6">🎵</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {t("my_games.no_games")}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {t("my_games.start_creating")}
              </p>
              <button
                onClick={() => navigate("/create")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {t("my_games.create_first_game")}
              </button>
            </div>
          )}

          {/* Games Grid */}
          {!isLoading && games && games.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {games.map((game) => (
                <div
                  key={game._id}
                  className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {/* Game Header */}
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 leading-tight">
                      {game.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        game.isPublic
                          ? "bg-green-100 text-green-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {game.isPublic
                        ? `🌍 ${t("my_games.public_game")}`
                        : `🔒 ${t("my_games.private_game")}`}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {game.description || "No description provided."}
                  </p>

                  {/* Song Count */}
                  <div className="flex items-center gap-2 mb-8 text-purple-600">
                    <FaHeadphones className="text-lg" />
                    <span className="font-semibold">
                      {t("my_games.songs_count", { count: game.songs.length })}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditClick(game._id)}
                      className={`flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <FaEdit />
                      {t("my_games.edit")}
                    </button>
                    <button
                      onClick={() => handleDeleteClick(game)}
                      className={`flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <FaTrashAlt />
                      {t("my_games.delete")}
                    </button>
                    <button
                      onClick={() => navigate(`/launch/${game._id}`)}
                      className={`flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <FaPlay />
                      {t("my_games.launch")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default MyGames;
