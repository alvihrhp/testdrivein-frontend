import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

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

// Types
export type JenisMobil = 'SUV' | 'MPV' | 'Hatchback' | 'Sedan' | 'Coupe' | 'Wagon';
export type EngineType = 'Bensin' | 'Electric' | 'Hybrid';

export interface Car {
  id: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  images?: string[]; // Array of image URLs
  description: string;
  price: number;
  showroom: string;
  jenis_mobil: JenisMobil;
  engine_type: EngineType;
  year: number;
  engine_capacity?: number;
  capacity: number;
  salesId: string;
  sales: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  bookings: any[]; // Anda bisa membuat interface terpisah untuk Booking jika diperlukan
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  mobilId: string;
  showroom: string;
  tanggal: string;
  jam: string;
  createdAt: string;
  mobil: Car;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

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
