import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { FaGraduationCap, FaLock, FaArrowRight } from "react-icons/fa";

const TeacherRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  // If user is not logged in, redirect to login
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // If user is not a music teacher, show access denied page
  if (!userInfo.isMusicTeacher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="bg-gradient-to-r from-red-100 to-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaLock className="text-3xl text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Teacher Access Required
            </h1>
            
            <p className="text-gray-600 mb-6">
              This area is exclusively for music teachers. To access teaching features, you need to register as a music teacher.
            </p>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-3">
                <FaGraduationCap className="text-purple-600 text-xl" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Teaching Features Include:</h3>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1">
                    <li>• Create vocal lessons with AI analysis</li>
                    <li>• Track student progress and performance</li>
                    <li>• Live vocal coaching sessions</li>
                    <li>• Advanced analytics and reporting</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => window.location.href = "/register"}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <FaGraduationCap />
                <span>Register as Music Teacher</span>
                <FaArrowRight />
              </button>
              
              <button
                onClick={() => window.location.href = "/games"}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
              >
                Back to Games
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user is a music teacher, render the protected content
  return children;
};

export default TeacherRoute;
