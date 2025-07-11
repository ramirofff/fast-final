// components/CategorySelector.tsx
import React from 'react';

interface Props {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

const CategorySelector: React.FC<Props> = ({ categories, activeCategory, setActiveCategory }) => (
  <div className="flex gap-2 mb-4 flex-wrap justify-center">
    {categories.map((cat) => (
      <button
        key={cat}
        onClick={() => setActiveCategory(cat)}
        className={`px-4 py-2 rounded-full border shadow ${
          activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
        }`}
      >
        {cat}
      </button>
    ))}
    <button
      onClick={() => setActiveCategory('')}
      className={`px-4 py-2 rounded-full border shadow ${
        activeCategory === '' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
      }`}
    >
      Todas
    </button>
  </div>
);

export default CategorySelector;