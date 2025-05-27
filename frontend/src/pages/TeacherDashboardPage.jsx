import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
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
} from "react-icons/fa";

const TeacherDashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    {
      title: "Active Students",
      value: "24",
      icon: FaUsers,
      color: "from-blue-500 to-cyan-500",
      change: "+3 this week",
    },
    {
      title: "Lessons Created",
      value: "12",
      icon: FaMusic,
      color: "from-purple-500 to-pink-500",
      change: "+2 this month",
    },
    {
      title: "Vocal Analyses",
      value: "156",
      icon: FaMicrophone,
      color: "from-green-500 to-emerald-500",
      change: "+18 this week",
    },
    {
      title: "Avg. Accuracy",
      value: "87%",
      icon: FaChartLine,
      color: "from-orange-500 to-red-500",
      change: "+5% improvement",
    },
  ];

  const recentLessons = [
    {
      id: 1,
      title: "Vocal Warm-ups - Do Re Mi",
      students: 8,
      completed: 6,
      avgScore: 92,
      date: "2024-01-15",
      status: "active",
    },
    {
      id: 2,
      title: "Pitch Training - Major Scales",
      students: 12,
      completed: 12,
      avgScore: 85,
      date: "2024-01-14",
      status: "completed",
    },
    {
      id: 3,
      title: "Rhythm Practice - 4/4 Time",
      students: 15,
      completed: 10,
      avgScore: 78,
      date: "2024-01-13",
      status: "active",
    },
  ];

  const features = [
    {
      icon: FaMicrophone,
      title: "AI Vocal Analysis",
      description: "Advanced pitch, tone, and rhythm analysis using cutting-edge AI technology",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: FaWaveSquare,
      title: "Real-time Feedback",
      description: "Instant feedback on vocal performance with detailed accuracy metrics",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FaChartLine,
      title: "Progress Tracking",
      description: "Comprehensive analytics to track student improvement over time",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: FaHeadphones,
      title: "Custom Lessons",
      description: "Create personalized vocal exercises tailored to each student's needs",
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
      action: () => navigate("/live-session"),
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
                  <div className="text-indigo-200 text-sm">Premium Features</div>
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
                    <div className={`bg-gradient-to-r ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Quick Actions</h2>
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
              <h2 className="text-xl font-bold text-gray-900">Recent Lessons</h2>
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
                  {recentLessons.map((lesson) => (
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
                          {lesson.completed}/{lesson.students}
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
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <FaEye />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <FaEdit />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                  <div className={`bg-gradient-to-r ${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
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
