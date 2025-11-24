import { useState } from 'react';
import { Upload, X, Clock } from 'lucide-react';
import { hostAPI } from '../utils/api';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        location_name: formData.location,
        area: formData.area,
        full_address: formData.address,
        charger_type: formData.type,
        power_output: formData.power,
        price_per_hour: formData.price,
        description: formData.description,
        latitude: formData.lat,
        longitude: formData.lng,
        amenities: formData.amenities,
        images: images,
        available_slots: slots.filter(s => s.available).map(s => s.time),
      };

      console.log("Host Registration Payload:", payload);

      await hostAPI.register(payload);

      alert("Charger submitted! Admin will approve it soon.");

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

    } catch (error: any) {
      console.error("Host registration error:", error);
      alert(error?.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl text-gray-900 mb-2">List Your EV Charger</h1>
        <p className="text-gray-600">Earn money by sharing your charging station with EV drivers in Delhi</p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* BASIC INFORMATION */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl text-gray-900 mb-4">Basic Information</h2>

            <div className="space-y-4">

              {/* Location */}
              <div>
                <label className="block text-gray-700 mb-2">Location Name *</label>
                <input
                  required
                  placeholder="Example: Home Charger, Parking Basement, Office EV Point"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* AREA + TYPE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Area *</label>
                  <input
                    required
                    placeholder="Example: Rohini Sector 15"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Charger Type *</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="Type 2">Type 2</option>
                    <option value="CCS">CCS</option>
                    <option value="CHAdeMO">CHAdeMO</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-gray-700 mb-2">Full Address *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Example: House No. 123, Near City Mall, Rohini Sector 15, Delhi"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* LAT / LNG */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Latitude *</label>
                  <input
                    required
                    placeholder="Example: 28.7041"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Longitude *</label>
                  <input
                    required
                    placeholder="Example: 77.1025"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* CHARGER DETAILS */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl text-gray-900 mb-4">Charger Details</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-gray-700 mb-2">Power Output *</label>
                  <input
                    required
                    placeholder="Example: 7.4 kW / 15 kW / 22 kW"
                    value={formData.power}
                    onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Price per Hour *</label>
                  <input
                    required
                    placeholder="Example: 40"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

              </div>

              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  placeholder="Example: Secure basement parking, 24x7 CCTV, Fast charging, easy access."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* PHOTOS */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl text-gray-900 mb-4">Photos</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square">
                  <img src={img} className="w-full h-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500">
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

          {/* AMENITIES */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl text-gray-900 mb-4">Amenities</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {amenityOptions.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-4 py-2 rounded-lg border ${
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

          {/* TIME SLOTS */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl text-gray-900 mb-4">Available Time Slots</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {slots.map((slot, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleSlot(idx)}
                  className={`px-4 py-2 rounded-lg border ${
                    slot.available
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                  }`}
                >
                  <Clock className="inline w-4 h-4 mr-2" />
                  {slot.time}
                </button>
              ))}
            </div>
          </div>

          {/* SUBMIT */}
          <div className="bg-white rounded-xl p-6 shadow-sm flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Submit for Approval
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
