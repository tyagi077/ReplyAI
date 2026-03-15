import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Wallet, Search } from 'lucide-react';
import Button from '../ui/Button';
import { Logo } from '../ui/Logo';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-navy/90 backdrop-blur-md py-3 shadow-lg' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo className="h-8 w-8 text-primary" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                NexusNews
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/latest" className="nav-link">Latest</Link>
            <Link to="/verified" className="nav-link">Verified</Link>
            <Link to="/about" className="nav-link">About</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button className="text-white hover:text-primary transition-colors">
              <Search size={20} />
            </button>
            <Button onClick={()=>navigate("/add")} variant="primary" size="small">
              Submit News
            </Button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden bg-navy/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/latest" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Latest</Link>
              <Link to="/verified" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Verified</Link>
              <Link to="/about" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>About</Link>
              <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
                <Button onClick={()=>{navigate("/add")}} variant="primary" fullWidth>
                  Submit News
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;