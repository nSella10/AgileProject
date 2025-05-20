// src/pages/CreateGamePage.jsx
import React, { useState } from "react";
import PageLayout from "../components/PageLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCreateGameMutation, gamesApiSlice } from "../slices/gamesApiSlice";
import { FaPlus } from "react-icons/fa";

const CreateGamePage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [songs, setSongs] = useState([{ name: "", file: null }]);
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createGame, { isLoading }] = useCreateGameMutation();

  const handleSongChange = (index, field, value) => {
    const updated = [...songs];
    updated[index][field] = value;
    setSongs(updated);
  };

  const addSong = () => setSongs([...songs, { name: "", file: null }]);

  const removeSong = (index) => {
    const updated = [...songs];
    updated.splice(index, 1);
    setSongs(updated);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || songs.some((s) => !s.name || !s.file)) {
      setError("Please fill in all required fields and upload all songs.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("isPublic", isPublic);

    songs.forEach((song) => {
      formData.append("names", song.name);
      formData.append("songs", song.file);
    });

    try {
      await createGame(formData).unwrap();
      dispatch(gamesApiSlice.util.invalidateTags(["Game"]));
      navigate("/mygames");
    } catch (err) {
      setError(err?.data?.message || "Failed to create game.");
    }
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto py-10 px-6">
        <h2 className="text-4xl font-bold text-center text-indigo-600 mb-10">
          🎵 Create Your Music Game
        </h2>

        {error && <p className="text-red-500 mb-6 text-center">{error}</p>}

        <form
          onSubmit={submitHandler}
          className="bg-white p-8 rounded-2xl shadow-lg space-y-6"
        >
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Game Title
            </label>
            <input
              type="text"
              placeholder="Enter game title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description (optional)
            </label>
            <textarea
              placeholder="Write a short description..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-4">
              Upload Songs
            </label>
            <div className="space-y-4">
              {songs.map((song, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-gray-50 border border-gray-200 shadow-sm"
                >
                  <div className="mb-2">
                    <input
                      type="text"
                      placeholder="Song name"
                      value={song.name}
                      onChange={(e) =>
                        handleSongChange(index, "name", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-blue-600 cursor-pointer">
                      <span className="font-semibold">🎵 Upload MP3</span>
                      <input
                        type="file"
                        accept="audio/mp3"
                        onChange={(e) =>
                          handleSongChange(index, "file", e.target.files[0])
                        }
                        className="hidden"
                      />
                    </label>

                    {song.file && (
                      <span className="text-sm text-gray-600">
                        📁 {song.file.name}
                      </span>
                    )}

                    {songs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSong(index)}
                        className="ml-auto text-red-500 text-sm hover:underline"
                      >
                        ❌ Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addSong}
              className="mt-4 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <FaPlus /> Add Another Song
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <span className="text-gray-700">Make game public</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-all"
          >
            {isLoading ? "Creating..." : "Create Game"}
          </button>
        </form>
      </div>
    </PageLayout>
  );
};

export default CreateGamePage;
