// components/CategorySelector.tsx
import React, { useState } from 'react';

interface Props {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  onDeleteCategory: (category: string) => void;
  onEditCategory: (oldCat: string, newCat: string) => void;
}

const CategorySelector: React.FC<Props> = ({
  categories,
  activeCategory,
  setActiveCategory,
  onDeleteCategory,
  onEditCategory,
}) => {
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  return (
    <div className="flex gap-2 mb-4 flex-wrap justify-center relative">
      <button
        onClick={() => {
          setActiveCategory('');
          setMenuOpenFor(null);
        }}
        className={`px-4 py-2 rounded-full border shadow text-sm transition font-semibold ${
          activeCategory === '' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
        }`}
      >
        Todas
      </button>

      {categories.map((cat) => (
        <div key={cat} className="relative">
          <button
            onClick={() => {
              setActiveCategory(cat);
              setMenuOpenFor(cat === menuOpenFor ? null : cat);
              setEditingName(cat);
            }}
            className={`px-4 py-2 rounded-full border shadow text-sm transition font-semibold ${
              activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            {cat}
          </button>

          {cat !== 'Sin categoría' && menuOpenFor === cat && (
            <div className="absolute z-10 top-full mt-1 left-0 bg-white border rounded shadow-lg w-48">
              <div className="p-2 border-b text-sm font-medium">Editar categoría</div>
              <div className="flex p-2 gap-1">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="border px-2 py-1 rounded w-full text-sm"
                />
                <button
                  onClick={() => {
                    onEditCategory(cat, editingName);
                    setMenuOpenFor(null);
                  }}
                  className="bg-green-600 text-white px-2 rounded text-xs hover:bg-green-700"
                >
                  ✔
                </button>
              </div>
              <button
                onClick={() => {
                  onDeleteCategory(cat);
                  setMenuOpenFor(null);
                }}
                className="text-red-600 hover:bg-red-100 px-4 py-2 w-full text-left text-sm"
              >
                🗑 Eliminar
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategorySelector;
