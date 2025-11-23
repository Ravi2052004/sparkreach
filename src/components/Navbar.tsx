import { Link, useLocation } from 'react-router-dom';
import { Zap, User, Menu, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { UserAuth } from './UserAuth';

export function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [showAuth]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">SparkReach</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`transition-colors ${
                  location.pathname === '/' ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Find Chargers
              </Link>
              <Link
                to="/host"
                className={`transition-colors ${
                  location.pathname === '/host' ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Become a Host
              </Link>
              <Link
                to="/admin/login"
                className="text-gray-700 hover:text-red-600 transition-colors text-sm"
              >
                Admin
              </Link>
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <div className="text-gray-900">{user.name}</div>
                    {user.evDetails && (
                      <div className="text-gray-600 text-xs">
                        {user.evDetails.make} {user.evDetails.model}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Login / Sign Up</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-4">
                <Link
                  to="/"
                  className={`px-4 py-2 ${
                    location.pathname === '/' ? 'text-green-600' : 'text-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Find Chargers
                </Link>
                <Link
                  to="/host"
                  className={`px-4 py-2 ${
                    location.pathname === '/host' ? 'text-green-600' : 'text-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Become a Host
                </Link>
                {user ? (
                  <div className="px-4">
                    <div className="mb-2">
                      <div className="text-gray-900">{user.name}</div>
                      {user.evDetails && (
                        <div className="text-gray-600 text-sm">
                          {user.evDetails.make} {user.evDetails.model}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuth(true)}
                    className="mx-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white"
                  >
                    <User className="w-4 h-4" />
                    <span>Login / Sign Up</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {showAuth && <UserAuth onClose={() => setShowAuth(false)} />}
    </>
  );
}