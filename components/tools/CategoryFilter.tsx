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
          className={`px-[18px] py-2 rounded-full text-[13px] font-medium border-[1.5px] transition-all ${
            active === cat.id
              ? 'bg-[#1A1A2E] dark:bg-white border-[#1A1A2E] dark:border-white text-white dark:text-[#1A1A2E]'
              : 'border-[#E8EAF0] dark:border-[#2A2B35] bg-white dark:bg-[#1A1B23] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {cat.icon} {cat.name}
        </button>
      ))}
    </div>
  );
}
