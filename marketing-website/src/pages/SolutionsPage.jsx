import React from "react";
import PageLayout from "../components/PageLayout";

const SolutionsPage = () => {
  const solutions = [
    {
      title: "Guessify! at School",
      icon: "🏫",
      description: "Transform your classroom with interactive music education",
      features: [
        "Curriculum-aligned content",
        "Student progress tracking",
        "Classroom management tools",
        "Multi-grade level support",
      ],
      benefits: [
        "Increased student engagement",
        "Improved music knowledge retention",
        "Fun, interactive learning experience",
        "Easy lesson planning integration",
      ],
    },
    {
      title: "Guessify! at Work",
      icon: "💼",
      description: "Build stronger teams through music-based activities",
      features: [
        "Team building games",
        "Virtual event hosting",
        "Custom corporate playlists",
        "Employee engagement metrics",
      ],
      benefits: [
        "Enhanced team collaboration",
        "Improved workplace morale",
        "Stress relief and fun",
        "Remote team connection",
      ],
    },
    {
      title: "Guessify! at Home",
      icon: "🏠",
      description: "Bring families together with musical fun",
      features: [
        "Family-friendly content",
        "Multi-generational playlists",
        "Easy setup and play",
        "Offline mode available",
      ],
      benefits: [
        "Quality family time",
        "Musical discovery for all ages",
        "Screen-time that's educational",
        "Bonding through shared experiences",
      ],
    },
    {
      title: "Guessify! Community",
      icon: "🌍",
      description: "Connect with music lovers worldwide",
      features: [
        "Public game hosting",
        "Community challenges",
        "Global leaderboards",
        "Cultural music exploration",
      ],
      benefits: [
        "Meet like-minded music fans",
        "Discover new genres and artists",
        "Competitive gaming experience",
        "Cultural exchange through music",
      ],
    },
  ];

  const useCases = [
    {
      category: "Education",
      examples: [
        "Music theory lessons",
        "Historical music periods study",
        "Instrument recognition training",
        "Composer identification games",
      ],
    },
    {
      category: "Corporate",
      examples: [
        "Team building events",
        "Company party entertainment",
        "Remote team bonding",
        "Client entertainment",
      ],
    },
    {
      category: "Personal",
      examples: [
        "Birthday party games",
        "Family reunions",
        "Date night activities",
        "Personal music knowledge testing",
      ],
    },
  ];

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-indigo-600 to-purple-700 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Solutions for Every Setting
          </h1>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
            Discover how Guessify! can enhance learning, team building, and
            entertainment in schools, workplaces, homes, and communities.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main Solutions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {solutions.map((solution, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <span className="text-4xl mr-4">{solution.icon}</span>
                <h2 className="text-2xl font-bold text-gray-800">
                  {solution.title}
                </h2>
              </div>

              <p className="text-gray-600 mb-6 text-lg">
                {solution.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {solution.features.map((feature, featureIdx) => (
                      <li
                        key={featureIdx}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <svg
                          className="w-4 h-4 text-green-500 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Benefits</h3>
                  <ul className="space-y-2">
                    {solution.benefits.map((benefit, benefitIdx) => (
                      <li
                        key={benefitIdx}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <svg
                          className="w-4 h-4 text-blue-500 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Popular Use Cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-indigo-700">
                  {useCase.category}
                </h3>
                <ul className="space-y-2">
                  {useCase.examples.map((example, exampleIdx) => (
                    <li
                      key={exampleIdx}
                      className="text-gray-700 flex items-center"
                    >
                      <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-bold mb-2">Lincoln Elementary School</h3>
              <p className="text-gray-600 text-sm mb-3">
                "Guessify! has transformed our music classes. Student engagement
                is up 85% and test scores have improved significantly."
              </p>
              <p className="text-xs text-gray-500">
                - Sarah Johnson, Music Teacher
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-bold mb-2">TechCorp Inc.</h3>
              <p className="text-gray-600 text-sm mb-3">
                "Our remote team building events with Guessify! have been a huge
                hit. Team morale and collaboration have never been better."
              </p>
              <p className="text-xs text-gray-500">- Mike Chen, HR Director</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of educators, teams, and families who are already
            using Guessify! to create memorable musical experiences.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
              Start Free Trial
            </button>
            <button className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SolutionsPage;
