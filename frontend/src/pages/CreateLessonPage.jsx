import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import SongSearchInput from "../components/SongSearchInput";
import { useCreateLessonMutation } from "../slices/lessonsApiSlice";
import { toast } from "react-toastify";
import {
  FaMusic,
  FaMicrophone,
  FaPlay,
  FaStop,
  FaPause,
  FaVolumeUp,
  FaSearch,
  FaClock,
  FaUsers,
  FaGraduationCap,
  FaSave,
  FaArrowLeft,
  FaWaveSquare,
  FaHeadphones,
  FaChartLine,
  FaTimes,
} from "react-icons/fa";

const CreateLessonPage = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [lessonData, setLessonData] = useState({
    title: "",
    description: "",
    difficulty: "beginner",
    duration: 30,
    maxStudents: 20,
    analysisType: "pitch",
  });

  const [createLesson, { isLoading }] = useCreateLessonMutation();

  const difficultyLevels = [
    {
      value: "beginner",
      label: "Beginner",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "intermediate",
      label: "Intermediate",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "advanced", label: "Advanced", color: "bg-red-100 text-red-800" },
  ];

  const analysisTypes = [
    {
      value: "pitch",
      label: "Pitch Accuracy",
      description: "Analyze how accurately students match the pitch",
      icon: FaWaveSquare,
    },
    {
      value: "rhythm",
      label: "Rhythm Timing",
      description: "Evaluate timing and rhythm accuracy",
      icon: FaClock,
    },
    {
      value: "tone",
      label: "Tone Quality",
      description: "Assess vocal tone and timbre",
      icon: FaHeadphones,
    },
    {
      value: "overall",
      label: "Overall Performance",
      description: "Comprehensive vocal analysis",
      icon: FaChartLine,
    },
  ];

  const handleSongSelect = (song) => {
    // Convert iTunes API format to our lesson format
    const formattedSong = {
      title: song.title || song.trackName,
      artist: song.artist || song.artistName,
      previewUrl: song.previewUrl,
      artworkUrl: song.artworkUrl || song.artworkUrl100,
      trackId: song.trackId,
      playbackStart: 0,
      playbackDuration: 10,
    };

    // Check if song is already selected
    const isAlreadySelected = selectedSongs.some(
      (s) => s.trackId === formattedSong.trackId
    );
    if (!isAlreadySelected) {
      setSelectedSongs((prev) => [...prev, formattedSong]);
    }
  };

  const removeSong = (trackId) => {
    setSelectedSongs((prev) => prev.filter((song) => song.trackId !== trackId));
    if (currentSongIndex >= selectedSongs.length - 1) {
      setCurrentSongIndex(Math.max(0, selectedSongs.length - 2));
    }
  };

  const updateSongSettings = (songIndex, field, value) => {
    setSelectedSongs((prev) =>
      prev.map((song, index) =>
        index === songIndex ? { ...song, [field]: value } : song
      )
    );
  };

  const handlePlayPause = () => {
    if (audioRef.current && selectedSongs[currentSongIndex]) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const currentSong = selectedSongs[currentSongIndex];
        audioRef.current.src = currentSong.previewUrl;
        audioRef.current.currentTime = currentSong.playbackStart || 0;
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleInputChange = (field, value) => {
    setLessonData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateLesson = async () => {
    if (!lessonData.title.trim() || selectedSongs.length === 0) {
      toast.error("Please provide a title and select at least one song.");
      return;
    }

    try {
      const lessonPayload = {
        ...lessonData,
        songs: selectedSongs,
      };

      await createLesson(lessonPayload).unwrap();
      toast.success("🎉 Lesson created successfully!");
      navigate("/teacher-dashboard");
    } catch (err) {
      console.error("Error creating lesson:", err);
      toast.error("Failed to create lesson. Please try again.");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose Songs for Your Lesson
              </h2>
              <p className="text-gray-600">
                Select one or more songs that your students will practice
                singing
              </p>
            </div>

            {/* Selected Songs Display */}
            {selectedSongs.length > 0 && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Selected Songs ({selectedSongs.length})
                </h3>
                <div className="space-y-3">
                  {selectedSongs.map((song, index) => (
                    <div
                      key={song.trackId}
                      className="flex items-center justify-between bg-white rounded-lg p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 rounded-lg flex items-center justify-center">
                          <FaMusic className="text-white text-sm" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {song.title}
                          </h4>
                          <p className="text-gray-600 text-sm">{song.artist}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeSong(song.trackId)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Song Search */}
            <SongSearchInput
              onSongSelect={handleSongSelect}
              selectedSongs={selectedSongs}
            />

            {/* Continue Button */}
            {selectedSongs.length > 0 && (
              <div className="text-center">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  Continue to Lesson Settings
                </button>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Configure Your Lesson
              </h2>
              <p className="text-gray-600">
                Set up the lesson parameters and analysis settings
              </p>
            </div>

            {/* Selected Songs Display with Settings */}
            {selectedSongs.length > 0 && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Song Settings ({selectedSongs.length} songs)
                </h3>
                {selectedSongs.map((song, index) => (
                  <div
                    key={song.trackId}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center">
                          <FaMusic className="text-white text-lg" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {song.title}
                          </h4>
                          <p className="text-gray-600 text-sm">{song.artist}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentSongIndex(index);
                          handlePlayPause();
                        }}
                        className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        {isPlaying && currentSongIndex === index ? (
                          <FaPause />
                        ) : (
                          <FaPlay />
                        )}
                      </button>
                    </div>

                    {/* Song-specific settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Playback Start (seconds)
                        </label>
                        <input
                          type="number"
                          value={song.playbackStart}
                          onChange={(e) =>
                            updateSongSettings(
                              index,
                              "playbackStart",
                              parseInt(e.target.value) || 0
                            )
                          }
                          min="0"
                          max="25"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Playback Duration (seconds)
                        </label>
                        <input
                          type="number"
                          value={song.playbackDuration}
                          onChange={(e) =>
                            updateSongSettings(
                              index,
                              "playbackDuration",
                              parseInt(e.target.value) || 10
                            )
                          }
                          min="5"
                          max="30"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Lesson Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Title
                </label>
                <input
                  type="text"
                  value={lessonData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter lesson title..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={lessonData.difficulty}
                  onChange={(e) =>
                    handleInputChange("difficulty", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {difficultyLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson Description
              </label>
              <textarea
                value={lessonData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe what students will learn in this lesson..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Lesson Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Duration (minutes)
                </label>
                <input
                  type="number"
                  value={lessonData.duration}
                  onChange={(e) =>
                    handleInputChange("duration", parseInt(e.target.value))
                  }
                  min="5"
                  max="120"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Students
                </label>
                <input
                  type="number"
                  value={lessonData.maxStudents}
                  onChange={(e) =>
                    handleInputChange("maxStudents", parseInt(e.target.value))
                  }
                  min="1"
                  max="50"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Analysis Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Analysis Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.value}
                      onClick={() =>
                        handleInputChange("analysisType", type.value)
                      }
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                        lessonData.analysisType === type.value
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            lessonData.analysisType === type.value
                              ? "bg-purple-500 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <Icon className="text-lg" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {type.label}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/teacher-dashboard")}
                  className="bg-white/20 backdrop-blur-sm p-2 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <FaArrowLeft className="text-xl" />
                </button>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold">
                    Create New Lesson
                  </h1>
                  <p className="text-purple-100">
                    Design a vocal training lesson for your students
                  </p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <FaGraduationCap className="text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep >= 1
                    ? "bg-purple-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <div
                className={`w-16 h-1 ${
                  currentStep >= 2 ? "bg-purple-500" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep >= 2
                    ? "bg-purple-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() =>
                  currentStep > 1
                    ? setCurrentStep(currentStep - 1)
                    : navigate("/teacher-dashboard")
                }
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FaArrowLeft className="text-sm" />
                <span>{currentStep > 1 ? "Previous" : "Cancel"}</span>
              </button>

              {currentStep === 2 ? (
                <button
                  onClick={handleCreateLesson}
                  disabled={
                    !lessonData.title.trim() || selectedSongs.length === 0
                  }
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave className="text-sm" />
                  <span>Create Lesson</span>
                </button>
              ) : (
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={selectedSongs.length === 0}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <FaArrowLeft className="text-sm rotate-180" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
        />
      </div>
    </PageLayout>
  );
};

export default CreateLessonPage;
