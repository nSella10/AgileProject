import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PageLayout from "../components/PageLayout";

const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "he";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    alert(t("contact.form.success"));
  };

  const contactMethods = [
    {
      icon: "📧",
      title: t("contact.methods.email_support.title"),
      description: t("contact.methods.email_support.description"),
      contact: "support@guessify.com",
      responseTime: t("contact.methods.email_support.response"),
    },
    {
      icon: "💼",
      title: t("contact.methods.sales.title"),
      description: t("contact.methods.sales.description"),
      contact: "sales@guessify.com",
      responseTime: t("contact.methods.sales.response"),
    },
    {
      icon: "🤝",
      title: t("contact.methods.partnerships.title"),
      description: t("contact.methods.partnerships.description"),
      contact: "partnerships@guessify.com",
      responseTime: t("contact.methods.partnerships.response"),
    },
    {
      icon: "📰",
      title: t("contact.methods.press.title"),
      description: t("contact.methods.press.description"),
      contact: "press@guessify.com",
      responseTime: t("contact.methods.press.response"),
    },
  ];

  const offices = [
    {
      city: t("contact.offices.tel_aviv.city"),
      address: t("contact.offices.tel_aviv.address"),
      phone: t("contact.offices.tel_aviv.phone"),
      hours: t("contact.offices.tel_aviv.hours"),
    },
    {
      city: t("contact.offices.new_york.city"),
      address: t("contact.offices.new_york.address"),
      phone: t("contact.offices.new_york.phone"),
      hours: t("contact.offices.new_york.hours"),
    },
  ];

  return (
    <PageLayout>
      <div
        className="bg-gradient-to-b from-green-600 to-teal-700 py-16 text-white"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("contact.title")}
          </h1>
          <p className="text-xl text-green-200 max-w-3xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div dir={isRTL ? "rtl" : "ltr"}>
            <h2 className="text-2xl font-bold mb-6">
              {t("contact.form.title")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t("contact.form.name")} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t("contact.form.email")} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("contact.form.category")}
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="general">
                    {t("contact.form.categories.general")}
                  </option>
                  <option value="support">
                    {t("contact.form.categories.support")}
                  </option>
                  <option value="sales">
                    {t("contact.form.categories.sales")}
                  </option>
                  <option value="partnership">
                    {t("contact.form.categories.partnership")}
                  </option>
                  <option value="feedback">
                    {t("contact.form.categories.feedback")}
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("contact.form.subject")} *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("contact.form.message")} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder={t("contact.form.placeholder")}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                {t("contact.form.submit")}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div dir={isRTL ? "rtl" : "ltr"}>
            <h2 className="text-2xl font-bold mb-6">
              {t("contact.methods.title")}
            </h2>

            {/* Contact Methods */}
            <div className="space-y-6 mb-8">
              {contactMethods.map((method, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div
                    className={`flex items-start ${
                      isRTL ? "space-x-reverse space-x-3" : "space-x-3"
                    }`}
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {method.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {method.description}
                      </p>
                      <a
                        href={`mailto:${method.contact}`}
                        className="text-green-600 hover:text-green-700 font-medium"
                      >
                        {method.contact}
                      </a>
                      <p className="text-xs text-gray-500 mt-1">
                        {method.responseTime}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Office Locations */}
            <h3 className="text-xl font-bold mb-4">
              {t("contact.offices.title")}
            </h3>
            <div className="space-y-4">
              {offices.map((office, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {office.city}
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{office.address}</p>
                    <p>{office.phone}</p>
                    <p>{office.hours}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Link */}
        <div
          className="mt-16 bg-blue-50 rounded-lg p-8 text-center"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <h2 className="text-2xl font-bold mb-4">
            {t("contact.faq_section.title")}
          </h2>
          <p className="text-gray-700 mb-6">
            {t("contact.faq_section.description")}
          </p>
          <a
            href="/help"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            {t("contact.faq_section.button")}
          </a>
        </div>
      </div>
    </PageLayout>
  );
};

export default ContactPage;
