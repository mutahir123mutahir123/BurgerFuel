import Image from 'next/image';
import Link from 'next/link';
import { HeroBanner } from '@/types';

interface HeroSlideProps {
  banner: HeroBanner;
  isActive: boolean;
}

export function HeroSlide({ banner, isActive }: HeroSlideProps) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
      }`}
      aria-hidden={!isActive}
    >
      <div className="relative w-full h-full">
        {banner.mobileImage ? (
          <>
            <picture>
              <source media="(max-width: 639px)" srcSet={banner.mobileImage} />
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                sizes="100vw"
                priority={isActive}
                className="object-cover"
              />
            </picture>
          </>
        ) : (
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            sizes="100vw"
            priority={isActive}
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-20">
          <a
            href="tel:+923292833343"
            className="blink-phone inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-accent text-white font-bold text-sm sm:text-base md:text-lg rounded-full shadow-lg hover:bg-accent/90 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
              <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
            </svg>
            0329-2833343
          </a>
        </div>
        <div className="absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-10 md:px-16 lg:px-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
            {banner.title}
          </h2>
          {banner.subtitle && (
            <p className="mt-2 sm:mt-4 text-lg sm:text-xl md:text-2xl text-white/90 drop-shadow-md">
              {banner.subtitle}
            </p>
          )}
          <Link
            href={banner.link || '/?category=crispy-burger'}
            className="mt-4 sm:mt-6 px-6 py-3 bg-accent text-white font-semibold rounded-md transition-colors hover:bg-accent/90 cursor-pointer"
          >
            View Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
