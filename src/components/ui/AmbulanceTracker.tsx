import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Truck, Navigation } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

export default function AmbulanceTracker() {
  const [ambulanceLocation, setAmbulanceLocation] = useState<Location>({
    lat: 17.3850,
    lng: 78.4867,
    address: "Jubilee Hills, Hyderabad"
  });
  const [hospitalLocation] = useState<Location>({
    lat: 17.4065,
    lng: 78.4772,
    address: "Apollo Hospital, Hyderabad"
  });
  const [estimatedArrival, setEstimatedArrival] = useState(8);
  const [distance, setDistance] = useState(4.2);

  // Simulate ambulance movement
  useEffect(() => {
    const interval = setInterval(() => {
      setAmbulanceLocation((prev) => ({
        ...prev,
        lat: prev.lat + (Math.random() - 0.5) * 0.001, // Small random movement
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
      }));
      
      setEstimatedArrival((prev) => Math.max(0, prev - 0.1));
      setDistance((prev) => Math.max(0, prev - 0.05));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (estimatedArrival <= 2) return 'bg-destructive text-destructive-foreground';
    if (estimatedArrival <= 5) return 'bg-orange-500 text-white';
    return 'bg-primary text-primary-foreground';
  };

  return (
    <Card className="mb-6 shadow-card border-l-4 border-l-primary">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Truck className="w-5 h-5 text-primary-foreground" />
          </div>
          <span>Ambulance Live Tracker</span>
          <Badge className={`${getStatusColor()} ml-auto animate-pulse`}>
            En Route
          </Badge>
        </CardTitle>
        <CardDescription>
          Real-time ambulance location and estimated arrival time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Location Info */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Navigation className="w-4 h-4 text-accent-dark" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Current Location</h4>
                <p className="text-sm text-muted-foreground">{ambulanceLocation.address}</p>
                <p className="text-xs text-muted-foreground">
                  {ambulanceLocation.lat.toFixed(4)}, {ambulanceLocation.lng.toFixed(4)}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-secondary/20 rounded-lg">
                <MapPin className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Destination</h4>
                <p className="text-sm text-muted-foreground">{hospitalLocation.address}</p>
              </div>
            </div>
          </div>

          {/* ETA Info */}
          <div className="space-y-4">
            <div className="bg-gradient-card p-4 rounded-lg border border-border">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground">Estimated Arrival</span>
              </div>
              <div className="text-2xl font-bold text-primary">
                {estimatedArrival.toFixed(1)} mins
              </div>
              <p className="text-sm text-muted-foreground">
                Distance remaining: {distance.toFixed(1)} km
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground">{Math.round((1 - distance/4.2) * 100)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-primary h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.round((1 - distance/4.2) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Updates */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>Live tracking active • Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}