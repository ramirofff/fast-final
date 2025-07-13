'use client';

import React, { useState } from 'react';

interface Props {
  productId: string;
  categories: string[];
  onClose: () => void;
  onUpdateCategory: (productId: string, newCategory: string) => void;
}

const CategoryChangeModal: React.FC<Props> = ({
  productId,
  categories,
  onClose,
  onUpdateCategory,
}) => {
  const [newCategory, setNewCategory] = useState('');

  const handleConfirm = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    onUpdateCategory(productId, trimmed);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-gray-900 rounded-2xl shadow-lg p-6 w-full max-w-sm text-white">
        <h2 className="text-lg font-semibold mb-4">Cambiar categoría</h2>

        {/* Selector existente */}
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-gray-800 border border-gray-600 text-white"
        >
          <option value="" disabled>
            Seleccionar categoría
          </option>
          {categories.filter((c) => c !== 'Sin categoría').map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Nueva categoría */}
        <input
          type="text"
          placeholder="O crear nueva categoría"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-400"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1 text-sm bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryChangeModal;
