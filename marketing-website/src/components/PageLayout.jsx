// Marketing Website Page Layout - Uses MarketingNavbar
import React from "react";
import MarketingNavbar from "./MarketingNavbar";

const PageLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <MarketingNavbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
