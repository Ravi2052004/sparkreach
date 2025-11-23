import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, LogOut, Home } from 'lucide-react';

export function AdminDashboardSimple() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<any>(null);

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
    } catch (error) {
      console.error('Error parsing admin user:', error);
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-xl text-gray-900 mb-4">Loading Admin Dashboard...</div>
          <div className="text-gray-600">Please wait</div>
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

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl text-gray-900 mb-4">Welcome to Admin Dashboard</h2>
          <p className="text-gray-600 mb-6">
            You are logged in as: <strong>{adminUser.email}</strong>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg text-gray-900 mb-2">Total Users</h3>
              <div className="text-3xl text-blue-600">1,248</div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg text-gray-900 mb-2">Active Chargers</h3>
              <div className="text-3xl text-green-600">342</div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h3 className="text-lg text-gray-900 mb-2">Total Bookings</h3>
              <div className="text-3xl text-purple-600">5,634</div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg text-gray-900 mb-2">Dashboard Status</h3>
            <p className="text-gray-700">
              ✅ Admin dashboard is working correctly!
            </p>
            <p className="text-sm text-gray-600 mt-2">
              If you see this message, the admin authentication and routing are functioning properly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
