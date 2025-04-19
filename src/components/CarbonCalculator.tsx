
import React, { useState } from 'react';
import { Car, Bike, Bus, Train, Footprints } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Progress } from './ui/progress';

const CarbonCalculator = () => {
  const [transportMode, setTransportMode] = useState('car');
  const [distance, setDistance] = useState(10);
  
  // Emissions factors (kg CO2 per km)
  const emissionFactors = {
    car: 0.192,
    carpool: 0.096,
    bus: 0.052,
    train: 0.041,
    bike: 0,
    walk: 0
  };
  
  // Calculate emissions
  const calculateEmissions = () => {
    return (distance * emissionFactors[transportMode as keyof typeof emissionFactors]).toFixed(2);
  };
  
  const emissions = calculateEmissions();
  
  // Calculate savings compared to car
  const calculateSavings = () => {
    const carEmissions = distance * emissionFactors.car;
    const currentEmissions = distance * emissionFactors[transportMode as keyof typeof emissionFactors];
    const savings = carEmissions - currentEmissions;
    const percentageSaved = (savings / carEmissions) * 100;
    
    return {
      amount: savings.toFixed(2),
      percentage: percentageSaved.toFixed(0)
    };
  };
  
  const savings = calculateSavings();
  
  return (
    <section id="carbon-calculator" className="py-10 bg-green-50">
      <div className="container px-4 mx-auto">
        <h2 className="text-2xl font-bold text-green-800 mb-2">Carbon Footprint Calculator</h2>
        <p className="text-green-700 mb-6">Measure the environmental impact of your commute</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  <RadioGroupItem value="car" id="car" />
                  <Label htmlFor="car" className="flex items-center gap-2 cursor-pointer">
                    <Car className="h-4 w-4" /> Car (alone)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="carpool" id="carpool" />
                  <Label htmlFor="carpool" className="flex items-center gap-2 cursor-pointer">
                    <Car className="h-4 w-4" /> Carpool
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bus" id="bus" />
                  <Label htmlFor="bus" className="flex items-center gap-2 cursor-pointer">
                    <Bus className="h-4 w-4" /> Bus
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="train" id="train" />
                  <Label htmlFor="train" className="flex items-center gap-2 cursor-pointer">
                    <Train className="h-4 w-4" /> Train
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bike" id="bike" />
                  <Label htmlFor="bike" className="flex items-center gap-2 cursor-pointer">
                    <Bike className="h-4 w-4" /> Bicycle
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="walk" id="walk" />
                  <Label htmlFor="walk" className="flex items-center gap-2 cursor-pointer">
                    <Footprints className="h-4 w-4" /> Walking
                  </Label>
                </div>
              </RadioGroup>
              
              <div className="mt-8 space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Daily Commute Distance (km)</Label>
                    <span className="font-medium">{distance} km</span>
                  </div>
                  <Slider 
                    value={[distance]} 
                    onValueChange={([value]) => setDistance(value)}
                    min={1}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1 km</span>
                    <span>50 km</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Your Carbon Impact</CardTitle>
              <CardDescription>
                Daily carbon emissions based on your commute
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-6xl font-bold text-green-800 mb-2">
                  {emissions}
                </div>
                <div className="text-green-600 mb-8">kg CO₂ per day</div>
                
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
                    
                    <div className="mt-8 p-4 bg-green-100 rounded-lg">
                      <p className="text-green-800 text-sm">
                        <span className="font-medium">Carbon impact:</span>{' '}
                        {parseInt(savings.percentage) >= 75 ? (
                          'Amazing! Your choice is significantly reducing carbon emissions.'
                        ) : parseInt(savings.percentage) >= 40 ? (
                          'Great job! You\'re making a positive environmental impact.'
                        ) : (
                          'You\'re on the right track. Consider even greener options when possible.'
                        )}
                      </p>
                    </div>
                  </div>
                )}
                
                {transportMode === 'car' && (
                  <div className="w-full p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-green-800 text-sm">
                      <span className="font-medium">Tip:</span>{' '}
                      Try switching to public transport, carpooling, or active transportation to reduce your carbon footprint.
                    </p>
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
