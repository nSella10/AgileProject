import React, { useState } from "react";
import PageLayout from "../components/PageLayout";

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, annual: 0 },
      description: "Perfect for trying out Guessify!",
      features: [
        "Up to 3 games per month",
        "Maximum 10 players per game",
        "Basic song library access",
        "Standard support",
        "Basic analytics",
      ],
      buttonText: "Get Started",
      buttonStyle: "border border-gray-300 text-gray-700 hover:bg-gray-50",
      popular: false,
    },
    {
      name: "Educator",
      price: { monthly: 9.99, annual: 99.99 },
      description: "Ideal for teachers and small classrooms",
      features: [
        "Unlimited games",
        "Up to 50 players per game",
        "Full song library access",
        "Priority support",
        "Advanced analytics",
        "Custom game templates",
        "Student progress tracking",
        "Classroom management tools",
      ],
      buttonText: "Start Free Trial",
      buttonStyle: "bg-blue-600 text-white hover:bg-blue-700",
      popular: true,
    },
    {
      name: "Institution",
      price: { monthly: 29.99, annual: 299.99 },
      description: "For schools and large organizations",
      features: [
        "Everything in Educator",
        "Unlimited players per game",
        "Multi-classroom management",
        "Advanced reporting",
        "Custom branding",
        "API access",
        "Dedicated account manager",
        "Training and onboarding",
        "Single sign-on (SSO)",
      ],
      buttonText: "Contact Sales",
      buttonStyle: "bg-purple-600 text-white hover:bg-purple-700",
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "Can I change my plan at any time?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes, we offer a 14-day free trial for all paid plans. No credit card required to start.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, and bank transfers for institutional customers.",
    },
    {
      question: "Do you offer discounts for non-profits?",
      answer:
        "Yes, we offer special pricing for qualified educational institutions and non-profit organizations. Contact us for details.",
    },
  ];

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-blue-600 to-purple-700 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your needs. Start free and upgrade as
            you grow.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`${!isAnnual ? "text-white" : "text-blue-200"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isAnnual ? "bg-green-500" : "bg-blue-400"
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  isAnnual ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`${isAnnual ? "text-white" : "text-blue-200"}`}>
              Annual
              <span className="ml-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                Save 17%
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative bg-white rounded-lg shadow-lg p-8 ${
                plan.popular ? "ring-2 ring-blue-500 transform scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">
                    ${isAnnual ? plan.price.annual : plan.price.monthly}
                  </span>
                  <span className="text-gray-500">
                    {plan.price.monthly === 0
                      ? ""
                      : isAnnual
                      ? "/year"
                      : "/month"}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIdx) => (
                  <li key={featureIdx} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${plan.buttonStyle}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Enterprise Section */}
        <div className="bg-gray-50 rounded-lg p-8 text-center mb-16">
          <h2 className="text-2xl font-bold mb-4">Need Something Custom?</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            For large enterprises, school districts, or organizations with
            specific needs, we offer custom solutions tailored to your
            requirements.
          </p>
          <button className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors">
            Contact Enterprise Sales
          </button>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PricingPage;
