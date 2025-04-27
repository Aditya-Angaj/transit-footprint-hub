
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Car, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CarpoolList = () => {
  const { toast } = useToast();

  const { data: carpools, isLoading } = useQuery({
    queryKey: ['carpools'],
    queryFn: async () => {
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

      if (error) throw error;
      return data;
    }
  });

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

      const { error } = await supabase
        .from('carpool_participants')
        .insert({
          carpool_id: carpoolId,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You've requested to join the carpool. The owner will be notified.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join carpool. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div>Loading carpools...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-green-800">Available Carpools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {carpools?.map((carpool) => (
          <Card key={carpool.id} className="border-l-4 border-green-500">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{carpool.origin} to {carpool.destination}</CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {carpool.available_seats - (carpool.carpool_participants?.length || 0)} seats left
                </Badge>
              </div>
              <CardDescription>{carpool.schedule}</CardDescription>
            </CardHeader>
            
            <CardContent className="pb-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Car className="h-4 w-4" />
                <span>{carpool.available_seats} total seats</span>
                <Users className="h-4 w-4 ml-2" />
                <span>{carpool.carpool_participants?.length || 0} joined</span>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={() => handleJoinCarpool(carpool.id)}
                className="w-full"
                variant="outline"
              >
                Request to Join
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CarpoolList;
