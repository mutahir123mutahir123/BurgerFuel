'use client';

import { useRef, useEffect, useCallback } from 'react';
import { Category } from '@/types';
import { CategorySliderItem } from './CategorySliderItem';

interface CategorySliderProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategorySlider({
  categories,
  activeCategory,
  onCategoryChange,
}: CategorySliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const scrollToCategory = useCallback((categoryId: string) => {
    const item = itemRefs.current.get(categoryId);
    const container = scrollRef.current;
    if (!item || !container) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const scrollLeft = item.offsetLeft - containerRect.width / 2 + itemRect.width / 2;

    container.scrollTo({
      left: scrollLeft,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    scrollToCategory(activeCategory);
  }, [activeCategory, scrollToCategory]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = categories.findIndex(c => c.id === activeCategory);
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight') {
      nextIndex = Math.min(currentIndex + 1, categories.length - 1);
    } else if (e.key === 'ArrowLeft') {
      nextIndex = Math.max(currentIndex - 1, 0);
    } else {
      return;
    }

    e.preventDefault();
    onCategoryChange(categories[nextIndex].id);
  };

  return (
    <div id="menu" className="w-full border-b border-border bg-background scroll-mt-0">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide gap-1 px-4 py-3"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
        role="tablist"
        aria-label="Menu categories"
        onKeyDown={handleKeyDown}
      >
        {categories.map((category) => (
          <CategorySliderItem
            key={category.id}
            category={category}
            isActive={category.id === activeCategory}
            onClick={() => onCategoryChange(category.id)}
            ref={(el) => {
              if (el) {
                itemRefs.current.set(category.id, el);
              } else {
                itemRefs.current.delete(category.id);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
