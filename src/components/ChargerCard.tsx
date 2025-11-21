import { Link } from 'react-router-dom';
import { MapPin, Battery, IndianRupee, Star, Zap } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ChargerCardProps {
  charger: any;
}

export function ChargerCard({ charger }: ChargerCardProps) {
  return (
    <Link to={`/charger/${charger.id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200">
        <div className="relative h-48">
          <ImageWithFallback
            src={charger.image}
            alt={charger.location}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full flex items-center gap-1">
            <Zap className="w-4 h-4 text-green-600" />
            <span className="text-green-600">{charger.power}</span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-gray-900 mb-2">
            {charger.location}
          </h3>
          
          <div className="flex items-center gap-1 text-gray-600 mb-3">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{charger.area}</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Battery className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">{charger.type}</span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">{charger.distance}</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-1">
              <IndianRupee className="w-5 h-5 text-gray-900" />
              <span className="text-gray-900">{charger.price}/hr</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-gray-700">{charger.rating}</span>
              <span className="text-gray-500 text-sm">({charger.reviews})</span>
            </div>
          </div>

          {charger.availableSlots > 0 ? (
            <div className="mt-3 text-sm text-green-600">
              {charger.availableSlots} slots available today
            </div>
          ) : (
            <div className="mt-3 text-sm text-red-600">
              No slots available today
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
