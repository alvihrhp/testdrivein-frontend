import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';
import type { Car } from '@/types/car';
import { Users, Zap, Battery, Fuel, Car as CarIcon } from 'lucide-react';

interface CarCardProps {
  car: Car;
  formatPrice: (price: number) => string;
}

const getEngineIcon = (engineType: string) => {
  const type = engineType.toLowerCase();
  if (type.includes('hybrid')) {
    return <Battery className="h-4 w-4 text-gray-500" />;
  } else if (type.includes('electric') || type.includes('listrik')) {
    return <Zap className="h-4 w-4 text-gray-500" />;
  }
  return <Fuel className="h-4 w-4 text-gray-500" />;
};

export function CarCard({ car, formatPrice }: CarCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="relative h-48">
        <Image
          src={car.image || '/placeholder-car.jpg'}
          alt={car.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{car.name}</h3>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center">
            <Users className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0" />
            <span>{car.capacity} Penumpang</span>
          </span>
          <span className="flex items-center">
            <CarIcon className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0" />
            <span>{car.jenis_mobil}</span>
          </span>
          <span className="flex items-center">
            {getEngineIcon(car.engine_type)}
            <span className="ml-1 capitalize">
              {car.engine_type.toLowerCase()}
            </span>
          </span>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-sm text-gray-500">Harga mulai dari</p>
            <p className="text-lg font-bold text-gray-900">{formatPrice(car.price)}</p>
          </div>
          <Link href={`/mobil/${car.slug}`}>
            <Button 
              size="sm" 
              variant="outline"
              className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition-colors"
            >
              Detail
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
