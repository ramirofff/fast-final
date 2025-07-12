// components/CategorySelector.tsx
'use client';
import React, { useState, useRef } from 'react';

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
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleLongPress = (cat: string) => {
    if (cat !== 'Sin categoría' && cat !== 'Todas') {
      setMenuOpenFor(cat);
      setEditingName(cat);
    }
  };

  const handleTouchStart = (cat: string) => {
    longPressTimeout.current = setTimeout(() => handleLongPress(cat), 600);
  };

  const handleTouchEnd = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  };

  return (
    <div className="flex gap-2 mb-4 flex-wrap justify-center relative">
      {/* Botón Todas */}
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
        <div
          key={cat}
          className="relative"
          onTouchStart={() => handleTouchStart(cat)}
          onTouchEnd={handleTouchEnd}
          onMouseDown={() => handleTouchStart(cat)}
          onMouseUp={handleTouchEnd}
        >
          <button
            onClick={() => {
              setActiveCategory(cat);
              if (menuOpenFor !== cat) {
                setMenuOpenFor(null); // solo cerramos si era otro
              }
            }}
            className={`px-4 py-2 rounded-full border shadow text-sm transition font-semibold ${
              activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            {cat}
          </button>

          {/* Menú contextual */}
          {cat !== 'Sin categoría' && cat !== 'Todas' && menuOpenFor === cat && (
            <div
              className="absolute z-10 top-full mt-1 left-0 bg-white border rounded shadow-lg w-48"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
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
                    onEditCategory(cat, editingName.trim());
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
              <button
                onClick={() => setMenuOpenFor(null)}
                className="text-gray-500 hover:text-black px-4 py-2 w-full text-left text-xs"
              >
                ✖ Cancelar
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategorySelector;
