'use client';

import { useMemo } from 'react';
import { Category, Product } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  categories: Category[];
  activeCategory: string;
  onProductClick?: (product: Product) => void;
}

export function ProductGrid({
  categories,
  activeCategory,
  onProductClick,
}: ProductGridProps) {
  const activeCategoryData = useMemo(
    () => categories.find((c) => c.id === activeCategory),
    [categories, activeCategory]
  );

  if (!activeCategoryData) return null;

  const products = activeCategoryData.products;

  if (products.length === 0) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
        <div className="text-center py-16">
          <p className="text-muted text-lg">No products in this category yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="menu"
      className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto w-full"
      aria-label={`Menu: ${activeCategoryData.name}`}
    >
      {/* Category Header */}
      <div className="mb-5 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          {activeCategoryData.name}
        </h2>
        {activeCategoryData.description && (
          <p className="text-sm text-muted mt-1">
            {activeCategoryData.description}
          </p>
        )}
      </div>

      {/* Product Grid - 2 columns mobile, 3 columns desktop */}
      <div
        key={activeCategory}
        className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-5"
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={onProductClick}
          />
        ))}
      </div>
    </section>
  );
}
