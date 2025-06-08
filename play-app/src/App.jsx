import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JoinGamePage from "./pages/JoinGamePage";
import NotFoundPage from "./pages/NotFoundPage";
import ScrollToTop from "./components/ScrollToTop";

// Play App - Game participation platform
function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Play App Routes - No authentication required */}
        <Route path="/" element={<JoinGamePage />} />
        <Route path="/join" element={<JoinGamePage />} />
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
