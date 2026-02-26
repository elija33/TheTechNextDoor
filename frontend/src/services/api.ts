import axios from 'axios';
import { Product, Category, Cart, Order, User } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product API
export const productApi = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  getByCategory: (categoryId: number) => api.get<Product[]>(`/products/category/${categoryId}`),
  search: (keyword: string) => api.get<Product[]>(`/products/search?keyword=${keyword}`),
  create: (product: Partial<Product>) => api.post<Product>('/products', product),
  update: (id: number, product: Partial<Product>) => api.put<Product>(`/products/${id}`, product),
  delete: (id: number) => api.delete(`/products/${id}`),
};

// Category API
export const categoryApi = {
  getAll: () => api.get<Category[]>('/categories'),
  getById: (id: number) => api.get<Category>(`/categories/${id}`),
  create: (category: Partial<Category>) => api.post<Category>('/categories', category),
  update: (id: number, category: Partial<Category>) => api.put<Category>(`/categories/${id}`, category),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

// Cart API
export const cartApi = {
  get: (userId: number) => api.get<Cart>(`/cart/${userId}`),
  addItem: (userId: number, productId: number, quantity: number) =>
    api.post<Cart>(`/cart/${userId}/add`, { productId, quantity }),
  updateItem: (userId: number, productId: number, quantity: number) =>
    api.put<Cart>(`/cart/${userId}/item/${productId}?quantity=${quantity}`),
  removeItem: (userId: number, productId: number) =>
    api.delete<Cart>(`/cart/${userId}/item/${productId}`),
  clear: (userId: number) => api.delete(`/cart/${userId}/clear`),
};

// Order API
export const orderApi = {
  getByUser: (userId: number) => api.get<Order[]>(`/orders/user/${userId}`),
  getById: (orderId: number) => api.get<Order>(`/orders/${orderId}`),
  create: (userId: number, shippingInfo: {
    shippingAddress: string;
    shippingCity: string;
    shippingState: string;
    shippingZipCode: string;
  }) => api.post<Order>(`/orders/${userId}`, shippingInfo),
  updateStatus: (orderId: number, status: string) =>
    api.put<Order>(`/orders/${orderId}/status?status=${status}`),
};

// User API
export const userApi = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: number) => api.get<User>(`/users/${id}`),
  create: (user: Partial<User>) => api.post<User>('/users', user),
  update: (id: number, user: Partial<User>) => api.put<User>(`/users/${id}`, user),
  delete: (id: number) => api.delete(`/users/${id}`),
};

// Email API
export const emailApi = {
  sendConfirmation: (data: { email: string; firstName: string; lastName: string }) =>
    api.post('/email/send-confirmation', data),
};

export default api;
