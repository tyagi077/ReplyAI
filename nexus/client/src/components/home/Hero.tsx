import React from 'react';
import { ArrowRight, Shield, Database, Cpu } from 'lucide-react';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';


const Hero: React.FC = () => {
  const navigate = useNavigate();


  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy to-navy/95 -z-10"></div>
      
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5 -z-10"></div>
      
      {/* Glow effect */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-[100px] -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-8 mb-10 md:mb-0">
            <div className="mb-3 inline-block">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                Decentralized Truth Platform
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Share News Without </span>
              <span className="text-primary block md:inline">Fear</span>
              <span className="text-white">, Verify With </span>
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Transparency
              </span>
            </h1>
            
            <p className="text-white/80 text-lg md:text-xl mb-8 leading-relaxed">
              A blockchain-powered platform for anonymous news sharing with AI-verified 
              truth scores. Making information free, accessible, and verified for everyone.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                variant="primary" 
                size="large" 
                icon={<ArrowRight className="animate-pulse" />}
              >
                Explore Feed
              </Button>
              <Button onClick={()=>navigate("/add")} variant="outlined" size="large">
                Submit News
              </Button>
            </div>
            
            <div className="flex flex-wrap mt-12 gap-6">
              <div className="flex items-center">
                <Shield className="text-primary mr-2" size={20} />
                <span className="text-white font-medium">Secure & Anonymous</span>
              </div>
              
              <div className="flex items-center">
                <Database className="text-primary mr-2" size={20} />
                <span className="text-white font-medium">Blockchain Verified</span>
              </div>
              
              <div className="flex items-center">
                <Cpu className="text-primary mr-2" size={20} />
                <span className="text-white font-medium">AI Powered</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-primary/20">
              <img 
                src="https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Newspapers with digital overlay" 
                className="w-full h-auto"
              />
              
              {/* Truth score overlay */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-green-400 text-white text-sm font-bold px-3 py-1 rounded-full flex items-center">
                93% Verified
              </div>
            </div>
            
           
            
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;