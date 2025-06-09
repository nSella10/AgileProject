import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PageLayout from "../components/PageLayout";

const HelpPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "he";
  const [activeCategory, setActiveCategory] = useState("getting-started");

  const categories = t("help.categories", { returnObjects: true }) || {
    "getting-started": {
      title: "Getting Started",
      faqs: [
        {
          question: "How do I create my first game?",
          answer:
            "Click on 'Create Game' in the navigation menu, give your game a title, search and select songs, then save your game. You can then launch it from your 'My Games' page.",
        },
        {
          question: "How do players join my game?",
          answer:
            "When you launch a game, you'll get a room code. Players can join by going to the 'Join Game' page and entering this code.",
        },
        {
          question: "Do I need to create an account?",
          answer:
            "Yes, you need an account to create and host games. However, players can join games without creating an account.",
        },
      ],
    },
    gameplay: {
      title: "Gameplay",
      faqs: [
        {
          question: "How does the scoring system work?",
          answer:
            "Players earn points based on how quickly they guess the correct song. Faster guesses earn more points. The scoring system rewards both accuracy and speed.",
        },
        {
          question: "Can I replay songs during the game?",
          answer:
            "Yes, as the host you can replay songs for longer durations if no one guesses correctly in the initial time.",
        },
        {
          question: "How many songs can I add to a game?",
          answer:
            "You can add as many songs as you'd like to your game. We recommend 10-20 songs for a good game experience.",
        },
      ],
    },
    technical: {
      title: "Technical Support",
      faqs: [
        {
          question: "What browsers are supported?",
          answer:
            "Guessify! works best on modern browsers including Chrome, Firefox, Safari, and Edge. Make sure your browser is up to date for the best experience.",
        },
        {
          question: "Why can't I hear the music?",
          answer:
            "Make sure your device volume is turned up and that you've allowed audio permissions in your browser. Some browsers require user interaction before playing audio.",
        },
        {
          question: "The game is lagging or slow",
          answer:
            "Try refreshing the page, checking your internet connection, or closing other browser tabs. For best performance, use a stable internet connection.",
        },
      ],
    },
    account: {
      title: "Account & Billing",
      faqs: [
        {
          question: "How do I reset my password?",
          answer:
            "Click 'Forgot Password' on the login page and enter your email address. You'll receive instructions to reset your password.",
        },
        {
          question: "Can I delete my account?",
          answer:
            "Yes, you can delete your account by contacting our support team. Note that this will permanently remove all your games and data.",
        },
        {
          question: "Is Guessify! free to use?",
          answer:
            "Yes, Guessify! offers a free tier with basic features. We also offer premium plans for educators and enterprises with additional features.",
        },
      ],
    },
  };

  return (
    <PageLayout>
      <div
        className="bg-gradient-to-b from-blue-600 to-blue-800 py-16 text-white"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("help.title")}
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            {t("help.subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16" dir={isRTL ? "rtl" : "ltr"}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">
              {t("help.categories_title")}
            </h2>
            <div className="space-y-2">
              {Object.entries(categories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`w-full ${
                    isRTL ? "text-right" : "text-left"
                  } p-3 rounded-lg transition-colors ${
                    activeCategory === key
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-6">
              {categories[activeCategory].title}
            </h2>
            <div className="space-y-4">
              {categories[activeCategory].faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-16 bg-gray-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">{t("help.support.title")}</h2>
          <p className="text-gray-700 mb-6">{t("help.support.description")}</p>
          <div
            className={`flex flex-col md:flex-row justify-center items-center gap-4 ${
              isRTL ? "md:flex-row-reverse" : ""
            }`}
          >
            <a
              href="mailto:support@guessify.com"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t("help.support.contact_support")}
            </a>
            <a
              href="/contact"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              {t("help.support.send_feedback")}
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default HelpPage;
