import axios from 'axios';

const API_BASE_URL = 'https://api.thetechnextdoors.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Email API
export const emailApi = {
  sendConfirmation: (data: { email: string; firstName: string; lastName: string }) =>
    api.post('/email/send-confirmation', data),
  sendScheduleNotification: (data: {
    customerName: string; email: string; phone: string;
    brand: string; grouping: string; model: string; service: string;
    date: string; time: string; notes: string; amount: string;
    streetAddress: string; city: string; zip: string;
  }) => api.post('/email/send-schedule-notification', data),
  sendContactNotification: (data: {
    customerName: string; email: string; phone: string;
    contactMethod: string; message: string;
  }) => api.post('/email/send-contact-notification', data),
};

// Repair Services API
export const repairServicesApi = {
  getAll: () => api.get('/repair-services'),
  save: (service: object) => api.post('/repair-services', service),
  delete: (id: string) => api.delete(`/repair-services/${id}`),
};

// Service Cards API
export const serviceCardsApi = {
  getAll: () => api.get('/service-cards'),
  saveAll: (cards: object[]) => api.post('/service-cards/batch', cards),
};

// Carousel Images API
export const carouselImagesApi = {
  getAll: () => api.get('/carousel-images'),
  saveAll: (images: object[]) => api.post('/carousel-images/batch', images),
};

// Quote Images API
export const quoteImagesApi = {
  getAll: () => api.get('/quote-images'),
  saveAll: (images: object[]) => api.post('/quote-images/batch', images),
};

// Repair Orders API
export const repairOrdersApi = {
  getAll: () => api.get('/repair-orders'),
  save: (order: object) => api.post('/repair-orders', order),
  updateStatus: (id: string, status: string) =>
    api.put(`/repair-orders/${encodeURIComponent(id)}/status`, { status }),
  delete: (id: string) => api.delete(`/repair-orders/${encodeURIComponent(id)}`),
  getBookedTimes: (date: string) =>
    api.get('/repair-orders/booked-times', { params: { date } }),
};

// Contact Messages API
export const contactMessagesApi = {
  getAll: () => api.get('/contact-messages'),
  save: (message: object) => api.post('/contact-messages', message),
  markAsRead: (id: string) => api.put(`/contact-messages/${encodeURIComponent(id)}/read`),
  delete: (id: string) => api.delete(`/contact-messages/${encodeURIComponent(id)}`),
};

// Quote Requests API
export const quoteRequestsApi = {
  getAll: () => api.get('/quote-requests'),
  save: (quote: object) => api.post('/quote-requests', quote),
  updateStatus: (id: string, status: string) =>
    api.put(`/quote-requests/${encodeURIComponent(id)}/status`, { status }),
  delete: (id: string) => api.delete(`/quote-requests/${encodeURIComponent(id)}`),
};

// Admin Accounts API
export interface AdminAccount {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  age: string | null;
  gender: string | null;
  mustChangePassword: boolean;
  createdAt: number;
  temporaryPassword?: string;
}

export const adminAccountsApi = {
  getAll: () => api.get<AdminAccount[]>('/admin/accounts'),
  create: (data: { firstName: string; lastName: string; email: string; age?: string; gender?: string; password?: string }) =>
    api.post<AdminAccount>('/admin/accounts', data),
  login: (data: { identifier: string; password: string }) =>
    api.post<AdminAccount>('/admin/accounts/login', data),
  changePassword: (id: number, data: { currentPassword: string; newPassword: string }) =>
    api.put<AdminAccount>(`/admin/accounts/${id}/password`, data),
  updateProfile: (id: number, data: { firstName: string; lastName: string; age?: string; gender?: string }) =>
    api.put<AdminAccount>(`/admin/accounts/${id}`, data),
  delete: (id: number) => api.delete(`/admin/accounts/${id}`),
};

// Settings API (video URL, quote options, etc.)
export const settingsApi = {
  get: (key: string) => api.get<string>(`/settings/${key}`),
  save: (key: string, value: string) => api.put(`/settings/${key}`, { value }),
};

// Video API
export const videoApi = {
  get: () => api.get<string>('/video'),
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/video/upload', formData, {
      transformRequest: [(_data, headers) => {
        if (headers) delete headers['Content-Type'];
        return formData;
      }],
    });
  },
  delete: () => api.delete('/video'),
};

// Analytics API
export interface AnalyticsSummary {
  totalVisits: number;
  todayVisits: number;
  weekVisits: number;
  topPages: { page: string; count: number }[];
  todayLocations: { city: string; count: number }[];
}

export const analyticsApi = {
  track: (page: string, city?: string | null) => api.post('/analytics/track', { page, city }),
  getSummary: () => api.get<AnalyticsSummary>('/analytics/summary'),
};

// Google Reviews API
export interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  profile_photo_url: string;
  author_url: string;
}

export interface GoogleReviewsData {
  reviews: GoogleReview[];
  rating: number;
  totalRatings: number;
}

export const googleReviewsApi = {
  get: () => api.get<GoogleReviewsData>('/google-reviews'),
};

export default api;
