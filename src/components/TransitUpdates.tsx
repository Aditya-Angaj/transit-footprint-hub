
import React from 'react';
import { Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const TransitUpdates = () => {
  // Fetch user progress data
  const { data: progressData } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .single();
      
      if (error) throw error;
      return data || {
        today: { rides: 0, co2Saved: 0, progress: 0 },
        yesterday: { rides: 0, co2Saved: 0, progress: 0 },
        month: { rides: 0, co2Saved: 0, progress: 0 }
      };
    }
  });

  // Service alerts for India/Mumbai region
  const serviceAlerts = [
    {
      id: 1,
      type: 'Traffic',
      message: 'Heavy traffic on Thane-Belapur Road due to construction work',
      affectedRoutes: ['Palm Beach Road', 'Thane-Belapur Road'],
      timeStamp: new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    {
      id: 2,
      type: 'Weather',
      message: 'Expected rain showers in Navi Mumbai region',
      affectedRoutes: ['All Routes'],
      timeStamp: new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  ];

  return (
    <section id="transit-updates" className="py-10 bg-green-50">
      <div className="container px-4 mx-auto">
        <h2 className="text-2xl font-bold text-green-800 mb-2">Service Updates</h2>
        <p className="text-green-700 mb-6">Get the latest information on service alerts and your progress</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Tracking Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" /> Your Progress
              </CardTitle>
              <CardDescription>Track your sustainable travel impact</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                {['today', 'yesterday', 'month'].map((period) => (
                  <div key={period} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium capitalize">{period}</h4>
                      <span className="text-sm text-green-600">
                        {progressData?.[period]?.rides || 0} rides
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      CO₂ saved: {progressData?.[period]?.co2Saved || 0}kg
                    </div>
                    <Progress 
                      value={progressData?.[period]?.progress || 0} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Service Alerts Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-600 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Service Alerts
              </CardTitle>
              <CardDescription>Latest updates about service changes (IST)</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {serviceAlerts.map((alert) => (
                  <div key={alert.id} className="p-3 rounded-md bg-amber-50 border border-amber-100">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 mb-2">
                        {alert.type}
                      </Badge>
                      <span className="text-xs text-gray-500">{alert.timeStamp} IST</span>
                    </div>
                    <p className="text-sm mb-2">{alert.message}</p>
                    <div className="text-xs text-gray-500">
                      Affected: {alert.affectedRoutes.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TransitUpdates;
