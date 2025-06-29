import { useQuery } from '@tanstack/react-query';
import { carService } from '@/services/carService';
import { Car } from '@/types/car';

const CARS_QUERY_KEY = 'cars';

/**
 * Hook to fetch all cars with optional search
 * @param search Optional search term to filter cars
 * @returns Query result with cars data
 */
export const useCars = (search?: string) => {
  return useQuery<Car[]>({
    queryKey: [CARS_QUERY_KEY, { search }],
    queryFn: () => carService.getAllCars(search),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch a single car by slug
 * @param slug The slug of the car (name-id)
 * @returns Query result with car details
 */
export const useCar = (slug: string) => {
  return useQuery<Car>({
    queryKey: [CARS_QUERY_KEY, slug],
    queryFn: () => carService.getCarBySlug(slug),
    enabled: !!slug, // Only run the query if slug is available
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
