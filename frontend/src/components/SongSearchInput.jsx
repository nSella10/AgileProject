import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaPlay, FaPause, FaPlus, FaTimes } from "react-icons/fa";
import { useLazySearchSongsQuery } from "../slices/gamesApiSlice";

const SongSearchInput = ({ onSongSelect, selectedSongs = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const audioRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const [searchSongs, { isLoading }] = useLazySearchSongsQuery();

  // חיפוש שירים דרך ה-API שלנו
  const handleSearch = useCallback(
    async (term) => {
      if (!term.trim()) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      try {
        const result = await searchSongs(term).unwrap();
        setSearchResults(result.results || []);
        setShowResults(true);
      } catch (error) {
        console.error("Error searching songs:", error);
        setSearchResults([]);
        setShowResults(false);
      }
    },
    [searchSongs]
  );

  // debounce לחיפוש
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, handleSearch]);

  // השמעת קטע מהשיר
  const playPreview = (previewUrl, trackId) => {
    if (currentlyPlaying === trackId) {
      // עצירת השמעה
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setCurrentlyPlaying(null);
    } else {
      // עצירת השמעה קודמת
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // השמעה חדשה
      if (previewUrl) {
        // נשתמש ב-URL ישיר - אם יש בעיות CORS, נציג הודעה
        const audioUrl = previewUrl;

        audioRef.current = new Audio(audioUrl);
        audioRef.current.crossOrigin = "anonymous";
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
        setCurrentlyPlaying(trackId);

        // עצירה אוטומטית כשהשיר נגמר
        audioRef.current.onended = () => {
          setCurrentlyPlaying(null);
        };
      }
    }
  };

  // בחירת שיר
  const selectSong = (song) => {
    const songData = {
      title: song.trackName,
      artist: song.artistName,
      previewUrl: song.previewUrl,
      artworkUrl: song.artworkUrl100,
      trackId: song.trackId,
    };

    onSongSelect(songData);
    setSearchTerm("");
    setShowResults(false);
    setSearchResults([]);

    // עצירת השמעה אם פועלת
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setCurrentlyPlaying(null);
  };

  // בדיקה אם השיר כבר נבחר
  const isSongSelected = (trackId) => {
    return selectedSongs.some((song) => song.trackId === trackId);
  };

  return (
    <div className="relative">
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          Search Songs
        </label>
        <input
          type="text"
          placeholder="Type song name or artist..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {/* תוצאות חיפוש */}
      {showResults && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Searching songs...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="p-2">
              {searchResults.map((song) => (
                <div
                  key={song.trackId}
                  className="flex items-center p-3 hover:bg-gray-50 rounded-lg border-b border-gray-100 last:border-b-0"
                >
                  {/* תמונת האלבום */}
                  <img
                    src={song.artworkUrl60}
                    alt={song.trackName}
                    className="w-12 h-12 rounded-md mr-3"
                  />

                  {/* פרטי השיר */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {song.trackName}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {song.artistName}
                    </p>
                  </div>

                  {/* כפתורי פעולה */}
                  <div className="flex items-center gap-2">
                    {/* כפתור השמעה */}
                    {song.previewUrl && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          playPreview(song.previewUrl, song.trackId);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Play preview"
                      >
                        {currentlyPlaying === song.trackId ? (
                          <FaPause size={16} />
                        ) : (
                          <FaPlay size={16} />
                        )}
                      </button>
                    )}

                    {/* כפתור בחירה */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        selectSong(song);
                      }}
                      disabled={isSongSelected(song.trackId)}
                      className={`p-2 rounded-full transition-colors ${
                        isSongSelected(song.trackId)
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-green-600 hover:bg-green-50"
                      }`}
                      title={
                        isSongSelected(song.trackId)
                          ? "Already selected"
                          : "Select song"
                      }
                    >
                      <FaPlus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}

      {/* רשימת שירים שנבחרו */}
      {selectedSongs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Selected Songs ({selectedSongs.length})
          </h3>
          <div className="space-y-2">
            {selectedSongs.map((song, index) => (
              <div
                key={song.trackId}
                className="flex items-center p-3 bg-gray-50 rounded-lg border"
              >
                <img
                  src={song.artworkUrl}
                  alt={song.title}
                  className="w-10 h-10 rounded-md mr-3"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{song.title}</p>
                  <p className="text-sm text-gray-600">{song.artist}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const updatedSongs = selectedSongs.filter(
                      (_, i) => i !== index
                    );
                    onSongSelect(updatedSongs, true); // true מציין שזה מחיקה
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Remove song"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SongSearchInput;
