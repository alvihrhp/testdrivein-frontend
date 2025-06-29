import axios from 'axios';
//@ts-ignore
import type { Car as CarType, JenisMobil, EngineType, Booking as BookingType } from '@/types/car';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
export type { JenisMobil, EngineType, Car as CarType, Booking as BookingType } from '@/types/car';

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
}) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// API functions
export const getCars = async (): Promise<Car[]> => {
  const response = await api.get(endpoints.cars.getAll);
  return response.data;
};

export const getCarBySlug = async (slug: string): Promise<Car> => {
  const { data } = await api.get<Car>(endpoints.cars.getBySlug(slug));
  return data;
};

export const createBooking = async (bookingData: {
  name: string;
  email: string;
  phone: string;
  mobilId: string;
  mobilName: string;
  showroom: string;
  tanggal: string;
  jam: string;
}): Promise<Booking> => {
  const { data } = await api.post<Booking>(endpoints.bookings.create, bookingData);
  return data;
};

export const getBookings = async (): Promise<Booking[]> => {
  const { data } = await api.get<Booking[]>(endpoints.bookings.getAll);
  return data;
};
