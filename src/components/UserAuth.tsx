import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Car, Battery, MapPin, Eye, EyeOff } from 'lucide-react';

interface UserAuthProps {
  onClose?: () => void;
}

export function UserAuth({ onClose }: UserAuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    // EV Details
    evMake: '',
    evModel: '',
    evYear: '',
    batteryCapacity: '',
    compatibleChargers: [] as string[],
    city: 'Delhi',
  });

  const chargerTypes = [
    { value: 'Type 2', label: 'Type 2 (AC)' },
    { value: 'CCS', label: 'CCS (DC Fast)' },
    { value: 'CHAdeMO', label: 'CHAdeMO (DC Fast)' },
    { value: 'Type 1', label: 'Type 1 (AC)' },
  ];

  const popularEVs = [
    { make: 'Tata', model: 'Nexon EV', chargers: ['Type 2', 'CCS'] },
    { make: 'Tata', model: 'Tigor EV', chargers: ['Type 2', 'CCS'] },
    { make: 'MG', model: 'ZS EV', chargers: ['Type 2', 'CCS'] },
    { make: 'Hyundai', model: 'Kona Electric', chargers: ['Type 2', 'CCS'] },
    { make: 'Mahindra', model: 'eVerito', chargers: ['Type 2'] },
    { make: 'BYD', model: 'e6', chargers: ['Type 2', 'CCS'] },
  ];

  const toggleChargerType = (chargerType: string) => {
    if (formData.compatibleChargers.includes(chargerType)) {
      setFormData({
        ...formData,
        compatibleChargers: formData.compatibleChargers.filter((c) => c !== chargerType),
      });
    } else {
      setFormData({
        ...formData,
        compatibleChargers: [...formData.compatibleChargers, chargerType],
      });
    }
  };

  const handleEVSelect = (ev: any) => {
    setFormData({
      ...formData,
      evMake: ev.make,
      evModel: ev.model,
      compatibleChargers: ev.chargers,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login logic - in production, call your API
      const userData = {
        email: formData.email,
        password: formData.password,
      };
      console.log('Login:', userData);
      
      // Store user session
      localStorage.setItem('user', JSON.stringify({ email: formData.email }));
      
      alert('Login successful!');
      if (onClose) onClose();
    } else {
      // Registration logic - in production, call your API
      console.log('Register:', formData);
      
      // Store user data including EV details
      localStorage.setItem('user', JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        evDetails: {
          make: formData.evMake,
          model: formData.evModel,
          year: formData.evYear,
          batteryCapacity: formData.batteryCapacity,
          compatibleChargers: formData.compatibleChargers,
        },
        city: formData.city,
      }));
      
      alert('Registration successful! You can now find compatible charging stations.');
      if (onClose) onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-gray-900">
              {isLogin ? 'Login to SparkReach' : 'Join SparkReach'}
            </h2>
            {onClose && (
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                {/* Basic Information */}
                <div>
                  <label className="block text-gray-700 mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-gray-700 mb-2">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-4 pr-10 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <>
                {/* EV Details Section */}
                <div className="pt-4 border-t">
                  <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <Car className="w-5 h-5 text-green-600" />
                    Your Electric Vehicle Details
                  </h3>

                  {/* Quick Select Popular EVs */}
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Quick Select (Optional)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {popularEVs.map((ev) => (
                        <button
                          key={`${ev.make}-${ev.model}`}
                          type="button"
                          onClick={() => handleEVSelect(ev)}
                          className={`px-3 py-2 rounded-lg border text-sm transition-all text-left ${
                            formData.evMake === ev.make && formData.evModel === ev.model
                              ? 'bg-green-50 border-green-500 text-green-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:border-green-500'
                          }`}
                        >
                          {ev.make} {ev.model}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">EV Make *</label>
                      <input
                        type="text"
                        required
                        value={formData.evMake}
                        onChange={(e) => setFormData({ ...formData, evMake: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., Tata, MG"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">EV Model *</label>
                      <input
                        type="text"
                        required
                        value={formData.evModel}
                        onChange={(e) => setFormData({ ...formData, evModel: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., Nexon EV"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Year</label>
                      <input
                        type="text"
                        value={formData.evYear}
                        onChange={(e) => setFormData({ ...formData, evYear: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., 2023"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Battery Capacity</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.batteryCapacity}
                          onChange={(e) => setFormData({ ...formData, batteryCapacity: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="e.g., 30.2 kWh"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-gray-700 mb-2">
                      <Battery className="w-4 h-4 inline mr-2" />
                      Compatible Charger Types *
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                      Select all charger types your EV supports
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {chargerTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => toggleChargerType(type.value)}
                          className={`px-4 py-2 rounded-lg border transition-all ${
                            formData.compatibleChargers.includes(type.value)
                              ? 'bg-green-50 border-green-500 text-green-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:border-green-500'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                    {formData.compatibleChargers.length === 0 && (
                      <p className="text-sm text-red-600 mt-2">
                        Please select at least one compatible charger type
                      </p>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="block text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Delhi"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={!isLogin && formData.compatibleChargers.length === 0}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-green-600 hover:text-green-700"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
