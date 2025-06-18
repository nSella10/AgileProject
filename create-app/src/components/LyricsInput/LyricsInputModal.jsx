import React, { useState } from "react";
import { toast } from "react-toastify";

/**
 * מודל להוספת מילות שיר ידנית
 */
const LyricsInputModal = ({
  isOpen,
  onClose,
  songData, // מכיל trackId, title, artist, previewUrl, artworkUrl
  onLyricsAdded,
}) => {
  const [lyrics, setLyrics] = useState("");
  const [language, setLanguage] = useState("hebrew");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!lyrics.trim()) {
      toast.error("Please enter the song lyrics");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/lyrics/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          trackId: songData?.trackId,
          title: songData?.title,
          artist: songData?.artist,
          lyrics: lyrics.trim(),
          language,
          previewUrl: songData?.previewUrl,
          artworkUrl: songData?.artworkUrl,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Lyrics added successfully to database! 🎵");
        onLyricsAdded(data.data);
        onClose();
        setLyrics("");
      } else {
        if (response.status === 409) {
          toast.warning("This song already exists in our database");
        } else {
          toast.error(data.message || "Failed to add lyrics");
        }
      }
    } catch (error) {
      console.error("Error adding lyrics:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setLyrics("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Add Song Lyrics</h2>
              <p className="text-purple-100 mt-1">
                Help build our lyrics database! 🎵
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
              disabled={isSubmitting}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Song Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Song Details:</h3>
            <p className="text-lg font-medium text-purple-600">
              "{songData?.title}" by {songData?.artist}
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Instructions:</strong> Please copy and paste the
                  complete lyrics from a reliable source (like the official
                  website, album booklet, or trusted lyrics site). Your
                  contribution will help other users enjoy this song in their
                  games!
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Language Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Song Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isSubmitting}
              >
                <option value="hebrew">Hebrew (עברית)</option>
                <option value="english">English</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Lyrics Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Song Lyrics *
              </label>
              <textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder="Paste the complete song lyrics here..."
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                disabled={isSubmitting}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {lyrics.length} characters
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || !lyrics.trim()}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </div>
                ) : (
                  "Add Lyrics"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3">
          <p className="text-xs text-gray-500 text-center">
            By adding lyrics, you help build our community database. Please
            ensure you have the right to share these lyrics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LyricsInputModal;
