import { Platform } from 'react-native';

// Cloud PostgreSQL Backend on Render (Set to true to connect directly to the live cloud database)
const USE_RENDER = true; 
const RENDER_BACKEND_URL = 'https://api.tailorc.com';
const LOCAL_HOST_IP = '192.168.167.107';
const LOCAL_PORT = '5000';

// On Web: use current origin hostname or Render. On Native: use Render or host machine LAN IP
export const getBaseUrl = () => {
  // If running on web in browser on local port (localhost or LAN), connect to local backend port 5000
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location && window.location.hostname) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('192.168.')) {
      return `http://${window.location.hostname}:${LOCAL_PORT}/api`;
    }
  }
  if (USE_RENDER) {
    return `${RENDER_BACKEND_URL}/api`;
  }
  if (Platform.OS === 'web') {
    return `http://localhost:${LOCAL_PORT}/api`;
  }
  return `http://${LOCAL_HOST_IP}:${LOCAL_PORT}/api`;
};

let authToken: string | null = (() => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem('tailorc_partner_token');
    }
  } catch {}
  return null;
})();

export const setAuthToken = (token: string | null) => {
  authToken = token;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (token) {
        window.localStorage.setItem('tailorc_partner_token', token);
      } else {
        window.localStorage.removeItem('tailorc_partner_token');
      }
    }
  } catch {}
};

const request = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = getBaseUrl();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
    ...((options.headers as Record<string, string>) || {})
  };

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), 12000) : null;

  try {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
      signal: controller ? controller.signal : undefined
    });
    if (timeoutId) clearTimeout(timeoutId);
    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: res.ok, message: text };
    }
    return data;
  } catch (error: any) {
    if (timeoutId) clearTimeout(timeoutId);
    throw error;
  }
};

export const api = {
  // Auth
  login: (identifier: string, password: string, role?: string) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password, role })
  }),
  registerTailor: async (tailorData: any) => {
    try {
      return await request('/auth/register-tailor', {
        method: 'POST',
        body: JSON.stringify(tailorData)
      });
    } catch (err) {
      console.warn('Backend server offline during tailor registration, using offline local session:', err);
      const isSolo = tailorData.operatingModel !== 'MULTI';
      const shopId = 'shop-' + Date.now().toString().slice(-4);
      const userId = 'usr-tailor-' + Date.now().toString().slice(-4);
      const shop = {
        id: shopId,
        name: tailorData.shopName || `${tailorData.ownerName}'s Atelier`,
        city: tailorData.city || 'Hyderabad',
        area: tailorData.area || 'Central Atelier Hub',
        address: tailorData.address || 'Atelier Workshop Street, Hyderabad',
        landmark: tailorData.landmark || '',
        pincode: tailorData.pincode || '500034',
        latitude: tailorData.latitude || 17.4156,
        longitude: tailorData.longitude || 78.4350,
        phone: tailorData.phone,
        rating: 5.0,
        reviewsCount: 1,
        specialties: tailorData.specialties || (isSolo ? 'Bespoke Blouses & Kurtas' : 'Bridal Maggam, Blouses & Suits'),
        baseRate: Number(tailorData.baseRate) || 450,
        status: 'Active',
        operatingModel: (isSolo ? 'SOLO' : 'MULTI') as 'SOLO' | 'MULTI',
        teamSize: isSolo ? 1 : (Number(tailorData.teamSize) || 1),
        teamMembers: tailorData.teamMembers || [],
        ownerName: tailorData.ownerName,
        experienceYears: Number(tailorData.experienceYears) || 5,
        workshopHours: tailorData.workshopHours || '10:00 AM - 09:00 PM',
        hasTrialRoom: Boolean(tailorData.hasTrialRoom ?? true),
        turnaroundDays: tailorData.turnaroundDays || (isSolo ? '3-5 Days' : '2-4 Days'),
        upiId: tailorData.upiId || `${tailorData.phone}@upi`
      };
      const user = {
        id: userId,
        name: tailorData.ownerName,
        phone: tailorData.phone,
        email: tailorData.email || null,
        role: 'TAILOR' as const,
        tailorShopId: shop.id,
        shop
      };
      return {
        success: true,
        message: `${shop.name} registered successfully!`,
        token: 'local-offline-token-' + Date.now(),
        user
      };
    }
  },
  getMe: () => request('/auth/me'),

  // Orders
  getOrders: (params: Record<string, any> = {}) => {
    const queryParts = Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
    const query = queryParts.join('&');
    return request(`/orders${query ? '?' + query : ''}`);
  },
  getAdminStats: (params: Record<string, any> = {}) => {
    const queryParts = Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
    const query = queryParts.join('&');
    return request(`/orders/stats${query ? '?' + query : ''}`);
  },
  createOrder: (orderData: any) => request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),
  updateOrderStatus: (id: string, status: string) => request(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  decideOrder: (id: string, decision: 'ACCEPT' | 'REJECT', notes?: string) => request(`/orders/${id}/decision`, {
    method: 'PATCH',
    body: JSON.stringify({ decision, notes })
  }),
  assignTailor: (id: string, assignedTailor: string) => request(`/orders/${id}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ assignedTailor })
  }),


  // Tailors (Admin CRUD)
  getTailors: (params: { search?: string; tailorShopId?: string; shopName?: string } | string = '') => {
    if (typeof params === 'string') {
      return request(`/tailors?search=${encodeURIComponent(params)}`);
    }
    const queryParts = Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
    const query = queryParts.join('&');
    return request(`/tailors${query ? '?' + query : ''}`);
  },
  getTailorShops: (search = '') => request(`/tailors/shops${search ? '?search=' + encodeURIComponent(search) : ''}`),
  createTailor: (tailorData: any) => request('/tailors', {
    method: 'POST',
    body: JSON.stringify(tailorData)
  }),
  updateTailor: (id: string, tailorData: any) => request(`/tailors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(tailorData)
  }),
  updateShopMeasurements: (shopId: string, customMeasurements: any[]) => request(`/tailors/shops/${shopId}/measurements`, {
    method: 'PUT',
    body: JSON.stringify({ customMeasurements })
  }),
  deleteTailor: (id: string) => request(`/tailors/${id}`, {
    method: 'DELETE'
  }),

  // Services (Admin CRUD)
  getCategories: (params?: { tailorShopId?: string; shopName?: string } | string) => {
    if (typeof params === 'string') {
      return request(`/services/categories${params ? '?tailorShopId=' + encodeURIComponent(params) : ''}`);
    }
    if (!params) return request('/services/categories');
    const queryParts = Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
    const query = queryParts.join('&');
    return request(`/services/categories${query ? '?' + query : ''}`);
  },
  createCategory: (categoryData: { name: string; emoji?: string; tailorShopId?: string }) => request('/services/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData)
  }),
  deleteCategory: (nameOrId: string) => request(`/services/categories/${encodeURIComponent(nameOrId)}`, {
    method: 'DELETE'
  }),
  getServices: (params: { category?: string; search?: string; tailorShopId?: string; shopName?: string } | string = '') => {
    if (typeof params === 'string') {
      return request(`/services${params ? '?category=' + encodeURIComponent(params) : ''}`);
    }
    const queryParts = Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
    const query = queryParts.join('&');
    return request(`/services${query ? '?' + query : ''}`);
  },
  createService: (serviceData: any) => request('/services', {
    method: 'POST',
    body: JSON.stringify(serviceData)
  }),
  updateService: (id: string, serviceData: any) => request(`/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(serviceData)
  }),
  deleteService: (id: string) => request(`/services/${id}`, {
    method: 'DELETE'
  }),

  // Saree Boutique Storefront (Per-Shop Admin CRUD)
  getSarees: (params: { category?: string; search?: string; tailorShopId?: string; shopName?: string } | string = '') => {
    if (typeof params === 'string') {
      return request(`/services/sarees${params ? '?category=' + encodeURIComponent(params) : ''}`);
    }
    const queryParts = Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
    const query = queryParts.join('&');
    return request(`/services/sarees${query ? '?' + query : ''}`);
  },
  createSaree: (sareeData: any) => request('/services/sarees', {
    method: 'POST',
    body: JSON.stringify(sareeData)
  }),
  toggleSareeStock: (id: string) => request(`/services/sarees/${id}/stock`, {
    method: 'PATCH'
  }),
  deleteSaree: (id: string) => request(`/services/sarees/${id}`, {
    method: 'DELETE'
  }),

  // Quotes Desk
  getQuotes: () => request('/quotes'),
  setQuotePrice: (id: string, price: string | number) => request(`/quotes/${id}/price`, {
    method: 'PATCH',
    body: JSON.stringify({ quotedPrice: price })
  }),
  updateQuotePrice: (id: string, price: string | number) => request(`/quotes/${id}/price`, {
    method: 'PATCH',
    body: JSON.stringify({ quotedPrice: price })
  }),
  acceptQuote: (id: string, bookingData: any = {}) => request(`/quotes/${id}/accept`, {
    method: 'POST',
    body: JSON.stringify(bookingData)
  }),
  respondToQuote: (id: string, responseData: any) => request(`/quotes/${id}/respond`, {
    method: 'POST',
    body: JSON.stringify(responseData)
  }),
  deleteQuote: (id: string) => request(`/quotes/${id}`, {
    method: 'DELETE'
  }),

  // Naap Passport
  getNaapPassport: (userId?: string) => request(`/naap/passport${userId ? '?userId=' + userId : ''}`),

  // Cities & Locality Hubs
  getCities: () => request('/tailors/cities'),

  // AWS S3 Photo Uploads
  uploadPhoto: (imageBase64: string, folder = 'shops') => request('/upload/photo', {
    method: 'POST',
    body: JSON.stringify({ image: imageBase64, folder })
  }),
  uploadPhotos: (imagesBase64: string[], folder = 'shops') => request('/upload/photos', {
    method: 'POST',
    body: JSON.stringify({ images: imagesBase64, folder })
  })
};
