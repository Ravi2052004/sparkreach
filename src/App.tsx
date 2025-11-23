import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { HostDashboard } from './components/HostDashboard';
import { ChargerDetails } from './components/ChargerDetails';
import { BookingFlow } from './components/BookingFlow';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminDashboardSimple } from './components/AdminDashboardSimple';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/test" element={<AdminDashboardSimple />} />
          
          {/* Public Routes */}
          <Route path="/" element={<><Navbar /><HomePage /></>} />
          <Route path="/host" element={<><Navbar /><HostDashboard /></>} />
          <Route path="/charger/:id" element={<><Navbar /><ChargerDetails /></>} />
          <Route path="/booking/:id" element={<><Navbar /><BookingFlow /></>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}