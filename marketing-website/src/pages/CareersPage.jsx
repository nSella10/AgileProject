import { useTranslation } from "react-i18next";
import PageLayout from "../components/PageLayout";

const CareersPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "he";

  const openPositions = t("careers.positions", { returnObjects: true }) || [];

  const benefits = t("careers.benefits", { returnObjects: true }) || [];
  const values = t("careers.why_work_reasons", { returnObjects: true }) || [];
  const teamMembers = t("careers.team_members", { returnObjects: true }) || [];
  const hiringProcess =
    t("careers.hiring_process", { returnObjects: true }) || [];

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-purple-600 to-indigo-700 py-16 text-white">
        <div
          className={`max-w-7xl mx-auto px-4 text-center ${isRTL ? "rtl" : ""}`}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("careers.title")}
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            {t("careers.subtitle")}
          </p>
        </div>
      </div>

      <div className={`max-w-7xl mx-auto px-4 py-16 ${isRTL ? "rtl" : ""}`}>
        {/* Company Culture */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("careers.why_work")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <div
                key={idx}
                className={`text-center p-6 bg-gray-50 rounded-lg ${
                  isRTL ? "text-right" : ""
                }`}
              >
                <h3 className="text-xl font-bold text-purple-700 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("careers.benefits_title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className={`flex items-start p-6 bg-white rounded-lg shadow-sm ${
                  isRTL ? "space-x-reverse space-x-5 text-right" : "space-x-4"
                }`}
              >
                <span className={`text-3xl ${isRTL ? "order-2" : ""}`}>
                  {benefit.icon}
                </span>
                <div className={isRTL ? "order-1" : ""}>
                  <h3 className="text-lg font-semibold mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("careers.open_positions_title")}
          </h2>
          <div className="space-y-6">
            {openPositions.map((position, idx) => (
              <div
                key={idx}
                className={`bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow ${
                  isRTL ? "text-right" : ""
                }`}
              >
                <div
                  className={`flex flex-col md:flex-row md:items-center md:justify-between mb-4`}
                >
                  <div className={isRTL ? "order-1" : "order-1"}>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {position.title}
                    </h3>
                    <div
                      className={`flex flex-wrap gap-3 text-sm text-gray-600 ${
                        isRTL ? "justify-end md:justify-start" : ""
                      }`}
                    >
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        {position.department}
                      </span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {position.location}
                      </span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <button
                    className={`mt-4 md:mt-0 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors ${
                      isRTL ? "order-2 md:mr-4" : "order-2"
                    }`}
                  >
                    {t("careers.apply_now")}
                  </button>
                </div>

                <p className="text-gray-700 mb-4">{position.description}</p>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {t("careers.requirements")}:
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {position.requirements.map((req, reqIdx) => (
                      <li
                        key={reqIdx}
                        className={`flex items-center text-sm text-gray-600 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <svg
                          className={`w-4 h-4 text-green-500 ${
                            isRTL ? "ml-2" : "mr-2"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Process */}
        <div
          className={`mb-16 bg-gray-50 rounded-lg p-8 ${
            isRTL ? "text-right" : ""
          }`}
        >
          <h2 className="text-2xl font-bold text-center mb-8">
            {t("careers.hiring_process_title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {hiringProcess.map((step, idx) => (
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

        {/* Contact */}
        <div className={`text-center ${isRTL ? "text-right" : ""}`}>
          <h2 className="text-2xl font-bold mb-4 text-center">
            {t("careers.no_right_role")}
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-center">
            {t("careers.looking_for_talent")}
          </p>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-center">
              {t("careers.meet_team")}:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className={`bg-purple-50 p-4 rounded-lg ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  <p className="font-medium">{member.name}</p>
                  <p className="text-purple-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
          <a
            href={`mailto:${t("careers.contact_email")}`}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-block"
          >
            {t("careers.get_in_touch")}
          </a>
        </div>
      </div>
    </PageLayout>
  );
};

export default CareersPage;
