
import React from 'react';
import Header from '@/components/Header';
import TripPlanner from '@/components/TripPlanner';
import CarbonCalculator from '@/components/CarbonCalculator';
import CommunitySection from '@/components/CommunitySection';
import TransitUpdates from '@/components/TransitUpdates';
import Footer from '@/components/Footer';
import CarpoolList from '@/components/CarpoolList';
import TravelLog from '@/components/TravelLog';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-green-50/30">
      <Header />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16">
          <div className="container px-4 mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Travel Sustainably, Live Better</h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto mb-8">
              GreenCommute helps you find eco-friendly transportation options, track your carbon footprint, and earn rewards for making sustainable choices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#trip-planner" className="inline-flex items-center justify-center rounded-md bg-white text-green-800 font-medium px-6 py-3 shadow hover:bg-green-50">
                Plan Your Trip
              </a>
              <a href="#carbon-calculator" className="inline-flex items-center justify-center rounded-md border border-green-300 text-white font-medium px-6 py-3 hover:bg-green-800">
                Calculate Your Impact
              </a>
            </div>
          </div>
        </section>
        
        {/* Main content sections */}
        <TripPlanner />
        <div className="py-8">
          <div className="container px-4 mx-auto">
            <CarpoolList />
          </div>
        </div>
        
        {/* New Travel Log Section */}
        <div className="py-8 bg-green-50">
          <div className="container px-4 mx-auto">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Track Your Journeys</h2>
            <TravelLog />
          </div>
        </div>
        
        <CarbonCalculator />
        <CommunitySection />
        <TransitUpdates />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
