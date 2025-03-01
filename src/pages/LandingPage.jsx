import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Stats from '../components/Stats';
import CTA from '../components/CTA';

const LandingPage = () => {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Hero />
      <Features />
      <Stats />
      <CTA />
    </div>
  );
};

export default LandingPage;