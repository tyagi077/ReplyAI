import React from 'react';
import NewsFeed from '../components/news/NewsFeed';

const VerifiedPage: React.FC = () => {
  return (
    <div className="bg-navy min-h-screen">
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold text-white mb-6">Verified News</h1>
        <p className="text-white/70 mb-8">Displaying all news items with credibility score &gt; 40 (newest first).</p>
        <NewsFeed />
      </div>
    </div>
  );
};

export default VerifiedPage;
