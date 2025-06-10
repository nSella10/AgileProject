import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

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

// This is a nice component

function App() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "he";

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <Router>
      <div dir={isRTL ? "rtl" : "ltr"}>
        <ScrollToTop />
        <Routes>
          {/* Marketing Website Routes - Each page handles its own layout */}
          <Route path="/" element={<HomePage />} />

          {/* English Routes */}
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

          {/* Hebrew Routes */}
          <Route path="/אודות" element={<AboutPage />} />
          <Route path="/עזרה" element={<HelpPage />} />
          <Route path="/בלוג" element={<BlogPage />} />
          <Route path="/מחירים" element={<PricingPage />} />
          <Route path="/פתרונות" element={<SolutionsPage />} />
          <Route path="/קריירה" element={<CareersPage />} />
          <Route path="/צור-קשר" element={<ContactPage />} />
          <Route path="/תנאים" element={<TermsPage />} />
          <Route path="/פרטיות" element={<PrivacyPage />} />
          <Route path="/בית-ספר" element={<SchoolPage />} />
          <Route path="/עבודה" element={<WorkPage />} />
          <Route path="/קהילה" element={<CommunityPage />} />
          <Route path="/בבית" element={<HomePage2 />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
