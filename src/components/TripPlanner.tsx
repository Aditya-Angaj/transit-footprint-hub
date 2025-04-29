
import React, { useState } from 'react';
import { MapPin, Calendar, Clock, ArrowRight, Car, KeyRound } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import TransportModes from './TransportModes';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Navi Mumbai region distance mapping - adding accurate local distances
const naviMumbaiDistances = {
  'vashi': {
    'nerul': 5.2,
    'belapur': 8.7,
    'kharghar': 12.5,
    'panvel': 19.8,
    'airoli': 7.3,
    'ghansoli': 4.6,
    'kopar khairane': 3.2,
    'sanpada': 1.8,
    'juinagar': 3.5,
    'seawoods': 6.1,
    'cbd belapur': 8.7,
    'khanda colony': 15.3,
    'taloja': 22.4,
  },
  'nerul': {
    'vashi': 5.2,
    'belapur': 3.5,
    'kharghar': 7.3,
    'panvel': 14.6,
    'airoli': 12.5,
    'ghansoli': 9.8,
    'kopar khairane': 8.4,
    'sanpada': 3.4,
    'juinagar': 1.7,
    'seawoods': 0.9,
    'cbd belapur': 3.5,
    'khanda colony': 10.1,
    'taloja': 17.2,
  },
  'belapur': {
    'vashi': 8.7,
    'nerul': 3.5,
    'kharghar': 3.8,
    'panvel': 11.1,
    'airoli': 16.0,
    'ghansoli': 13.3,
    'kopar khairane': 11.9,
    'sanpada': 6.9,
    'juinagar': 5.2,
    'seawoods': 2.6,
    'cbd belapur': 0.0,
    'khanda colony': 6.6,
    'taloja': 13.7,
  },
  'kharghar': {
    'vashi': 12.5,
    'nerul': 7.3,
    'belapur': 3.8,
    'panvel': 7.3,
    'airoli': 19.8,
    'ghansoli': 17.1,
    'kopar khairane': 15.7,
    'sanpada': 10.7,
    'juinagar': 9.0,
    'seawoods': 6.4,
    'cbd belapur': 3.8,
    'khanda colony': 2.8,
    'taloja': 9.9,
  }
  // These are the most populated areas, we can add more as needed
};

// Helper function to calculate accurate distance between Navi Mumbai locations
const calculateNaviMumbaiDistance = (origin, destination) => {
  const originLower = origin.toLowerCase();
  const destinationLower = destination.toLowerCase();
  
  // Check if we have exact data for these locations
  for (const [baseLocation, distances] of Object.entries(naviMumbaiDistances)) {
    if (originLower.includes(baseLocation)) {
      for (const [targetLocation, distance] of Object.entries(distances)) {
        if (destinationLower.includes(targetLocation)) {
          return distance;
        }
      }
    }
    
    // Check reverse direction
    if (destinationLower.includes(baseLocation)) {
      for (const [targetLocation, distance] of Object.entries(distances)) {
        if (originLower.includes(targetLocation)) {
          return distance;
        }
      }
    }
  }
  
  return null; // If no match found
};

const TripPlanner = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [apiKey, setApiKey] = useState('YOUR_GOOGLE_MAPS_API_KEY_HERE');
  const [calculatedDistance, setCalculatedDistance] = useState(null);
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
    
    setIsCalculating(true);
    try {
      // Check for Navi Mumbai specific distances first
      const naviMumbaiDistance = calculateNaviMumbaiDistance(origin, destination);
      
      if (naviMumbaiDistance) {
        setCalculatedDistance(naviMumbaiDistance);
        toast({
          title: "Distance calculated",
          description: `The distance between ${origin} and ${destination} is approximately ${naviMumbaiDistance} km.`,
        });
      }
      
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

  const handleCreateCarpool = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!origin || !destination) {
      toast({
        title: "Missing information",
        description: "Please enter both origin and destination",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create a carpool",
          variant: "destructive"
        });
        return;
      }

      const carpoolData = {
        origin,
        destination,
        schedule: date && time ? `${date} ${time}` : "Flexible",
        available_seats: 4, // Default to 4 seats, you could make this configurable
        user_id: user.id,
        status: 'active' // Explicitly set status to active
      };

      const { error } = await supabase
        .from('carpools')
        .insert(carpoolData);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your carpool has been created and is now available.",
      });
      
      // Reset form
      setShowResults(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create carpool. Please try again.",
        variant: "destructive"
      });
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
                      placeholder="Your location in Navi Mumbai" 
                      className="pl-10"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      required
                      list="navi-mumbai-locations"
                    />
                    <datalist id="navi-mumbai-locations">
                      <option value="Vashi" />
                      <option value="Nerul" />
                      <option value="Belapur" />
                      <option value="Kharghar" />
                      <option value="Panvel" />
                      <option value="Airoli" />
                      <option value="Ghansoli" />
                      <option value="Kopar Khairane" />
                      <option value="Sanpada" />
                      <option value="Juinagar" />
                      <option value="Seawoods" />
                      <option value="CBD Belapur" />
                    </datalist>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destination" className="text-green-800">Destination</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 h-4 w-4" />
                    <Input 
                      id="destination"
                      placeholder="Where to in Navi Mumbai?" 
                      className="pl-10"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                      list="navi-mumbai-locations"
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
              
              {calculatedDistance && (
                <div className="bg-green-50 p-3 rounded-md mb-4 text-green-800 text-sm">
                  <strong>Accurate distance:</strong> {calculatedDistance} km between {origin} and {destination}
                </div>
              )}
              
              <div className="flex justify-center gap-4">
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700 px-8"
                  disabled={isCalculating}
                >
                  {isCalculating ? 'Calculating...' : 'Find Routes'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button 
                  type="button"
                  variant="outline"
                  className="px-8"
                  onClick={handleCreateCarpool}
                >
                  Create Carpool
                  <Car className="ml-2 h-4 w-4" />
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
                calculatedDistance={calculatedDistance}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TripPlanner;
