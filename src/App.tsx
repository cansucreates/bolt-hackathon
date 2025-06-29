import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { AdoptionPage } from './pages/AdoptionPage';
import { LostFoundPage } from './pages/LostFoundPage';
import { LostFoundRegistryPage } from './pages/LostFoundRegistryPage';
import { VetPage } from './pages/VetPage';
import { VetChatPage } from './pages/VetChatPage';
import { CommunityPage } from './pages/CommunityPage';
import { CrowdfundingPage } from './pages/CrowdfundingPage';
import { DonationPage } from './pages/DonationPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SupabaseSetupNotice } from './components/common/SupabaseSetupNotice';

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  return url && 
         key && 
         url !== 'your_supabase_project_url_here' && 
         key !== 'your_supabase_anon_key_here' &&
         url.startsWith('https://');
};

function App() {
  // Show setup notice if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return <SupabaseSetupNotice />;
  }

  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/adoption" element={<AdoptionPage />} />
            <Route path="/lost-found" element={<LostFoundPage />} />
            <Route path="/lost-found-registry" element={<LostFoundRegistryPage />} />
            <Route path="/vet" element={<VetPage />} />
            <Route path="/vet-chat" element={<VetChatPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/crowdfunding" element={<CrowdfundingPage />} />
            <Route path="/donation" element={<DonationPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;