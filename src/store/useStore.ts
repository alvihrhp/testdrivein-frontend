import { create } from 'zustand';
import type { Car, Booking } from '@/types/car';

interface StoreState {
  cars: Car[];
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  fetchCars: () => Promise<void>;
  fetchBookings: () => Promise<void>;
  createBooking: (bookingData: any) => Promise<void>;
}

export const useStore = create<StoreState>((set) => ({
  cars: [],
  bookings: [],
  isLoading: false,
  error: null,

  fetchCars: async () => {
    set({ isLoading: true, error: null });
    try {
      const { getCars } = await import('@/lib/api');
      const cars = await getCars();
      set({ cars, isLoading: false });
    } catch (error) {
      set({ 
        error: 'Failed to fetch cars. Please try again later.',
        isLoading: false 
      });
    }
  },

  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const { getBookings } = await import('@/lib/api');
      const bookings = await getBookings();
      set({ bookings, isLoading: false });
    } catch (error) {
      set({ 
        error: 'Failed to fetch bookings. Please try again later.',
        isLoading: false 
      });
    }
  },

  createBooking: async (bookingData) => {
    set({ isLoading: true, error: null });
    try {
      const { createBooking } = await import('@/lib/api');
      const newBooking = await createBooking(bookingData);
      set((state) => ({
        bookings: [newBooking, ...state.bookings],
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: 'Failed to create booking. Please try again.',
        isLoading: false 
      });
      throw error;
    }
  },
}));
