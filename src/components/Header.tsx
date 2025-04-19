
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bike, Earth } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 w-full bg-white border-b border-earth-200 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center gap-2">
          <Earth className="w-6 h-6 text-green-600" />
          <span className="text-xl font-semibold text-green-800">GreenCommute</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#trip-planner" className="text-green-800 hover:text-green-600 font-medium">
            Trip Planner
          </a>
          <a href="#carbon-calculator" className="text-green-800 hover:text-green-600 font-medium">
            Carbon Calculator
          </a>
          <a href="#community" className="text-green-800 hover:text-green-600 font-medium">
            Community
          </a>
          <a href="#incentives" className="text-green-800 hover:text-green-600 font-medium">
            Rewards
          </a>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/login')}
            className="font-medium text-green-800 hover:text-green-600"
          >
            Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
