import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-navy pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="bg-white/5 rounded-xl p-8 shadow-lg">
          <h1 className="text-4xl font-bold text-white mb-4">About NexusNews</h1>
          <p className="text-white/70 mb-6">
            NexusNews aggregates news submitted by users, verifies credibility using AI signals, and displays verified and latest updates.
          </p>
          <p className="text-white/70 mb-6">
            Use the navigation above to explore the latest and verified stories, or submit your own article.
          </p>
          <Link to="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
