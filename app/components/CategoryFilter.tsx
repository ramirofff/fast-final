'use client';

interface Props {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

export default function CategoryFilter({ categories, activeCategory, setActiveCategory }: Props) {
  return (
    <div className="flex gap-2 mb-4 flex-wrap justify-center">
      <button
        onClick={() => setActiveCategory('')}
        className={`px-4 py-2 rounded-full border shadow text-sm font-semibold transition
          ${activeCategory === '' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'}`}
      >
        Todas
      </button>

      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`px-4 py-2 rounded-full border shadow text-sm font-semibold transition
            ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
