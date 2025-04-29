
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Car, Users, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CarpoolList = () => {
  const { toast } = useToast();
  const [authChecked, setAuthChecked] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check for current user
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
      setAuthChecked(true);
    };
    
    checkUser();
  }, []);

  const { data: carpools, isLoading, refetch } = useQuery({
    queryKey: ['carpools'],
    queryFn: async () => {
      // Log the query execution to debug
      console.log("Fetching carpools with active status");
      
      const { data, error } = await supabase
        .from('carpools')
        .select(`
          *,
          carpool_participants (
            user_id,
            status
          )
        `)
        .eq('status', 'active');

      if (error) {
        console.error("Error fetching carpools:", error);
        throw error;
      }
      
      console.log("Fetched carpools:", data);
      return data || [];
    }
  });

  // Refetch carpools on component mount to ensure we have the latest data
  useEffect(() => {
    refetch();
    
    // Set up real-time subscription for carpools table
    const channel = supabase
      .channel('carpools-changes')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'carpools' 
        }, 
        (payload) => {
          console.log('Carpool change detected:', payload);
          refetch();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const handleJoinCarpool = async (carpoolId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to join carpools",
          variant: "destructive"
        });
        return;
      }

      // Check if user already joined this carpool
      const { data: existingRequest } = await supabase
        .from('carpool_participants')
        .select()
        .eq('carpool_id', carpoolId)
        .eq('user_id', user.id)
        .single();

      if (existingRequest) {
        toast({
          title: "Already requested",
          description: "You have already requested to join this carpool.",
          variant: "default"
        });
        return;
      }

      const { error } = await supabase
        .from('carpool_participants')
        .insert({
          carpool_id: carpoolId,
          user_id: user.id,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You've requested to join the carpool. The owner will be notified.",
      });
      
      // Refresh the carpools list
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join carpool. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 flex justify-center">
        <div className="animate-pulse text-green-600">Loading carpools...</div>
      </div>
    );
  }

  if (!carpools || carpools.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-green-800">Available Carpools</h2>
        <Card className="bg-green-50/50">
          <CardContent className="py-8 text-center">
            <p className="text-green-800 mb-2">No carpools available at the moment.</p>
            <p className="text-green-600 text-sm">Create a new carpool in the trip planner above!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Group carpools by ownership (own vs others)
  const myOwnCarpools = currentUserId ? carpools.filter(carpool => carpool.user_id === currentUserId) : [];
  const othersCarpools = currentUserId ? carpools.filter(carpool => carpool.user_id !== currentUserId) : carpools;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-800">Available Carpools</h2>
      
      {myOwnCarpools.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-green-700">Your Carpools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myOwnCarpools.map((carpool) => {
              const participantCount = carpool.carpool_participants?.length || 0;
              const seatsLeft = carpool.available_seats - participantCount;
              
              return (
                <Card key={carpool.id} className="border-l-4 border-blue-500">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Your Carpool
                      </Badge>
                      <Badge variant={seatsLeft > 0 ? "outline" : "secondary"} className={seatsLeft > 0 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {seatsLeft > 0 ? `${seatsLeft} seats left` : 'Full'}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg flex items-center gap-1 mt-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      {carpool.origin} to {carpool.destination}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {carpool.schedule}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Car className="h-4 w-4" />
                      <span>{carpool.available_seats} total seats</span>
                      <Users className="h-4 w-4 ml-2" />
                      <span>{participantCount} joined</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
      
      {othersCarpools.length > 0 && (
        <div className="space-y-4">
          {myOwnCarpools.length > 0 && (
            <h3 className="text-xl font-semibold text-green-700">Other Available Carpools</h3>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {othersCarpools.map((carpool) => {
              const participantCount = carpool.carpool_participants?.length || 0;
              const seatsLeft = carpool.available_seats - participantCount;
              
              return (
                <Card key={carpool.id} className="border-l-4 border-green-500">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <Badge variant={seatsLeft > 0 ? "outline" : "secondary"} className={seatsLeft > 0 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {seatsLeft > 0 ? `${seatsLeft} seats left` : 'Full'}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-green-600" />
                      {carpool.origin} to {carpool.destination}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {carpool.schedule}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Car className="h-4 w-4" />
                      <span>{carpool.available_seats} total seats</span>
                      <Users className="h-4 w-4 ml-2" />
                      <span>{participantCount} joined</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      onClick={() => handleJoinCarpool(carpool.id)}
                      className="w-full"
                      variant={seatsLeft > 0 ? "outline" : "secondary"}
                      disabled={seatsLeft <= 0}
                    >
                      {seatsLeft > 0 ? 'Request to Join' : 'No Seats Available'}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarpoolList;
