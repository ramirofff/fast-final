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
      setImageUrl(''); // Limpiamos la URL si se subió imagen
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
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Agregar producto</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
      <input
        type="number"
        placeholder="Precio"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
      <input
        type="text"
        placeholder="URL de imagen (opcional)"
        value={imageUrl}
        onChange={(e) => {
          setImageUrl(e.target.value);
          setImageFileBase64(null); // Si escribe URL, quitamos imagen local
        }}
        className="w-full border rounded px-3 py-2"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="w-full text-sm"
      />
      <input
        type="text"
        placeholder="Categoría (opcional)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />

      {(imageFileBase64 || imageUrl) && (
        <div className="mt-2">
          <p className="text-sm text-gray-500">Vista previa:</p>
          <img
            src={imageFileBase64 || imageUrl}
            alt="Vista previa"
            className="w-24 h-24 object-cover border rounded"
          />
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}
