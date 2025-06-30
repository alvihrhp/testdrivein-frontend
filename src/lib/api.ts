import axios from 'axios';
import type { Car as CarType, Booking as BookingType } from '@/types/car';

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'CLIENT' | 'SALES';
  };
  access_token: string;
}

interface RegisterResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'CLIENT' | 'SALES';
  };
  access_token: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token (client-side only)
if (typeof window !== 'undefined') {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

// API endpoints
export const endpoints = {
  cars: {
    getAll: '/mobil',
    getBySlug: (slug: string) => `/mobil/${slug}`,
  },
  bookings: {
    create: '/bookings',
    getAll: '/bookings',
  },
};

// Re-export types from @/types/car
export type { JenisMobil, EngineType } from '@/types/car';

// For backward compatibility
export type Car = CarType;
export type Booking = BookingType;

// Auth functions
export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'CLIENT' | 'SALES';
}): Promise<RegisterResponse> => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// API functions
export const getCars = async (): Promise<CarType[]> => {
  const response = await api.get('/mobil');
  return response.data;
};

export const getCarBySlug = async (slug: string): Promise<CarType> => {
  const response = await api.get(`/mobil/${slug}`);
  return response.data;
};

export const getBookings = async (): Promise<BookingType[]> => {
  const response = await api.get('/bookings');
  return response.data;
};

export const createBooking = async (bookingData: Omit<BookingType, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<BookingType> => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};
