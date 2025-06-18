import React from "react";
import Navbar from "../components/Navbar";

const PageLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {" "}
      {/* התאמה לצבע של דפי auth */}
      <Navbar />
      <main className="flex-grow flex flex-col">{children}</main>
    </div>
  );
};

export default PageLayout;
