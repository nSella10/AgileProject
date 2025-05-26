import React, { useState } from "react";
import PageLayout from "../components/PageLayout";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
  };

  const contactMethods = [
    {
      icon: "📧",
      title: "Email Support",
      description: "Get help with technical issues",
      contact: "support@guessify.com",
      responseTime: "Usually responds within 24 hours"
    },
    {
      icon: "💼",
      title: "Sales Inquiries",
      description: "Questions about pricing and plans",
      contact: "sales@guessify.com",
      responseTime: "Usually responds within 4 hours"
    },
    {
      icon: "🤝",
      title: "Partnerships",
      description: "Collaboration opportunities",
      contact: "partnerships@guessify.com",
      responseTime: "Usually responds within 48 hours"
    },
    {
      icon: "📰",
      title: "Press & Media",
      description: "Media inquiries and press releases",
      contact: "press@guessify.com",
      responseTime: "Usually responds within 24 hours"
    }
  ];

  const offices = [
    {
      city: "Tel Aviv",
      address: "123 Rothschild Blvd, Tel Aviv, Israel",
      phone: "+972-3-123-4567",
      hours: "Sunday - Thursday: 9:00 AM - 6:00 PM"
    },
    {
      city: "New York",
      address: "456 Broadway, New York, NY 10013",
      phone: "+1-212-123-4567",
      hours: "Monday - Friday: 9:00 AM - 6:00 PM EST"
    }
  ];

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-green-600 to-teal-700 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-green-200 max-w-3xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
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
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
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
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="sales">Sales Question</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
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
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Other Ways to Reach Us</h2>
            
            {/* Contact Methods */}
            <div className="space-y-6 mb-8">
              {contactMethods.map((method, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">{method.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{method.description}</p>
                      <a 
                        href={`mailto:${method.contact}`}
                        className="text-green-600 hover:text-green-700 font-medium"
                      >
                        {method.contact}
                      </a>
                      <p className="text-xs text-gray-500 mt-1">{method.responseTime}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Office Locations */}
            <h3 className="text-xl font-bold mb-4">Our Offices</h3>
            <div className="space-y-4">
              {offices.map((office, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">{office.city}</h4>
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
        <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Looking for Quick Answers?</h2>
          <p className="text-gray-700 mb-6">
            Check out our Help Center for frequently asked questions and detailed guides.
          </p>
          <a 
            href="/help" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Visit Help Center
          </a>
        </div>
      </div>
    </PageLayout>
  );
};

export default ContactPage;
