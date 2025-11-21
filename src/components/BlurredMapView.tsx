import { MapPin, Lock } from 'lucide-react';

interface BlurredMapViewProps {
  charger: any;
}

export function BlurredMapView({ charger }: BlurredMapViewProps) {
  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-gray-200">
      {/* Blurred background map image */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(10px)',
          transform: 'scale(1.1)',
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-sm flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-full p-6 shadow-lg mb-4">
          <Lock className="w-12 h-12 text-green-600" />
        </div>
        
        <h3 className="text-xl text-gray-900 mb-2">
          Exact Location Hidden
        </h3>
        
        <p className="text-gray-600 text-center max-w-md mb-4">
          The precise location and directions will be revealed after completing your payment
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <div className="text-sm text-gray-900 mb-1">
                Approximate Area
              </div>
              <div className="text-gray-700">
                {charger.area}, Delhi
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Within 2 km radius
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-sm text-gray-500 text-center max-w-md">
          <p>Complete your booking to get:</p>
          <ul className="mt-2 space-y-1 text-left inline-block">
            <li>✓ Exact address and GPS coordinates</li>
            <li>✓ Turn-by-turn navigation</li>
            <li>✓ Host contact details</li>
            <li>✓ Parking instructions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
