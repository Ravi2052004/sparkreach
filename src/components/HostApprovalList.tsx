import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, MapPin, Zap, IndianRupee, Eye, Calendar } from 'lucide-react';
import { getMockAdminData } from '../utils/mockAdminData';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function HostApprovalList() {
  const [pendingHosts, setPendingHosts] = useState<any[]>([]);
  const [selectedHost, setSelectedHost] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    // Load pending hosts from backend API
    // const data = await adminAPI.getPendingHosts();
    const mockData = getMockAdminData();
    setPendingHosts(mockData.pendingHosts);
  }, []);

  const handleApprove = async (host: any) => {
    if (window.confirm(`Approve ${host.location} for listing?`)) {
      try {
        // Call backend API
        // await adminAPI.approveHost(host.id, host);
        
        console.log('Approving host:', host);
        setPendingHosts(pendingHosts.filter(h => h.id !== host.id));
        alert('Host approved successfully! The charger is now live on the platform.');
      } catch (error) {
        console.error('Error approving host:', error);
        alert('Failed to approve host. Please try again.');
      }
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      // Call backend API
      // await adminAPI.rejectHost(selectedHost.id, rejectionReason);
      
      console.log('Rejecting host:', selectedHost.id, rejectionReason);
      setPendingHosts(pendingHosts.filter(h => h.id !== selectedHost.id));
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedHost(null);
      alert('Host rejected. A notification has been sent to the host.');
    } catch (error) {
      console.error('Error rejecting host:', error);
      alert('Failed to reject host. Please try again.');
    }
  };

  const openRejectModal = (host: any) => {
    setSelectedHost(host);
    setShowRejectModal(true);
  };

  if (pendingHosts.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center shadow-sm">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl text-gray-900 mb-2">All Caught Up!</h3>
        <p className="text-gray-600">There are no pending host applications to review.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-gray-900">Pending Host Approvals</h2>
        <div className="text-gray-600">{pendingHosts.length} pending</div>
      </div>

      <div className="space-y-6">
        {pendingHosts.map((host) => (
          <div key={host.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Images */}
              <div className="space-y-3">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={host.images[0]}
                    alt={host.location}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {host.images.slice(1, 4).map((img: string, idx: number) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={img}
                        alt={`${host.location} ${idx + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <h3 className="text-xl text-gray-900 mb-2">{host.location}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{host.area}, Delhi</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Type</div>
                      <div className="text-gray-900 flex items-center gap-1">
                        <Zap className="w-4 h-4 text-green-600" />
                        {host.type}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Power</div>
                      <div className="text-gray-900">{host.power}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Price/hr</div>
                      <div className="text-gray-900 flex items-center gap-1">
                        <IndianRupee className="w-4 h-4" />
                        {host.price}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Submitted</div>
                      <div className="text-gray-900 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {host.submittedDate}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Description</div>
                    <p className="text-gray-700">{host.description}</p>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Amenities</div>
                    <div className="flex flex-wrap gap-2">
                      {host.amenities.map((amenity: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Available Slots</div>
                    <div className="flex flex-wrap gap-2">
                      {host.slots.filter((s: any) => s.available).map((slot: any, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm"
                        >
                          {slot.time}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm text-gray-700 mb-2">Host Contact</div>
                    <div className="space-y-1 text-sm text-gray-900">
                      <div>Name: {host.hostName}</div>
                      <div>Email: {host.hostEmail}</div>
                      <div>Phone: {host.hostPhone}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleApprove(host)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve & Publish
                  </button>
                  <button
                    onClick={() => openRejectModal(host)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl text-gray-900 mb-4">Reject Host Application</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting <strong>{selectedHost?.location}</strong>. This will be sent to the host.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedHost(null);
                }}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
