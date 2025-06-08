// This file will be replaced with three separate App.jsx files for each application
// This is a temporary placeholder during the architecture split

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import HelpPage from "./pages/HelpPage";
import BlogPage from "./pages/BlogPage";
import PricingPage from "./pages/PricingPage";
import SolutionsPage from "./pages/SolutionsPage";
import CareersPage from "./pages/CareersPage";
import ContactPage from "./pages/ContactPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import SchoolPage from "./pages/SchoolPage";
import WorkPage from "./pages/WorkPage";
import HomePage2 from "./pages/HomePage2";
import CommunityPage from "./pages/CommunityPage";

import ScrollToTop from "./components/ScrollToTop";
import NotFoundPage from "./pages/NotFoundPage";

// Marketing Website App - Static content only
function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Marketing Website Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/school" element={<SchoolPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/home" element={<HomePage2 />} />
        <Route path="/community" element={<CommunityPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
