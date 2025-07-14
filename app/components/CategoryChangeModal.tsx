'use client';

import React, { useState } from 'react';

interface Props {
  productId: string;
  categories: string[];
  onClose: () => void;
  onCategoryChange: (newCategory: string) => void;
}

export default function CategoryChangeModal({
  productId,
  categories,
  onClose,
  onCategoryChange,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  const handleSubmit = () => {
    const finalCategory = selectedCategory === '__custom__' ? customCategory.trim() : selectedCategory;
    if (!finalCategory) return;
    onCategoryChange(finalCategory);
  };

  return (
    <div className="space-y-4 bg-gray-900 text-white p-6 rounded-xl shadow-lg w-full max-w-sm">
      <h2 className="text-xl font-bold text-center">Asignar categoría</h2>

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
      >
        <option value="">Seleccionar categoría existente</option>
        {categories.filter(c => c !== 'Sin categoría').map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
        <option value="__custom__">Otra...</option>
      </select>

      {selectedCategory === '__custom__' && (
        <input
          type="text"
          placeholder="Nueva categoría"
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
          className="w-full mt-2 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400"
        />
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
