
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Car, Train, Bus, Bike, Footprints, Calendar, MapPin, Info } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';

// Emissions factors (kg CO2 per km)
const emissionFactors = {
  car: 0.192,
  carpool: 0.096,
  bus: 0.052,
  train: 0.041,
  bike: 0,
  walk: 0
};

const TransportIcon = ({ mode }: { mode: string }) => {
  switch (mode) {
    case 'car':
      return <Car className="h-4 w-4 text-red-500" />;
    case 'carpool':
      return <Car className="h-4 w-4 text-amber-500" />;
    case 'bus':
      return <Bus className="h-4 w-4 text-blue-500" />;
    case 'train':
      return <Train className="h-4 w-4 text-indigo-500" />;
    case 'bike':
      return <Bike className="h-4 w-4 text-green-500" />;
    case 'walk':
      return <Footprints className="h-4 w-4 text-green-500" />;
    default:
      return <Car className="h-4 w-4" />;
  }
};

interface TravelLog {
  id: string;
  date: string;
  origin: string;
  destination: string;
  distance: number;
  transport_mode: string;
  notes: string | null;
  created_at: string;
}

const TravelHistory = () => {
  const [logs, setLogs] = useState<TravelLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [potentialSavings, setPotentialSavings] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTravelLogs = async () => {
      try {
        setIsLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: "Authentication required",
            description: "Please sign in to view your travel history",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('travel_logs')
          .select('*')
          .order('date', { ascending: false });
        
        if (error) throw error;
        
        setLogs(data || []);
        
        // Calculate emissions statistics
        if (data && data.length > 0) {
          // Total emissions
          const totalCO2 = data.reduce((sum, log) => {
            const factor = emissionFactors[log.transport_mode as keyof typeof emissionFactors] || 0;
            return sum + (log.distance * factor);
          }, 0);
          
          // Calculate potential savings if all car trips were public transport
          const potentialCO2Savings = data.reduce((sum, log) => {
            if (log.transport_mode === 'car') {
              const carEmissions = log.distance * emissionFactors.car;
              const publicTransportEmissions = log.distance * emissionFactors.train;
              return sum + (carEmissions - publicTransportEmissions);
            }
            return sum;
          }, 0);
          
          setTotalEmissions(parseFloat(totalCO2.toFixed(2)));
          setPotentialSavings(parseFloat(potentialCO2Savings.toFixed(2)));
        }
      } catch (error: any) {
        toast({
          title: "Error loading travel history",
          description: error.message || "Failed to load your travel data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTravelLogs();
  }, [toast]);

  const getEmissionsForTrip = (distance: number, mode: string): number => {
    const factor = emissionFactors[mode as keyof typeof emissionFactors] || 0;
    return parseFloat((distance * factor).toFixed(2));
  };

  const getEmissionsBadgeColor = (mode: string): string => {
    switch (mode) {
      case 'car':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'carpool':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'bus':
      case 'train':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'bike':
      case 'walk':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImprovementTip = () => {
    // Check for patterns in the data
    const carTrips = logs.filter(log => log.transport_mode === 'car').length;
    const totalTrips = logs.length;
    const carPercentage = totalTrips > 0 ? (carTrips / totalTrips) * 100 : 0;
    
    if (carPercentage > 70) {
      return "Consider using public transport or carpooling for regular journeys. This could reduce your carbon footprint by up to 75%.";
    } else if (carPercentage > 40) {
      return "Try replacing some car trips with train or bus travel to further reduce your emissions.";
    } else if (potentialSavings > 5) {
      return `You could save approximately ${potentialSavings.toFixed(1)} kg of CO₂ by switching remaining car trips to public transport.`;
    } else {
      return "Great job! You're already making sustainable transportation choices.";
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-green-800">Your Travel History</CardTitle>
        <CardDescription>
          Track your journey history and environmental impact
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : logs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border rounded-md p-4 bg-green-50 border-green-200">
                <div className="text-sm font-medium text-green-800 mb-1">Total Carbon Impact</div>
                <div className="text-2xl font-bold text-green-900">{totalEmissions} kg CO₂</div>
                <div className="text-xs text-green-700 mt-1">From your {logs.length} logged trips</div>
              </div>
              
              <div className="border rounded-md p-4 bg-amber-50 border-amber-200">
                <div className="text-sm font-medium text-amber-800 mb-1">Improvement Potential</div>
                <div className="flex items-center gap-1">
                  <Info className="h-4 w-4 text-amber-600" />
                  <div className="text-sm text-amber-800">{getImprovementTip()}</div>
                </div>
                {potentialSavings > 0 && (
                  <div className="text-xs text-amber-700 mt-1">
                    Potential savings: {potentialSavings} kg CO₂
                  </div>
                )}
              </div>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Transport</TableHead>
                    <TableHead className="text-right">Impact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          {format(new Date(log.date), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-green-600" />
                          <span className="truncate max-w-[100px] sm:max-w-full">
                            {log.origin} → {log.destination}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">{log.distance} km</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TransportIcon mode={log.transport_mode} />
                          <span className="capitalize">{log.transport_mode}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={getEmissionsBadgeColor(log.transport_mode)} variant="outline">
                          {getEmissionsForTrip(log.distance, log.transport_mode)} kg CO₂
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <div className="text-center py-10 border rounded-md bg-gray-50">
            <p className="text-gray-500">You haven't logged any trips yet.</p>
            <p className="text-sm text-gray-400 mt-1">Use the form above to log your daily travel.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TravelHistory;
