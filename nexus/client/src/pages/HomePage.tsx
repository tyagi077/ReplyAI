import React from 'react';
import Hero from '../components/home/Hero';
import NewsFeed from '../components/news/NewsFeed';
import TrendingSection from '../components/home/TrendingSection';
import FeaturesSection from '../components/home/FeaturesSection';

const HomePage: React.FC = () => {
  return (
    <div className="bg-navy min-h-screen">
      <Hero />
      <TrendingSection />
      <NewsFeed />
      <FeaturesSection />
    </div>
  );
};

export default HomePage;