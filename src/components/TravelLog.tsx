
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Save } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { calculateNaviMumbaiDistance } from '@/utils/distanceCalculator';

const TravelLog = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [transportMode, setTransportMode] = useState('car');
  const [notes, setNotes] = useState('');
  const [isLogging, setIsLogging] = useState(false);
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
    
    setIsLogging(true);
    
    try {
      // Calculate distance 
      let distance = calculateNaviMumbaiDistance(origin, destination);
      if (!distance) {
        distance = 5; // Default if we can't calculate
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to log your travel",
          variant: "destructive"
        });
        setIsLogging(false);
        return;
      }
      
      // Fixed Supabase call to match our database schema
      const { error } = await supabase
        .from('travel_logs')
        .insert({
          user_id: user.id,
          date,
          origin,
          destination,
          distance,
          transport_mode: transportMode,
          notes,
        });
      
      if (error) throw error;
      
      toast({
        title: "Travel logged successfully!",
        description: `Your ${distance} km trip has been recorded.`
      });
      
      // Reset form fields except date
      setOrigin('');
      setDestination('');
      setNotes('');
      
    } catch (error: any) {
      toast({
        title: "Error logging travel",
        description: error.message || "Failed to log your travel data",
        variant: "destructive"
      });
    } finally {
      setIsLogging(false);
    }
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Calendar className="h-5 w-5 text-green-600" />
          Log Your Daily Travel
        </CardTitle>
        <CardDescription>
          Track your commuting habits and environmental impact
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
            
            <div>
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
          </div>
          
          <div>
            <Label className="text-green-800">Transport Mode</Label>
            <RadioGroup 
              value={transportMode} 
              onValueChange={setTransportMode}
              className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="car" id="car-log" />
                <Label htmlFor="car-log">Car (alone)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="carpool" id="carpool-log" />
                <Label htmlFor="carpool-log">Carpool</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bus" id="bus-log" />
                <Label htmlFor="bus-log">Bus</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="train" id="train-log" />
                <Label htmlFor="train-log">Train</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bike" id="bike-log" />
                <Label htmlFor="bike-log">Bicycle</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="walk" id="walk-log" />
                <Label htmlFor="walk-log">Walking</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="notes" className="text-green-800">Notes (optional)</Label>
            <Textarea 
              id="notes"
              placeholder="Any additional details about your trip" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-20"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLogging}
          >
            {isLogging ? 'Logging...' : 'Log Travel'}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TravelLog;
