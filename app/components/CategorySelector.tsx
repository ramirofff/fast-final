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
        className={`px-4 py-2 rounded-full text-sm transition font-semibold border ${
          activeCategory === '' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700'
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
              if (menuOpenFor !== cat) setMenuOpenFor(null);
            }}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
              activeCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700'
            }`}
          >
            {cat}
          </button>

          {/* Menú contextual */}
          {cat !== 'Sin categoría' && cat !== 'Todas' && menuOpenFor === cat && (
            <div
              className="absolute z-10 top-full mt-1 left-0 bg-gray-900 border border-gray-700 rounded shadow-lg w-56"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <div className="p-2 border-b border-gray-700 text-sm font-medium text-white">Editar categoría</div>
              <div className="flex p-2 gap-1">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="bg-gray-800 border border-gray-600 px-2 py-1 rounded w-full text-sm text-white placeholder-gray-400"
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
                className="text-red-400 hover:bg-red-900/30 px-4 py-2 w-full text-left text-sm"
              >
                🗑 Eliminar
              </button>
              <button
                onClick={() => setMenuOpenFor(null)}
                className="text-gray-400 hover:text-white px-4 py-2 w-full text-left text-xs"
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
