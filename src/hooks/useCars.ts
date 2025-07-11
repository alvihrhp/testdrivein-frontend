import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { getCars } from '@/lib/api';
import { Car } from '@/lib/api';

export function useCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchCars = useCallback(async () => {
    try {
      const data = await getCars();
      setCars(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      toast({
        title: 'Error',
        description: 'Failed to load cars. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return { cars, loading, error, refetch: fetchCars };
}
