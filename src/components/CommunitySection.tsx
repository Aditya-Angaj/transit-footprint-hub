
import React from 'react';
import { Car, Map, Earth } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const CommunitySection = () => {
  // Mock data for community carpools
  const carpools = [
    {
      id: 1,
      driver: {
        name: 'Emma Johnson',
        avatar: '',
        rating: 4.8
      },
      route: 'Downtown to Westside',
      schedule: 'Mon-Fri, 8:30 AM',
      seats: 3,
      members: 2,
      tags: ['Regular', 'EV']
    },
    {
      id: 2,
      driver: {
        name: 'Michael Chen',
        avatar: '',
        rating: 4.9
      },
      route: 'Northside to City Center',
      schedule: 'Mon-Wed, 7:45 AM',
      seats: 4,
      members: 1,
      tags: ['Flexible', 'Music Friendly']
    },
    {
      id: 3,
      driver: {
        name: 'Sarah Ahmed',
        avatar: '',
        rating: 4.7
      },
      route: 'Eastside to University',
      schedule: 'Tue-Thu, 9:00 AM',
      seats: 3,
      members: 3,
      tags: ['Campus Route', 'Student Friendly']
    }
  ];

  // Mock eco-challenges data
  const challenges = [
    {
      id: 1,
      title: 'Car-Free Week',
      participants: 328,
      co2Saved: '1,250 kg',
      description: 'Go without a car for a full week to earn rewards and reduce emissions',
      progress: 65
    },
    {
      id: 2,
      title: 'Bike to Work Month',
      participants: 417,
      co2Saved: '2,890 kg',
      description: 'Commute by bicycle for 20 days to earn special badges and discounts',
      progress: 42
    }
  ];

  return (
    <section id="community" className="py-10">
      <div className="container px-4 mx-auto">
        <h2 className="text-2xl font-bold text-green-800 mb-2">Community & Incentives</h2>
        <p className="text-green-700 mb-6">Connect with others and earn rewards for sustainable choices</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              
              <Button variant="ghost" className="w-full border border-dashed border-green-300 text-green-700 hover:bg-green-50">
                Start a New Carpool
              </Button>
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
                    <Button className="w-full bg-sky-500 hover:bg-sky-600">
                      Join Challenge
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Local Business Incentives</CardTitle>
                  <CardDescription>
                    Special offers when you use sustainable transport
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-2">
                    <li className="text-sm flex justify-between">
                      <span className="font-medium">Green Café</span>
                      <span className="text-green-700">15% off for cyclists</span>
                    </li>
                    <li className="text-sm flex justify-between">
                      <span className="font-medium">Metro Fitness</span>
                      <span className="text-green-700">$10 discount for bus riders</span>
                    </li>
                    <li className="text-sm flex justify-between">
                      <span className="font-medium">City Books</span>
                      <span className="text-green-700">Free coffee with public transit</span>
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
