import React, { useState } from "react";
import PageLayout from "../components/PageLayout";
import { useRegisterMutation } from "../slices/usersApiSlice";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [register, { isLoading }] = useRegisterMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (email !== confirmEmail) {
      setErrorMessage("Emails do not match");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      await register({ firstName, lastName, email, password }).unwrap();
      setSuccessMessage("Registration successful! You can now log in.");

      setFirstName("");
      setLastName("");
      setEmail("");
      setConfirmEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setErrorMessage(
        err?.data?.message || err?.error || "Registration failed"
      );
    }
  };

  return (
    <PageLayout>
      <div className="flex justify-center items-center min-h-[80vh] bg-gray-100 px-4">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          {successMessage ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                🎉 {successMessage}
              </h2>
              <a
                href="/login"
                className="text-blue-600 hover:underline text-lg"
              >
                Go to Login →
              </a>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
                Create your account
              </h2>

              {errorMessage && (
                <div className="mb-4 text-red-600 text-sm text-center">
                  {errorMessage}
                </div>
              )}

              <form className="space-y-4" onSubmit={submitHandler}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-gray-700 mb-1"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-gray-700 mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmEmail"
                    className="block text-gray-700 mb-1"
                  >
                    Confirm Email
                  </label>
                  <input
                    id="confirmEmail"
                    type="email"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-gray-700 mb-1"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing up..." : "Sign up"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  Log in
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default RegisterPage;
