import React from "react";
import PageLayout from "../components/PageLayout";

const AboutPage = () => {
  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-purple-700 to-purple-900 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Guessify!
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            We're revolutionizing music education and entertainment through
            interactive quiz games
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Our Story */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-700 mb-6">
                Guessify! was born from a simple idea: make learning music fun
                and interactive. Our team of music educators and technology
                enthusiasts came together to create a platform that brings
                people together through the universal language of music.
              </p>
              <p className="text-lg text-gray-700">
                Whether you're a teacher looking to engage your students, a
                family wanting to bond over music, or friends competing for
                bragging rights, Guessify! provides the perfect platform for
                musical discovery and fun.
              </p>
            </div>
            <div className="bg-purple-100 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-purple-800 mb-4">
                Our Mission
              </h3>
              <p className="text-purple-700">
                To make music education accessible, engaging, and enjoyable for
                everyone, while fostering connections through shared musical
                experiences.
              </p>
            </div>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Leadership Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Omri Peer",
                role: "Senior Fullstack Developer, DevOps, DBA",
                bio: "Expert in full-stack development with extensive experience in DevOps and database administration.",
              },
              {
                name: "Ori Katz",
                role: "Scrum Master, UX/UI Designer",
                bio: "Passionate about creating intuitive user experiences and leading agile development processes.",
              },
              {
                name: "Robert Ifraimov",
                role: "Product Owner, QA Engineer",
                bio: "Focused on product strategy and ensuring the highest quality standards in our applications.",
              },
              {
                name: "Noam Sella",
                role: "Technical Writer, System Architect",
                bio: "Specializes in system architecture design and creating comprehensive technical documentation.",
              },
            ].map((member, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="w-24 h-24 bg-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-700">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-purple-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Company Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Innovation",
                description:
                  "Constantly pushing the boundaries of educational technology",
              },
              {
                title: "Accessibility",
                description:
                  "Making music education available to everyone, everywhere",
              },
              {
                title: "Community",
                description:
                  "Building connections through shared musical experiences",
              },
              {
                title: "Excellence",
                description:
                  "Delivering the highest quality educational content and experiences",
              },
            ].map((value, idx) => (
              <div key={idx} className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-bold text-purple-700 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-purple-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <p className="text-gray-700 mb-6">
            Have questions or want to learn more about Guessify!? We'd love to
            hear from you.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <a
              href="mailto:hello@guessify.com"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="/careers"
              className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors"
            >
              Join Our Team
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AboutPage;
