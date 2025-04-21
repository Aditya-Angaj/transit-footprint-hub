
import React, { useEffect, useState } from 'react';
import { Bike, Bus, Car, Footprints, Train, Caravan } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';

interface TransportModeProps {
  origin: string;
  destination: string;
  apiKey: string;
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

interface GoogleMatrixResponseRowElement {
  status: string;
  duration: { text: string; value: number };
  distance: { text: string; value: number };
}

const TransportModes: React.FC<TransportModeProps> = ({ origin, destination, apiKey }) => {
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const calculateRoutes = async () => {
      setLoading(true);
      try {
        // Fetch travel data for each mode using Google Distance Matrix API
        const [walk, bike, transit, driving] = await Promise.all([
          fetchGoogleMatrix(origin, destination, "walking", apiKey),
          fetchGoogleMatrix(origin, destination, "bicycling", apiKey),
          fetchGoogleMatrix(origin, destination, "transit", apiKey),
          fetchGoogleMatrix(origin, destination, "driving", apiKey),
        ]);

        // Prefer using Google values if present, fallback to defaults if needed.
        setRoutes([
          {
            id: 1,
            mode: 'bike',
            icon: Bike,
            title: 'Bike Route',
            time: bike.durationText || walk.durationText || "N/A",
            distance: bike.distanceText || walk.distanceText || "N/A",
            emissions: '0 kg CO₂',
            emissionReduction: '100%',
            tags: ['zero-emissions', 'exercise']
          },
          {
            id: 2,
            mode: 'transit',
            icon: Bus,
            title: 'Public Transit',
            time: transit.durationText || "N/A",
            distance: transit.distanceText || "N/A",
            emissions: transit.distanceValue != null 
              ? `${((transit.distanceValue / 1000) * 0.06).toFixed(1)} kg CO₂`
              : '—',
            emissionReduction: transit.distanceValue != null && driving.distanceValue != null
              ? `${Math.round((1 - ((transit.distanceValue / 1000) * 0.06) / ((driving.distanceValue / 1000) * 0.2)) * 100)}%`
              : '—',
            tags: ['low-emissions', 'convenient']
          },
          {
            id: 3,
            mode: 'walk',
            title: 'Walking Route',
            icon: Footprints,
            time: walk.durationText || "N/A",
            distance: walk.distanceText || "N/A",
            emissions: '0 kg CO₂',
            emissionReduction: '100%',
            tags: ['zero-emissions', 'exercise']
          },
          {
            id: 4,
            mode: 'carpool',
            icon: Caravan,
            title: 'Carpool',
            time: driving.durationText || "N/A",
            distance: driving.distanceText || "N/A",
            emissions: driving.distanceValue != null
              ? `${((driving.distanceValue / 1000) * 0.13).toFixed(1)} kg CO₂`
              : '—',
            emissionReduction: driving.distanceValue != null
              ? `${Math.round((1 - 0.13 / 0.2) * 100)}%`
              : '—',
            tags: ['shared', 'community']
          }
        ]);

      } catch (error) {
        console.error("Error calculating routes:", error);
        toast({
          title: "Error",
          description: "Failed to fetch route times from Google Maps API.",
          variant: "destructive"
        });
        setRoutes(getDefaultRoutes());
      } finally {
        setLoading(false);
      }
    };

    if (origin && destination && apiKey) {
      calculateRoutes();
    }
  // eslint-disable-next-line
  }, [origin, destination, apiKey]);

  async function fetchGoogleMatrix(
    origin: string, 
    destination: string, 
    mode: string,
    apiKey: string,
  ) {
    const params = new URLSearchParams({
      origins: origin,
      destinations: destination,
      mode,
      key: apiKey
    });

    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?${params}`);
      const data = await response.json();

      // Google API returns "status" field and rows[].elements[] for results
      const row: GoogleMatrixResponseRowElement = data?.rows?.[0]?.elements?.[0];
      if (!row || row.status !== "OK") {
        return { durationText: "", durationValue: null, distanceText: "", distanceValue: null };
      }
      return {
        durationText: row.duration?.text || "",
        durationValue: row.duration?.value ?? null,
        distanceText: row.distance?.text || "",
        distanceValue: row.distance?.value ?? null,
      };
    } catch (e) {
      return { durationText: "", durationValue: null, distanceText: "", distanceValue: null };
    }
  }

  // fallback if Google fails
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

