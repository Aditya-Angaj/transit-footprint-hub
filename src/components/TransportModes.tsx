
import React from 'react';
import { Bike, Bus, Car, Footprints, Train, Caravan } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

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
  // Mock data - in a real app, this would come from an API
  const routes: RouteOption[] = [
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
