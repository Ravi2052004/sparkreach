import { useState } from 'react';
import { Upload, Plus, X, MapPin, IndianRupee, Calendar, Clock } from 'lucide-react';

export function HostDashboard() {
  const [formData, setFormData] = useState({
    location: '',
    area: '',
    address: '',
    type: 'Type 2',
    power: '',
    price: '',
    description: '',
    amenities: [] as string[],
    lat: '',
    lng: '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [slots, setSlots] = useState([
    { time: '06:00-08:00', available: true },
    { time: '08:00-10:00', available: true },
    { time: '10:00-12:00', available: true },
    { time: '12:00-14:00', available: true },
    { time: '14:00-16:00', available: true },
    { time: '16:00-18:00', available: true },
    { time: '18:00-20:00', available: true },
    { time: '20:00-22:00', available: true },
  ]);

  const amenityOptions = [
    'Covered Parking',
    'Security',
    'Restroom',
    'WiFi',
    'Waiting Area',
    'CCTV',
    'Well-lit',
    'Refreshments',
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In production, upload to your server/cloud storage
      // For demo, we'll use placeholder URLs
      const newImages = Array.from(files).map((_, idx) => 
        `https://images.unsplash.com/photo-${Date.now()}-${idx}?w=400&h=300`
      );
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const toggleAmenity = (amenity: string) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter((a) => a !== amenity),
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity],
      });
    }
  };

  const toggleSlot = (index: number) => {
    const newSlots = [...slots];
    newSlots[index].available = !newSlots[index].available;
    setSlots(newSlots);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In production, send data to your backend API
    const chargerData = {
      ...formData,
      images,
      slots: slots.filter(s => s.available),
    };

    console.log('Submitting charger data:', chargerData);
    
    // Mock API call
    alert('Charger listing submitted successfully! Our team will review and approve within 24 hours.');
    
    // Reset form
    setFormData({
      location: '',
      area: '',
      address: '',
      type: 'Type 2',
      power: '',
      price: '',
      description: '',
      amenities: [],
      lat: '',
      lng: '',
    });
    setImages([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">
            List Your EV Charger
          </h1>
          <p className="text-gray-600">
            Earn money by sharing your charging station with EV drivers in Delhi
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Location Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., My Home Charger, XYZ Complex"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Area *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Connaught Place"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Charger Type *</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Type 2">Type 2</option>
                    <option value="CCS">CCS</option>
                    <option value="CHAdeMO">CHAdeMO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Full Address *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter complete address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Latitude *</label>
                  <input
                    type="text"
                    required
                    placeholder="28.6139"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Longitude *</label>
                  <input
                    type="text"
                    required
                    placeholder="77.2090"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Charger Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl text-gray-900 mb-4">
              Charger Details
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Power Output *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 7.4 kW, 22 kW"
                    value={formData.power}
                    onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Price per Hour (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g., 150"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe your charging station, parking availability, nearby landmarks, etc."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl text-gray-900 mb-4">
              Photos
            </h2>
            <p className="text-gray-600 mb-4">
              Add photos of your charging station, parking area, and surroundings
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square">
                  <img
                    src={img}
                    alt={`Upload ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Upload</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl text-gray-900 mb-4">
              Amenities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {amenityOptions.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    formData.amenities.includes(amenity)
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-green-500'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Available Time Slots */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl text-gray-900 mb-4">
              Available Time Slots
            </h2>
            <p className="text-gray-600 mb-4">
              Select the time slots when your charger is available for booking
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {slots.map((slot, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleSlot(idx)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    slot.available
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                  }`}
                >
                  <Clock className="w-4 h-4 inline mr-2" />
                  {slot.time}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-gray-600">
                <p className="mb-2">By submitting, you agree to:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Maintain your charger in working condition</li>
                  <li>Honor all confirmed bookings</li>
                  <li>Provide accurate location information</li>
                </ul>
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
              >
                Submit for Approval
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
