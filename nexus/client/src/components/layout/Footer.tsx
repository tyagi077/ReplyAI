import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { Twitter, Github, Disc as Discord, ArrowUpRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-darker text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center mb-6">
              <Logo className="h-8 w-8 text-primary" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                NexusNews
              </span>
            </Link>
            
            <p className="text-white/60 mb-6">
              A decentralized news platform powered by blockchain technology and AI verification.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-primary transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-primary transition-colors">
                <Discord size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-white/60 hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/trending" className="text-white/60 hover:text-primary transition-colors">Trending</Link>
              </li>
              <li>
                <Link to="/categories" className="text-white/60 hover:text-primary transition-colors">Categories</Link>
              </li>
              <li>
                <Link to="/submit" className="text-white/60 hover:text-primary transition-colors">Submit News</Link>
              </li>
              <li>
                <Link to="/about" className="text-white/60 hover:text-primary transition-colors">About Us</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">Categories</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/category/blockchain" className="text-white/60 hover:text-primary transition-colors">Blockchain</Link>
              </li>
              <li>
                <Link to="/category/cryptocurrency" className="text-white/60 hover:text-primary transition-colors">Cryptocurrency</Link>
              </li>
              <li>
                <Link to="/category/defi" className="text-white/60 hover:text-primary transition-colors">DeFi</Link>
              </li>
              <li>
                <Link to="/category/nft" className="text-white/60 hover:text-primary transition-colors">NFTs</Link>
              </li>
              <li>
                <Link to="/category/metaverse" className="text-white/60 hover:text-primary transition-colors">Metaverse</Link>
              </li>
            </ul>
          </div>      
          
        </div>
        
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between">
          <p className="text-white/60 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} NexusNews. All rights reserved.
          </p>
          
          <div className="flex flex-wrap space-x-4 text-sm text-white/60">
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;