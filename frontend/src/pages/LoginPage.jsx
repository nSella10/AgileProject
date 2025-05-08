import React, { useState } from "react";
import PageLayout from "../components/PageLayout";
import { useLoginMutation } from "../slices/usersApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import { useNavigate, useLocation } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const fromCreate = location.state?.fromCreate; // נבדוק אם הופנינו מ־/create

  const [login, { isLoading }] = useLoginMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res));
      fromCreate ? navigate("/create") : navigate("/dashboard");
    } catch (err) {
      setErrorMessage(err?.data?.message || "Login failed");
    }
  };

  return (
    <PageLayout>
      <div className="flex justify-center items-center min-h-[80vh] bg-gray-100 px-4">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-center text-blue-600">
            Log in to Music!
          </h2>

          {fromCreate && (
            <p className="text-sm text-center text-gray-600 mb-4">
              You must be logged in to create a game.
            </p>
          )}

          {errorMessage && (
            <div className="mb-4 text-red-600 text-sm text-center">
              {errorMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={submitHandler}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default LoginPage;
