'use client';

import { useState } from 'react';
import { Product } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AddProductModalProps {
  onAdd: (product: Product) => void;
  onClose: () => void;
}

export default function AddProductModal({ onAdd, onClose }: AddProductModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [imageFileBase64, setImageFileBase64] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageFileBase64(reader.result as string);
      setImageUrl('');
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (!name || !price) return;

    const product: Product = {
      id: uuidv4(),
      name,
      price: parseFloat(price),
      image: imageFileBase64 || imageUrl,
      category: category || 'Sin categoría',
    };

    onAdd(product);
  };

  return (
    <div className="space-y-4 bg-gray-900 text-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-center">Agregar producto</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400"
      />

      <input
        type="number"
        placeholder="Precio"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400"
      />

      <input
        type="text"
        placeholder="URL de imagen (opcional)"
        value={imageUrl}
        onChange={(e) => {
          setImageUrl(e.target.value);
          setImageFileBase64(null);
        }}
        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="w-full text-sm bg-gray-800 text-white"
      />

      <input
        type="text"
        placeholder="Categoría (opcional)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400"
      />

      {(imageFileBase64 || imageUrl) && (
        <div className="mt-2">
          <p className="text-sm text-gray-400">Vista previa:</p>
          <img
            src={imageFileBase64 || imageUrl}
            alt="Vista previa"
            className="w-24 h-24 object-cover border rounded border-white"
          />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded"
        >
          Cancelar
        </button>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}
