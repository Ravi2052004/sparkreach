// API utility functions for backend communication
// Update the BASE_URL to your actual backend server URL

const BASE_URL = 'http://localhost:3000/api'; // Change this to your backend URL

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// User APIs
export const userAPI = {
  register: (userData: any) => apiCall('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials: any) => apiCall('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  getProfile: () => apiCall('/users/profile'),
};

// Host APIs
export const hostAPI = {
  register: (hostData: any) => apiCall('/hosts/register', {
    method: 'POST',
    body: JSON.stringify(hostData),
  }),

  uploadPhoto: async (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BASE_URL}/hosts/upload-photo`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    
    return response.json();
  },

  uploadVideo: async (file: File) => {
    const formData = new FormData();
    formData.append('video', file);
    
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BASE_URL}/hosts/upload-video`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    
    return response.json();
  },

  getMyListings: () => apiCall('/hosts/my-listings'),
};

// Charger APIs
export const chargerAPI = {
  getAll: (filters?: any) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/chargers?${params}`);
  },

  getById: (id: string) => apiCall(`/chargers/${id}`),

  search: (query: string) => apiCall(`/chargers/search?q=${query}`),
};

// Booking APIs
export const bookingAPI = {
  create: (bookingData: any) => apiCall('/bookings/create', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),

  verifyPayment: (paymentData: any) => apiCall('/bookings/verify-payment', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  }),

  getMyBookings: () => apiCall('/bookings/my-bookings'),

  getById: (id: string) => apiCall(`/bookings/${id}`),
};

// Admin APIs
export const adminAPI = {
  login: (credentials: any) => apiCall('/admin/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  getPendingHosts: () => apiCall('/admin/pending-hosts'),

  approveHost: (hostId: string, chargerData: any) => apiCall(`/admin/approve-host/${hostId}`, {
    method: 'POST',
    body: JSON.stringify(chargerData),
  }),

  rejectHost: (hostId: string, reason: string) => apiCall(`/admin/reject-host/${hostId}`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  }),

  getAllBookings: () => apiCall('/admin/bookings'),

  getStatistics: () => apiCall('/admin/statistics'),
};

// Payment APIs
export const paymentAPI = {
  createOrder: (amount: number, bookingDetails: any) => apiCall('/payment/create-order', {
    method: 'POST',
    body: JSON.stringify({ amount, bookingDetails }),
  }),
};
