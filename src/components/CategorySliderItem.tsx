'use client';

import { forwardRef } from 'react';
import { Category } from '@/types';

interface CategorySliderItemProps {
  category: Category;
  isActive: boolean;
  onClick: () => void;
}

export const CategorySliderItem = forwardRef<HTMLButtonElement, CategorySliderItemProps>(
  ({ category, isActive, onClick }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        role="tab"
        aria-selected={isActive}
        aria-controls={`panel-${category.id}`}
        className={`
          flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium
          transition-all duration-200 whitespace-nowrap cursor-pointer
          ${isActive
            ? 'bg-accent text-white shadow-sm'
            : 'bg-secondary/10 text-foreground/70 hover:bg-secondary/20 hover:text-foreground'
          }
        `}
      >
        {category.name}
      </button>
    );
  }
);

CategorySliderItem.displayName = 'CategorySliderItem';
