// src/pages/CreateGamePage.jsx
import React, { useState } from "react";
import PageLayout from "../components/PageLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCreateGameMutation, gamesApiSlice } from "../slices/gamesApiSlice"; // חשוב לייבא גם את הסלייס עצמו

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

    if (!title || songs.length === 0 || songs.some((s) => !s.name || !s.file)) {
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
      <div className="max-w-xl mx-auto py-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-600">
          Create a New Game
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form className="space-y-4" onSubmit={submitHandler}>
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              className="w-full border px-3 py-2 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 font-medium">Songs</label>
            {songs.map((song, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Song Name"
                  className="flex-1 border px-2 py-1 rounded"
                  value={song.name}
                  onChange={(e) =>
                    handleSongChange(index, "name", e.target.value)
                  }
                />
                <input
                  type="file"
                  accept="audio/mp3"
                  className="flex-1 border px-2 py-1 rounded"
                  onChange={(e) =>
                    handleSongChange(index, "file", e.target.files[0])
                  }
                />
                {songs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSong(index)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSong}
              className="text-blue-600 hover:underline mt-1"
            >
              + Add Another Song
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <label>Make game public</label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isLoading ? "Creating..." : "Create Game"}
          </button>
        </form>
      </div>
    </PageLayout>
  );
};

export default CreateGamePage;
