import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
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
} from "react-icons/fa";

const CreateLessonPage = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [lessonData, setLessonData] = useState({
    title: "",
    description: "",
    difficulty: "beginner",
    duration: 30,
    maxStudents: 20,
    playbackStart: 0,
    playbackDuration: 10,
    analysisType: "pitch",
  });

  const mockSongs = [
    {
      id: 1,
      title: "Do-Re-Mi",
      artist: "The Sound of Music",
      duration: "2:18",
      preview_url: "https://example.com/do-re-mi.mp3",
      difficulty: "beginner",
      genre: "Educational",
    },
    {
      id: 2,
      title: "Twinkle Twinkle Little Star",
      artist: "Traditional",
      duration: "1:45",
      preview_url: "https://example.com/twinkle.mp3",
      difficulty: "beginner",
      genre: "Children's",
    },
    {
      id: 3,
      title: "Amazing Grace",
      artist: "Traditional Hymn",
      duration: "3:20",
      preview_url: "https://example.com/amazing-grace.mp3",
      difficulty: "intermediate",
      genre: "Spiritual",
    },
    {
      id: 4,
      title: "Happy Birthday",
      artist: "Traditional",
      duration: "0:30",
      preview_url: "https://example.com/happy-birthday.mp3",
      difficulty: "beginner",
      genre: "Celebration",
    },
  ];

  const filteredSongs = mockSongs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const difficultyLevels = [
    { value: "beginner", label: "Beginner", color: "bg-green-100 text-green-800" },
    { value: "intermediate", label: "Intermediate", color: "bg-yellow-100 text-yellow-800" },
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
    setSelectedSong(song);
    setCurrentStep(2);
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleInputChange = (field, value) => {
    setLessonData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateLesson = () => {
    // Here you would typically send the lesson data to your backend
    console.log("Creating lesson:", {
      ...lessonData,
      selectedSong,
    });
    
    // For now, just navigate back to teacher dashboard
    navigate("/teacher-dashboard");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose a Song for Your Lesson
              </h2>
              <p className="text-gray-600">
                Select a song that your students will practice singing
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for songs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Songs List */}
            <div className="grid gap-4">
              {filteredSongs.map((song) => (
                <div
                  key={song.id}
                  onClick={() => handleSongSelect(song)}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center">
                        <FaMusic className="text-white text-lg" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {song.title}
                        </h3>
                        <p className="text-gray-600 text-sm">{song.artist}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">{song.duration}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            song.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                            song.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {song.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="bg-purple-100 text-purple-600 p-2 rounded-lg hover:bg-purple-200 transition-colors">
                        <FaPlay className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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

            {/* Selected Song Display */}
            {selectedSong && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center">
                    <FaMusic className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedSong.title}</h3>
                    <p className="text-gray-600 text-sm">{selectedSong.artist}</p>
                  </div>
                  <button
                    onClick={handlePlayPause}
                    className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                </div>
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
                  onChange={(e) => handleInputChange('title', e.target.value)}
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
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
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
                onChange={(e) => handleInputChange('description', e.target.value)}
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
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
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
                  onChange={(e) => handleInputChange('maxStudents', parseInt(e.target.value))}
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
                      onClick={() => handleInputChange('analysisType', type.value)}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                        lessonData.analysisType === type.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          lessonData.analysisType === type.value
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="text-lg" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{type.label}</h4>
                          <p className="text-sm text-gray-600">{type.description}</p>
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
                  <h1 className="text-2xl lg:text-3xl font-bold">Create New Lesson</h1>
                  <p className="text-purple-100">Design a vocal training lesson for your students</p>
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
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                currentStep >= 1 ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-purple-500' : 'bg-gray-200'}`}></div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                currentStep >= 2 ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
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
                onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate("/teacher-dashboard")}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FaArrowLeft className="text-sm" />
                <span>{currentStep > 1 ? 'Previous' : 'Cancel'}</span>
              </button>

              {currentStep === 2 ? (
                <button
                  onClick={handleCreateLesson}
                  disabled={!lessonData.title.trim()}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave className="text-sm" />
                  <span>Create Lesson</span>
                </button>
              ) : (
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!selectedSong}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <FaArrowLeft className="text-sm rotate-180" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CreateLessonPage;
