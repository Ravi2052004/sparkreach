import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Zap, 
  IndianRupee, 
  Clock, 
  CheckCircle, 
  XCircle,
  LogOut,
  Home,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { getMockAdminData } from '../utils/mockAdminData';

type TabType = 'overview' | 'pending-hosts' | 'bookings' | 'users';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [adminUser, setAdminUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [pendingHosts, setPendingHosts] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // Check admin authentication
    const token = localStorage.getItem('adminToken');
    const admin = localStorage.getItem('adminUser');
    
    if (!token || !admin) {
      navigate('/admin/login');
      return;
    }

    try {
      setAdminUser(JSON.parse(admin));

      // Load admin data
      const mockData = getMockAdminData();
      setStats(mockData.statistics);
      setPendingHosts(mockData.pendingHosts);
      setBookings(mockData.bookings);
      setUsers(mockData.users);
    } catch (error) {
      console.error('Error loading admin data:', error);
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const handleApproveHost = (hostId: string) => {
    if (window.confirm('Approve this charging station?')) {
      setPendingHosts(pendingHosts.filter(h => h.id !== hostId));
      alert('Host approved successfully!');
    }
  };

  const handleRejectHost = (hostId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      setPendingHosts(pendingHosts.filter(h => h.id !== hostId));
      alert('Host rejected. Notification sent.');
    }
  };

  if (!adminUser || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-xl text-gray-900 mb-4">Loading Admin Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <nav className="bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-xl">SparkReach Admin</h1>
                <p className="text-xs text-red-100">Management Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden md:inline">View Site</span>
              </button>
              <div className="text-right hidden md:block">
                <div className="text-sm">{adminUser.name}</div>
                <div className="text-xs text-red-100">{adminUser.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('pending-hosts')}
              className={`py-4 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'pending-hosts'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending Hosts
              {pendingHosts.length > 0 && (
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  {pendingHosts.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'bookings'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Bookings
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'users'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Users
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl text-gray-900 mb-6">Dashboard Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-600">Total Users</div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
                <div className="text-3xl text-gray-900 mb-1">{stats.totalUsers}</div>
                <div className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +{stats.newUsersThisMonth} this month
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-600">Active Chargers</div>
                  <Zap className="w-8 h-8 text-green-500" />
                </div>
                <div className="text-3xl text-gray-900 mb-1">{stats.activeChargers}</div>
                <div className="text-sm text-orange-600 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {stats.pendingApprovals} pending approval
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-600">Total Bookings</div>
                  <CheckCircle className="w-8 h-8 text-purple-500" />
                </div>
                <div className="text-3xl text-gray-900 mb-1">{stats.totalBookings}</div>
                <div className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {stats.bookingsThisMonth} this month
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-yellow-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-600">Total Revenue</div>
                  <IndianRupee className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="text-3xl text-gray-900 mb-1">₹{stats.totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  ₹{stats.revenueThisMonth.toLocaleString()} this month
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('pending-hosts')}
                  className="flex items-center gap-3 p-4 border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                  <div className="text-left">
                    <div className="text-gray-900">Review Pending Hosts</div>
                    <div className="text-sm text-gray-600">{pendingHosts.length} awaiting approval</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                  <div className="text-left">
                    <div className="text-gray-900">View All Bookings</div>
                    <div className="text-sm text-gray-600">{bookings.length} total bookings</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('users')}
                  className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Users className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <div className="text-gray-900">Manage Users</div>
                    <div className="text-sm text-gray-600">{users.length} registered users</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pending Hosts Tab */}
        {activeTab === 'pending-hosts' && (
          <div>
            <h2 className="text-2xl text-gray-900 mb-6">Pending Host Approvals</h2>
            {pendingHosts.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl text-gray-900 mb-2">All Caught Up!</h3>
                <p className="text-gray-600">No pending host applications to review.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingHosts.map((host) => (
                  <div key={host.id} className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl text-gray-900">{host.location}</h3>
                        <p className="text-gray-600">{host.area}, Delhi</p>
                      </div>
                      <span className="text-sm text-gray-500">{host.submittedDate}</span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Type</div>
                        <div className="text-gray-900">{host.type}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Power</div>
                        <div className="text-gray-900">{host.power}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Price/hr</div>
                        <div className="text-gray-900">₹{host.price}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Host</div>
                        <div className="text-gray-900">{host.hostName}</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApproveHost(host.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Approve & Publish
                      </button>
                      <button
                        onClick={() => handleRejectHost(host.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <XCircle className="w-5 h-5" />
                        Reject Application
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-2xl text-gray-900 mb-6">All Bookings</h2>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-xl p-6 shadow-sm border">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Booking ID</div>
                      <div className="text-gray-900">{booking.id}</div>
                      <div className="mt-2 text-sm text-gray-600">Location</div>
                      <div className="text-gray-900">{booking.chargerLocation}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Customer</div>
                      <div className="text-gray-900">{booking.userName}</div>
                      <div className="text-sm text-gray-600">{booking.userEmail}</div>
                      <div className="text-sm text-gray-600">{booking.userPhone}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Amount</div>
                      <div className="text-2xl text-gray-900">₹{booking.amount}</div>
                      <div className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                        booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {booking.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl text-gray-900 mb-6">Registered Users</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {users.map((user) => (
                <div key={user.id} className="bg-white rounded-xl p-6 shadow-sm border">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg text-gray-900 mb-1">{user.name}</h3>
                      <div className="text-sm text-gray-600 mb-2">{user.email}</div>
                      <div className="text-sm text-gray-600 mb-2">{user.phone}</div>
                      {user.evDetails && (
                        <div className="bg-green-50 rounded p-2 text-sm">
                          <div className="text-gray-900">{user.evDetails.make} {user.evDetails.model}</div>
                          <div className="text-gray-600">{user.evDetails.compatibleChargers.join(', ')}</div>
                        </div>
                      )}
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-gray-600">Bookings</div>
                          <div className="text-gray-900">{user.totalBookings}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Spent</div>
                          <div className="text-gray-900">₹{user.totalSpent}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
