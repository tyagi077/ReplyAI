import React from 'react';
import { Shield, Database, Cpu, UserPlus, Hash, Clock } from 'lucide-react';

const features = [
  {
    icon: <Shield size={24} />,
    title: 'Anonymous & Secure',
    description: 'Share news without revealing your identity. Our platform ensures complete anonymity using advanced cryptographic techniques.'
  },
  {
    icon: <Database size={24} />,
    title: 'Blockchain Verified',
    description: 'All content is timestamped and stored on blockchain, creating an immutable record that cannot be altered or censored.'
  },
  {
    icon: <Cpu size={24} />,
    title: 'AI Truth Verification',
    description: 'Our proprietary AI analyzes each submission against multiple sources to generate accurate truth scores and detect misinformation.'
  },
  {
    icon: <UserPlus size={24} />,
    title: 'Web3 Authentication',
    description: 'Connect with your Web3 wallet for secure, passwordless authentication and to claim ownership of your content.'
  },
  {
    icon: <Hash size={24} />,
    title: 'Decentralized Storage',
    description: 'Your content is distributed across a decentralized network, making it resistant to censorship and single points of failure.'
  },
  {
    icon: <Clock size={24} />,
    title: 'Transparent History',
    description: 'Track the full history and verification journey of each article with our transparent audit trail system.'
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-navy-light relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5"></div>
      <div className="absolute -left-32 top-32 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
      <div className="absolute -right-32 bottom-32 w-64 h-64 bg-accent/10 rounded-full blur-[100px]"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Web3-Powered
            </span> News Platform
          </h2>
          <p className="text-white/70 text-lg">
            Built on blockchain technology and AI verification to ensure transparency,
            accuracy and freedom of information in the digital age.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/10 
                hover:border-primary/30 rounded-xl p-6 transition-all duration-300
                hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 group"
            >
              <div className="bg-primary/10 rounded-xl w-12 h-12 flex items-center justify-center text-primary mb-4 
                group-hover:bg-primary group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-white/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;