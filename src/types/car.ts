export type JenisMobil = 'MPV' | 'SUV' | 'Sedan' | 'Hatchback' | 'LCGC' | 'Sport' | 'Lainnya';
export type EngineType = 'Bensin' | 'Diesel' | 'Hybrid' | 'Listrik';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  mobilId: string;
  mobilName: string;
  showroom: string;
  tanggal: string;
  jam: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface Car {
  id: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  images?: string[];
  description: string;
  price: number;
  showroom: string;
  jenis_mobil: JenisMobil;
  engine_type: EngineType;
  year: number;
  engine_capacity?: number;
  capacity: number;
  salesId: string;
  sales: User;
  bookings: Booking[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
