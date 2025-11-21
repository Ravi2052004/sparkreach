import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { HostDashboard } from './components/HostDashboard';
import { ChargerDetails } from './components/ChargerDetails';
import { BookingFlow } from './components/BookingFlow';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/host" element={<HostDashboard />} />
          <Route path="/charger/:id" element={<ChargerDetails />} />
          <Route path="/booking/:id" element={<BookingFlow />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
