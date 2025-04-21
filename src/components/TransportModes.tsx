
import React, { useEffect, useState } from 'react';
import { Bike, Bus, Car, Footprints, Train, Caravan } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';

interface TransportModeProps {
  origin: string;
  destination: string;
}

interface RouteOption {
  id: number;
  mode: string;
  icon: React.ElementType;
  title: string;
  time: string;
  distance: string;
  emissions: string;
  emissionReduction: string;
  tags: string[];
}

const TransportModes: React.FC<TransportModeProps> = ({ origin, destination }) => {
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const calculateRoutes = async () => {
      setLoading(true);
      try {
        // Calculate distances
        const distance = await calculateDistance(origin, destination);
        
        // Create route options based on real distance
        const routeOptions = generateRouteOptions(distance);
        setRoutes(routeOptions);
      } catch (error) {
        console.error("Error calculating routes:", error);
        toast({
          title: "Error",
          description: "Failed to calculate route distances",
          variant: "destructive"
        });
        // Fallback to default routes
        setRoutes(getDefaultRoutes());
      } finally {
        setLoading(false);
      }
    };

    if (origin && destination) {
      calculateRoutes();
    }
  }, [origin, destination, toast]);

  const calculateDistance = async (start: string, end: string): Promise<number> => {
    try {
      // Using the Haversine formula to calculate distance
      // This is a simplified version - in a real app, you'd use a maps API
      const geocodeLocation = async (address: string) => {
        // Simulating geocoding
        // In a real app, you would use something like Google's Geocoding API
        if (address.toLowerCase().includes('delhi')) {
          return { lat: 28.6139, lng: 77.2090 };
        } else if (address.toLowerCase().includes('mumbai')) {
          return { lat: 19.0760, lng: 72.8777 };
        } else if (address.toLowerCase().includes('bangalore') || address.toLowerCase().includes('bengaluru')) {
          return { lat: 12.9716, lng: 77.5946 };
        } else if (address.toLowerCase().includes('chennai')) {
          return { lat: 13.0827, lng: 80.2707 };
        } else if (address.toLowerCase().includes('kolkata')) {
          return { lat: 22.5726, lng: 88.3639 };
        } else {
          // Random coordinates for demo
          const lat = 20 + Math.random() * 15;
          const lng = 70 + Math.random() * 15;
          return { lat, lng };
        }
      };

      const startCoords = await geocodeLocation(start);
      const endCoords = await geocodeLocation(end);

      // Haversine formula
      const R = 6371; // Earth radius in km
      const dLat = toRad(endCoords.lat - startCoords.lat);
      const dLon = toRad(endCoords.lng - startCoords.lng);
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(startCoords.lat)) * Math.cos(toRad(endCoords.lat)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;

      return distance; // kilometers
    } catch (error) {
      console.error("Error calculating distance:", error);
      return 5; // Default to 5km if calculation fails
    }
  };

  const toRad = (value: number) => {
    return value * Math.PI / 180;
  };

  const generateRouteOptions = (distanceKm: number): RouteOption[] => {
    // Calculate travel times based on distance
    const bikeSpeed = 15; // km/h
    const walkingSpeed = 5; // km/h
    const transitSpeed = 25; // km/h
    const carpoolSpeed = 40; // km/h

    const bikeTime = Math.round(distanceKm / bikeSpeed * 60);
    const walkTime = Math.round(distanceKm / walkingSpeed * 60);
    const transitTime = Math.round(distanceKm / transitSpeed * 60);
    const carpoolTime = Math.round(distanceKm / carpoolSpeed * 60);

    // Calculate emissions
    const transitEmissions = distanceKm * 0.06; // kg CO2 per km
    const carpoolEmissions = distanceKm * 0.13; // kg CO2 per km
    const carEmissions = distanceKm * 0.2; // kg CO2 per km (for comparison)

    return [
      {
        id: 1,
        mode: 'bike',
        icon: Bike,
        title: 'Bike Route',
        time: `${bikeTime} min`,
        distance: `${distanceKm.toFixed(1)} km`,
        emissions: '0 kg CO₂',
        emissionReduction: '100%',
        tags: ['zero-emissions', 'exercise']
      },
      {
        id: 2,
        mode: 'transit',
        icon: Bus,
        title: 'Public Transit',
        time: `${transitTime} min`,
        distance: `${distanceKm.toFixed(1)} km`,
        emissions: `${transitEmissions.toFixed(1)} kg CO₂`,
        emissionReduction: `${Math.round((1 - transitEmissions / carEmissions) * 100)}%`,
        tags: ['low-emissions', 'convenient']
      },
      {
        id: 3,
        mode: 'walk',
        title: 'Walking Route',
        icon: Footprints,
        time: `${walkTime} min`,
        distance: `${distanceKm.toFixed(1)} km`,
        emissions: '0 kg CO₂',
        emissionReduction: '100%',
        tags: ['zero-emissions', 'exercise']
      },
      {
        id: 4,
        mode: 'carpool',
        icon: Caravan,
        title: 'Carpool',
        time: `${carpoolTime} min`,
        distance: `${distanceKm.toFixed(1)} km`,
        emissions: `${carpoolEmissions.toFixed(1)} kg CO₂`,
        emissionReduction: `${Math.round((1 - carpoolEmissions / carEmissions) * 100)}%`,
        tags: ['shared', 'community']
      }
    ];
  };

  const getDefaultRoutes = (): RouteOption[] => {
    return [
      {
        id: 1,
        mode: 'bike',
        icon: Bike,
        title: 'Bike Route',
        time: '25 min',
        distance: '4.2 km',
        emissions: '0 kg CO₂',
        emissionReduction: '100%',
        tags: ['zero-emissions', 'exercise']
      },
      {
        id: 2,
        mode: 'transit',
        icon: Bus,
        title: 'Public Transit',
        time: '18 min',
        distance: '5.1 km',
        emissions: '0.3 kg CO₂',
        emissionReduction: '85%',
        tags: ['low-emissions', 'convenient']
      },
      {
        id: 3,
        mode: 'walk',
        icon: Footprints,
        title: 'Walking Route',
        time: '55 min',
        distance: '4.0 km',
        emissions: '0 kg CO₂',
        emissionReduction: '100%',
        tags: ['zero-emissions', 'exercise']
      },
      {
        id: 4,
        mode: 'carpool',
        icon: Caravan,
        title: 'Carpool',
        time: '15 min',
        distance: '6.3 km',
        emissions: '0.8 kg CO₂',
        emissionReduction: '60%',
        tags: ['shared', 'community']
      }
    ];
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
              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-500">CO₂ Emissions:</span>
                <span className="font-medium text-green-600">{route.emissions}</span>
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
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default TransportModes;
