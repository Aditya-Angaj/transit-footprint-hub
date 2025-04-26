import React, { useState } from 'react';
import { MapPin, Calendar, Clock, ArrowRight, KeyRound } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import TransportModes from './TransportModes';
import { useToast } from '@/hooks/use-toast';

const TripPlanner = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [apiKey, setApiKey] = useState('YOUR_GOOGLE_MAPS_API_KEY_HERE'); // Default API key placeholder
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!origin || !destination) {
      toast({
        title: "Missing information",
        description: "Please enter both origin and destination",
        variant: "destructive"
      });
      return;
    }
    if (!apiKey) {
      toast({
        title: "Google Maps API Key Required",
        description: "Please enter your Google Maps Distance Matrix public API key.",
        variant: "destructive"
      });
      return;
    }
    
    setIsCalculating(true);
    try {
      setShowResults(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not calculate routes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
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
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="gmaps-api-key" className="text-green-800 flex items-center">
                    <KeyRound className="mr-1 h-4 w-4" /> Google Maps API Key
                  </Label>
                  <Input 
                    id="gmaps-api-key"
                    type="password" 
                    placeholder="Enter your Distance Matrix API key"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    autoComplete="off"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    This key is only used locally to fetch real distances and times.{' '}
                    <a 
                      href="https://developers.google.com/maps/documentation/distance-matrix/get-api-key" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline hover:text-green-700"
                    >How to get an API key (highly recommended)</a>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700 px-8"
                  disabled={isCalculating}
                >
                  {isCalculating ? 'Calculating...' : 'Find Routes'}
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
                apiKey={apiKey}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TripPlanner;
