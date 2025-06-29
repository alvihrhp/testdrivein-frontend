'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarImageGalleryProps {
  car: {
    id: string;
    name: string;
    slug: string;
    image: string;
    images?: string[];
  };
  activeIndex: number;
  totalImages: number;
}

export function CarImageGallery({ 
  car, 
  activeIndex,
  totalImages
}: CarImageGalleryProps) {
  const images = car.images || [car.image];
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const ITEM_WIDTH = 80; // Width of each thumbnail item including margin

  // Scroll to make active thumbnail visible
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const containerWidth = container.offsetWidth;
      const maxScroll = container.scrollWidth - containerWidth;
      
      // Calculate scroll position to center the active thumbnail
      let scrollLeft = activeIndex * ITEM_WIDTH - (containerWidth / 2) + (ITEM_WIDTH / 2);
      
      // Ensure we don't scroll past the last item
      scrollLeft = Math.min(scrollLeft, maxScroll);
      
      // If we're at the last few items, align to the end
      if (activeIndex >= totalImages - 3) {
        scrollLeft = maxScroll + 16; // Add small padding
      }
      
      container.scrollTo({
        left: Math.max(0, scrollLeft), // Ensure we don't get negative values
        behavior: 'smooth'
      });
    }
  }, [activeIndex, ITEM_WIDTH, totalImages]);

  return (
    <div className="relative group">
      {/* Left Navigation Arrow */}
      {activeIndex > 0 && (
        <Link 
          href={`?image=${activeIndex - 1}`}
          scroll={false}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </Link>
      )}
      
      {/* Thumbnails Container */}
      <div 
        ref={scrollContainerRef}
        className="flex space-x-3 py-4 px-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory w-full"
        style={{
          scrollBehavior: 'smooth',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          paddingRight: '2rem', // Add right padding to ensure last item is fully visible
        }}
      >
        {images.map((image, index) => (
          <Link
            key={index}
            href={`?image=${index}`}
            scroll={false}
            className={`flex-shrink-0 w-30 h-28 relative rounded-md overflow-hidden border-2 transition-all duration-300 ease-in-out ${
              index === activeIndex ? 'border-blue-500' : 'border-gray-200'
            }`}
          >
            <Image
              src={image}
              alt={`${car.name} view ${index + 1}`}
              fill
              className={`object-cover transition-opacity duration-300 ease-in-out ${
                index !== activeIndex ? 'opacity-70' : 'opacity-100'
              }`}
              quality={90}
            />
            {index !== activeIndex && (
              <div className="absolute inset-0 bg-gray-100/30 transition-opacity duration-300 ease-in-out" />
            )}
          </Link>
        ))}
      </div>
      
      {/* Right Navigation Arrow */}
      {activeIndex < totalImages - 1 && (
        <Link 
          href={`?image=${activeIndex + 1}`}
          scroll={false}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </Link>
      )}
    </div>
  );
}
