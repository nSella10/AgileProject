import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import {
  useGetTeacherAnalyticsQuery,
  useGetMyLessonsQuery,
} from "../slices/lessonsApiSlice";
import {
  FaMusic,
  FaMicrophone,
  FaChartLine,
  FaUsers,
  FaPlus,
  FaPlay,
  FaStop,
  FaVolumeUp,
  FaEye,
  FaEdit,
  FaTrash,
  FaGraduationCap,
  FaStar,
  FaAward,
  FaHeadphones,
  FaWaveSquare,
  FaSpinner,
} from "react-icons/fa";

const TeacherDashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch real data from API
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useGetTeacherAnalyticsQuery();
  const {
    data: lessonsData,
    isLoading: lessonsLoading,
    error: lessonsError,
  } = useGetMyLessonsQuery();

  // Create stats from real data
  const stats = analyticsData
    ? [
        {
          title: "Total Students",
          value: analyticsData.totalStudents.toString(),
          icon: FaUsers,
          color: "from-blue-500 to-cyan-500",
          change: "Active learners",
        },
        {
          title: "Lessons Created",
          value: analyticsData.totalLessons.toString(),
          icon: FaMusic,
          color: "from-purple-500 to-pink-500",
          change: `${analyticsData.activeLessons} active`,
        },
        {
          title: "Active Lessons",
          value: analyticsData.activeLessons.toString(),
          icon: FaMicrophone,
          color: "from-green-500 to-emerald-500",
          change: "Currently running",
        },
        {
          title: "Avg. Accuracy",
          value: `${analyticsData.avgAccuracy}%`,
          icon: FaChartLine,
          color: "from-orange-500 to-red-500",
          change: "Overall performance",
        },
      ]
    : [
        {
          title: "Total Students",
          value: "0",
          icon: FaUsers,
          color: "from-blue-500 to-cyan-500",
          change: "No data yet",
        },
        {
          title: "Lessons Created",
          value: "0",
          icon: FaMusic,
          color: "from-purple-500 to-pink-500",
          change: "Create your first lesson",
        },
        {
          title: "Active Lessons",
          value: "0",
          icon: FaMicrophone,
          color: "from-green-500 to-emerald-500",
          change: "Start teaching",
        },
        {
          title: "Avg. Accuracy",
          value: "0%",
          icon: FaChartLine,
          color: "from-orange-500 to-red-500",
          change: "No recordings yet",
        },
      ];

  // Use real lessons data or show empty state
  const recentLessons =
    lessonsData && lessonsData.length > 0
      ? lessonsData.slice(0, 5).map((lesson) => ({
          id: lesson._id,
          title: lesson.title,
          students: lesson.students ? lesson.students.length : 0,
          completed: lesson.students ? lesson.students.length : 0,
          avgScore:
            lesson.students && lesson.students.length > 0
              ? Math.round(
                  lesson.students.reduce((sum, student) => {
                    const recordings = student.recordings || [];
                    if (recordings.length === 0) return sum;
                    const avgStudentScore =
                      recordings.reduce(
                        (scoreSum, recording) =>
                          scoreSum +
                          (recording.analysisResult?.overallScore || 0),
                        0
                      ) / recordings.length;
                    return sum + avgStudentScore;
                  }, 0) / lesson.students.length
                )
              : 0,
          date: new Date(lesson.createdAt).toLocaleDateString(),
          status: lesson.isActive ? "active" : "completed",
        }))
      : [];

  const features = [
    {
      icon: FaMicrophone,
      title: "AI Vocal Analysis",
      description:
        "Advanced pitch, tone, and rhythm analysis using cutting-edge AI technology",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: FaWaveSquare,
      title: "Real-time Feedback",
      description:
        "Instant feedback on vocal performance with detailed accuracy metrics",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FaChartLine,
      title: "Progress Tracking",
      description:
        "Comprehensive analytics to track student improvement over time",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: FaHeadphones,
      title: "Custom Lessons",
      description:
        "Create personalized vocal exercises tailored to each student's needs",
      color: "from-orange-500 to-red-500",
    },
  ];

  const quickActions = [
    {
      title: "Create New Lesson",
      description: "Design a new vocal training lesson",
      icon: FaPlus,
      color: "from-purple-500 to-pink-500",
      action: () => navigate("/create-lesson"),
    },
    {
      title: "Start Live Session",
      description: "Begin a real-time vocal training session",
      icon: FaPlay,
      color: "from-green-500 to-emerald-500",
      action: () => {
        // Navigate to first available lesson or show selection
        if (lessonsData && lessonsData.length > 0) {
          navigate(`/live-session/${lessonsData[0]._id}`);
        } else {
          navigate("/create-lesson");
        }
      },
    },
    {
      title: "View Analytics",
      description: "Analyze student performance data",
      icon: FaChartLine,
      color: "from-blue-500 to-cyan-500",
      action: () => navigate("/teacher-analytics"),
    },
    {
      title: "Manage Students",
      description: "Add or manage your student roster",
      icon: FaUsers,
      color: "from-orange-500 to-red-500",
      action: () => navigate("/manage-students"),
    },
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4">
                    <FaGraduationCap className="text-3xl text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold">
                      Music Teacher Dashboard
                    </h1>
                    <p className="text-indigo-100 text-lg">
                      Advanced vocal training with AI-powered analysis
                    </p>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <FaStar className="text-3xl text-yellow-300 mx-auto mb-2" />
                  <div className="text-2xl font-bold">Pro Teacher</div>
                  <div className="text-indigo-200 text-sm">
                    Premium Features
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-6 -mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`bg-gradient-to-r ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center`}
                    >
                      <Icon className="text-white text-xl" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        {stat.change}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-gray-700 font-medium">{stat.title}</h3>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div
                  key={index}
                  onClick={action.action}
                  className={`bg-gradient-to-br ${action.color} p-6 rounded-2xl text-white cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 group`}
                >
                  <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-all duration-300">
                    <Icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{action.title}</h3>
                  <p className="text-white/90 text-sm">{action.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Lessons */}
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Lessons
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lesson
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lessonsLoading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center">
                        <div className="flex items-center justify-center">
                          <FaSpinner className="animate-spin text-purple-500 text-xl mr-2" />
                          <span className="text-gray-500">
                            Loading lessons...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : lessonsError ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center">
                        <div className="text-red-500">
                          Error loading lessons. Please try again.
                        </div>
                      </td>
                    </tr>
                  ) : recentLessons.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center">
                        <div className="text-gray-500">
                          <FaMusic className="mx-auto text-4xl mb-4 text-gray-300" />
                          <p className="text-lg font-medium mb-2">
                            No lessons yet
                          </p>
                          <p className="text-sm">
                            Create your first lesson to get started!
                          </p>
                          <button
                            onClick={() => navigate("/create-lesson")}
                            className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                          >
                            Create Lesson
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    recentLessons.map((lesson) => (
                      <tr key={lesson.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {lesson.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {lesson.date}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {lesson.students}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {lesson.avgScore}%
                            </div>
                            {lesson.avgScore >= 90 && (
                              <FaAward className="ml-2 text-yellow-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              lesson.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {lesson.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                navigate(`/live-session/${lesson.id}`)
                              }
                              className="text-purple-600 hover:text-purple-900 p-1 rounded"
                              title="Start Live Session"
                            >
                              <FaPlay />
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/lesson-analytics/${lesson.id}`)
                              }
                              className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                              title="View Analytics"
                            >
                              <FaEye />
                            </button>
                            <button
                              className="text-green-600 hover:text-green-900 p-1 rounded"
                              title="Edit Lesson"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900 p-1 rounded"
                              title="Delete Lesson"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Advanced Teaching Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div
                    className={`bg-gradient-to-r ${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}
                  >
                    <Icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TeacherDashboardPage;
