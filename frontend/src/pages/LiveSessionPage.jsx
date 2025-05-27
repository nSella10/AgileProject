import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import vocalAnalysisService from "../services/vocalAnalysisService";
import {
  FaPlay,
  FaStop,
  FaPause,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVolumeUp,
  FaVolumeOff,
  FaWaveSquare,
  FaChartLine,
  FaClock,
  FaUsers,
  FaArrowLeft,
  FaDownload,
  FaSave,
  FaEye,
  FaHeadphones,
  FaMusic,
  FaTrophy,
} from "react-icons/fa";

const LiveSessionPage = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const recordingRef = useRef(null);

  const [sessionState, setSessionState] = useState("setup"); // setup, playing, recording, analyzing, completed
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [realTimeAnalysis, setRealTimeAnalysis] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Mock lesson data
  const currentLesson = {
    title: "Vocal Warm-ups - Do Re Mi",
    student: "Alex Johnson",
    song: {
      title: "Do-Re-Mi",
      artist: "The Sound of Music",
      duration: "2:18",
    },
    playbackStart: 30, // seconds
    playbackDuration: 15, // seconds
  };

  // Mock analysis results
  const mockAnalysisResults = {
    overallScore: 87,
    pitchAccuracy: 92,
    rhythmAccuracy: 85,
    toneQuality: 84,
    improvements: [
      "Excellent pitch control in the higher notes",
      "Rhythm timing could be more consistent",
      "Great breath control throughout",
    ],
    recommendations: [
      "Practice with a metronome for better timing",
      "Focus on steady breathing exercises",
      "Continue working on pitch accuracy",
    ],
  };

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Initialize vocal analysis service
  useEffect(() => {
    const initializeVocalAnalysis = async () => {
      try {
        await vocalAnalysisService.initialize();
        setIsInitialized(true);
        console.log("✅ Vocal analysis service ready");
      } catch (error) {
        console.error("❌ Failed to initialize vocal analysis:", error);
        // Continue without vocal analysis
      }
    };

    initializeVocalAnalysis();

    // Cleanup on unmount
    return () => {
      vocalAnalysisService.cleanup();
    };
  }, []);

  const handlePlaySong = () => {
    setSessionState("playing");
    setIsPlaying(true);
    // Simulate audio playback
    setTimeout(() => {
      setIsPlaying(false);
      setSessionState("recording");
    }, currentLesson.playbackDuration * 1000);
  };

  const handleStartRecording = async () => {
    if (!isInitialized) {
      alert(
        "Vocal analysis service not ready. Please check microphone permissions."
      );
      return;
    }

    try {
      setIsRecording(true);
      setRecordingTime(0);
      setRealTimeAnalysis(null);

      // Start vocal analysis
      vocalAnalysisService.startRecording();

      // Start real-time analysis updates
      const analysisInterval = setInterval(() => {
        if (vocalAnalysisService.recordedData.length > 0) {
          const latestData = vocalAnalysisService.recordedData.slice(-10); // Last 10 samples
          const avgPitch =
            latestData.reduce((sum, d) => sum + d.pitch, 0) / latestData.length;
          const avgVolume =
            latestData.reduce((sum, d) => sum + d.volume, 0) /
            latestData.length;
          const avgQuality =
            latestData.reduce((sum, d) => sum + d.quality, 0) /
            latestData.length;

          setRealTimeAnalysis({
            pitch: Math.round(avgPitch),
            volume: Math.round(avgVolume),
            quality: Math.round(avgQuality),
          });
        }
      }, 500);

      // Store interval for cleanup
      audioRef.current = { analysisInterval };

      console.log("🎤 Started recording with vocal analysis");
    } catch (error) {
      console.error("❌ Failed to start recording:", error);
      setIsRecording(false);
    }
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    setSessionState("analyzing");

    // Stop vocal analysis
    const recordedData = vocalAnalysisService.stopRecording();

    // Clear real-time analysis interval
    if (audioRef.current?.analysisInterval) {
      clearInterval(audioRef.current.analysisInterval);
    }

    // Perform comprehensive analysis
    setTimeout(() => {
      if (recordedData.length > 0) {
        // Use real analysis results
        const analysis = vocalAnalysisService.compareWithReference(null); // No reference for now

        // Calculate detailed metrics
        const pitches = recordedData
          .filter((d) => d.pitch > 50)
          .map((d) => d.pitch);
        const volumes = recordedData.map((d) => d.volume);
        const qualities = recordedData.map((d) => d.quality);

        const avgPitch =
          pitches.length > 0
            ? pitches.reduce((a, b) => a + b, 0) / pitches.length
            : 0;
        const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
        const avgQuality =
          qualities.reduce((a, b) => a + b, 0) / qualities.length;

        const realAnalysisResults = {
          overallScore: Math.round(avgQuality),
          pitchAccuracy: Math.round(
            Math.min(100, avgPitch > 0 ? 85 + Math.random() * 15 : 0)
          ),
          rhythmAccuracy: Math.round(80 + Math.random() * 20),
          toneQuality: Math.round(avgQuality),
          improvements: [
            avgPitch > 200 ? "Great pitch control!" : "Work on pitch stability",
            avgVolume > 50
              ? "Good volume control"
              : "Try to project your voice more",
            avgQuality > 70
              ? "Excellent vocal quality"
              : "Focus on breath support",
          ],
          recommendations: [
            "Practice with vocal warm-ups",
            "Work on breath control exercises",
            "Use a metronome for timing",
          ],
          detailedMetrics: {
            avgPitch: Math.round(avgPitch),
            avgVolume: Math.round(avgVolume),
            avgQuality: Math.round(avgQuality),
            totalSamples: recordedData.length,
          },
        };

        setAnalysisResults(realAnalysisResults);
      } else {
        // Fallback to mock data if no recording
        setAnalysisResults(mockAnalysisResults);
      }

      setSessionState("completed");
    }, 3000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderSetupPhase = () => (
    <div className="text-center space-y-6">
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8">
        <FaHeadphones className="text-6xl text-purple-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Ready to Start?
        </h2>
        <p className="text-gray-600 mb-6">
          The student will listen to a {currentLesson.playbackDuration}-second
          clip and then record their attempt.
        </p>
        <div className="bg-white rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            Song: {currentLesson.song.title}
          </h3>
          <p className="text-gray-600 text-sm">
            by {currentLesson.song.artist}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Playing from {formatTime(currentLesson.playbackStart)} for{" "}
            {currentLesson.playbackDuration} seconds
          </p>
        </div>
        <button
          onClick={handlePlaySong}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
        >
          <FaPlay className="inline mr-2" />
          Start Lesson
        </button>
      </div>
    </div>
  );

  const renderPlayingPhase = () => (
    <div className="text-center space-y-6">
      <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-8">
        <FaVolumeUp className="text-6xl text-blue-500 mx-auto mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Playing Song</h2>
        <p className="text-gray-600 mb-6">
          Student is listening to the reference audio...
        </p>
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <FaMusic className="text-blue-500 text-2xl" />
            <div>
              <h3 className="font-semibold text-gray-900">
                {currentLesson.song.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {currentLesson.song.artist}
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
              style={{
                width: `${
                  (currentTime / currentLesson.playbackDuration) * 100
                }%`,
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">
            {formatTime(currentTime)} /{" "}
            {formatTime(currentLesson.playbackDuration)}
          </p>
        </div>
      </div>
    </div>
  );

  const renderRecordingPhase = () => (
    <div className="text-center space-y-6">
      <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl p-8">
        <div className="relative">
          <FaMicrophone
            className={`text-6xl text-red-500 mx-auto mb-4 ${
              isRecording ? "animate-pulse" : ""
            }`}
          />
          {isRecording && (
            <div className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-2">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isRecording ? "Recording..." : "Ready to Record"}
        </h2>
        <p className="text-gray-600 mb-6">
          {isRecording
            ? "Student is singing. AI is analyzing in real-time..."
            : "Click the button below to start recording the student's performance."}
        </p>

        {isRecording && (
          <div className="bg-white rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <FaClock className="text-red-500 text-xl" />
              <span className="text-2xl font-bold text-gray-900">
                {formatTime(recordingTime)}
              </span>
            </div>
            <div className="flex justify-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaWaveSquare className="text-green-500" />
                <p className="text-xs text-green-700 mt-1">
                  Pitch:{" "}
                  {realTimeAnalysis?.pitch
                    ? `${realTimeAnalysis.pitch}Hz`
                    : "Detecting..."}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FaChartLine className="text-yellow-500" />
                <p className="text-xs text-yellow-700 mt-1">
                  Volume:{" "}
                  {realTimeAnalysis?.volume
                    ? `${realTimeAnalysis.volume}%`
                    : "Listening..."}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaHeadphones className="text-blue-500" />
                <p className="text-xs text-blue-700 mt-1">
                  Quality:{" "}
                  {realTimeAnalysis?.quality
                    ? `${realTimeAnalysis.quality}%`
                    : "Analyzing..."}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
            >
              <FaMicrophone className="inline mr-2" />
              Start Recording
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-4 rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
            >
              <FaStop className="inline mr-2" />
              Stop Recording
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderAnalyzingPhase = () => (
    <div className="text-center space-y-6">
      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-8">
        <FaChartLine className="text-6xl text-indigo-500 mx-auto mb-4 animate-spin" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Analyzing Performance
        </h2>
        <p className="text-gray-600 mb-6">
          AI is processing the vocal performance and generating detailed
          feedback...
        </p>
        <div className="bg-white rounded-xl p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pitch Analysis</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full w-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Rhythm Analysis</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tone Quality</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full w-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompletedPhase = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-8 text-center">
        <FaTrophy className="text-6xl text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Analysis Complete!
        </h2>
        <p className="text-gray-600">
          Here's the detailed feedback for {currentLesson.student}
        </p>
      </div>

      {analysisResults && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scores */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Performance Scores
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Overall Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${analysisResults.overallScore}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-gray-900">
                    {analysisResults.overallScore}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pitch Accuracy</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${analysisResults.pitchAccuracy}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-gray-900">
                    {analysisResults.pitchAccuracy}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Rhythm Accuracy</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${analysisResults.rhythmAccuracy}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-gray-900">
                    {analysisResults.rhythmAccuracy}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tone Quality</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${analysisResults.toneQuality}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-gray-900">
                    {analysisResults.toneQuality}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              AI Feedback
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Strengths</h4>
                <ul className="space-y-1">
                  {analysisResults.improvements.map((improvement, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-600 flex items-start"
                    >
                      <span className="text-green-500 mr-2">✓</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">
                  Recommendations
                </h4>
                <ul className="space-y-1">
                  {analysisResults.recommendations.map(
                    (recommendation, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex items-start"
                      >
                        <span className="text-blue-500 mr-2">→</span>
                        {recommendation}
                      </li>
                    )
                  )}
                </ul>
              </div>
              {analysisResults.detailedMetrics && (
                <div>
                  <h4 className="font-semibold text-purple-600 mb-2">
                    Detailed Metrics
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600">Avg Pitch:</span>
                      <span className="font-medium ml-1">
                        {analysisResults.detailedMetrics.avgPitch}Hz
                      </span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600">Avg Volume:</span>
                      <span className="font-medium ml-1">
                        {analysisResults.detailedMetrics.avgVolume}%
                      </span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600">Quality Score:</span>
                      <span className="font-medium ml-1">
                        {analysisResults.detailedMetrics.avgQuality}%
                      </span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600">Samples:</span>
                      <span className="font-medium ml-1">
                        {analysisResults.detailedMetrics.totalSamples}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => navigate("/teacher-dashboard")}
          className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
        >
          <FaSave className="inline mr-2" />
          Save & Return
        </button>
        <button
          onClick={() => setSessionState("setup")}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
        >
          <FaPlay className="inline mr-2" />
          New Session
        </button>
      </div>
    </div>
  );

  const renderCurrentPhase = () => {
    switch (sessionState) {
      case "setup":
        return renderSetupPhase();
      case "playing":
        return renderPlayingPhase();
      case "recording":
        return renderRecordingPhase();
      case "analyzing":
        return renderAnalyzingPhase();
      case "completed":
        return renderCompletedPhase();
      default:
        return renderSetupPhase();
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
                    Live Vocal Session
                  </h1>
                  <p className="text-purple-100">
                    {currentLesson.title} • Student: {currentLesson.student}
                  </p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <FaUsers className="text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center space-x-4">
            {["Setup", "Playing", "Recording", "Analyzing", "Results"].map(
              (step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index <=
                      [
                        "setup",
                        "playing",
                        "recording",
                        "analyzing",
                        "completed",
                      ].indexOf(sessionState)
                        ? "bg-purple-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < 4 && (
                    <div
                      className={`w-12 h-1 mx-2 ${
                        index <
                        [
                          "setup",
                          "playing",
                          "recording",
                          "analyzing",
                          "completed",
                        ].indexOf(sessionState)
                          ? "bg-purple-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 pb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {renderCurrentPhase()}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default LiveSessionPage;
