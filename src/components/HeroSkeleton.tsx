import { Skeleton } from './ui/Skeleton';

export function HeroSkeleton() {
  return (
    <div className="relative bg-gray-100 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-30"></div>
      
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
          
          {/* Search Bar Skeleton */}
          <div className="max-w-4xl mx-auto bg-white/90 rounded-xl shadow-xl p-6 mb-8">
            <div className="flex flex-row gap-3 w-full">
              <div className="relative flex-1 min-w-0">
                <Skeleton className="h-14 w-full rounded-lg" />
              </div>
              <Skeleton className="h-14 w-32 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
