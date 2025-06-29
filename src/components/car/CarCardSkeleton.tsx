import { Skeleton } from '../ui/Skeleton';

export function CarCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-50">
      {/* Image with badge */}
      <div className="relative w-full min-h-[240px] aspect-[3/2] overflow-hidden">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold text-gray-800 flex items-center shadow-sm">
          <Skeleton className="h-4 w-4 rounded-full mr-1.5" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col h-full p-5">
        <div className="flex-1">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <Skeleton className="h-6 w-40 mb-2" />
              <div className="flex items-center mb-4">
                <Skeleton className="h-4 w-4 mr-1.5" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-32 ml-2" />
          </div>
          
          {/* Car Specs */}
          <div className="grid grid-cols-3 gap-4 mt-4 mb-5 pb-4 border-b border-gray-100">
            {/* Seats */}
            <div className="flex flex-col items-center text-center">
              <Skeleton className="h-6 w-6 mb-1.5 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
            {/* Engine Type */}
            <div className="flex flex-col items-center text-center">
              <Skeleton className="h-6 w-6 mb-1.5 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
            {/* Car Type */}
            <div className="flex flex-col items-center text-center">
              <Skeleton className="h-6 w-6 mb-1.5 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>

        {/* Button */}
        <Skeleton className="w-full h-10 rounded-lg" />
      </div>
    </div>
  );
}
