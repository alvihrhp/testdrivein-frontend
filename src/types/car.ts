export type JenisMobil = 'MPV' | 'SUV' | 'Sedan' | 'Hatchback' | 'LCGC' | 'Sport' | 'Lainnya';
export type EngineType = 'Bensin' | 'Diesel' | 'Hybrid' | 'Listrik' | 'Electric';

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
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  brand: string;
  capacity: number;
  engine_capacity: number;
  engine_type: EngineType;
  jenis_mobil: JenisMobil;
  year: number;
  showroom: string;
  salesId: string;
  sales: User;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
