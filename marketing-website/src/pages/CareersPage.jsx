import React from "react";
import PageLayout from "../components/PageLayout";

const CareersPage = () => {
  const openPositions = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote / Tel Aviv",
      type: "Full-time",
      description:
        "Join our team to build the next generation of music education technology.",
      requirements: [
        "5+ years React experience",
        "Experience with modern JavaScript",
        "Knowledge of responsive design",
        "Passion for education technology",
      ],
    },
    {
      title: "Music Education Specialist",
      department: "Content",
      location: "Remote",
      type: "Full-time",
      description:
        "Help us create engaging educational content and curriculum integration.",
      requirements: [
        "Music education background",
        "Curriculum development experience",
        "Understanding of different learning styles",
        "Creative problem-solving skills",
      ],
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote / Tel Aviv",
      type: "Full-time",
      description:
        "Design intuitive and engaging user experiences for learners of all ages.",
      requirements: [
        "3+ years UX/UI design experience",
        "Proficiency in Figma/Sketch",
        "Experience with user research",
        "Portfolio showcasing educational products",
      ],
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      description: "Help our customers succeed and grow with Guessify!",
      requirements: [
        "Experience in customer success",
        "Strong communication skills",
        "Problem-solving mindset",
        "Education sector experience preferred",
      ],
    },
  ];

  const benefits = [
    {
      icon: "💰",
      title: "Competitive Salary",
      description: "Market-competitive compensation with equity options",
    },
    {
      icon: "🏠",
      title: "Remote-First",
      description: "Work from anywhere with flexible hours",
    },
    {
      icon: "🏥",
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs",
    },
    {
      icon: "📚",
      title: "Learning Budget",
      description: "Annual budget for courses, conferences, and books",
    },
    {
      icon: "🌴",
      title: "Unlimited PTO",
      description: "Take the time you need to recharge",
    },
    {
      icon: "🎵",
      title: "Music Perks",
      description: "Spotify Premium and concert ticket allowances",
    },
  ];

  const values = [
    {
      title: "Innovation",
      description:
        "We constantly push boundaries to create better learning experiences",
    },
    {
      title: "Collaboration",
      description: "We believe the best ideas come from working together",
    },
    {
      title: "Impact",
      description:
        "We're passionate about making education more engaging and accessible",
    },
    {
      title: "Growth",
      description:
        "We support each other's professional and personal development",
    },
  ];

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-purple-600 to-indigo-700 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Join Our Mission
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Help us revolutionize music education and create meaningful learning
            experiences for people worldwide
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Company Culture */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Work at Guessify!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <div key={idx} className="text-center p-6 bg-gray-50 rounded-lg">
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
            Benefits & Perks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-sm"
              >
                <span className="text-3xl">{benefit.icon}</span>
                <div>
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
            Open Positions
          </h2>
          <div className="space-y-6">
            {openPositions.map((position, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {position.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
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
                  <button className="mt-4 md:mt-0 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Apply Now
                  </button>
                </div>

                <p className="text-gray-700 mb-4">{position.description}</p>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Requirements:
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {position.requirements.map((req, reqIdx) => (
                      <li
                        key={reqIdx}
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
        <div className="mb-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            Our Hiring Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Application",
                description: "Submit your resume and cover letter",
              },
              {
                step: "2",
                title: "Phone Screen",
                description: "Brief conversation with our team",
              },
              {
                step: "3",
                title: "Technical/Skills",
                description: "Demonstrate your expertise",
              },
              {
                step: "4",
                title: "Final Interview",
                description: "Meet the team and discuss fit",
              },
            ].map((step, idx) => (
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
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Don't See the Right Role?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We're always looking for talented people who share our passion for
            music and education. Send us your resume and tell us how you'd like
            to contribute.
          </p>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">
              Meet Our Current Team:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="font-medium">Omri Peer</p>
                <p className="text-purple-600">
                  Senior Fullstack Developer, DevOps, DBA
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="font-medium">Ori Katz</p>
                <p className="text-purple-600">Scrum Master, UX/UI Designer</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="font-medium">Robert Ifraimov</p>
                <p className="text-purple-600">Product Owner, QA Engineer</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="font-medium">Noam Sella</p>
                <p className="text-purple-600">
                  Technical Writer, System Architect
                </p>
              </div>
            </div>
          </div>
          <a
            href="mailto:careers@guessify.com"
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-block"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </PageLayout>
  );
};

export default CareersPage;
