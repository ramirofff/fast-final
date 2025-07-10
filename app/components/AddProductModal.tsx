'use client';

import { useState } from 'react';
import { Product } from '../page';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  onAdd: (product: Product) => void;
  onClose: () => void;
}

export default function AddProductModal({ onAdd, onClose }: Props) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');

  const handleAdd = () => {
    const parsedPrice = parseFloat(price);
    if (!name || isNaN(parsedPrice) || !category) return;

    const newProduct: Product = {
      id: uuidv4(),
      name,
      price: parsedPrice,
      image,
      category,
    };
    onAdd(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Agregar Producto</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mb-2 w-full rounded"
        />
        <input
          type="number"
          placeholder="Precio"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 mb-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="URL de la imagen"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="border p-2 mb-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Categoría"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 mb-4 w-full rounded"
        />
        <div className="flex justify-between">
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Agregar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
