'use client';

import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Hero } from '@/components/Hero';
import { CategorySlider } from '@/components/CategorySlider';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductModal } from '@/components/ProductModal';
import { categories } from '@/data/menu';
import { Product } from '@/types';

function getValidCategory(categoryId: string | null): string {
  if (!categoryId) return categories[0]?.id ?? '';
  const exists = categories.some((c) => c.id === categoryId);
  return exists ? categoryId : categories[0]?.id ?? '';
}

export default function Home() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [activeCategory, setActiveCategory] = useState(() =>
    getValidCategory(categoryParam)
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <CategorySlider
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <ProductGrid
        categories={categories}
        activeCategory={activeCategory}
        onProductClick={handleProductClick}
      />
      <ProductModal
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={handleCloseModal}
      />
    </div>
  );
}
