'use client';

import Image from 'next/image';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

function getBasePrice(product: Product): number {
  switch (product.type) {
    case 'simple':
    case 'deal':
      return product.price;
    case 'size': {
      const validPrices = Object.values(product.prices).filter((p) => p > 0);
      return Math.min(...validPrices);
    }
    case 'quantity': {
      const validPrices = Object.values(product.prices).filter((p) => p > 0);
      return Math.min(...validPrices);
    }
    default:
      return 0;
  }
}

function hasMultiplePrices(product: Product): boolean {
  if (product.type === 'size') {
    const validPrices = Object.values(product.prices).filter((p) => p > 0);
    return validPrices.length > 1;
  }
  if (product.type === 'quantity') {
    const validPrices = Object.values(product.prices).filter((p) => p > 0);
    return validPrices.length > 1;
  }
  return false;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const basePrice = getBasePrice(product);
  const showStartingFrom = hasMultiplePrices(product);

  return (
    <button
      type="button"
      onClick={() => onClick?.(product)}
      className="card-animate group relative flex flex-col bg-card rounded-xl overflow-hidden border border-border/50 hover:border-accent/30 shadow-sm hover:shadow-md transition-all duration-300 ease-out cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent w-full text-left"
      aria-label={`${product.name}, Rs ${basePrice}${showStartingFrom ? ' onwards' : ''}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <Image
          src={product.image || '/images/placeholder.jpg'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 p-3 sm:p-4 flex-1">
        <h3 className="font-semibold text-sm sm:text-base text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-1 mt-auto pt-1">
          {showStartingFrom && (
            <span className="text-[11px] sm:text-xs text-muted font-medium">From</span>
          )}
          <span className="text-base sm:text-lg font-bold text-accent tracking-tight">
            Rs {basePrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Add Button - bottom strip */}
      <div className="flex items-center justify-center py-2.5 border-t border-border/40 bg-accent/5 group-hover:bg-accent group-hover:border-accent transition-all duration-300">
        <span className="text-xs sm:text-sm font-semibold text-accent group-hover:text-white tracking-wide uppercase transition-colors duration-300">
          + Add
        </span>
      </div>
    </button>
  );
}
