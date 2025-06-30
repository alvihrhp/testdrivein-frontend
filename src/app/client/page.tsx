"use client";

import { useState, useMemo } from 'react';
import { Button, Input, Skeleton } from '@/components/ui';
import { Search, Filter } from 'lucide-react';
import { CarCard, CarCardSkeleton } from '@/components/car';
import { HeroSkeleton } from '@/components/HeroSkeleton';
import { useCars } from '@/hooks/useCars';
import type { Car } from '@/types/car';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

export default function Home() {
  const { cars = [], loading: isLoading, error } = useCars();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter cars based on search query
  const filteredCars = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return cars;

    return cars.filter((car: Car) => {
      return (
        car.name.toLowerCase().includes(query) ||
        car.engine_type.toLowerCase().includes(query)
      );
    });
  }, [cars, searchQuery]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filteredCars dependency on searchQuery
  };
  
  // Show skeleton while loading initial data
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white">
          <HeroSkeleton />
          
          {/* Featured Cars Skeleton */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-10 w-24" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm">
                  <CarCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while loading cars';
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-red-500 text-lg font-medium mb-2">Failed to load cars</div>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100">
        {/* Hero Section */}
        <div className="relative text-white py-16 min-h-[500px] flex items-center">
          <div className="absolute inset-0 bg-black/60 z-0"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Dream Car</h1>
              <p className="text-xl mb-8">Experience a comfortable and professional test drive with our selection of the best cars.</p>
              
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search cars, brands, or types..."
                    className="pl-10 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Search Cars
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Featured Cars */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Mobil Tersedia</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
          
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car: Car) => (
                <CarCard 
                  key={car.id}
                  car={car}
                  formatPrice={formatPrice}
                />
              ))} 
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Tidak ada mobil yang ditemukan.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
