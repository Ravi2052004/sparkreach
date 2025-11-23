import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, IndianRupee, CheckCircle } from 'lucide-react';
import { getMockChargers } from '../utils/mockData';
import { MapView } from './MapView';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function BookingFlow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [charger, setCharger] = useState<any>(null);
  const [duration, setDuration] = useState(2);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [useTestMode, setUseTestMode] = useState(true); // Test mode by default
  const [userDetails, setUserDetails] = useState({
    name: '',
    phone: '',
    vehicleNumber: '',
  });

  const date = searchParams.get('date');
  const slot = searchParams.get('slot');

  useEffect(() => {
    // Pre-fill user details if logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserDetails({
        name: user.name || '',
        phone: user.phone || '',
        vehicleNumber: '',
      });
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Fetch charger details
    const chargers = getMockChargers();
    const found = chargers.find((c) => c.id === id);
    setCharger(found);

    return () => {
      document.body.removeChild(script);
    };
  }, [id]);

  if (!charger) {
    return <div className="max-w-7xl mx-auto px-4 py-12">Loading...</div>;
  }

  const totalPrice = charger.price * duration;
  const platformFee = Math.round(totalPrice * 0.05);
  const finalTotal = totalPrice + platformFee;

  const handlePayment = async () => {
    // Validate user details
    if (!userDetails.name || !userDetails.phone) {
      alert('Please fill in your name and phone number');
      return;
    }

    setLoading(true);

    // In production, you would call your backend API to create a Razorpay order
    // const orderResponse = await fetch('/api/create-order', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ amount: finalTotal, chargerId: charger.id, userId: userDetails })
    // });
    // const orderData = await orderResponse.json();

    try {
      const razorpayKey = useTestMode ? 'rzp_test_1DP5mmOlF5G5ag' : 'rzp_live_RZfRqaxQo1mJtf';

      const options = {
        key: razorpayKey,
        amount: finalTotal * 100, // Amount in paise
        currency: 'INR',
        name: 'SparkReach',
        description: `EV Charging at ${charger.location}`,
        image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=100&h=100',
        // order_id: orderData.orderId, // Use order ID from backend in production
        handler: function (response: any) {
          // Payment successful
          console.log('Payment successful:', response);
          
          // In production, verify payment on backend
          // await fetch('/api/verify-payment', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({
          //     razorpay_payment_id: response.razorpay_payment_id,
          //     razorpay_order_id: response.razorpay_order_id,
          //     razorpay_signature: response.razorpay_signature,
          //     bookingDetails: { chargerId: charger.id, date, slot, duration }
          //   })
          // });

          setPaymentSuccess(true);
          setLoading(false);
        },
        prefill: {
          name: userDetails.name || 'John Doe',
          email: 'john@example.com',
          contact: userDetails.phone || '9999999999',
        },
        notes: {
          charger_id: charger.id,
          date: date,
          slot: slot,
          duration: duration,
          vehicle_number: userDetails.vehicleNumber,
        },
        theme: {
          color: '#10b981',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            alert('Payment cancelled. Please try again when ready.');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        setLoading(false);
        alert(`Payment Failed: ${response.error.description || 'Please try again'}\n\nError Code: ${response.error.code}`);
      });

      razorpay.open();
    } catch (error) {
      console.error('Error initializing payment:', error);
      setLoading(false);
      alert('Failed to initialize payment. Please try again.');
    }
  };

  const handleDemoPayment = () => {
    // Demo payment for testing without Razorpay
    if (!userDetails.name || !userDetails.phone) {
      alert('Please fill in your name and phone number');
      return;
    }

    if (window.confirm('This is a demo payment. Your booking will be confirmed without actual payment. Continue?')) {
      setLoading(true);
      
      // Simulate payment processing
      setTimeout(() => {
        console.log('Demo payment successful');
        setPaymentSuccess(true);
        setLoading(false);
      }, 1500);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl text-gray-900 mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600 mb-8">
              Your charging slot has been successfully booked. Check your email for confirmation details.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h2 className="text-xl text-gray-900 mb-4">
                Booking Details
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-gray-900">{charger.location}</div>
                    <div className="text-sm text-gray-600">{charger.area}, Delhi</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">{date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">{slot} ({duration} hours)</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <h3 className="text-gray-900 mb-4">
                Host Contact Details
              </h3>
              <div className="space-y-2 text-gray-700">
                <div>Name: Rajesh Kumar</div>
                <div>Phone: +91 98765 43210</div>
                <div>Address: {charger.location}, {charger.area}, Delhi</div>
              </div>
              <div className="mt-4">
                <MapView chargers={[charger]} center={[charger.lat, charger.lng]} zoom={15} />
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl text-gray-900 mb-8">
          Complete Your Booking
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Charger Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl text-gray-900 mb-4">
                Charging Station
              </h2>
              <div className="flex items-center gap-4">
                <img
                  src={charger.image}
                  alt={charger.location}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-gray-900 mb-1">
                    {charger.location}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{charger.area}, Delhi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl text-gray-900 mb-4">
                Booking Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Date</span>
                  </div>
                  <span className="text-gray-900">{date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Time Slot</span>
                  </div>
                  <span className="text-gray-900">{slot}</span>
                </div>
                <div className="pt-4 border-t">
                  <label className="block text-gray-700 mb-2">Duration (hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl text-gray-900 mb-4">
                Your Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={userDetails.name}
                    onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={userDetails.phone}
                    onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Vehicle Number</label>
                  <input
                    type="text"
                    placeholder="DL 01 XX 1234"
                    value={userDetails.vehicleNumber}
                    onChange={(e) => setUserDetails({ ...userDetails, vehicleNumber: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl text-gray-900 mb-4">
                Price Summary
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-gray-700">
                  <span>₹{charger.price}/hr × {duration} hours</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span>Platform fee</span>
                  <span>₹{platformFee}</span>
                </div>
                <div className="pt-3 border-t flex items-center justify-between">
                  <span className="text-gray-900">Total</span>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-5 h-5 text-gray-900" />
                    <span className="text-2xl text-gray-900">{finalTotal}</span>
                  </div>
                </div>
              </div>

              {/* Payment Mode Toggle */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useTestMode}
                    onChange={(e) => setUseTestMode(e.target.checked)}
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="text-sm text-gray-700">Use Test Mode (Recommended)</span>
                </label>
                {useTestMode && (
                  <p className="text-xs text-gray-600 mt-2">
                    Test Cards: 4111 1111 1111 1111 (Any CVV, Future Date)
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : `Pay ₹${finalTotal} with Razorpay`}
                </button>

                <button
                  onClick={handleDemoPayment}
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Demo Payment (For Testing)
                </button>
              </div>

              <div className="mt-4 text-xs text-gray-500 text-center">
                By proceeding, you agree to our terms and conditions
              </div>

              {useTestMode && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-gray-700">
                    <strong>Test Mode Active:</strong> Use test card details for payment testing.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}