export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Car {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  price: number;
  showroom: string;
  sales: User;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
