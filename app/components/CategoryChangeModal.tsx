// app/components/CategoryChangeModal.tsx
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
  onUpdateCategory
}) => {
  const [newCategory, setNewCategory] = useState('');

  const handleConfirm = () => {
    if (!newCategory.trim()) return;
    onUpdateCategory(productId, newCategory.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm relative">
        <h2 className="text-lg font-semibold mb-4">Cambiar categoría</h2>
        <select
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="" disabled>Seleccionar categoría</option>
          {categories.filter(c => c !== 'Sin categoría').map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="O crear nueva categoría"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-600 px-4 py-1">Cancelar</button>
          <button
            onClick={handleConfirm}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryChangeModal;
