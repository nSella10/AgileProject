// src/pages/CreateGamePage.jsx
import React, { useState } from "react";
import PageLayout from "../components/PageLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCreateGameMutation, gamesApiSlice } from "../slices/gamesApiSlice";
import { FaMusic, FaPlus, FaTrashAlt, FaUpload } from "react-icons/fa";

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

        <form className="space-y-8" onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Enter Game Title"
            className="w-full px-6 py-4 border-2 rounded-xl text-xl text-center shadow"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Enter Description (Optional)"
            className="w-full px-6 py-4 border-2 rounded-xl shadow resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          ></textarea>

          <div className="bg-gray-100 p-6 rounded-xl shadow">
            {songs.map((song, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 mb-4 shadow-md bg-white"
              >
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="Enter song name"
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

                  {/* שם הקובץ אם הועלה */}
                  {song.file && (
                    <span className="text-sm text-gray-600">
                      📁 {song.file.name}
                    </span>
                  )}

                  {songs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSong(index)}
                      className="ml-auto text-red-500 text-sm"
                    >
                      ❌ Remove
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addSong}
              className="flex gap-2 items-center text-indigo-600 hover:text-indigo-800 mt-4"
            >
              <FaPlus /> Add Another Song
            </button>
          </div>

          <div className="flex justify-center items-center gap-2">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <span>Make game public</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-all shadow-lg block mx-auto"
          >
            {isLoading ? "Creating..." : "Create Game"}
          </button>
        </form>
      </div>
    </PageLayout>
  );
};

export default CreateGamePage;
