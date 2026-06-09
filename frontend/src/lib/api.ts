const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper to get auth headers
const getHeaders = (isMultipart = false) => {
  const headers: any = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('luxury_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

// Generic request wrapper
const request = async (endpoint: string, options: any = {}) => {
  const url = `${API_URL}${endpoint}`;
  const headers = { ...getHeaders(options.body instanceof FormData), ...options.headers };
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const api = {
  // Authentication
  auth: {
    login: (credentials: any) => 
      request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData: any) => 
      request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    me: () => 
      request('/auth/me', { method: 'GET' }),
    forgotPassword: (email: string) =>
      request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (payload: any) =>
      request('/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) }),
  },

  // User Administration (Admin Only)
  users: {
    list: () =>
      request('/users', { method: 'GET' }),
    create: (data: any) =>
      request('/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request(`/users/${id}`, { method: 'DELETE' }),
  },

  // Notifications
  notifications: {
    list: () =>
      request('/notifications', { method: 'GET' }),
    markRead: (id: string) =>
      request(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllRead: () =>
      request('/notifications/read-all', { method: 'PUT' }),
    delete: (id: string) =>
      request(`/notifications/${id}`, { method: 'DELETE' }),
  },

  // Properties
  properties: {
    list: (params: any = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
      const queryString = query.toString();
      return request(`/properties${queryString ? `?${queryString}` : ''}`);
    },
    get: (id: string) => 
      request(`/properties/${id}`),
    create: (data: any) => 
      request('/properties', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => 
      request(`/properties/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => 
      request(`/properties/${id}`, { method: 'DELETE' }),
  },

  // Inquiries / Leads
  inquiries: {
    submit: (data: any) => 
      request('/inquiries', { method: 'POST', body: JSON.stringify(data) }),
    list: () => 
      request('/inquiries', { method: 'GET' }),
    updateStatus: (id: string, status: string) => 
      request(`/inquiries/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    delete: (id: string) => 
      request(`/inquiries/${id}`, { method: 'DELETE' }),
  },

  // Blogs
  blogs: {
    list: (params: any = {}) => {
      const query = new URLSearchParams();
      if (params.tag) query.append('tag', params.tag);
      if (params.limit) query.append('limit', String(params.limit));
      const queryString = query.toString();
      return request(`/blogs${queryString ? `?${queryString}` : ''}`);
    },
    get: (slug: string) => 
      request(`/blogs/${slug}`),
    create: (data: any) => 
      request('/blogs', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => 
      request(`/blogs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => 
      request(`/blogs/${id}`, { method: 'DELETE' }),
  },

  // Testimonials
  testimonials: {
    list: (approvedOnly = true) => 
      request(`/testimonials?approvedOnly=${approvedOnly}`),
    submit: (data: any) => 
      request('/testimonials', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    approve: (id: string, approved: boolean) => 
      request(`/testimonials/${id}/approve`, { method: 'PUT', body: JSON.stringify({ approved }) }),
    delete: (id: string) => 
      request(`/testimonials/${id}`, { method: 'DELETE' }),
  },

  // CMS Settings
  settings: {
    list: () => 
      request('/settings'),
    updateBulk: (settings: any) => 
      request('/settings/bulk', { method: 'POST', body: JSON.stringify({ settings }) }),
  },

  // Analytics
  analytics: {
    dashboard: () => 
      request('/analytics/dashboard'),
  },
};
