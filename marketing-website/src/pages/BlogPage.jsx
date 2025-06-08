import React from "react";
import PageLayout from "../components/PageLayout";

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "5 Ways Music Games Enhance Learning in the Classroom",
      excerpt:
        "Discover how interactive music games can transform traditional education and engage students in new ways.",
      date: "March 15, 2024",
      category: "Education",
      readTime: "5 min read",
      image: "🎵",
    },
    {
      id: 2,
      title: "Building Team Spirit Through Music Trivia",
      excerpt:
        "Learn how companies are using music games to boost team morale and create stronger workplace connections.",
      date: "March 10, 2024",
      category: "Workplace",
      readTime: "4 min read",
      image: "🎤",
    },
    {
      id: 3,
      title: "The Science Behind Music and Memory",
      excerpt:
        "Exploring the cognitive benefits of music-based learning and how it improves retention and recall.",
      date: "March 5, 2024",
      category: "Research",
      readTime: "7 min read",
      image: "🧠",
    },
    {
      id: 4,
      title: "Creating Inclusive Music Experiences for All Ages",
      excerpt:
        "Tips for designing music games that are accessible and enjoyable for players of all backgrounds and abilities.",
      date: "February 28, 2024",
      category: "Accessibility",
      readTime: "6 min read",
      image: "🌍",
    },
    {
      id: 5,
      title: "Top 10 Music Genres for Educational Games",
      excerpt:
        "A comprehensive guide to selecting the best music genres for different learning objectives and age groups.",
      date: "February 20, 2024",
      category: "Tips",
      readTime: "8 min read",
      image: "🎼",
    },
    {
      id: 6,
      title: "Virtual Music Events: The Future of Remote Learning",
      excerpt:
        "How virtual music experiences are reshaping distance education and bringing students together online.",
      date: "February 15, 2024",
      category: "Technology",
      readTime: "5 min read",
      image: "💻",
    },
  ];

  const categories = [
    "All",
    "Education",
    "Workplace",
    "Research",
    "Accessibility",
    "Tips",
    "Technology",
  ];

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-green-600 to-green-800 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Guessify! Blog
          </h1>
          <p className="text-xl text-green-200 max-w-3xl mx-auto">
            Insights, tips, and stories about music education and interactive
            learning
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-green-100 hover:text-green-700 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 text-white">
            <span className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </span>
            <h2 className="text-3xl font-bold mt-4 mb-4">
              {blogPosts[0].title}
            </h2>
            <p className="text-lg mb-6 opacity-90">{blogPosts[0].excerpt}</p>
            <div className="flex items-center gap-4 text-sm opacity-80">
              <span>{blogPosts[0].date}</span>
              <span>•</span>
              <span>{blogPosts[0].readTime}</span>
              <span>•</span>
              <span>{blogPosts[0].category}</span>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-6xl">{post.image}</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-xs">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 hover:text-green-600 transition-colors cursor-pointer">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                    Read More →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gray-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to get the latest insights on music
            education, new features, and tips for creating engaging learning
            experiences.
          </p>
          <div className="flex flex-col md:flex-row max-w-md mx-auto gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default BlogPage;
