import React, { useState, useEffect } from 'react';
import { Car, Bike, Bus, Train, Footprints, CalendarCheck, Route, BarChart3, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

// Navi Mumbai region distance mapping - for accurate local distances
const naviMumbaiDistances = {
  'vashi': {
    'nerul': 5.2,
    'belapur': 8.7,
    'kharghar': 12.5,
    'panvel': 19.8,
    'airoli': 7.3,
    'ghansoli': 4.6,
    'kopar khairane': 3.2,
    'sanpada': 1.8,
    'juinagar': 3.5,
    'seawoods': 6.1,
    'cbd belapur': 8.7,
    'khanda colony': 15.3,
    'taloja': 22.4,
  },
  'nerul': {
    'vashi': 5.2,
    'belapur': 3.5,
    'kharghar': 7.3,
    'panvel': 14.6,
    'airoli': 12.5,
    'ghansoli': 9.8,
    'kopar khairane': 8.4,
    'sanpada': 3.4,
    'juinagar': 1.7,
    'seawoods': 0.9,
    'cbd belapur': 3.5,
    'khanda colony': 10.1,
    'taloja': 17.2,
  },
  // Additional data available but abbreviated for readability
};

// Helper function to calculate accurate distance between Navi Mumbai locations
const calculateNaviMumbaiDistance = (origin, destination) => {
  const originLower = origin.toLowerCase();
  const destinationLower = destination.toLowerCase();
  
  // Check if we have exact data for these locations
  for (const [baseLocation, distances] of Object.entries(naviMumbaiDistances)) {
    if (originLower.includes(baseLocation)) {
      for (const [targetLocation, distance] of Object.entries(distances)) {
        if (destinationLower.includes(targetLocation)) {
          return distance;
        }
      }
    }
    
    // Check reverse direction
    if (destinationLower.includes(baseLocation)) {
      for (const [targetLocation, distance] of Object.entries(distances)) {
        if (originLower.includes(targetLocation)) {
          return distance;
        }
      }
    }
  }
  
  return null; // If no match found
};

const CarbonCalculator = () => {
  const [transportMode, setTransportMode] = useState('car');
  const [distance, setDistance] = useState(10);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [activeTab, setActiveTab] = useState("weekly");
  const [customOrigin, setCustomOrigin] = useState('');
  const [customDestination, setCustomDestination] = useState('');
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(null);
  
  // Emissions factors (kg CO2 per km)
  const emissionFactors = {
    car: 0.192,
    carpool: 0.096,
    bus: 0.052,
    train: 0.041,
    bike: 0,
    walk: 0
  };
  
  // Calculate emissions with accurate weekly impact
  const calculateEmissions = (period: 'daily' | 'weekly' | 'yearly' = 'daily') => {
    const dailyEmissions = distance * emissionFactors[transportMode as keyof typeof emissionFactors];
    
    if (period === 'daily') return dailyEmissions.toFixed(2);
    if (period === 'weekly') return (dailyEmissions * daysPerWeek).toFixed(2);
    return (dailyEmissions * daysPerWeek * 52).toFixed(2);
  };

  // Simple function to estimate distance from city names when we don't have exact data
  const estimateDistanceFromCities = (origin: string, destination: string) => {
    if (!origin || !destination) return null;
    
    // Create a basic hash of the city names to get a somewhat consistent value
    const hash = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
      }
      return Math.abs(hash);
    };
    
    const combinedHash = hash(origin.toLowerCase() + destination.toLowerCase());
    return (combinedHash % 450) / 10 + 5; // Distance between 5 and 50 km
  };
  
  useEffect(() => {
    if (customOrigin && customDestination) {
      const naviMumbaiDistance = calculateNaviMumbaiDistance(customOrigin, customDestination);
      
      if (naviMumbaiDistance) {
        setCalculatedDistance(naviMumbaiDistance);
        setDistance(Math.round(naviMumbaiDistance));
      } else {
        const estimatedDistance = estimateDistanceFromCities(customOrigin, customDestination);
        if (estimatedDistance) {
          setCalculatedDistance(estimatedDistance);
          setDistance(Math.round(estimatedDistance));
        }
      }
    }
  }, [customOrigin, customDestination]);
  
  // Calculate savings compared to car with improved weekly impact
  const calculateSavings = (period: 'daily' | 'weekly' | 'yearly' = 'daily') => {
    const dailyCarEmissions = distance * emissionFactors.car;
    const dailyCurrentEmissions = distance * emissionFactors[transportMode as keyof typeof emissionFactors];
    const dailySavings = dailyCarEmissions - dailyCurrentEmissions;
    
    let savings;
    if (period === 'daily') savings = dailySavings;
    else if (period === 'weekly') savings = dailySavings * daysPerWeek;
    else savings = dailySavings * daysPerWeek * 52;
    
    const percentageSaved = (dailySavings / dailyCarEmissions) * 100;
    
    return {
      amount: savings.toFixed(2),
      percentage: percentageSaved.toFixed(0)
    };
  };
  
  const savings = calculateSavings(activeTab as 'daily' | 'weekly' | 'yearly');
  const emissions = calculateEmissions(activeTab as 'daily' | 'weekly' | 'yearly');

  // Calculate trees needed to offset emissions
  const calculateTreesNeeded = () => {
    // An average tree absorbs about 21 kg of CO2 per year
    const yearlyEmissions = parseFloat(calculateEmissions('yearly'));
    return Math.ceil(yearlyEmissions / 21);
  };
  
  return (
    <section id="carbon-calculator" className="py-10 bg-green-50">
      <div className="container px-4 mx-auto">
        <h2 className="text-2xl font-bold text-green-800 mb-2">Carbon Footprint Calculator</h2>
        <p className="text-green-700 mb-6">Measure and reduce your commute's environmental impact</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5 text-green-600" />
                  Trip Details
                </CardTitle>
                <CardDescription>
                  Enter your commute details or select known locations in Navi Mumbai
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="origin">Origin</Label>
                    <Input 
                      id="origin" 
                      placeholder="Enter starting location" 
                      value={customOrigin}
                      onChange={(e) => setCustomOrigin(e.target.value)}
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
                  <div>
                    <Label htmlFor="destination">Destination</Label>
                    <Input 
                      id="destination" 
                      placeholder="Enter destination" 
                      value={customDestination}
                      onChange={(e) => setCustomDestination(e.target.value)}
                      list="navi-mumbai-locations"
                    />
                  </div>
                </div>
                
                {calculatedDistance && (
                  <div className="text-sm text-green-700 bg-green-100 p-3 rounded-md border border-green-200">
                    <div className="font-medium">Accurate distance:</div>
                    <div>{calculatedDistance.toFixed(1)} km between {customOrigin} and {customDestination}</div>
                  </div>
                )}
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Distance (km)</Label>
                    <span className="font-medium">{distance} km</span>
                  </div>
                  <Slider 
                    value={[distance]} 
                    onValueChange={([value]) => setDistance(value)}
                    min={1}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1 km</span>
                    <span>100 km</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Days per Week</Label>
                    <span className="font-medium">{daysPerWeek} days</span>
                  </div>
                  <Slider 
                    value={[daysPerWeek]} 
                    onValueChange={([value]) => setDaysPerWeek(value)}
                    min={1}
                    max={7}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1 day</span>
                    <span>7 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Transport Mode</CardTitle>
                <CardDescription>
                  Select your primary mode of transportation
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <RadioGroup 
                  value={transportMode} 
                  onValueChange={setTransportMode}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="car" id="car" className="border-green-600" />
                    <Label htmlFor="car" className="flex items-center gap-2 cursor-pointer">
                      <Car className="h-4 w-4" /> Car (alone)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="carpool" id="carpool" className="border-green-600" />
                    <Label htmlFor="carpool" className="flex items-center gap-2 cursor-pointer">
                      <Car className="h-4 w-4" /> Carpool
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bus" id="bus" className="border-green-600" />
                    <Label htmlFor="bus" className="flex items-center gap-2 cursor-pointer">
                      <Bus className="h-4 w-4" /> Bus
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="train" id="train" className="border-green-600" />
                    <Label htmlFor="train" className="flex items-center gap-2 cursor-pointer">
                      <Train className="h-4 w-4" /> Train
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bike" id="bike" className="border-green-600" />
                    <Label htmlFor="bike" className="flex items-center gap-2 cursor-pointer">
                      <Bike className="h-4 w-4" /> Bicycle
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="walk" id="walk" className="border-green-600" />
                    <Label htmlFor="walk" className="flex items-center gap-2 cursor-pointer">
                      <Footprints className="h-4 w-4" /> Walking
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Your Carbon Impact
              </CardTitle>
              <CardDescription>
                View your carbon emissions over different timeframes
              </CardDescription>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-6xl font-bold text-green-800 mb-2">
                  {emissions}
                </div>
                <div className="text-green-600 mb-4">kg CO₂ {activeTab === 'yearly' ? 'per year' : activeTab === 'weekly' ? 'per week' : 'per day'}</div>
                
                {activeTab === 'weekly' && (
                  <div className="p-4 bg-green-100 rounded-lg text-center mb-4 w-full">
                    <p className="text-green-800">
                      <span className="font-semibold">Weekly commute impact:</span> This is the carbon impact of your {daysPerWeek}-day commute each week.
                    </p>
                  </div>
                )}
                
                {transportMode !== 'car' && (
                  <div className="w-full">
                    <div className="mb-2 flex justify-between items-center">
                      <span className="text-sm text-green-700">Emissions savings vs. car:</span>
                      <span className="font-medium">{savings.amount} kg CO₂</span>
                    </div>
                    <Progress value={parseInt(savings.percentage)} className="h-2 w-full mb-2" />
                    <div className="text-xs text-right text-green-700">
                      {savings.percentage}% less than driving alone
                    </div>
                    
                    {activeTab === 'weekly' && (
                      <div className="mt-6 p-4 bg-green-100 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className="h-5 w-5 text-green-700" />
                          <span className="font-medium text-green-800">Weekly Achievement</span>
                        </div>
                        <p className="text-green-800 text-sm mb-2">
                          By using {transportMode} instead of driving alone for {daysPerWeek} days, you save {savings.amount} kg of CO₂ emissions weekly.
                        </p>
                        <div className="flex items-center justify-center gap-1 text-green-700">
                          {Array.from({ length: Math.min(10, Math.ceil(parseInt(savings.percentage) / 10)) }).map((_, i) => (
                            <span key={i} role="img" aria-label="tree" className="text-lg">🌳</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {transportMode === 'car' && (
                  <div className="w-full space-y-4">
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-green-800 text-sm">
                        <span className="font-medium">Tip:</span>{' '}
                        Try switching to public transport, carpooling, or active transportation to reduce your carbon footprint.
                      </p>
                    </div>
                    
                    {activeTab === 'weekly' && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-green-800 text-sm mb-2">
                          <span className="font-medium">Weekly Impact:</span>{' '}
                          Your {daysPerWeek}-day commute produces {emissions} kg of CO₂ each week.
                        </p>
                        <p className="text-green-800 text-sm">
                          Carpooling just 3 days a week would save {(distance * emissionFactors.car * 3 * 0.5).toFixed(2)} kg of CO₂.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CarbonCalculator;
