import React from 'react';
import Hero from '../components/home/Hero';
import LostFoundSection from '../components/home/LostFoundSection';
import CrowdfundingSection from '../components/home/CrowdfundingSection';
import VetSection from '../components/home/VetSection';
import ChatSection from '../components/home/ChatSection';
import CommunitySection from '../components/home/CommunitySection';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <LostFoundSection />
      <CrowdfundingSection />
      <VetSection />
      <ChatSection />
      <CommunitySection />
    </>
  );
};

export default HomePage;