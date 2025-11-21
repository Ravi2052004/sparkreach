import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapPin, Battery, IndianRupee, Star, Zap, Clock, Shield, Calendar } from 'lucide-react';
import { MapView } from './MapView';
import { BlurredMapView } from './BlurredMapView';
import { getMockChargers } from '../utils/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ChargerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [charger, setCharger] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Simulate API call to fetch charger details
    const chargers = getMockChargers();
    const found = chargers.find((c) => c.id === id);
    setCharger(found);

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, [id]);

  if (!charger) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const handleBooking = () => {
    if (!selectedSlot) {
      alert('Please select a time slot');
      return;
    }

    // Check if user is logged in
    if (!user) {
      alert('Please login or create an account to book a charging slot');
      return;
    }

    // Check charger compatibility
    if (user.evDetails?.compatibleChargers?.length > 0) {
      if (!user.evDetails.compatibleChargers.includes(charger.type)) {
        const confirmBooking = window.confirm(
          `This charger type (${charger.type}) is not in your EV's compatible list. Do you still want to proceed?`
        );
        if (!confirmBooking) return;
      }
    }

    navigate(`/booking/${charger.id}?date=${selectedDate}&slot=${selectedSlot}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="h-96 rounded-xl overflow-hidden">
            <ImageWithFallback
              src={charger.image}
              alt={charger.location}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {charger.additionalImages?.map((img: string, idx: number) => (
              <div key={idx} className="h-44 rounded-xl overflow-hidden">
                <ImageWithFallback
                  src={img}
                  alt={`${charger.location} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl text-gray-900 mb-2">
                    {charger.location}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{charger.area}, Delhi</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-gray-900">{charger.rating}</span>
                  <span className="text-gray-500">({charger.reviews} reviews)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Battery className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-600">Type</div>
                    <div className="text-gray-900">{charger.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-600">Power</div>
                    <div className="text-gray-900">{charger.power}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-600">Rate</div>
                    <div className="text-gray-900">₹{charger.price}/hr</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-600">Available</div>
                    <div className="text-gray-900">24/7</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl text-gray-900 mb-4">About this charging station</h2>
              <p className="text-gray-700 leading-relaxed">
                {charger.description || `Fast and reliable EV charging station in ${charger.area}. Perfect location with easy access and secure parking. Our charger is well-maintained and regularly serviced to ensure optimal performance. Ideal for quick charging sessions while you grab a coffee or run errands nearby.`}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {charger.amenities?.map((amenity: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-700">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl text-gray-900 mb-4">Location</h2>
              <BlurredMapView charger={charger} />
              <p className="text-sm text-gray-600 mt-4 text-center">
                Exact location will be shown after payment confirmation
              </p>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Price per hour</span>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-5 h-5 text-gray-900" />
                    <span className="text-2xl text-gray-900">{charger.price}</span>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Slot Selection */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Available Time Slots
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {charger.slots?.map((slot: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSlot(slot.time)}
                      disabled={!slot.available}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        selectedSlot === slot.time
                          ? 'bg-green-600 text-white border-green-600'
                          : slot.available
                          ? 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleBooking}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mb-4"
              >
                Continue to Payment
              </button>

              {!user && (
                <div className="text-center text-sm text-red-600 mb-4">
                  Please login to continue booking
                </div>
              )}

              {user?.evDetails?.compatibleChargers?.length > 0 && (
                <div className={`text-center text-sm mb-4 ${
                  user.evDetails.compatibleChargers.includes(charger.type)
                    ? 'text-green-600'
                    : 'text-orange-600'
                }`}>
                  {user.evDetails.compatibleChargers.includes(charger.type) ? (
                    <>✓ Compatible with your {user.evDetails.make} {user.evDetails.model}</>
                  ) : (
                    <>⚠ Not in your compatible charger list</>
                  )}
                </div>
              )}

              <div className="text-center text-sm text-gray-500">
                You won't be charged yet
              </div>

              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secure payment via Razorpay</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Zap className="w-4 h-4 text-green-600" />
                  <span>Instant booking confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}