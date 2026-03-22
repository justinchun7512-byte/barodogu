'use client';

import { CATEGORIES, type Category } from '@/lib/tools';

interface Props {
  active: Category | 'all';
  onChange: (id: Category | 'all') => void;
}

export function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {CATEGORIES.map(cat => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id as Category | 'all')}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
            active === cat.id
              ? 'bg-primary text-white border-primary'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-300 hover:bg-primary hover:text-white hover:border-primary'
          }`}
        >
          {cat.icon} {cat.name}
        </button>
      ))}
    </div>
  );
}
