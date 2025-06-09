// src/pages/CommunityPage.jsx
import { useTranslation } from "react-i18next";
import PageLayout from "../components/PageLayout";

const CommunityPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "he";

  const features =
    t("community.community_features.features", { returnObjects: true }) || [];
  const challenges =
    t("community.popular_challenges.challenges", { returnObjects: true }) || [];
  const events =
    t("community.events.event_list", { returnObjects: true }) || [];
  const userStories =
    t("community.user_stories.stories", { returnObjects: true }) || [];
  const topPlayers =
    t("community.leaderboards.top_players", { returnObjects: true }) || [];
  const howToJoinSteps =
    t("community.how_to_join.steps", { returnObjects: true }) || [];
  const communityRules =
    t("community.community_guidelines.rules", { returnObjects: true }) || [];

  return (
    <PageLayout>
      <div
        className="bg-gradient-to-b from-purple-600 to-pink-700 py-16 text-white"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("community.title")}
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            {t("community.subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16" dir={isRTL ? "rtl" : "ltr"}>
        {/* Global Community Section */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t("community.global_community")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t("community.global_subtitle")}
          </p>
          <div
            className={`flex flex-col md:flex-row justify-center items-center gap-4 ${
              isRTL ? "md:flex-row-reverse" : ""
            }`}
          >
            <button className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors">
              {t("community.join_community")}
            </button>
            <button className="border border-purple-600 text-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition-colors">
              {t("community.explore_games")}
            </button>
          </div>
        </div>

        {/* Community Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">
            {t("community.community_features.title")}
          </h2>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${
              isRTL ? "rtl" : ""
            }`}
          >
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-lg p-6 text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Challenges */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            {t("community.popular_challenges.title")}
          </h2>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${
              isRTL ? "rtl" : ""
            }`}
          >
            {challenges.map((challenge, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-3">{challenge.title}</h3>
                <p className="text-gray-600 mb-4">{challenge.description}</p>
                <div
                  className={`flex justify-between items-center text-sm text-gray-500 ${
                    isRTL ? "" : ""
                  }`}
                >
                  {isRTL ? (
                    <>
                      <span>{challenge.participants}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          challenge.difficulty === "קל"
                            ? "bg-green-100 text-green-600"
                            : challenge.difficulty === "בינוני"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {challenge.difficulty}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>{challenge.participants}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          challenge.difficulty === "קל"
                            ? "bg-green-100 text-green-600"
                            : challenge.difficulty === "בינוני"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {challenge.difficulty}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboards */}
        <div className="mb-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">
            {t("community.leaderboards.title")}
          </h2>
          <div className="flex justify-center mb-6">
            <div className="flex bg-white rounded-lg p-1">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md">
                {t("community.leaderboards.weekly")}
              </button>
              <button className="px-4 py-2 text-gray-600">
                {t("community.leaderboards.monthly")}
              </button>
              <button className="px-4 py-2 text-gray-600">
                {t("community.leaderboards.all_time")}
              </button>
            </div>
          </div>
          <div className="max-w-md mx-auto" dir={isRTL ? "rtl" : "ltr"}>
            {topPlayers.map((player, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between bg-white p-4 rounded-lg mb-2 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {isRTL ? (
                  <>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-purple-600 ml-4">
                        #{player.rank}
                      </span>
                      <div className="text-right">
                        <div className="font-bold">{player.name}</div>
                        <div className="text-sm text-gray-500">
                          {player.country}
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {player.score}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-purple-600 mr-4">
                        #{player.rank}
                      </span>
                      <div>
                        <div className="font-bold">{player.name}</div>
                        <div className="text-sm text-gray-500">
                          {player.country}
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {player.score}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Events */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            {t("community.events.title")}
          </h2>
          <h3 className="text-xl font-semibold text-center mb-6">
            {t("community.events.upcoming")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <div className="text-sm text-gray-500 mb-2">
                  {event.date} • {event.time}
                </div>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="text-xs text-purple-600">
                  {event.participants}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Stories */}
        <div className="mb-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">
            {t("community.user_stories.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userStories.map((story, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">{story.avatar}</div>
                <h3 className="font-bold mb-2">{story.name}</h3>
                <div className="text-sm text-gray-500 mb-3">
                  {story.location}
                </div>
                <p className="text-gray-600 italic">"{story.quote}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* How to Join */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            {t("community.how_to_join.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howToJoinSteps.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  {step.step}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="mb-16 bg-purple-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            {t("community.community_guidelines.title")}
          </h2>
          <p className="text-center text-gray-600 mb-8">
            {t("community.community_guidelines.description")}
          </p>
          <div className="max-w-2xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
            <ul className="space-y-3">
              {communityRules.map((rule, idx) => (
                <li
                  key={idx}
                  className={`flex items-start ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0 ${
                      isRTL ? "ml-3" : "mr-3"
                    }`}
                  ></span>
                  <span className="text-gray-700">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t("community.ready_to_join")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t("community.join_description")}
          </p>
          <div
            className={`flex flex-col md:flex-row justify-center items-center gap-4 ${
              isRTL ? "md:flex-row-reverse" : ""
            }`}
          >
            <button className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors">
              {t("community.join_now")}
            </button>
            <button className="border border-purple-600 text-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition-colors">
              {t("community.browse_games")}
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CommunityPage;
