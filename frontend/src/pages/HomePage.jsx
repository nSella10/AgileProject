import React from "react";
import Navbar from "../components/Navbar";
import "../styles/homepage.css";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-700 to-purple-900">
      {/* Navbar */}
      <Navbar />

      {/* Cards Section */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "For Friends & Family",
            color: "bg-green-500",
            btn: "Try now",
          },
          { title: "For Students", color: "bg-orange-500", btn: "Join now" },
          { title: "For Teachers", color: "bg-red-500", btn: "Create game" },
          {
            title: "For Creators",
            color: "bg-blue-500",
            btn: "Start creating",
          },
        ].map((card) => (
          <div
            key={card.title}
            className={`rounded-xl ${card.color} text-white p-6 shadow-lg`}
          >
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="mt-2 mb-4">
              Play fun music quiz games together at home!
            </p>
            <button className="bg-white text-black rounded px-3 py-1 font-medium">
              {card.btn}
            </button>
          </div>
        ))}
      </div>

      {/* Lower cards section (Image 3) */}
      <div className="bg-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white shadow-xl rounded-lg flex flex-col p-6">
            <h4 className="font-semibold mb-3">FOR HIGHER EDUCATION</h4>
            <p className="text-sm mb-4">
              Inspire your students with Guessify!+
            </p>
            <button className="bg-green-600 text-white rounded-md px-4 py-2 w-max">
              Buy now
            </button>
          </div>
          <div className="bg-white shadow-xl rounded-lg flex flex-col p-6">
            <h4 className="font-semibold mb-3">FOR ENTERPRISES</h4>
            <p className="text-sm mb-4">
              Drive business growth and transformation with Guessify!
            </p>
            <button className="bg-green-600 text-white rounded-md px-4 py-2 w-max">
              Learn more
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {[
            "Guessify! at school",
            "Guessify! at work",
            "Guessify! at home",
            "Guessify! community",
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white shadow rounded-lg p-4 border-t-4 border-purple-600"
            >
              <h4 className="font-semibold text-purple-700 mb-2">{item}</h4>
              <p className="text-sm">Engaging group and distance learning.</p>
              <button className="text-blue-600 text-sm mt-3">Learn more</button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h5 className="font-semibold mb-4">About</h5>
            {[
              "Company",
              "Leadership",
              "Careers",
              "Open positions",
              "Press",
              "Company events",
              "Contact us",
            ].map((item) => (
              <p
                key={item}
                className="text-sm mb-2 cursor-pointer hover:text-white"
              >
                {item}
              </p>
            ))}
          </div>
          <div>
            <h5 className="font-semibold mb-4">Solutions</h5>
            {[
              "At home",
              "At school",
              "At work",
              "Community",
              "Marketplace",
            ].map((item) => (
              <p
                key={item}
                className="text-sm mb-2 cursor-pointer hover:text-white"
              >
                {item}
              </p>
            ))}
          </div>
          <div>
            <h5 className="font-semibold mb-4">Resources</h5>
            {[
              "Explore Content",
              "Blog",
              "Webinars",
              "Trust Center",
              "Help Center",
            ].map((item) => (
              <p
                key={item}
                className="text-sm mb-2 cursor-pointer hover:text-white"
              >
                {item}
              </p>
            ))}
          </div>
          <div>
            <h5 className="font-semibold mb-4">Terms and conditions</h5>
            {["Terms and conditions", "Privacy policy", "Cookie notice"].map(
              (item) => (
                <p
                  key={item}
                  className="text-sm mb-2 cursor-pointer hover:text-white"
                >
                  {item}
                </p>
              )
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
