import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import AuthPage from "./components/pages/AuthPage";
import ProfilePage from "./components/pages/ProfilePage";
import Footer from "./components/Footer";
import AppLoader from "./components/AppLoader";

function AppContent() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const { darkMode } = useSelector((state) => state.theme);
  
  const isProfilePage = location.pathname.startsWith('/profile');

  useEffect(() => {
    const handleLoading = () => {
      // Add a small delay to ensure everything is ready
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); // 1 second minimum loading time
    };

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      handleLoading();
    } else {
      window.addEventListener("load", handleLoading);
    }

    return () => window.removeEventListener("load", handleLoading);
  }, []);

  // Show loader until everything is loaded
  if (isLoading) {
    return <AppLoader darkMode={darkMode} />;
  }

  return (
    <div className="min-h-screen w-full transition-colors duration-500 bg-gradient-to-b from-blue-100 via-white to-purple-100 dark:from-slate-900 dark:via-gray-900 dark:to-gray-800">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/:authType" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} /> 
        <Route path="/profile/:id" element={<ProfilePage />} />
        {/* Add more routes here if needed */}
      </Routes>
      {/* Conditionally render Footer - hide on profile pages */}
      {!isProfilePage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
