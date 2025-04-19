
import React, { useState } from 'react';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import TransportModes from './TransportModes';

const TripPlanner = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  return (
    <section id="trip-planner" className="py-8">
      <div className="container px-4 mx-auto">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Plan Your Green Journey</h2>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="origin" className="text-green-800">Starting Point</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 h-4 w-4" />
                    <Input 
                      id="origin"
                      placeholder="Your location" 
                      className="pl-10"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destination" className="text-green-800">Destination</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 h-4 w-4" />
                    <Input 
                      id="destination"
                      placeholder="Where to?" 
                      className="pl-10"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-green-800">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 h-4 w-4" />
                    <Input 
                      id="date"
                      type="date" 
                      className="pl-10"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-green-800">Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 h-4 w-4" />
                    <Input 
                      id="time"
                      type="time" 
                      className="pl-10"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button type="submit" className="bg-green-600 hover:bg-green-700 px-8">
                  Find Routes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          {showResults && (
            <div className="border-t border-earth-200 p-6 bg-green-50">
              <h3 className="text-lg font-medium text-green-800 mb-4">Sustainable Route Options</h3>
              <TransportModes
                origin={origin}
                destination={destination}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TripPlanner;
