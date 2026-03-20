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

export default api;
