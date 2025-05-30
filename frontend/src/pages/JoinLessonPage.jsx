import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import {
  useLazyGetLessonByRoomCodeQuery,
  useAddStudentRecordingMutation,
} from "../slices/lessonsApiSlice";
import { toast } from "react-toastify";
import {
  FaMicrophone,
  FaPlay,
  FaPause,
  FaStop,
  FaMusic,
  FaUser,
  FaGraduationCap,
  FaSpinner,
  FaArrowLeft,
  FaVolumeUp,
} from "react-icons/fa";

const JoinLessonPage = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [studentName, setStudentName] = useState("");
  const [joined, setJoined] = useState(false);
  const [lessonData, setLessonData] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState("");

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const [getLessonByRoomCode, { isLoading }] =
    useLazyGetLessonByRoomCodeQuery();
  const [addStudentRecording] = useAddStudentRecordingMutation();

  const handleJoinLesson = async () => {
    if (!roomCode.trim() || !studentName.trim()) {
      setError("Please enter both room code and your name.");
      return;
    }

    try {
      const result = await getLessonByRoomCode(roomCode.trim()).unwrap();
      setLessonData(result);
      setJoined(true);
      setError("");
      toast.success(`Welcome to ${result.title}!`);
    } catch (err) {
      console.error("Error joining lesson:", err);
      setError(
        "Invalid room code or lesson not active. Please check and try again."
      );
    }
  };

  const handlePlaySong = () => {
    const currentSong = lessonData?.songs?.[lessonData.currentSongIndex || 0];
    if (audioRef.current && currentSong?.previewUrl) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.currentTime = currentSong.playbackStart || 0;
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "audio/wav" });
        setRecordingBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Recording started! Sing along with the song.");
    } catch (err) {
      console.error("Error starting recording:", err);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("Recording completed!");
    }
  };

  const analyzeRecording = async () => {
    // Mock AI analysis - in real implementation, this would send to backend
    setTimeout(async () => {
      const mockResult = {
        pitchAccuracy: Math.floor(Math.random() * 30) + 70, // 70-100
        rhythmAccuracy: Math.floor(Math.random() * 25) + 75, // 75-100
        overallScore: Math.floor(Math.random() * 20) + 80, // 80-100
        feedback:
          "Great job! Your pitch accuracy is improving. Try to focus on maintaining steady rhythm.",
      };

      // Save recording to database
      try {
        await addStudentRecording({
          lessonId: lessonData._id,
          studentName,
          songIndex: lessonData.currentSongIndex || 0,
          analysisResult: mockResult,
        }).unwrap();

        console.log("✅ Recording saved to database");
        toast.success("Analysis complete and saved!");
      } catch (error) {
        console.error("❌ Failed to save recording:", error);
        toast.error("Analysis completed but failed to save");
      }

      setAnalysisResult(mockResult);
    }, 2000);
  };

  if (!joined) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaMicrophone className="text-white text-2xl" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Join Vocal Lesson
                </h1>
                <p className="text-gray-600">
                  Enter the room code provided by your teacher
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Code
                  </label>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="Enter room code..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-lg font-mono"
                    maxLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={handleJoinLesson}
                  disabled={
                    isLoading || !roomCode.trim() || !studentName.trim()
                  }
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Joining...
                    </>
                  ) : (
                    "Join Lesson"
                  )}
                </button>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate("/")}
                  className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <FaMicrophone className="text-2xl" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold">
                    {lessonData?.title}
                  </h1>
                  <p className="text-purple-100">
                    Teacher: {lessonData?.teacher?.firstName}{" "}
                    {lessonData?.teacher?.lastName}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-purple-200">Room Code</div>
                <div className="text-xl font-bold font-mono">{roomCode}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Song Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FaMusic className="mr-2 text-purple-500" />
                Practice Song
              </h2>

              {lessonData?.songs && lessonData.songs.length > 0 && (
                <div className="space-y-4">
                  {/* Current Song Display */}
                  {(() => {
                    const currentSong =
                      lessonData.songs[lessonData.currentSongIndex || 0];
                    return (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {currentSong.title}
                            </h3>
                            <p className="text-gray-600">
                              {currentSong.artist}
                            </p>
                          </div>
                          {lessonData.songs.length > 1 && (
                            <div className="text-sm text-gray-500">
                              Song {(lessonData.currentSongIndex || 0) + 1} of{" "}
                              {lessonData.songs.length}
                            </div>
                          )}
                        </div>
                        {currentSong.playbackStart > 0 && (
                          <p className="text-xs text-gray-500">
                            Playing from{" "}
                            {Math.floor(currentSong.playbackStart / 60)}:
                            {(currentSong.playbackStart % 60)
                              .toString()
                              .padStart(2, "0")}
                            for {currentSong.playbackDuration}s
                          </p>
                        )}
                      </div>
                    );
                  })()}

                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={handlePlaySong}
                      className="bg-purple-500 text-white p-4 rounded-full hover:bg-purple-600 transition-colors"
                    >
                      {isPlaying ? (
                        <FaPause className="text-xl" />
                      ) : (
                        <FaPlay className="text-xl" />
                      )}
                    </button>
                    <span className="text-gray-600">
                      {isPlaying ? "Playing..." : "Click to play"}
                    </span>
                  </div>

                  {(() => {
                    const currentSong =
                      lessonData.songs[lessonData.currentSongIndex || 0];
                    return (
                      currentSong.previewUrl && (
                        <audio
                          ref={audioRef}
                          src={currentSong.previewUrl}
                          onEnded={() => setIsPlaying(false)}
                          onPause={() => setIsPlaying(false)}
                        />
                      )
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Recording Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FaMicrophone className="mr-2 text-pink-500" />
                Your Recording
              </h2>

              <div className="space-y-4">
                <div className="text-center">
                  {!isRecording && !recordingBlob && (
                    <button
                      onClick={startRecording}
                      className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center mx-auto"
                    >
                      <FaMicrophone className="mr-2" />
                      Start Recording
                    </button>
                  )}

                  {isRecording && (
                    <div className="space-y-4">
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center justify-center text-red-600">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                          Recording in progress...
                        </div>
                      </div>
                      <button
                        onClick={stopRecording}
                        className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors flex items-center justify-center mx-auto"
                      >
                        <FaStop className="mr-2" />
                        Stop Recording
                      </button>
                    </div>
                  )}

                  {recordingBlob && !analysisResult && (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-green-600">Recording completed!</p>
                      </div>
                      <button
                        onClick={analyzeRecording}
                        className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center mx-auto"
                      >
                        Analyze Performance
                      </button>
                    </div>
                  )}

                  {analysisResult && (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4">
                        Analysis Results
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Pitch Accuracy:</span>
                          <span className="font-semibold">
                            {analysisResult.pitchAccuracy}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rhythm Accuracy:</span>
                          <span className="font-semibold">
                            {analysisResult.rhythmAccuracy}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Overall Score:</span>
                          <span className="font-bold text-lg text-green-600">
                            {analysisResult.overallScore}%
                          </span>
                        </div>
                        <div className="mt-4 p-3 bg-white rounded-lg">
                          <p className="text-sm text-gray-700">
                            {analysisResult.feedback}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default JoinLessonPage;
