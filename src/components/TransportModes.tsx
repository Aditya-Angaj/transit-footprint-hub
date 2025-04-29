import React, { useEffect, useState } from 'react';
import { Bike, Bus, Car, Footprints, Train, Caravan } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Improved algorithm to estimate distances based on city names
const calculateImprovedDistance = (origin: string, destination: string, providedDistance: number | null) => {
  // If we already have a calculated distance, use it
  if (providedDistance !== null) {
    return {
      distance: providedDistance,
      drivingTime: Math.ceil((providedDistance / 50) * 60), // in minutes
      walkingTime: Math.ceil((providedDistance / 5) * 60),
      bikingTime: Math.ceil((providedDistance / 15) * 60),
      busTime: Math.ceil((providedDistance / 30) * 60),
      trainTime: Math.ceil((providedDistance / 60) * 60)
    };
  }
  
  // This is a simplified calculation to make the distances more realistic
  // We hash the origin and destination names to create somewhat consistent distances
  const hash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };
  
  // Generate a distance between 5 and 50 km based on the names
  const combinedHash = hash(origin.toLowerCase() + destination.toLowerCase());
  const distance = (combinedHash % 450) / 10 + 5; // From 5 to 50 km
  
  // More realistic time estimations for each mode
  const drivingSpeed = 50; // km/h for urban travel
  const walkingSpeed = 5; // km/h
  const bikingSpeed = 15; // km/h
  const busSpeed = 30; // km/h including stops
  const trainSpeed = 60; // km/h for commuter rails
  
  return {
    distance,
    drivingTime: Math.ceil((distance / drivingSpeed) * 60), // in minutes
    walkingTime: Math.ceil((distance / walkingSpeed) * 60),
    bikingTime: Math.ceil((distance / bikingSpeed) * 60),
    busTime: Math.ceil((distance / busSpeed) * 60),
    trainTime: Math.ceil((distance / trainSpeed) * 60)
  };
};

interface TransportModeProps {
  origin: string;
  destination: string;
  calculatedDistance?: number | null;
}

const TransportModes: React.FC<TransportModeProps> = ({ origin, destination, calculatedDistance = null }) => {
  const [routes, setRoutes] = useState<Array<{
    id: number;
    mode: string;
    icon: React.ElementType;
    title: string;
    time: string;
    distance: string;
    emissions: string;
    emissionReduction: string;
    weeklyEmissions: string;
    tags: string[];
  }>>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const calculateRoutes = async () => {
    if (!origin || !destination) {
      setLoading(false);
      return;
    }

    // Calculate improved distance metrics
    const { 
      distance, 
      drivingTime, 
      walkingTime, 
      bikingTime, 
      busTime, 
      trainTime 
    } = calculateImprovedDistance(origin, destination, calculatedDistance);

    // Emissions factors (kg CO2 per km)
    const emissionFactors = {
      car: 0.192,
      carpool: 0.096,
      bus: 0.052,
      train: 0.041,
      bike: 0,
      walk: 0
    };

    // Calculate different route options with weekly impact
    const calculateWeeklyEmissions = (dailyEmissions: number) => {
      return (dailyEmissions * 5).toFixed(2); // Assuming 5 working days
    };

    // Calculate different route options
    const routeOptions = [
      {
        id: 1,
        mode: 'bike',
        icon: Bike,
        title: 'Bike Route',
        time: `${bikingTime} mins`,
        distance: `${distance.toFixed(1)} km`,
        emissions: '0 kg CO₂',
        emissionReduction: '100%',
        weeklyEmissions: '0 kg CO₂/week',
        tags: ['zero-emissions', 'exercise']
      },
      {
        id: 2,
        mode: 'transit',
        icon: Bus,
        title: 'Public Transit',
        time: `${busTime} mins`,
        distance: `${distance.toFixed(1)} km`,
        emissions: `${(distance * emissionFactors.bus).toFixed(2)} kg CO₂`,
        emissionReduction: `${Math.round((1 - emissionFactors.bus / emissionFactors.car) * 100)}%`,
        weeklyEmissions: `${calculateWeeklyEmissions(distance * emissionFactors.bus)} kg CO₂/week`,
        tags: ['low-emissions', 'convenient']
      },
      {
        id: 3,
        mode: 'walk',
        icon: Footprints,
        title: 'Walking Route',
        time: `${walkingTime} mins`,
        distance: `${distance.toFixed(1)} km`,
        emissions: '0 kg CO₂',
        emissionReduction: '100%',
        weeklyEmissions: '0 kg CO₂/week',
        tags: ['zero-emissions', 'exercise']
      },
      {
        id: 4,
        mode: 'carpool',
        icon: Caravan,
        title: 'Carpool',
        time: `${drivingTime} mins`,
        distance: `${distance.toFixed(1)} km`,
        emissions: `${(distance * emissionFactors.carpool).toFixed(2)} kg CO₂`,
        emissionReduction: `${Math.round((1 - emissionFactors.carpool / emissionFactors.car) * 100)}%`,
        weeklyEmissions: `${calculateWeeklyEmissions(distance * emissionFactors.carpool)} kg CO₂/week`,
        tags: ['shared', 'community']
      }
    ];

    setRoutes(routeOptions);
    setLoading(false);
  };

  useEffect(() => {
    calculateRoutes();
  }, [origin, destination, calculatedDistance]);

  const handleStartCarpool = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please log in to create a carpool.",
        });
        return;
      }

      const { error } = await supabase.from('carpools').insert({
        user_id: user.id,
        origin,
        destination,
        schedule: "Flexible",
        available_seats: 3,
        status: 'active'  // Explicitly set status to active
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your carpool has been created.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating carpool",
        description: error.message,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-pulse text-green-600">Calculating routes...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {routes.map((route) => {
        const Icon = route.icon;
        return (
          <Card key={route.id} className="overflow-hidden">
            <CardHeader className="bg-green-100 pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Icon className="h-5 w-5" /> {route.title}
                </CardTitle>
                <Badge variant="outline" className="bg-white">
                  {route.time}
                </Badge>
              </div>
              <CardDescription>
                {origin} to {destination}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Distance:</span>
                <span className="font-medium">{route.distance}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Daily CO₂:</span>
                <span className="font-medium text-green-600">{route.emissions}</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-500">Weekly CO₂:</span>
                <span className="font-medium text-green-600">{route.weeklyEmissions}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: route.emissionReduction }}
                ></div>
              </div>
              <div className="text-xs text-right mt-1 text-green-700">
                {route.emissionReduction} less than driving alone
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2 flex-wrap">
              {route.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-green-50 text-green-700 text-xs">
                  {tag}
                </Badge>
              ))}
              {route.mode === 'carpool' && (
                <button 
                  onClick={handleStartCarpool}
                  className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Start Carpool
                </button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default TransportModes;
