import React from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import AdjudicatorsSection from '@/components/landing/AdjudicatorsSection';
import WhyCritVidSection from '@/components/landing/WhyCritVidSection';
import CallToActionSection from '@/components/landing/CallToActionSection';
import FooterSection from '@/components/landing/FooterSection';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white w-full max-w-none">
      {/* Landing Header */}
      <LandingHeader />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* How It Works */}
      <HowItWorksSection />
      
      {/* Meet Our Adjudicators */}
      <AdjudicatorsSection />
      
      {/* Why CritVid */}
      <WhyCritVidSection />
      
      {/* Call to Action */}
      <CallToActionSection />
      
      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default Index;
