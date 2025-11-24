import { useState, useEffect } from 'react';
import { Calendar, MapPin, IndianRupee, User, Car, CheckCircle, Clock } from 'lucide-react';
import { getMockAdminData } from '../utils/mockAdminData';

export function BookingsManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Load bookings from backend API
    // const data = await adminAPI.getAllBookings();
    const mockData = getMockAdminData();
    setBookings(mockData.bookings);
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === 'all') return true;
    return booking.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ongoing':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl text-gray-900">All Bookings</h2>
        
        <div className="flex items-center gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <div className="text-gray-600">
            {filteredBookings.length} bookings
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Booking Info */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-600">#{booking.id}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{booking.chargerLocation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{booking.date} at {booking.slot}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{booking.duration} hours</span>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div>
                  <div className="text-sm text-gray-600 mb-2">Customer Details</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>{booking.userName}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {booking.userEmail}
                    </div>
                    <div className="text-sm text-gray-600">
                      {booking.userPhone}
                    </div>
                    {booking.vehicleNumber && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Car className="w-4 h-4 text-gray-500" />
                        <span>{booking.vehicleNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="lg:w-48 bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">Payment</div>
                <div className="flex items-center gap-1 text-2xl text-gray-900 mb-2">
                  <IndianRupee className="w-6 h-6" />
                  <span>{booking.amount}</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    {booking.paymentStatus === 'paid' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-orange-600" />
                    )}
                    <span className={booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'}>
                      {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    {booking.paymentMethod}
                  </div>
                  {booking.razorpayPaymentId && (
                    <div className="text-xs text-gray-500 break-all">
                      {booking.razorpayPaymentId}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredBookings.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl text-gray-900 mb-2">No Bookings Found</h3>
            <p className="text-gray-600">No bookings match the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
