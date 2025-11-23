import { useState, useEffect } from 'react';
import { User, Mail, Phone, Car, Calendar, MapPin } from 'lucide-react';
import { getMockAdminData } from '../utils/mockAdminData';

export function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load users from backend API
    const mockData = getMockAdminData();
    setUsers(mockData.users);
  }, []);

  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;
    return (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)
    );
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl text-gray-900">Registered Users</h2>
        
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 w-64"
          />
          <div className="text-gray-600">
            {filteredUsers.length} users
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg text-gray-900 mb-1">{user.name}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {user.joinedDate}</span>
                  </div>
                  {user.city && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{user.city}</span>
                    </div>
                  )}
                </div>

                {user.evDetails && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                      <Car className="w-4 h-4 text-green-600" />
                      <span className="text-gray-900">Electric Vehicle</span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-700">
                      <div>{user.evDetails.make} {user.evDetails.model}</div>
                      {user.evDetails.year && <div>Year: {user.evDetails.year}</div>}
                      {user.evDetails.batteryCapacity && (
                        <div>Battery: {user.evDetails.batteryCapacity}</div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {user.evDetails.compatibleChargers.map((charger: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                          >
                            {charger}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Total Bookings</div>
                    <div className="text-lg text-gray-900">{user.totalBookings}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Total Spent</div>
                    <div className="text-lg text-gray-900">₹{user.totalSpent}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl text-gray-900 mb-2">No Users Found</h3>
          <p className="text-gray-600">No users match your search query.</p>
        </div>
      )}
    </div>
  );
}
