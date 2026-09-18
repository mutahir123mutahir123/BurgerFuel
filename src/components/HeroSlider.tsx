'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { HeroBanner } from '@/types';
import { HeroSlide } from './HeroSlide';

interface HeroSliderProps {
  banners: HeroBanner[];
  autoSlideInterval?: number;
}

export function HeroSlider({
  banners,
  autoSlideInterval = 3000,
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Auto-slide
  useEffect(() => {
    if (isPaused || banners.length <= 1) return;

    const interval = setInterval(goToNext, autoSlideInterval);
    return () => clearInterval(interval);
  }, [isPaused, autoSlideInterval, goToNext, banners.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('keydown', handleKeyDown);
      return () => slider.removeEventListener('keydown', handleKeyDown);
    }
  }, [goToNext, goToPrev]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  if (banners.length === 0) return null;

  return (
    <div
      ref={sliderRef}
      className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Hero banner slider"
      aria-roledescription="carousel"
      tabIndex={0}
    >
      {banners.map((banner, index) => (
        <HeroSlide
          key={banner.id}
          banner={banner}
          isActive={index === currentIndex}
        />
      ))}

      {/* Navigation Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
        {banners.map((banner, index) => (
          <button
            key={banner.id}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentIndex
                ? 'bg-white scale-110'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}: ${banner.title}`}
            aria-current={index === currentIndex ? 'true' : undefined}
          />
        ))}
      </div>

      {/* Previous/Next Arrows (desktop only) */}
      <button
        onClick={goToPrev}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors cursor-pointer"
        aria-label="Previous slide"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors cursor-pointer"
        aria-label="Next slide"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
