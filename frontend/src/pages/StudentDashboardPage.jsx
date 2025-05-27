import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import {
  FaMusic,
  FaMicrophone,
  FaChartLine,
  FaPlay,
  FaAward,
  FaStar,
  FaHeadphones,
  FaWaveSquare,
  FaClock,
  FaGraduationCap,
  FaTrophy,
  FaBookOpen,
  FaVolumeUp,
  FaUser,
} from "react-icons/fa";

const StudentDashboardPage = () => {
  const navigate = useNavigate();

  const studentStats = [
    {
      title: "Lessons Completed",
      value: "8",
      icon: FaBookOpen,
      color: "from-blue-500 to-cyan-500",
      change: "+2 this week",
    },
    {
      title: "Average Score",
      value: "85%",
      icon: FaChartLine,
      color: "from-green-500 to-emerald-500",
      change: "+12% improvement",
    },
    {
      title: "Practice Time",
      value: "2.5h",
      icon: FaClock,
      color: "from-purple-500 to-pink-500",
      change: "This week",
    },
    {
      title: "Achievements",
      value: "5",
      icon: FaTrophy,
      color: "from-orange-500 to-red-500",
      change: "+1 new badge",
    },
  ];

  const recentLessons = [
    {
      id: 1,
      title: "Vocal Warm-ups - Do Re Mi",
      teacher: "Ms. Johnson",
      score: 92,
      date: "2024-01-15",
      status: "completed",
      feedback: "Excellent pitch accuracy!",
    },
    {
      id: 2,
      title: "Pitch Training - Major Scales",
      teacher: "Mr. Smith",
      score: 85,
      date: "2024-01-14",
      status: "completed",
      feedback: "Good progress on timing",
    },
    {
      id: 3,
      title: "Rhythm Practice - 4/4 Time",
      teacher: "Ms. Davis",
      score: 78,
      date: "2024-01-13",
      status: "needs_practice",
      feedback: "Focus on rhythm consistency",
    },
  ];

  const achievements = [
    {
      title: "Perfect Pitch",
      description: "Achieved 100% pitch accuracy",
      icon: FaWaveSquare,
      color: "bg-yellow-500",
      earned: true,
    },
    {
      title: "Rhythm Master",
      description: "Completed 10 rhythm exercises",
      icon: FaClock,
      color: "bg-blue-500",
      earned: true,
    },
    {
      title: "Vocal Virtuoso",
      description: "Scored 90%+ on 5 lessons",
      icon: FaMicrophone,
      color: "bg-purple-500",
      earned: false,
    },
    {
      title: "Practice Champion",
      description: "Practice 7 days in a row",
      icon: FaStar,
      color: "bg-green-500",
      earned: true,
    },
  ];

  const upcomingLessons = [
    {
      id: 1,
      title: "Advanced Harmonies",
      teacher: "Ms. Johnson",
      time: "2:00 PM",
      date: "Today",
      difficulty: "Advanced",
    },
    {
      id: 2,
      title: "Vocal Breathing Techniques",
      teacher: "Mr. Smith",
      time: "10:00 AM",
      date: "Tomorrow",
      difficulty: "Intermediate",
    },
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4">
                    <FaGraduationCap className="text-3xl text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold">
                      Student Dashboard
                    </h1>
                    <p className="text-blue-100 text-lg">
                      Track your vocal learning progress with AI feedback
                    </p>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <FaUser className="text-3xl text-blue-200 mx-auto mb-2" />
                  <div className="text-xl font-bold">Alex Student</div>
                  <div className="text-blue-200 text-sm">Intermediate Level</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-6 -mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentStats.map((stat, index) => {
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

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming Lessons */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 text-white">
                  <h2 className="text-xl font-bold">Upcoming Lessons</h2>
                </div>
                <div className="p-6">
                  {upcomingLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-xl mb-4 last:mb-0 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-12 h-12 rounded-xl flex items-center justify-center">
                          <FaMusic className="text-white text-lg" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {lesson.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {lesson.teacher} • {lesson.date} at {lesson.time}
                          </p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                            lesson.difficulty === 'Advanced' ? 'bg-red-100 text-red-800' :
                            lesson.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {lesson.difficulty}
                          </span>
                        </div>
                      </div>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        <FaPlay className="text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Lessons */}
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
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Feedback
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
                                {lesson.teacher} • {lesson.date}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">
                                {lesson.score}%
                              </div>
                              {lesson.score >= 90 && (
                                <FaAward className="ml-2 text-yellow-500" />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                lesson.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {lesson.status === "completed" ? "Completed" : "Needs Practice"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {lesson.feedback}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Achievements Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-white">
                  <h2 className="text-xl font-bold">Achievements</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => {
                      const Icon = achievement.icon;
                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            achievement.earned
                              ? "border-green-200 bg-green-50"
                              : "border-gray-200 bg-gray-50 opacity-60"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                achievement.earned ? achievement.color : "bg-gray-400"
                              } text-white`}
                            >
                              <Icon className="text-lg" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {achievement.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {achievement.description}
                              </p>
                            </div>
                            {achievement.earned && (
                              <FaStar className="text-yellow-500" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Quick Practice */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg p-6 text-white mt-6">
                <div className="text-center">
                  <FaHeadphones className="text-4xl mx-auto mb-4 text-blue-200" />
                  <h3 className="text-xl font-bold mb-2">Quick Practice</h3>
                  <p className="text-blue-100 mb-4 text-sm">
                    Practice your vocal skills with a quick 5-minute session
                  </p>
                  <button
                    onClick={() => navigate("/quick-practice")}
                    className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors"
                  >
                    Start Practice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default StudentDashboardPage;
