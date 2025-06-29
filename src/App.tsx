import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import LostFoundPage from './pages/LostFoundPage';
import LostFoundRegistryPage from './pages/LostFoundRegistryPage';
import CrowdfundingPage from './pages/CrowdfundingPage';
import AdoptionPage from './pages/AdoptionPage';
import VetPage from './pages/VetPage';
import VetChatPage from './pages/VetChatPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import DonationPage from './pages/DonationPage';

// Scroll to top component
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top immediately when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // Use 'auto' for immediate scroll, not 'smooth'
    });
    
    // Also ensure document element is scrolled to top (for some browsers)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Reset scroll restoration to manual to prevent browser interference
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, [pathname]);

  return null;
};

function App() {
  // Set scroll restoration to manual on app initialization
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Ensure initial page load starts at top
    window.scrollTo(0, 0);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/lost-found" element={<LostFoundPage />} />
            <Route path="/lost-found/registry" element={<LostFoundRegistryPage />} />
            <Route path="/crowdfunding" element={<CrowdfundingPage />} />
            <Route path="/adoption" element={<AdoptionPage />} />
            <Route path="/vets" element={<VetPage />} />
            <Route path="/chat" element={<VetChatPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/donations" element={<DonationPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            
            {/* Auth Callback - This handles Google OAuth redirects */}
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            
            {/* Additional navigation routes */}
            <Route path="/guide" element={<div className="pt-24 pb-16 text-center"><h1 className="text-4xl font-bold text-gray-800 mb-4">Pet Care Guide</h1><p className="text-gray-600">Coming Soon!</p></div>} />
            <Route path="/emergency" element={<div className="pt-24 pb-16 text-center"><h1 className="text-4xl font-bold text-gray-800 mb-4">Emergency Help</h1><p className="text-gray-600">Coming Soon!</p></div>} />
            <Route path="/blog" element={<div className="pt-24 pb-16 text-center"><h1 className="text-4xl font-bold text-gray-800 mb-4">Pet Blog</h1><p className="text-gray-600">Coming Soon!</p></div>} />
            <Route path="/events" element={<div className="pt-24 pb-16 text-center"><h1 className="text-4xl font-bold text-gray-800 mb-4">Events</h1><p className="text-gray-600">Coming Soon!</p></div>} />
            <Route path="/volunteer" element={<div className="pt-24 pb-16 text-center"><h1 className="text-4xl font-bold text-gray-800 mb-4">Volunteer</h1><p className="text-gray-600">Coming Soon!</p></div>} />
            <Route path="/about" element={<div className="pt-24 pb-16 text-center"><h1 className="text-4xl font-bold text-gray-800 mb-4">About Us</h1><p className="text-gray-600">Coming Soon!</p></div>} />
            <Route path="/contact" element={<div className="pt-24 pb-16 text-center"><h1 className="text-4xl font-bold text-gray-800 mb-4">Contact</h1><p className="text-gray-600">Coming Soon!</p></div>} />
            <Route path="/privacy" element={<div className="pt-24 pb-16 text-center"><h1 className="text-4xl font-bold text-gray-800 mb-4">Privacy Policy</h1><p className="text-gray-600">Coming Soon!</p></div>} />
            <Route path="/terms" element={<div className="pt-24 pb-16 text-center"><h1 className="text-4xl font-bold text-gray-800 mb-4">Terms of Service</h1><p className="text-gray-600">Coming Soon!</p></div>} />
            <Route path="/faq" element={<div className="pt-24 pb-16 text-center"><h1 className="text-4xl font-bold text-gray-800 mb-4">FAQ</h1><p className="text-gray-600">Coming Soon!</p></div>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App