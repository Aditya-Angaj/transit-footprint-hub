import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Earth, User } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '@/lib/supabase';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

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
          {user ? (
            <Button 
              variant="ghost" 
              onClick={() => navigate('/profile')}
              className="font-medium text-green-800 hover:text-green-600"
            >
              <User className="w-5 h-5 mr-2" />
              Profile
            </Button>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="font-medium text-green-800 hover:text-green-600"
              >
                Login
              </Button>
              <Button 
                variant="default"
                onClick={() => navigate('/signup')}
                className="font-medium bg-green-600 hover:bg-green-700 text-white"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
