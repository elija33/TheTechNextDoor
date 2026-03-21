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

// Repair Orders API
export const repairOrdersApi = {
  getAll: () => api.get('/repair-orders'),
  save: (order: object) => api.post('/repair-orders', order),
  updateStatus: (id: string, status: string) =>
    api.put(`/repair-orders/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/repair-orders/${id}`),
  getBookedTimes: (date: string) =>
    api.get('/repair-orders/booked-times', { params: { date } }),
};

// Contact Messages API
export const contactMessagesApi = {
  getAll: () => api.get('/contact-messages'),
  save: (message: object) => api.post('/contact-messages', message),
  markAsRead: (id: string) => api.put(`/contact-messages/${id}/read`),
  delete: (id: string) => api.delete(`/contact-messages/${id}`),
};

// Quote Requests API
export const quoteRequestsApi = {
  getAll: () => api.get('/quote-requests'),
  save: (quote: object) => api.post('/quote-requests', quote),
  updateStatus: (id: string, status: string) =>
    api.put(`/quote-requests/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/quote-requests/${id}`),
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
      headers: { 'Content-Type': undefined },
    });
  },
  delete: () => api.delete('/video'),
};

export default api;
