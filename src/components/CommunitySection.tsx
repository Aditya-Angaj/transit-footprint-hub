import React from 'react';
import { Car, Earth, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const CommunitySection = () => {
  const { toast } = useToast();
  
  // Mock data for community carpools
  const carpools = [
    {
      id: 1,
      driver: {
        name: 'Raj Patel',
        avatar: '',
        rating: 4.8
      },
      route: 'Vashi to Airoli',
      schedule: 'Mon-Fri, 9:00 AM',
      seats: 3,
      members: 2,
      tags: ['Regular', 'AC']
    },
    {
      id: 2,
      driver: {
        name: 'Priya Shah',
        avatar: '',
        rating: 4.9
      },
      route: 'Nerul to Belapur CBD',
      schedule: 'Mon-Sat, 8:30 AM',
      seats: 4,
      members: 3,
      tags: ['Flexible', 'Ladies Only']
    },
    {
      id: 3,
      driver: {
        name: 'Amit Kumar',
        avatar: '',
        rating: 4.7
      },
      route: 'Kharghar to Seawoods',
      schedule: 'Mon-Fri, 9:30 AM',
      seats: 3,
      members: 2,
      tags: ['IT Park Route', 'EV']
    }
  ];

  // Mock data for progress tracking
  const progressData = {
    today: {
      rides: 45,
      co2Saved: 125,
      progress: 85
    },
    yesterday: {
      rides: 38,
      co2Saved: 98,
      progress: 72
    },
    month: {
      rides: 842,
      co2Saved: 2250,
      progress: 92
    }
  };

  // Mock eco-challenges data
  const challenges = [
    {
      id: 1,
      title: 'Navi Mumbai Car-Free Week',
      participants: 458,
      co2Saved: '1,850 kg',
      description: 'Join the community challenge to reduce traffic in Navi Mumbai',
      progress: 75
    },
    {
      id: 2,
      title: 'Palm Beach Cycling Month',
      participants: 326,
      co2Saved: '2,120 kg',
      description: 'Cycle along Palm Beach Road for special rewards',
      progress: 62
    }
  ];

  const handleJoinChallenge = async (challengeId: number) => {
    try {
      const { error } = await supabase
        .from('challenge_participants')
        .insert({ challenge_id: challengeId, user_id: supabase.auth.user()?.id });

      if (error) throw error;

      toast({
        title: "Successfully joined the challenge!",
        description: "You can now track your progress in your profile.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error joining challenge",
        description: "Please try again later.",
      });
    }
  };

  const handleStartCarpool = async () => {
    try {
      const { error } = await supabase.from('carpools').insert({
        user_id: supabase.auth.user()?.id,
        status: 'draft'
      });

      if (error) throw error;

      toast({
        title: "Creating new carpool",
        description: "You'll be redirected to set up your carpool details.",
      });
      // You would typically navigate to a form page here
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating carpool",
        description: "Please try again later.",
      });
    }
  };

  return (
    <section id="community" className="py-10">
      <div className="container px-4 mx-auto">
        <h2 className="text-2xl font-bold text-green-800 mb-2">Community & Incentives</h2>
        <p className="text-green-700 mb-6">Connect with others and earn rewards for sustainable choices in Navi Mumbai</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-green-800 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> Progress Tracking
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(progressData).map(([period, data]) => (
                  <Card key={period} className="bg-green-50/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg capitalize">{period}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">{data.rides}</span> rides
                        </div>
                        <div className="text-sm text-green-700">
                          <span className="font-medium">{data.co2Saved}</span> kg CO₂ saved
                        </div>
                        <Progress value={data.progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium text-green-800 mb-4 flex items-center gap-2">
                <Car className="h-5 w-5" /> Community Carpools
              </h3>
              <div className="space-y-4">
                {carpools.map((carpool) => (
                  <Card key={carpool.id} className="relative overflow-hidden border-l-4 border-green-500">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{carpool.route}</CardTitle>
                        <div className="flex items-center text-amber-500 text-sm">
                          ★ {carpool.driver.rating}
                        </div>
                      </div>
                      <CardDescription>{carpool.schedule}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={carpool.driver.avatar} />
                            <AvatarFallback className="bg-green-200 text-green-800">
                              {carpool.driver.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{carpool.driver.name}</span>
                        </div>
                        
                        <div className="text-sm text-green-700">
                          {carpool.members}/{carpool.seats} spots filled
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {carpool.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="bg-green-50">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button className="w-full" variant="outline">
                        Request to Join
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
                <Button 
                  variant="ghost" 
                  className="w-full border border-dashed border-green-300 text-green-700 hover:bg-green-50"
                  onClick={handleStartCarpool}
                >
                  Start a New Carpool
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-medium text-green-800 mb-4 flex items-center gap-2">
              <Earth className="h-5 w-5" /> Eco-Challenges & Rewards
            </h3>
            
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="overflow-hidden border-t-4 border-sky-500">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                    <CardDescription>{challenge.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div className="text-sm">
                        <span className="text-gray-500">Participants:</span>{' '}
                        <span className="font-medium">{challenge.participants}</span>
                      </div>
                      <div className="text-sm text-right">
                        <span className="text-gray-500">CO₂ Saved:</span>{' '}
                        <span className="font-medium text-green-700">{challenge.co2Saved}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-sm flex justify-between">
                        <span>Progress</span>
                        <span>{challenge.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-sky-500 h-2 rounded-full" 
                          style={{ width: `${challenge.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      onClick={() => handleJoinChallenge(challenge.id)}
                      className="w-full bg-sky-500 hover:bg-sky-600"
                    >
                      Join Challenge
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Local Business Incentives</CardTitle>
                  <CardDescription>
                    Special offers in Navi Mumbai when you use sustainable transport
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-2">
                    <li className="text-sm flex justify-between">
                      <span className="font-medium">Inorbit Mall</span>
                      <span className="text-green-700">20% off at food court</span>
                    </li>
                    <li className="text-sm flex justify-between">
                      <span className="font-medium">DY Patil Sports Academy</span>
                      <span className="text-green-700">₹200 off membership</span>
                    </li>
                    <li className="text-sm flex justify-between">
                      <span className="font-medium">Raghuleela Mall</span>
                      <span className="text-green-700">Free parking for cyclists</span>
                    </li>
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Rewards
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
