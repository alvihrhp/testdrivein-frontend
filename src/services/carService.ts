import { api } from '@/lib/api';
import { Car, ApiResponse } from '@/types/car';

/**
 * Service for handling car-related API calls
 */
export const carService = {
  /**
   * Get all cars with optional search query
   * @param search Optional search term to filter cars
   * @returns Promise with array of cars
   */
  getAllCars: async (search?: string): Promise<Car[]> => {
    try {
      const response = await api.get<ApiResponse<Car[]>>('/mobil', {
        params: search ? { search } : {}
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching cars:', error);
      throw error;
    }
  },

  /**
   * Get a single car by slug
   * @param slug The slug of the car (name-id)
   * @returns Promise with car details
   */
  getCarBySlug: async (slug: string): Promise<Car> => {
    try {
      const response = await api.get<ApiResponse<Car>>(`/mobil/${slug}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching car with slug ${slug}:`, error);
      throw error;
    }
  },
};
