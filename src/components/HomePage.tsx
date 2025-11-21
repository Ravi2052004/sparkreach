import { useState, useEffect } from 'react';
import { Search, MapPin, Battery, IndianRupee, Filter } from 'lucide-react';
import { MapView } from './MapView';
import { ChargerCard } from './ChargerCard';
import { getMockChargers } from '../utils/mockData';

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [chargers, setChargers] = useState<any[]>([]);
  const [filteredChargers, setFilteredChargers] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get user data to filter compatible chargers
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Simulate API call to fetch chargers
    const mockChargers = getMockChargers();
    setChargers(mockChargers);
    setFilteredChargers(mockChargers);
  }, []);

  useEffect(() => {
    let filtered = chargers;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (charger) =>
          charger.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          charger.area.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by charger type
    if (filterType !== 'all') {
      filtered = filtered.filter((charger) => charger.type === filterType);
    }

    // Filter by user's compatible chargers if logged in
    if (user?.evDetails?.compatibleChargers?.length > 0 && filterType === 'compatible') {
      filtered = filtered.filter((charger) =>
        user.evDetails.compatibleChargers.includes(charger.type)
      );
    }

    setFilteredChargers(filtered);
  }, [searchQuery, filterType, chargers, user]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl mb-4">
            Charge Your EV Anywhere in Delhi
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Peer-to-peer EV charging network connecting drivers with local charging stations
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-2xl">
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by area (e.g., Connaught Place, Dwarka)"
                  className="flex-1 bg-transparent outline-none text-gray-900"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Filter:</span>
              </div>
              <select
                className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                {user?.evDetails?.compatibleChargers?.length > 0 && (
                  <option value="compatible">Compatible with My EV</option>
                )}
                <option value="Type 2">Type 2</option>
                <option value="CCS">CCS</option>
                <option value="CHAdeMO">CHAdeMO</option>
              </select>
            </div>

            {user?.evDetails && (
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Battery className="w-4 h-4 text-green-600" />
                <span>
                  Your EV: {user.evDetails.make} {user.evDetails.model}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl text-gray-900">
            Available Chargers
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredChargers.length} charging stations found
          </p>
        </div>

        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChargers.map((charger) => (
              <ChargerCard key={charger.id} charger={charger} />
            ))}
          </div>
        ) : (
          <MapView chargers={filteredChargers} />
        )}
      </div>
    </div>
  );
}