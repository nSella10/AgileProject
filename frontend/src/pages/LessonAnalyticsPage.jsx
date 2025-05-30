import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { useGetLessonRecordingsQuery, useGetLessonByIdQuery } from "../slices/lessonsApiSlice";
import {
  FaChartLine,
  FaUsers,
  FaMicrophone,
  FaArrowLeft,
  FaStar,
  FaMusic,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";

const LessonAnalyticsPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const { data: lessonData, isLoading: lessonLoading } = useGetLessonByIdQuery(lessonId);
  const { data: recordingsData, isLoading: recordingsLoading } = useGetLessonRecordingsQuery(lessonId);

  if (lessonLoading || recordingsLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin text-6xl text-purple-500 mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-gray-900">Loading Analytics...</h2>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!lessonData || !recordingsData) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h2>
            <button
              onClick={() => navigate("/teacher-dashboard")}
              className="bg-purple-500 text-white px-6 py-3 rounded-xl hover:bg-purple-600"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Calculate overall statistics
  const totalStudents = recordingsData.totalStudents || 0;
  const totalRecordings = recordingsData.totalRecordings || 0;
  const avgScore = recordingsData.recordings?.length > 0 
    ? Math.round(
        recordingsData.recordings
          .flatMap(student => student.recordings)
          .reduce((sum, recording) => sum + (recording.analysisResult?.overallScore || 0), 0) /
        totalRecordings
      )
    : 0;

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/teacher-dashboard")}
                  className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-colors"
                >
                  <FaArrowLeft className="text-xl" />
                </button>
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <FaChartLine className="text-2xl" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold">Lesson Analytics</h1>
                  <p className="text-purple-100">{lessonData.title}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-purple-200">Created</div>
                <div className="text-lg font-semibold">
                  {new Date(lessonData.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <FaUsers className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Recordings</p>
                  <p className="text-3xl font-bold text-gray-900">{totalRecordings}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <FaMicrophone className="text-green-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Average Score</p>
                  <p className="text-3xl font-bold text-gray-900">{avgScore}%</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <FaStar className="text-yellow-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Songs</p>
                  <p className="text-3xl font-bold text-gray-900">{lessonData.songs?.length || 0}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-xl">
                  <FaMusic className="text-purple-600 text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Student Recordings */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FaMicrophone className="mr-2 text-purple-500" />
              Student Recordings & Analysis
            </h2>

            {recordingsData.recordings && recordingsData.recordings.length > 0 ? (
              <div className="space-y-6">
                {recordingsData.recordings.map((student, studentIndex) => (
                  <div key={studentIndex} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{student.studentName}</h3>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FaCalendarAlt className="mr-1" />
                        Joined: {new Date(student.joinedAt).toLocaleDateString()}
                      </div>
                    </div>

                    {student.recordings.length > 0 ? (
                      <div className="space-y-4">
                        {student.recordings.map((recording, recordingIndex) => (
                          <div key={recordingIndex} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <FaMusic className="text-purple-500" />
                                <span className="font-medium">{recording.songTitle}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <FaClock className="mr-1" />
                                {new Date(recording.recordedAt).toLocaleString()}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                  {recording.analysisResult?.pitchAccuracy || 0}%
                                </div>
                                <div className="text-sm text-gray-600">Pitch Accuracy</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                  {recording.analysisResult?.rhythmAccuracy || 0}%
                                </div>
                                <div className="text-sm text-gray-600">Rhythm Accuracy</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                  {recording.analysisResult?.overallScore || 0}%
                                </div>
                                <div className="text-sm text-gray-600">Overall Score</div>
                              </div>
                            </div>

                            {recording.analysisResult?.feedback && (
                              <div className="mt-4 p-3 bg-white rounded-lg border">
                                <p className="text-sm text-gray-700">{recording.analysisResult.feedback}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No recordings yet</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaMicrophone className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Recordings Yet</h3>
                <p className="text-gray-500">Students haven't submitted any recordings for this lesson.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default LessonAnalyticsPage;
