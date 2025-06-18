import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "he";

  const [register, { isLoading }] = useRegisterMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (email !== confirmEmail) {
      setErrorMessage(t("register.emails_no_match"));
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(t("register.passwords_no_match"));
      return;
    }

    try {
      await register({ firstName, lastName, email, password }).unwrap();
      setSuccessMessage(t("register.registration_success"));

      setFirstName("");
      setLastName("");
      setEmail("");
      setConfirmEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setErrorMessage(
        err?.data?.message || err?.error || t("register.registration_failed")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center px-4 py-8">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white opacity-5 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-yellow-300 opacity-20 rounded-full"></div>
      </div>

      <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Welcome content */}
        <div
          className={`text-white space-y-6 text-center ${
            isRTL ? "lg:text-right" : "lg:text-left"
          }`}
        >
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {t("register.join_community")}
            </h1>
            <p className="text-xl text-purple-100">{t("register.subtitle")}</p>
          </div>

          <div className="space-y-4">
            <div
              className={`flex items-center ${
                isRTL ? "space-x-reverse" : ""
              } space-x-3 justify-center ${
                isRTL ? "lg:justify-end" : "lg:justify-start"
              }`}
            >
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-lg">{t("register.create_unlimited")}</span>
            </div>
            <div
              className={`flex items-center ${
                isRTL ? "space-x-reverse" : ""
              } space-x-3 justify-center ${
                isRTL ? "lg:justify-end" : "lg:justify-start"
              }`}
            >
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-lg">{t("register.access_thousands")}</span>
            </div>
            <div
              className={`flex items-center ${
                isRTL ? "space-x-reverse" : ""
              } space-x-3 justify-center ${
                isRTL ? "lg:justify-end" : "lg:justify-start"
              }`}
            >
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-lg">{t("register.perfect_education")}</span>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <p className="text-sm italic">
                {t("register.teacher_testimonial")}
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Registration form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto">
          {successMessage ? (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-2xl font-bold text-green-600">
                {t("register.welcome_to_guessify")}
              </h2>
              <p className="text-gray-600">{successMessage}</p>
              <a
                href="/login"
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                {t("register.continue_to_login")}
              </a>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎵</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {t("register.create_account")}
                </h2>
                <p className="text-gray-600">{t("register.get_started")}</p>
              </div>

              {errorMessage && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  <div
                    className={`flex items-center ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <span className={`${isRTL ? "ml-2" : "mr-2"}`}>⚠️</span>
                    {errorMessage}
                  </div>
                </div>
              )}

              <form className="space-y-6" onSubmit={submitHandler}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      {t("register.first_name")}
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      placeholder={t("register.first_name_placeholder")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      {t("register.last_name")}
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      placeholder={t("register.last_name_placeholder")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    {t("register.email_address")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={t("register.email_placeholder")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmEmail"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    {t("register.confirm_email")}
                  </label>
                  <input
                    id="confirmEmail"
                    type="email"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    required
                    placeholder={t("register.confirm_email_placeholder")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      {t("register.password")}
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder={t("register.password_placeholder")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      {t("register.confirm_password")}
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder={t("register.confirm_password_placeholder")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div
                        className={`animate-spin rounded-full h-5 w-5 border-b-2 border-white ${
                          isRTL ? "ml-2" : "mr-2"
                        }`}
                      ></div>
                      {t("register.creating_account")}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className={`${isRTL ? "ml-2" : "mr-2"}`}>🎵</span>
                      {t("register.create_my_account")}
                    </div>
                  )}
                </button>
              </form>

              <div className="text-center mt-6 pt-6 border-t border-gray-200">
                <p className="text-gray-600">
                  {t("register.already_have_account")}{" "}
                  <a
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    {t("register.sign_in_here")}
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
