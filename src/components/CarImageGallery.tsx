'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Car } from '@/types/car';
import { cn } from '@/lib/utils';

interface CarImageGalleryProps {
  car: Pick<Car, 'id' | 'name' | 'slug' | 'image' | 'images'>;
  activeIndex: number;
  totalImages: number;
}

export function CarImageGallery({ car, activeIndex: initialActiveIndex, totalImages }: CarImageGalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const allImages = [car.image, ...(car.images || [])];
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const activeThumbnailRef = useRef<HTMLButtonElement>(null);

  const scrollToImage = (index: number) => {
    if (galleryRef.current) {
      const scrollAmount = index * galleryRef.current.offsetWidth;
      galleryRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  const handleScroll = () => {
    if (galleryRef.current) {
      const scrollPosition = galleryRef.current.scrollLeft;
      const containerWidth = galleryRef.current.offsetWidth;
      const newIndex = Math.round(scrollPosition / containerWidth);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };

  useEffect(() => {
    const gallery = galleryRef.current;
    if (gallery) {
      gallery.addEventListener('scroll', handleScroll);
      return () => gallery.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (activeThumbnailRef.current && thumbnailRef.current) {
      const thumbnail = activeThumbnailRef.current;
      const container = thumbnailRef.current;
      const containerWidth = container.offsetWidth;
      const thumbnailWidth = thumbnail.offsetWidth + 8; // 8px for gap
      const scrollLeft = thumbnail.offsetLeft - (containerWidth / 2) + (thumbnailWidth / 2);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  // Initial scroll to active index
  useEffect(() => {
    scrollToImage(initialActiveIndex);
  }, [initialActiveIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && activeIndex > 0) {
        scrollToImage(activeIndex - 1);
      } else if (e.key === 'ArrowRight' && activeIndex < totalImages - 1) {
        scrollToImage(activeIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, totalImages]);

  return (
    <div className="relative flex flex-col h-full">
      {/* Main Image Gallery */}
      <div
        ref={galleryRef}
        className="flex overflow-x-hidden scroll-smooth snap-x snap-mandatory flex-1"
      >
        {allImages.map((image, index) => (
          <div
            key={index}
            className="relative w-full min-w-full h-[400px] md:h-[500px] snap-start flex items-center justify-center"
          >
            <Image
              src={image}
              alt={`${car.name} - ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {activeIndex > 0 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md z-10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-110 flex items-center justify-center h-10 w-10 transform -translate-y-1/2"
          onClick={() => scrollToImage(activeIndex - 1)}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6 text-blue-600" />
        </button>
      )}

      {activeIndex < totalImages - 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md z-10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-110 flex items-center justify-center h-10 w-10 transform -translate-y-1/2"
          onClick={() => scrollToImage(activeIndex + 1)}
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6 text-blue-600" />
        </button>
      )}

      {/* Thumbnail Carousel */}
      {totalImages > 1 && (
        <div className="mt-6 relative group">
          <div className="relative py-2">
            {/* Left Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const prevIndex = (activeIndex - 1 + totalImages) % totalImages;
                scrollToImage(prevIndex);
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-110 flex items-center justify-center h-10 w-10"
              aria-label="Previous thumbnail"
            >
              <ChevronLeft className="h-6 w-6 text-blue-600" />
            </button>

            {/* Thumbnails */}
            <div 
              ref={thumbnailRef}
              className="flex overflow-x-auto py-3 no-scrollbar px-4 items-center"
              style={{ 
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {allImages.map((image, index) => (
                <button
                  ref={index === activeIndex ? activeThumbnailRef : null}
                  key={index}
                  onClick={() => scrollToImage(index)}
                  className={cn(
                    'relative flex-shrink-0 w-24 h-16 md:w-28 md:h-20 rounded-md overflow-hidden transition-all duration-200 mx-3',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    activeIndex === index 
                      ? 'ring-2 ring-blue-500 ring-offset-2 scale-105 shadow-md' 
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  )}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 5rem, 6rem"
                  />
                </button>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const nextIndex = (activeIndex + 1) % totalImages;
                scrollToImage(nextIndex);
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-110 flex items-center justify-center h-10 w-10"
              aria-label="Next thumbnail"
            >
              <ChevronRight className="h-6 w-6 text-blue-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
