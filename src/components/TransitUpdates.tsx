
import React from 'react';
import { Clock, Bus, Train, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

const TransitUpdates = () => {
  // Mock data for transit updates
  const busUpdates = [
    {
      id: 1,
      line: 'Route 42',
      destination: 'Downtown',
      status: 'On Time',
      nextArrival: '3 min',
      occupancy: 'Low'
    },
    {
      id: 2,
      line: 'Route 15',
      destination: 'Westside Mall',
      status: 'Slight Delay',
      nextArrival: '7 min',
      occupancy: 'Medium'
    },
    {
      id: 3,
      line: 'Route 67',
      destination: 'University',
      status: 'On Time',
      nextArrival: '12 min',
      occupancy: 'Low'
    }
  ];

  const trainUpdates = [
    {
      id: 1,
      line: 'Blue Line',
      destination: 'Airport',
      status: 'On Time',
      nextArrival: '5 min',
      occupancy: 'Medium'
    },
    {
      id: 2,
      line: 'Green Line',
      destination: 'City Center',
      status: 'Delay',
      nextArrival: '15 min',
      occupancy: 'High'
    }
  ];

  // Mock data for service alerts
  const serviceAlerts = [
    {
      id: 1,
      type: 'Disruption',
      message: 'Route 22 detoured due to construction on Main St.',
      affectedRoutes: ['Route 22'],
      timeStamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'Weather',
      message: 'Expect delays on all routes due to rain forecast.',
      affectedRoutes: ['All Routes'],
      timeStamp: '1 hour ago'
    }
  ];

  return (
    <section id="transit-updates" className="py-10 bg-green-50">
      <div className="container px-4 mx-auto">
        <h2 className="text-2xl font-bold text-green-800 mb-2">Real-Time Transit Updates</h2>
        <p className="text-green-700 mb-6">Get the latest information on public transportation</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" /> Upcoming Departures
              </CardTitle>
              <CardDescription>Arrivals at your nearest stop: <span className="font-medium">Central Station</span></CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Bus className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">Buses</h4>
                  </div>
                  
                  <div className="space-y-2">
                    {busUpdates.map((update) => (
                      <div key={update.id} className="flex items-center justify-between p-2 rounded-md bg-white border border-green-100">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                            {update.line}
                          </Badge>
                          <div className="text-sm flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {update.destination}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={
                            update.status === 'On Time' 
                              ? 'border-green-300 text-green-800'
                              : 'border-amber-300 text-amber-700'
                          }>
                            {update.status}
                          </Badge>
                          
                          <div className="flex flex-col items-end">
                            <div className="text-lg font-semibold">{update.nextArrival}</div>
                            <div className="text-xs text-gray-500">
                              Occupancy: {update.occupancy}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Train className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">Trains</h4>
                  </div>
                  
                  <div className="space-y-2">
                    {trainUpdates.map((update) => (
                      <div key={update.id} className="flex items-center justify-between p-2 rounded-md bg-white border border-green-100">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-sky-100 text-sky-800 hover:bg-sky-200">
                            {update.line}
                          </Badge>
                          <div className="text-sm flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {update.destination}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={
                            update.status === 'On Time' 
                              ? 'border-green-300 text-green-800'
                              : 'border-amber-300 text-amber-700'
                          }>
                            {update.status}
                          </Badge>
                          
                          <div className="flex flex-col items-end">
                            <div className="text-lg font-semibold">{update.nextArrival}</div>
                            <div className="text-xs text-gray-500">
                              Occupancy: {update.occupancy}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-600 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
                Service Alerts
              </CardTitle>
              <CardDescription>Latest updates about service changes</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {serviceAlerts.map((alert) => (
                  <div key={alert.id} className="p-3 rounded-md bg-amber-50 border border-amber-100">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 mb-2">
                        {alert.type}
                      </Badge>
                      <span className="text-xs text-gray-500">{alert.timeStamp}</span>
                    </div>
                    <p className="text-sm mb-2">{alert.message}</p>
                    <div className="text-xs text-gray-500">
                      Affected: {alert.affectedRoutes.join(', ')}
                    </div>
                  </div>
                ))}
                
                <div className="pt-4">
                  <h4 className="font-medium text-green-800 mb-2">Other Updates</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>New bike lane on Oak Street</span>
                      <span className="text-gray-500">Today</span>
                    </div>
                    <div className="flex justify-between">
                      <span>EV charging stations added downtown</span>
                      <span className="text-gray-500">Yesterday</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TransitUpdates;
