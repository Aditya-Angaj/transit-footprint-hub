
import React from 'react';
import { Earth, Github, Twitter, Facebook, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Footer = () => {
  return (
    <footer className="bg-green-900 text-white py-12">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Earth className="h-6 w-6 text-green-300" />
              <span className="text-2xl font-bold">GreenCommute</span>
            </div>
            <p className="text-green-200">
              Making sustainable transportation accessible, affordable, and rewarding for everyone.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-green-200 hover:text-white hover:bg-green-800">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-green-200 hover:text-white hover:bg-green-800">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-green-200 hover:text-white hover:bg-green-800">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <a href="#trip-planner" className="text-green-200 hover:text-white transition-colors">
                  Trip Planner
                </a>
              </li>
              <li>
                <a href="#carbon-calculator" className="text-green-200 hover:text-white transition-colors">
                  Carbon Calculator
                </a>
              </li>
              <li>
                <a href="#community" className="text-green-200 hover:text-white transition-colors">
                  Community Carpools
                </a>
              </li>
              <li>
                <a href="#transit-updates" className="text-green-200 hover:text-white transition-colors">
                  Transit Updates
                </a>
              </li>
              <li>
                <a href="#incentives" className="text-green-200 hover:text-white transition-colors">
                  Incentives & Rewards
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-green-200 hover:text-white transition-colors">
                  Our Mission
                </a>
              </li>
              <li>
                <a href="#" className="text-green-200 hover:text-white transition-colors">
                  Environmental Impact
                </a>
              </li>
              <li>
                <a href="#" className="text-green-200 hover:text-white transition-colors">
                  Partners
                </a>
              </li>
              <li>
                <a href="#" className="text-green-200 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-green-200 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-green-200 mb-4">
              Subscribe to receive updates on new features and sustainable transportation news.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-800 h-4 w-4" />
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="pl-9 bg-white text-green-800 placeholder:text-green-400 border-green-700"
                />
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-green-800 text-center text-green-300 text-sm">
          <p>© {new Date().getFullYear()} GreenCommute. All rights reserved.</p>
          <p className="mt-1">
            Contributing to{' '}
            <a href="#" className="underline hover:text-white">SDG 11: Sustainable Cities and Communities</a>
            {' '}and{' '}
            <a href="#" className="underline hover:text-white">SDG 13: Climate Action</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
